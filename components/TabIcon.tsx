import { Image, Text, View } from "react-native";

const TabIcon = ({ icon, color, name, focused }: { icon: any, color: string, focused: boolean, name: string }) => {
    return (
        <View className='items-center justify-center gap-2'>
            <Image
                resizeMode='contain'
                className='w-6 h-6'
                tintColor={color}
                source={icon} />
            <Text className={`${focused ? "font-psemibold" : "font-pregular text-xs"}`} style={{ color }}>
                {name}
            </Text>
        </View>
    )
}

export default TabIcon;