import { createContext, useContext, useEffect, useState } from "react";
import {
    loginUser,
    registerUser,
    getMe,
    refreshToken,
    logout
} from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken") || ""
    );

    const login = async (credentials) => {

        const res = await loginUser(credentials);

        localStorage.setItem(
            "accessToken",
            res.data.accessToken
        );

        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
    };

    const register = async (data) => {

        return registerUser(data);

    };

    const logoutUser = async () => {

        try{

            await logout();

        }catch{}

        localStorage.removeItem("accessToken");

        setAccessToken("");

        setUser(null);

    };

    const fetchUser = async () => {

        if(!accessToken){

            setLoading(false);
            return;

        }

        try{

            const me=await getMe(accessToken);

            setUser(me.data.user);

        }

        catch{

            try{

                const refresh=await refreshToken();

                localStorage.setItem(
                    "accessToken",
                    refresh.data.accessToken
                );

                setAccessToken(refresh.data.accessToken);

                const me=await getMe(refresh.data.accessToken);

                setUser(me.data.user);

            }

            catch{

                localStorage.removeItem("accessToken");

                setAccessToken("");

                setUser(null);

            }

        }

        setLoading(false);

    };

    useEffect(()=>{

        fetchUser();

    },[]);

    return(

        <AuthContext.Provider
        value={{
            user,
            loading,
            login,
            register,
            logoutUser
        }}>

            {children}

        </AuthContext.Provider>

    )

}