import { AlertTriangle, X } from "lucide-react";

function DeleteCategoryModal({
  isOpen,
  category,
  isDeleting,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !category) {
    return null;
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="delete-category-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-category-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="delete-category-icon">
          <AlertTriangle size={26} />
        </div>

        <button
          className="modal-close-button delete-category-close"
          type="button"
          onClick={onClose}
          aria-label="Close delete category modal"
        >
          <X size={20} />
        </button>

        <div className="delete-category-content">
          <span className="modal-eyebrow">
            Delete category
          </span>

          <h2 id="delete-category-title">
            Are you sure?
          </h2>

          <p>
            You are about to permanently delete
            <strong> “{category.name}”</strong>.
          </p>

          <p>
            Tasks currently using this category may become
            uncategorized.
          </p>
        </div>

        <div className="delete-category-actions">
          <button
            className="modal-secondary-button"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            className="delete-category-confirm-button"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? "Deleting..."
              : "Delete category"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteCategoryModal;