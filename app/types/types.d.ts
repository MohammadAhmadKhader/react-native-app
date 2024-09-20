import { Models } from "react-native-appwrite";

export type Video = Prettify<Models.Document & BareVideo>
export type User = Prettify<Models.Document & BareUser>

export type BareVideo = {
    title:string,
    thumbnail:string,
    prompt:string,
    video:string,
    users:User
}

export type BareUser = {
    username:string,
    email:string,
    avatar:string,
    accountId:string,
}

export type CreateVideoFormType = { 
    title: string, 
    video: DocumentPicker.DocumentPickerAsset | null, 
    thumbnail: DocumentPicker.DocumentPickerAsset | null, 
    prompt: string 
}

export type UserLikedVideos = {
    user:User,
    video:Video
}[]



type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
