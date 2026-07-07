import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import authService from "../../services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setError } from "../../redux/slices/authSlice";
import { fetchProjects } from "../../redux/thunks/projectThunks";
import storage from "../../utils/storage";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const schema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export default function Register() {
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
			const payload = {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			};

			const res = await authService.register(payload);
			if (res && res.success) {
				const { user, token } = res.data;
				storage.setToken(token);
				dispatch(loginSuccess({ user, token }));
				// fetch projects immediately so dashboard shows data
				dispatch(fetchProjects());
				toast.success("Registration successful");
				navigate("/dashboard");
			} else {
				toast.error(res.message || "Registration failed");
				dispatch(setError(res.message));
			}
		} catch (err) {
			toast.error(err?.response?.data?.message || err.message || "Registration failed");
			dispatch(setError(err?.response?.data?.message || err.message));
		} finally {
			setLocalLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.22),_transparent_35%),linear-gradient(135deg,_#f8faff_0%,_#eef2ff_45%,_#fdf2f8_100%)] px-4 py-8 sm:px-6 lg:px-8">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-indigo-400/30 blur-3xl" />
				<div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-400/25 blur-3xl" />
				<div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
			</div>

			<div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
				<div className="w-full max-w-xl rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
					<div className="mb-8 text-center">
						<div className="mb-3 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
							New workspace
						</div>
						<h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Create your account</h2>
						<p className="mt-2 text-sm text-slate-600 sm:text-base">Join thousands of teams building faster with a beautifully simple workspace.</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Input label="First Name" name="firstName" register={register} error={errors.firstName?.message} />
							<Input label="Last Name" name="lastName" register={register} error={errors.lastName?.message} />
						</div>

						<Input label="Email" name="email" register={register} error={errors.email?.message} />

						<Input label="Password" name="password" type="password" register={register} error={errors.password?.message} />

						<Input label="Confirm Password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword?.message} />

						<div className="pt-2">
							<Button type="submit" loading={loading} className="w-full rounded-xl py-3.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0">
								Create account
							</Button>
						</div>
					</form>

					<div className="mt-6 flex flex-col items-center justify-center gap-2 border-t border-slate-200/80 pt-5 text-center sm:flex-row sm:gap-2">
						<p className="text-sm text-slate-600">Already have an account?</p>
						<Link to="/" className="text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700">
							Log in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
