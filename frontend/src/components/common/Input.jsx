import React from "react";

export default function Input({ label, name, register, type = "text", error, ...rest }) {
	return (
		<div className="w-full">
			{label && <label className="block text-sm font-medium mb-1">{label}</label>}
			<input
				name={name}
				type={type}
				{...(register ? register(name) : {})}
				className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? "border-red-500" : "border-gray-300"}`}
				{...rest}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}
