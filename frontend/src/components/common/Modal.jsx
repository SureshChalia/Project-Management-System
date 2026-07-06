import React from "react";

export default function Modal({ 
  children, 
  onClose, 
  title, 
  isOpen = true,
  size = "md" 
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "w-full sm:w-96",
    md: "w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-3/5",
    lg: "w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4",
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className={`bg-white rounded-xl shadow-2xl p-6 ${sizeClasses[size] || sizeClasses.md} max-h-96 overflow-y-auto`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
