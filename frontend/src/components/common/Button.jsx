import React from "react";

export default function Button({ children, loading, type = "button", className = "", variant = "primary", ...rest }) {
	const variants = {
		primary: "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 text-white",
		secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900",
		ghost: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700",
		danger: "bg-red-600 hover:bg-red-700 text-white",
	};

	return (
		<button
			type={type}
			disabled={loading}
			className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant] || variants.primary} ${className}`}
			{...rest}
		>
			{loading ? (
				<svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
				</svg>
			) : (
				children
			)}
		</button>
	);
}
