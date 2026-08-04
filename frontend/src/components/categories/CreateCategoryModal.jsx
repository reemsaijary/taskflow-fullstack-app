import { useState } from "react";
import { X } from "lucide-react";

import api from "../../api/axios";

const initialForm = {
  name: "",
  colour: "#FACC15",
};

function CreateCategoryModal({
  isOpen,
  onClose,
  onCategoryCreated,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post(
        "/categories/",
        formData
      );

      onCategoryCreated(response.data);

      setFormData(initialForm);

      onClose();
    } catch {
      setError("Could not create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="create-task-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              New category
            </span>

            <h2>Create category</h2>

            <p>
              Organize your tasks into groups.
            </p>
          </div>

          <button
            className="modal-close-button"
            type="button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="create-task-form"
          onSubmit={handleSubmit}
        >
          <div className="modal-form-group full-width">
            <label>Category name</label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-form-group full-width">
            <label>Color</label>

            <input
              type="color"
              name="colour"
              value={formData.colour}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="modal-error-message full-width">
              {error}
            </p>
          )}

          <div className="modal-actions full-width">
            <button
              type="button"
              className="modal-secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="modal-primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating..."
                : "Create Category"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateCategoryModal;