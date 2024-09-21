import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Menu, IconButton } from "react-native-paper"
import { deleteVideoPost, saveVideoPost } from '@/lib/appWrite';
import { usePathname } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

type Props = {
    videoId: string,
    refetch?: () => any
}

const VideoMenu = ({ videoId, refetch }: Props) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isVideoSaved, setIsVideoSaved] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.startsWith("/bookmark")) {
            setIsVideoSaved(true)
        }
    }, [])
    async function closeMenu() {
        setIsVisible(false)
    }

    function openMenu() {
        setIsVisible(true)
    }

    async function handleSaveVideo() {
        if(isLoading === false) {
            setIsLoading(true)
            try {
                await saveVideoPost(videoId)
                setIsVisible(false)
                Alert.alert("Success", "Video was saved successfully")
            } catch (error: any) {
                Alert.alert("Error", error.message)
            } finally {
                setIsLoading(false)
            }
        }
    }

    async function handleRemoveVideo() {
        if(isLoading === false) {
            setIsLoading(true)
            try {
                await deleteVideoPost(videoId)
                setIsVisible(false)
                Alert.alert("Success", "Video was removed successfully")
                if (refetch) {
                    refetch()
                }
            } catch (error: any) {
                Alert.alert("Error", error.message)
            } finally {
                setIsLoading(false)
            }
        }
    }
    return (
        <View>
            <Menu
                visible={isVisible}
                onDismiss={closeMenu}
                anchor={
                    <IconButton
                        icon={"dots-vertical"}
                        size={24}
                        onPress={openMenu}
                    />}
            >
                {isVideoSaved ? (
                    <Menu.Item onPress={handleRemoveVideo} title="Remove" disabled={isLoading} />
                ) :
                    (
                        <Menu.Item onPress={handleSaveVideo} title="Save" disabled={isLoading} />
                    )}
            </Menu>
        </View>
    )
}

export default VideoMenu