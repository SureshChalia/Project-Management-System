import React from "react";

export default function Input({ label, name, register, type = "text", error, ...rest }) {
	return (
		<div className="w-full">
			{label && <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>}
			<input
				name={name}
				type={type}
				{...(register ? register(name) : {})}
				className={`w-full rounded-2xl border bg-slate-50/80 px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 ${error ? "border-red-400" : "border-slate-200"}`}
				{...rest}
			/>
			{error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
		</div>
	);
}
