const StatusBadge = ({ status }) => {
  const statusColors = {
    Todo: "bg-gray-100 text-gray-800 border border-gray-300",
    "In Progress": "bg-blue-100 text-blue-800 border border-blue-300",
    Done: "bg-green-100 text-green-800 border border-green-300",
  };

  const statusIcons = {
    Todo: "◯",
    "In Progress": "◒",
    Done: "✓",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        statusColors[status] || statusColors.Todo
      }`}
    >
      <span>{statusIcons[status]}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
