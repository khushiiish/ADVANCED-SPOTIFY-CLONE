import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Loader } from "lucide-react";
import { axiosInstance} from "@/lib/axios"
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';



const updateApiToken=(token:string | null)=>{
    if(token){
        axiosInstance.defaults.headers.common['Authorization']=`Bearer ${token}`
    }else{
        delete axiosInstance.defaults.headers.common['Authorization']
    }
}


const AuthProvider=({children}: {children:React.ReactNode})=>{

    const {getToken, userId, isLoaded, isSignedIn}=useAuth()
    const [loading,setLoading]=useState(true);
    const {checkAdminStatus, reset}=useAuthStore();
    const {initSocket,disconnectSocket}=useChatStore()

    useEffect(()=>{
        const initAuth=async()=>{
            try{
                if(!isLoaded) return;

                if (isSignedIn && userId) {
                    const token = await getToken();
                    updateApiToken(token);
                    if (token) {
                        await checkAdminStatus();
                        initSocket(userId);
                    }
                } else {
                    updateApiToken(null);
                    reset();
                }
            }catch(error:any){
                updateApiToken(null);
                reset();
                console.log("Error in auth provider", error);
            }finally{
                if(isLoaded){
                    setLoading(false);
                }
            }
        };
    
        initAuth();
        return ()=>disconnectSocket();
    },[getToken, userId, isLoaded, isSignedIn, checkAdminStatus, reset, initSocket, disconnectSocket])

    if(loading) return(
        <div className="h-screen w-full flex items-center justify-center">
            <Loader className="size-8 text-emerald-500 animate-spin" />
        </div>
    )

    return <div>{children}</div>
};
export default AuthProvider;