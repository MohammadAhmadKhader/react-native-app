import { CreateVideoFormType } from '@/app/types/types';
import { DocumentPickerAsset } from 'expo-document-picker';
import { Client, Account, ID, Avatars, Databases, Query, Storage, ImageGravity } from 'react-native-appwrite';
import {endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId,storageId,usersVideosCollectionId} from "@env"
import { logErrorToLocalDb } from './sqliteDb';

export const config = {
    endpoint:endpoint,
    platform:platform,
    projectId:projectId,
    databaseId:databaseId,
    userCollectionId:userCollectionId,
    videoCollectionId:videoCollectionId,
    storageId:storageId,
    usersVideosCollectionId:usersVideosCollectionId
}

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);
    
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage  = new Storage(client);
    
export async function createUser(email:string,username:string,password:string){
    try {
        const newAccount = await account.create(ID.unique(), email, password, username)
       
        if(!newAccount){
            throw new Error("Account was not created")
        }

        const avatarUrl = avatars.getInitials(username);
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId:newAccount.$id,
                email,
                username,
                avatar:avatarUrl
            }
            
        );

        await signIn(email,password);
        return await getCurrentUser()
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error}`)
        throw new Error(error);
    }
}

export async function signIn(email:string, password:string) {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
}

export async function getCurrentUser(){
    try {
        const userAccount = await account.get()

        if(!userAccount){
            throw new Error("User account was not found")
        }

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId",userAccount.$id)]
        )

        if(!currentUser){
            throw new Error("Current user was not found")
        }
        
        return {
            doc:currentUser.documents[0],
            user:{
                id:currentUser.documents[0].$id,
                username:userAccount.name,
                email:userAccount.email,
                isEmailVerified:userAccount.emailVerification,
                phone:userAccount.phone,
                avatar:currentUser.documents[0].avatar
            }
        };
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`)
    }
}

export async function signOut(){
    try {
        await account.deleteSession("current")
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`)
        throw new Error(error.message)
    }
}

export async function getAllPosts(){
    try {
        
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        )
        
        return posts.documents;
    } catch (error: any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`)
        throw new Error(error.message)
    }
}

export async function getLatestPosts(){
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        )

        return posts.documents;
    } catch (error: any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`)
        throw new Error(error.message)
    }
}

export async function searchPosts(query: string){
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search("title", query)]
        )
        console.log(JSON.stringify(posts.documents,null,2))
        return posts.documents;
    } catch (error : any) {
        console.log(`error: ${error.message}`)
        throw new Error(error.message)
    }
}

export async function getUserPosts(userId: string){
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal("users", userId)]
        )
        
        return posts.documents;
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`)
        throw new Error(error.message)
    }
}

export async function createVideo(form : CreateVideoFormType){
    try {
        const [thumbnailUrl, videoUrl, user] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, "video"),
            getCurrentUser()
        ])

        const newVideoPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),{
                title:form.title,
                thumbnail:thumbnailUrl,
                video:videoUrl,
                prompt:form.prompt,
                users:user?.user.id
        })
        

        return newVideoPost;
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(error.message)
        throw new Error(error)
    }
}

async function getFilePreview(fileId:string, fileType: string){
    let fileUrl : string | undefined;
    try {
        if(fileType === "image"){
            const width = 2000;
            const height = 2000;
            const gravity = ImageGravity.Top;
            const quality = 100;
            
            fileUrl = storage.getFilePreview(config.storageId, fileId, width, height, gravity, quality).toString()
        } else if (fileType === "video"){
            fileUrl = storage.getFileView(config.storageId, fileId).toString()
        } else {
            throw new Error(`Received file type: ${fileType} which is NOT identified`);
        }

        return fileUrl;
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`);
        throw new Error(error);
    }
}

async function uploadFile(file : DocumentPickerAsset, type : string){
    if(!file || !type) return
    const { mimeType } = file;
    try {
        if(!mimeType){
            throw new Error("File type is not identified")
        }
        if(!file.size){
            throw new Error("File has no size")
        }
        const uploadedFile = await storage.createFile(config.storageId,ID.unique(),{
            type : mimeType,
            name : file.name,
            size : file.size,
            uri : file.uri
        })
        
        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl;
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`);
        throw new Error(error);
    }
}

export async function getAllLikedPostsByUser(){
    try {
        
        const result = await getCurrentUser();
        const userId = result?.user.id;
        
        const videoPost = await databases.listDocuments(
            config.databaseId,
            config.usersVideosCollectionId,
            [Query.equal("user",userId ?? "")]
        )

        return videoPost.documents;
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`)
        throw new Error(error)
    }
}

export async function saveVideoPost(videoPostId:string){
    try {
        const result = await getCurrentUser();
        const userId = result?.user.id;

        const usersVideosLike = await databases.createDocument(
            config.databaseId,
            config.usersVideosCollectionId,
            ID.unique(),
            {
                user:userId,
                video:videoPostId
            }
        )
   
        return usersVideosLike.documents[0];
    } catch (error : any) {
        console.log(`error: ${error.message}`)
        if(error.message !=="Cannot convert undefined value to object"){ 
            // issue with appWrite package it throws error but everything works as expected, 
            // error was handled to not show error message to customer
            await logErrorToLocalDb(error)
            throw new Error(error)
        }
    }
}

export async function deleteVideoPost(videoId:string){
    try {
        const result = await getCurrentUser();
        const userId = result?.user.id;
        const requiredDoc = await databases.listDocuments(
            config.databaseId,
            config.usersVideosCollectionId,
            [Query.equal("user",userId ?? ""),Query.equal("video",videoId)]
        )

        console.log(requiredDoc.documents[0].$id)

        await databases.deleteDocument(
            config.databaseId,
            config.usersVideosCollectionId,
            requiredDoc.documents[0].$id
        )
    } catch (error : any) {
        await logErrorToLocalDb(error)
        console.log(`error: ${error.message}`)
        throw new Error(error)
    }
}