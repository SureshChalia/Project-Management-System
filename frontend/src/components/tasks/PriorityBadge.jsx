const PriorityBadge = ({ priority }) => {
  const priorityColors = {
    Low: "bg-blue-100 text-blue-800 border border-blue-300",
    Medium: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    High: "bg-orange-100 text-orange-800 border border-orange-300",
    Critical: "bg-red-100 text-red-800 border border-red-300",
  };

  const priorityIcons = {
    Low: "▼",
    Medium: "●",
    High: "▲",
    Critical: "◆",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        priorityColors[priority] || priorityColors.Medium
      }`}
    >
      <span>{priorityIcons[priority]}</span>
      {priority}
    </span>
  );
};

export default PriorityBadge;
