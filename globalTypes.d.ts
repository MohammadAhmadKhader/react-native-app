declare module '*.png' {
    import { ImageSourcePropType } from 'react-native'
    const content: ImageSourcePropType

    export default content
};
declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      EXPO_PUBLIC_ENDPOINT: string;
      EXPO_PUBLIC_PLATFORM:string;
      EXPO_PUBLIC_PROJECT_ID:string;
      EXPO_PUBLIC_DATABASE_ID:string;
      EXPO_PUBLIC_USER_COLLECTION_ID:string;
      EXPO_PUBLIC_VIDEO_COLLECTION_ID:string;
      EXPO_PUBLIC_STORAGE_ID:string;
      EXPO_PUBLIC_USERS_VIDEOS_COLLECTION_ID:string;
    }
  }