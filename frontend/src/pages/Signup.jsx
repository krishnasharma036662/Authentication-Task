import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Signup() {

    const { register } = useAuth();

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        username: "",

        email: "",

        password: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await register(form);

            toast.success("Account Created");

            navigate("/login");

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Registration Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-100 via-white to-blue-100">

            <div className="bg-white rounded-3xl shadow-2xl w-[430px] p-10">

                <h1 className="text-4xl font-bold text-center">

                    Create Account

                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">

                    Register your account

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input

                        name="username"

                        placeholder="Username"

                        onChange={handleChange}

                        className="w-full border rounded-xl p-3"

                    />

                    <input

                        name="email"

                        placeholder="Email"

                        type="email"

                        onChange={handleChange}

                        className="w-full border rounded-xl p-3"

                    />

                    <div className="relative">

                        <input

                            name="password"

                            placeholder="Password"

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3"

                        />

                        <button

                            type="button"

                            onClick={() =>
                                setShowPassword(!showPassword)
                            }

                            className="absolute right-4 top-4"

                        >

                            {

                                showPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />

                            }

                        </button>

                    </div>

                    <button

                        disabled={loading}

                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-white flex items-center justify-center gap-2"

                    >

                        <UserPlus size={18} />

                        {

                            loading
                                ? "Creating..."
                                : "Create Account"

                        }

                    </button>

                </form>

                <p className="text-center mt-6">

                    Already have an account?

                    <Link

                        to="/login"

                        className="text-blue-600 font-semibold ml-2"

                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}