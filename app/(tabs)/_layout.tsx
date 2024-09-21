import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from "@/constants"
import TabIcon from '@/components/TabIcon'

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#FFA001",
            tabBarInactiveTintColor: "#CDCDE0",
            tabBarStyle: {
                backgroundColor: "#161622",
                borderTopWidth: 1,
                borderTopColor: "#232533",
                height: 84,
            }
        }}>
            <Tabs.Screen name="home" options={{
                headerShown: false,
                title: "Home",
                tabBarIcon: ({ focused, color }) => {
                    return (
                        <TabIcon
                            icon={icons.home}
                            color={color}
                            name="Home"
                            focused={focused}
                        />)
                }
            }} />
            <Tabs.Screen name="bookmark" options={{
                headerShown: false,
                title: "Bookmark",
                tabBarIcon: ({ focused, color }) => {
                    return (
                        <TabIcon
                            icon={icons.bookmark}
                            color={color}
                            name="Bookmark"
                            focused={focused}
                        />)
                }
            }} />
            <Tabs.Screen name="create" options={{
                headerShown: false,
                title: "Create",
                tabBarIcon: ({ focused, color }) => {
                    return (
                        <TabIcon
                            icon={icons.plus}
                            color={color}
                            name="Create"
                            focused={focused}
                        />)
                }
            }} />
            <Tabs.Screen name="profile" options={{
                headerShown: false,
                title: "Profile",
                tabBarIcon: ({ focused, color }) => {
                    return (
                        <TabIcon
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
                        />)
                }
            }} />
        </Tabs>
    )
}

export default TabsLayout