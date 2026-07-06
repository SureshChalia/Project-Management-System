import Modal from "../common/Modal";
import Button from "../common/Button";

const DeleteTaskModal = ({ isOpen, onClose, onConfirm, isLoading, taskTitle }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task" size="sm">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete the task{" "}
          <strong>{taskTitle}</strong>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTaskModal;
