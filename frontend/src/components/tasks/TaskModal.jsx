import Modal from "../common/Modal";
import TaskForm from "./TaskForm";

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultStatus,
  projectMembers,
  isLoading,
  title,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (initialData ? "Edit Task" : "Create New Task")}
      size="md"
    >
      <TaskForm
        initialData={initialData}
        defaultStatus={defaultStatus}
        projectMembers={projectMembers}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Modal>
  );
};

export default TaskModal;
