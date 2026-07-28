import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const { login } = useAuth();

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
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

            await login(form);

            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (err) {

            toast.error(
                err.response?.data?.message || "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 via-white to-blue-100">

            <div className="bg-white rounded-3xl shadow-2xl w-[420px] p-10">

                <h1 className="text-4xl font-bold text-center mb-2">

                    Welcome Back

                </h1>

                <p className="text-center text-gray-500 mb-8">

                    Login to continue

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input

                        type="email"
                        name="email"
                        placeholder="Email"

                        onChange={handleChange}

                        className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"

                    />

                    <div className="relative">

                        <input

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            name="password"

                            placeholder="Password"

                            onChange={handleChange}

                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"

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

                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-white flex justify-center items-center gap-2"

                    >

                        <LogIn size={18} />

                        {

                            loading
                                ? "Logging In..."
                                : "Login"

                        }

                    </button>

                </form>

                <p className="text-center mt-6">

                    Don't have an account?

                    <Link

                        to="/signup"

                        className="text-blue-600 font-semibold ml-2"

                    >

                        Signup

                    </Link>

                </p>

            </div>

        </div>

    );

}