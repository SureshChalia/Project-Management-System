import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import authService from "../../services/auth.service";
import socketService from "../../services/socket.service";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setLoading, setError } from "../../redux/slices/authSlice";
import { fetchProjects } from "../../redux/thunks/projectThunks";
import storage from "../../utils/storage";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [loading, setLocalLoading] = useState(false);

  const onSubmit = async (data) => {
    setLocalLoading(true);
    try {
      const res = await authService.login(data);
      if (res && res.success) {
        const { user, token } = res.data;
        storage.setToken(token);
        dispatch(loginSuccess({ user, token }));
        // Load projects immediately after login so dashboard has data
        dispatch(fetchProjects());

        // Connect socket with JWT token
        try {
          await socketService.connect(token);
          console.log("Socket connected successfully");
        } catch (socketError) {
          console.error("Failed to connect socket:", socketError.message);
          // Don't fail login if socket connection fails
          toast.warning("Real-time features may not work");
        }

        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error(res.message || "Login failed");
        dispatch(setError(res.message));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Login failed");
      dispatch(setError(err?.response?.data?.message || err.message));
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign in to your account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" name="email" register={register} error={errors.email?.message} />

          <Input label="Password" name="password" type="password" register={register} error={errors.password?.message} />

          <div className="flex items-center justify-between">
            <Link to="/register" className="text-sm text-indigo-600">Create account</Link>
            <Button type="submit" loading={loading}>Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  );
}