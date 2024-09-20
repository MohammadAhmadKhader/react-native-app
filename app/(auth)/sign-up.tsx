import { View, Text, ScrollView, Image, TextInputChangeEventData, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "@/constants"
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '@/lib/appWrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignUn = () => {

    const [form, setForm] = useState<{ email: string, password: string, username: string }>({
        username: "",
        email: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { setUser } = useGlobalContext()

    async function submit() {
        if (!form.username || !form.email || !form.password) {
            Alert.alert("Error", "Please fill all the fields")
        }
        setIsSubmitting(true);

        try {
            const result = await createUser(form.email, form.username, form.password)
            if (!result) {
                Alert.alert("Error", "Something went wrong please try again later")
                setIsSubmitting(false);
                return;
            }

            setUser(result.user)

            router.replace("/home")
        } catch (error: any) {
            Alert.alert("Error", error.message)
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
                        Sign up
                    </Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChange={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-7"
                        placeholder='username'
                    />

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
                        title='Sign Up'
                        handlePress={submit}
                        containerStyles='mt-7'
                        isLoading={isSubmitting}
                    />

                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Have an account already ?
                        </Text>
                        <Link
                            className='text-secondary font-psemibold text-lg'
                            href="/sign-in">
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default SignUn