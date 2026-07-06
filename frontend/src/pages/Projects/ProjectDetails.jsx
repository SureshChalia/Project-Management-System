import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import KanbanBoard from "../../components/tasks/KanbanBoard";
import TaskModal from "../../components/tasks/TaskModal";
import DeleteTaskModal from "../../components/tasks/DeleteTaskModal";
import TaskDetailsModal from "../../components/tasks/TaskDetailsModal";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import taskService from "../../services/task.service";
import projectService from "../../services/project.service";
import socketService from "../../services/socket.service";
import { useSocketTaskEvents } from "../../hooks/useSocketEvents";
import {
  addTask as addTaskRedux,
  deleteTask as deleteTaskRedux,
  updateTask as updateTaskRedux,
} from "../../redux/slices/taskSlice";

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("Todo");

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  const handleTaskEvent = useCallback((event) => {
    const { type, task, userName, status } = event;
    const actor = userName || "User";
    const taskTitle = task?.title || "Task";

    const activity = {
      id: `${Date.now()}-${type}`,
      type,
      task: taskTitle,
      user: actor,
      timestamp: new Date(),
    };

    setActivityFeed((prev) => [activity, ...prev.slice(0, 9)]);

    switch (type) {
      case "created":
        toast.success(`${actor} created a task: ${taskTitle}`);
        break;
      case "updated":
        toast.success(`${actor} updated a task: ${taskTitle}`);
        break;
      case "deleted":
        toast.success(`${actor} deleted a task`);
        break;
      case "statusChanged":
        toast.success(`${actor} moved a task to ${status}`);
        break;
      default:
        break;
    }
  }, []);

  useSocketTaskEvents(projectId, handleTaskEvent);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoadingProject(true);
        setProjectError(null);
        const response = await projectService.getProject(projectId);
        setProject(response.data?.project);
      } catch (err) {
        setProjectError(err.response?.data?.message || "Failed to load project");
        toast.error("Project not found");
        navigate("/projects");
      } finally {
        setLoadingProject(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, navigate]);

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setDefaultStatus("Todo");
  };

  const handleCreateTask = async (formData) => {
    try {
      setIsCreatingTask(true);
      const response = await taskService.createTask({
        ...formData,
        project: projectId,
      });

      dispatch(
        addTaskRedux({
          projectId,
          task: response.data?.task,
        })
      );
      toast.success("Task created successfully");
      closeTaskModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    if (!editingTask?._id) return;

    try {
      setIsUpdatingTask(true);
      const response = await taskService.updateTask(editingTask._id, formData);

      dispatch(
        updateTaskRedux({
          projectId,
          task: response.data?.task,
        })
      );
      toast.success("Task updated successfully");
      closeTaskModal();
      setIsDetailsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;

    try {
      setIsDeletingTask(true);
      await taskService.deleteTask(selectedTaskId);

      dispatch(
        deleteTaskRedux({
          projectId,
          taskId: selectedTaskId,
        })
      );
      toast.success("Task deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedTaskId(null);
      setSelectedTask(null);
      setIsDetailsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setSelectedTaskId(task._id);
    setIsDetailsModalOpen(true);
  };

  const handleAddTask = (status = "Todo") => {
    setDefaultStatus(status);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleDeleteClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDeleteModalOpen(true);
  };

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-2"
              >
                &larr; Back to Projects
              </button>

              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                {socketService.getIsConnected() && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span className="text-green-700 font-medium">Live</span>
                  </div>
                )}
              </div>

              {project.description && (
                <p className="text-gray-600 mt-1">{project.description}</p>
              )}
            </div>

            <Button onClick={() => handleAddTask("Todo")}>+ Add Task</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activityFeed.length > 0 && (
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Live Activity</h3>
            <div className="space-y-2">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="text-xs text-gray-600">
                  <span className="font-medium text-gray-900">{activity.user}</span>{" "}
                  <span className="text-gray-700">
                    {activity.type === "created" && "created "}
                    {activity.type === "updated" && "updated "}
                    {activity.type === "deleted" && "deleted "}
                    {activity.type === "statusChanged" && "moved "}
                  </span>
                  <span className="font-medium text-indigo-600">{activity.task}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          projectId={projectId}
          project={project}
          onTaskClick={handleTaskClick}
          onAddTaskClick={handleAddTask}
          onTaskDelete={handleDeleteClick}
        />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
        defaultStatus={defaultStatus}
        projectMembers={project?.members || []}
        isLoading={isCreatingTask || isUpdatingTask}
        title={editingTask ? "Edit Task" : "Create New Task"}
      />

      {selectedTask && (
        <TaskDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onEdit={() => handleEditTask(selectedTask)}
          onDelete={() => handleDeleteClick(selectedTask._id)}
          projectMembers={project?.members || []}
          currentUser={user}
        />
      )}

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTaskId(null);
        }}
        onConfirm={handleDeleteTask}
        isLoading={isDeletingTask}
        taskTitle={selectedTask?.title || "this task"}
      />
    </div>
  );
};

export default ProjectDetails;
