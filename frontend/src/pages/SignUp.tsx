"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/signup`,formData);
      toast.success("Registered Successfully");
      setTimeout(() => {
        toast("Redirecting you...");
        navigate("/")
      },3000)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 flex items-center justify-center px-4">
      <ToastContainer/>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create an Account ✨
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Join your team and start collaborating in real time
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg shadow-lg transition-all"
            >
              <UserPlus size={18} />
              Sign Up
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/"
              className="text-gray-800 font-semibold hover:underline"
            >
              Log in
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
