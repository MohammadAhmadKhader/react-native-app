declare module '*.png' {
    import { ImageSourcePropType } from 'react-native'
    const content: ImageSourcePropType

    export default content
};

declare module '@env' {
    export const endpoint: string;
    export const platform: string;
    export const projectId: string;
    export const databaseId: string;
    export const userCollectionId: string;
    export const videoCollectionId: string;
    export const storageId:string;
    export const usersVideosCollectionId:string;
    export const NODE_ENV: 'development' | 'production';
}