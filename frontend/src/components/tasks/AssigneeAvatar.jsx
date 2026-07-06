const AssigneeAvatar = ({ user, size = "md" }) => {
  if (!user) {
    return (
      <div
        className={`
          rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-600
          ${size === "sm" ? "w-6 h-6 text-xs" : ""}
          ${size === "md" ? "w-8 h-8 text-sm" : ""}
          ${size === "lg" ? "w-10 h-10 text-base" : ""}
        `}
      >
        ?
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
  ];
  const colorIndex = (user._id?.charCodeAt(0) || 0) % colors.length;

  return (
    <div
      title={`${user.firstName} ${user.lastName}`}
      className={`
        rounded-full flex items-center justify-center font-bold text-white
        ${colors[colorIndex]}
        ${size === "sm" ? "w-6 h-6 text-xs" : ""}
        ${size === "md" ? "w-8 h-8 text-sm" : ""}
        ${size === "lg" ? "w-10 h-10 text-base" : ""}
      `}
    >
      {initials}
    </div>
  );
};

export default AssigneeAvatar;
