const TaskSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-6"></div>
          <div className="h-6 bg-gray-200 rounded-full w-6"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
