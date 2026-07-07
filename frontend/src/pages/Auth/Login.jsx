import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiCheckCircle,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import authService from "../../services/auth.service";
import socketService from "../../services/socket.service";
import {
  loginSuccess,
  setError,
} from "../../redux/slices/authSlice";
import { fetchProjects } from "../../redux/thunks/projectThunks";
import storage from "../../utils/storage";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLocalLoading] = useState(false);

  const onSubmit = async (data) => {
    setLocalLoading(true);

    try {
      const res = await authService.login(data);

      if (res && res.success) {
        const { user, token } = res.data;

        storage.setToken(token);

        dispatch(loginSuccess({ user, token }));

        dispatch(fetchProjects());

        try {
          await socketService.connect(token);
          console.log("Socket connected successfully");
        } catch (socketError) {
          console.error(
            "Failed to connect socket:",
            socketError.message
          );
          toast.warning("Real-time features may not work");
        }

        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error(res.message || "Login failed");
        dispatch(setError(res.message));
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Login failed"
      );

      dispatch(
        setError(
          err?.response?.data?.message || err.message
        )
      );
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-sky-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden px-16">
          {/* Decorative Blobs */}
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-300 blur-3xl opacity-30"></div>

          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300 blur-3xl opacity-30"></div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-2 shadow">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-gray-700">
                Modern Project Management
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight text-gray-900">
              Manage your projects
              <span className="block text-indigo-600">
                smarter & faster.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Organize projects, collaborate with your team,
              assign tasks, track progress and boost productivity
              with one beautiful workspace.
            </p>

            <div className="mt-12 space-y-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-indigo-100 p-3">
                  <FiZap className="text-xl text-indigo-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-gray-500">
                    Real-time collaboration and instant updates.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-sky-100 p-3">
                  <FiUsers className="text-xl text-sky-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Team Collaboration
                  </h3>
                  <p className="text-sm text-gray-500">
                    Assign tasks and work together efficiently.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-100 p-3">
                  <FiShield className="text-xl text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Secure Workspace
                  </h3>
                  <p className="text-sm text-gray-500">
                    Protected authentication and secure access.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-2xl bg-white/70 backdrop-blur p-6 shadow-xl border border-white">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-emerald-500 text-3xl" />

                <div>
                  <p className="font-semibold">
                    Everything you need in one place
                  </p>

                  <p className="text-sm text-gray-500">
                    Tasks • Projects • Teams • Reports • Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-8 shadow-2xl">
              {/* Mobile Heading */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-indigo-600 to-sky-500 text-white text-2xl font-bold shadow-lg">
                  PM
                </div>

                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h2>

                <p className="mt-2 text-gray-500">
                  Sign in to continue managing your workspace.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <Input
                  label="Email Address"
                  name="email"
                  register={register}
                  error={errors.email?.message}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  error={errors.password?.message}
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-sky-500 py-3 text-white hover:opacity-95 transition-all shadow-lg"
                >
                  Sign In
                </Button>
              </form>

              <div className="my-8 flex items-center">
                <div className="h-px flex-1 bg-gray-200"></div>

                <span className="px-4 text-sm text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              <div className="text-center">
                <p className="text-gray-500">
                  Don't have an account?
                </p>

                <Link
                  to="/register"
                  className="mt-2 inline-flex font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Create an account →
                </Link>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Project Management System.
              <br />
              Build • Collaborate • Deliver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}