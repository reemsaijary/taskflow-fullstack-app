import { AlertTriangle, X } from "lucide-react";

function DeleteTaskModal({
  isOpen,
  task,
  isDeleting,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="delete-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-task-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="delete-modal-icon">
          <AlertTriangle size={26} />
        </div>

        <button
          className="modal-close-button delete-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close delete task modal"
        >
          <X size={20} />
        </button>

        <div className="delete-modal-content">
          <span className="modal-eyebrow">Delete task</span>

          <h2 id="delete-task-title">
            Are you sure?
          </h2>

          <p>
            You are about to permanently delete
            <strong> “{task.title}”</strong>.
            This action cannot be undone.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            className="modal-secondary-button"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            className="delete-confirm-button"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete task"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteTaskModal;