import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { User, Mail, BadgeCheck } from "lucide-react";

export default function Dashboard() {

    const { user } = useAuth();

    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar/>

            <div className="max-w-5xl mx-auto py-12">

                <div className="bg-white rounded-3xl shadow-xl p-10">

                    <h1 className="text-4xl font-bold mb-8">

                        Dashboard

                    </h1>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="bg-blue-50 rounded-xl p-6">

                            <User className="mb-3 text-blue-600"/>

                            <h2 className="font-semibold">

                                Username

                            </h2>

                            <p className="mt-2">

                                {user?.username}

                            </p>

                        </div>

                        <div className="bg-green-50 rounded-xl p-6">

                            <Mail className="mb-3 text-green-600"/>

                            <h2 className="font-semibold">

                                Email

                            </h2>

                            <p className="mt-2">

                                {user?.email}

                            </p>

                        </div>

                        <div className="bg-purple-50 rounded-xl p-6">

                            <BadgeCheck className="mb-3 text-purple-600"/>

                            <h2 className="font-semibold">

                                Verification

                            </h2>

                            <p className="mt-2">

                                {

                                    "Verified"

                                }

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}