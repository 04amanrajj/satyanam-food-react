import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        agree: false,
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const isFormValid = () => {
        const { email, password } = formData;
        return email && password.length >= 8;
    };

    return (
        <div className="flex items-center justify-center">
            <div>
                <img src="/coverpage/img2.jpeg" alt="food-image" width="100%" height="100%" />
            </div>
            <div className="flex items-center justify-center mt-10">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6">Login Account</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="example@gmail.com"
                                    className="w-full p-2 border rounded-lg"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <i className="fas fa-envelope absolute right-3 top-3 text-gray-400"></i>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="********"
                                    className="w-full p-2 border rounded-lg"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <i
                                    className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"} absolute right-3 top-3 text-gray-400 cursor-pointer`}
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                ></i>
                            </div>
                        </div>
                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                name="agree"
                                checked={formData.agree}
                                onChange={handleChange}
                            />
                            <label className="text-gray-700">Remember Password</label>
                        </div>
                        <button
                            className="w-full bg-green-500 text-white p-2 rounded-lg"
                            disabled={!isFormValid()}
                        >
                            Login Account
                        </button>
                    </form>
                    <p className="mt-4 text-center text-gray-700">
                        Don't have an account? <Link to="/user" className="text-blue-500">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;