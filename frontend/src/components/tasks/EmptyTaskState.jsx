const EmptyTaskState = ({ onAddTask }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-5xl mb-4">📋</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Yet</h3>
      <p className="text-gray-600 text-center mb-6 max-w-xs">
        Create your first task to get started with project management.
      </p>
      <button
        onClick={onAddTask}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        + Add Task
      </button>
    </div>
  );
};

export default EmptyTaskState;
