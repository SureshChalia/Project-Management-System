import React from "react";

export default function Button({ children, loading, type = "button", className = "", variant = "primary", ...rest }) {
	const variants = {
		primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
		secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
		ghost: "bg-white border hover:bg-gray-50 text-gray-700",
		danger: "bg-red-600 hover:bg-red-700 text-white",
	};

	return (
		<button
			type={type}
			disabled={loading}
			className={`inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm disabled:opacity-60 ${variants[variant] || variants.primary} ${className}`}
			{...rest}
		>
			{loading ? (
				<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
				</svg>
			) : (
				children
			)}
		</button>
	);
}
