import React from "react";

const Loader = ({
  fullScreen = false,
  text = "Loading...",
  size = "md",
}) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer Ring */}
        <div
          className={`${sizes[size]} rounded-full border-4 border-indigo-200`}
        />

        {/* Animated Ring */}
        <div
          className={`absolute inset-0 ${sizes[size]} rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin`}
        />

        {/* Center Logo */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">PM</span>
        </div>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-gray-700">{text}</h3>

      <p className="text-sm text-gray-500 mt-1">
        Please wait while we prepare your workspace...
      </p>

      {/* Animated Dots */}
      <div className="flex gap-2 mt-4">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
        <span
          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20 w-full">
      {content}
    </div>
  );
};

export default Loader;