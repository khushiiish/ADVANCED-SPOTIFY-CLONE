import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Loader } from "lucide-react";
import { axiosInstance} from "@/lib/axios"
import { useAuthStore } from '@/stores/useAuthStore';



const updateApiToken=(token:string | null)=>{
    if(token){
        axiosInstance.defaults.headers.common['Authorization']=`Bearer ${token}`
    }else{
        delete axiosInstance.defaults.headers.common['Authorization']
    }
}


const AuthProvider=({children}: {children:React.ReactNode})=>{

    const {getToken, userId, isLoaded}=useAuth()
    const [loading,setLoading]=useState(true);
    const {checkAdminStatus, reset}=useAuthStore()

    useEffect(()=>{
        const initAuth=async()=>{
            try{
                if (userId) {
                    let token = await getToken();
                    if (!token) {
                        // Small retry delay if Clerk token is not immediately available
                        await new Promise((res) => setTimeout(res, 500));
                        token = await getToken();
                    }
                    updateApiToken(token);
                    if (token) {
                        await checkAdminStatus();
                    } else {
                        reset();
                    }
                } else {
                    updateApiToken(null);
                    reset();
                }

            }catch(error:any){
                updateApiToken(null);
                reset();
                console.log("Error in auth provider", error)
                
            }finally{
                setLoading(false);
            }
    };
    if (isLoaded) {
        initAuth();
    }

},[getToken, userId, isLoaded])

if(loading) return(
    <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />

    </div>

)

    return <div>{children}</div>
};
export default AuthProvider;