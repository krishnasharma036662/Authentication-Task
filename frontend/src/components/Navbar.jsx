import { Shield, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

    const { logoutUser } = useAuth();

    return (

        <nav className="bg-white shadow-md">

            <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

                <div className="flex items-center gap-3">

                    <Shield className="text-blue-600"/>

                    <h1 className="font-bold text-2xl">

                        MERN Auth

                    </h1>

                </div>

                <button

                    onClick={logoutUser}

                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"

                >

                    <LogOut size={18}/>

                    Logout

                </button>

            </div>

        </nav>

    );

}