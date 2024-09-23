import { getCurrentUser } from "@/lib/appWrite";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

interface UserApp {
    id: string,
    email: string,
    username: string,
    avatar:string
}

type TGlobalContext = {
    user: UserApp | null,
    isUserLoading: boolean,
    isAppLoading:boolean,
    setIsUserLoading: Dispatch<SetStateAction<boolean>>,
    setIsAppLoading: Dispatch<SetStateAction<boolean>>,
    setUser:Dispatch<SetStateAction<UserApp | null>>
}

const userInitialState = {
    id: "",
    email: "",
    username: "",
    avatar:""
}

const GlobalContext = createContext({
    user: userInitialState
} as TGlobalContext)

export const useGlobalContext = () => useContext(GlobalContext)

export function GlobalProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserApp | null>(userInitialState)
    const [isUserLoading, setIsUserLoading] = useState<boolean>(false)
    const [isAppLoading, setIsAppLoading] = useState<boolean>(false)

    useEffect(() => {

        getCurrentUser().then((res) => {
            if (res) {
                const user = {
                    email:res.user.email,
                    id:res.user.id,
                    username:res.user.username,
                    avatar:res.user.avatar
                }
                
                setUser(user)
            } else {
                setUser(null);
            }
        }).catch((err: any) => {
            console.log(err)
        }).finally(()=>{
            setIsUserLoading(false);
        })

    }, [])

    return (
        <GlobalContext.Provider value={{ isUserLoading, setIsUserLoading, user, setUser,isAppLoading,setIsAppLoading }}>
            {children}
        </GlobalContext.Provider>
    )
}