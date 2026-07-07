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
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 bg-white p-8 rounded shadow">
				<h2 className="text-2xl font-semibold mb-6 text-center">Create an account</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<Input label="First Name" name="firstName" register={register} error={errors.firstName?.message} />
						<Input label="Last Name" name="lastName" register={register} error={errors.lastName?.message} />
					</div>

					<Input label="Email" name="email" register={register} error={errors.email?.message} />

					<Input label="Password" name="password" type="password" register={register} error={errors.password?.message} />

					<Input label="Confirm Password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword?.message} />

					<div className="flex items-center justify-between">
						<Link to="/" className="text-sm text-indigo-600">Already have an account?</Link>
						<Button type="submit" loading={loading}>Create account</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
