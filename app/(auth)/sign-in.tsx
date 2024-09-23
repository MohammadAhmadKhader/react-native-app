import { View, Text, ScrollView, Image, TextInputChangeEventData, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "@/constants"
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '@/lib/appWrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignIn = () => {
    const [form, setForm] = useState<{ email: string, password: string }>({
        email: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const {setUser} = useGlobalContext()

    async function submit() {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill all the fields")
        }
        setIsSubmitting(true);

        try {
            await signIn(form.email, form.password)
            const result = await getCurrentUser();
            setUser(result.user)

            router.replace("/home")
        } catch (error: any) {
            if(error.message == "Creation of a session is prohibited when a session is active."){
                try {
                    const result = await getCurrentUser()
                    setUser(result.user)

                    router.replace("/home")
                } catch (error : any) {
                    console.log(`error: ${error.message}`)
                }
                
            } else {
                Alert.alert("Error", error.message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <SafeAreaView className='bg-primary h-full w-full'>
            <ScrollView>
                <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className='w-[115px] h-[35px]'
                    />
                    <Text className='text-2xl text-white font-psemibold mt-10'>
                        Login
                    </Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChange={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                        placeholder='email'
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChange={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        placeholder='password'
                    />

                    <CustomButton
                        title='Sign In'
                        handlePress={submit}
                        containerStyles='mt-7'
                        isLoading={isSubmitting}
                    />

                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Don't have account?
                        </Text>
                        <Link
                            className='text-secondary font-psemibold text-lg'
                            href="/sign-up">
                            Sign up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default SignIn