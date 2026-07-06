import axios from "axios"
import { useAuthStore } from "../store"

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})


const refreshToken = async ()=>{
    axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,{}, {withCredentials: true})
}

api.interceptors.response.use((res)=> res, async(err)=>{
    const originalRequest = err.config

    if(err.response.status === 401 && !originalRequest._isRetray){
        try {
            originalRequest._isRetray = true
            const headers = {...originalRequest.headers}
            await refreshToken()
            return api.request({...originalRequest, headers})
        } catch (error) {
            console.error("Token refresh error",error)
            useAuthStore.getState().logout()
            return Promise.reject(error)
        }
    }

    return  Promise.reject(err)
})