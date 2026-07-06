import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import TaskColumn from "./TaskColumn";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  updateTaskStatus as updateTaskStatusRedux,
  setError,
} from "../../redux/slices/taskSlice";
import taskService from "../../services/task.service";

const STATUSES = ["Todo", "In Progress", "Done"];
const EMPTY_TASKS = [];

const KanbanBoard = ({
  projectId,
  onTaskClick,
  onAddTaskClick,
  onTaskDelete,
}) => {
  const dispatch = useDispatch();
  const { tasksByProject, loading, error } = useSelector((state) => state.tasks);
  const [localLoading, setLocalLoading] = useState(true);
  const tasks = useMemo(
    () => tasksByProject[projectId] || EMPTY_TASKS,
    [tasksByProject, projectId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch tasks for project
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLocalLoading(true);
        const response = await taskService.getTasksByProject(projectId);
        dispatch(
          setTasks({
            projectId,
            tasks: response.data?.tasks || [],
          })
        );
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to fetch tasks"));
      } finally {
        setLocalLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, dispatch]);

  // Organize tasks by status
  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {});

  const getDropStatus = useCallback(
    (overId) => {
      if (STATUSES.includes(overId)) {
        return overId;
      }

      return tasks.find((task) => task._id === overId)?.status;
    },
    [tasks]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;

      if (!over) return;

      const activeTaskId = active.id;
      const newStatus = getDropStatus(over.id);

      // Find the task
      const task = tasks.find((t) => t._id === activeTaskId);
      if (!task || !newStatus || task.status === newStatus) return;

      try {
        // Optimistically update Redux
        dispatch(
          updateTaskStatusRedux({
            projectId,
            taskId: activeTaskId,
            status: newStatus,
          })
        );

        // Update backend
        await taskService.updateTaskStatus(activeTaskId, newStatus);
      } catch (err) {
        // Revert optimistic update on error
        dispatch(
          updateTaskStatusRedux({
            projectId,
            taskId: activeTaskId,
            status: task.status,
          })
        );
        dispatch(
          setError(err.response?.data?.message || "Failed to update task status")
        );
      }
    },
    [tasks, projectId, dispatch, getDropStatus]
  );

  // Responsive grid
  const containerClasses =
    "grid gap-4 p-4 overflow-x-auto auto-cols-max lg:auto-cols-fr lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100";

  return (
    <div className="w-full overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className={containerClasses}>
          {STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              loading={localLoading || loading}
              onTaskClick={onTaskClick}
              onTaskDelete={onTaskDelete}
              onAddTask={() => onAddTaskClick(status)}
            />
          ))}
        </div>
      </DndContext>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
