import { useEffect, useState } from "react";
import { X } from "lucide-react";

import api from "../../api/axios";

function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onCategoryUpdated,
}) {
  const [formData, setFormData] = useState({
    name: "",
    colour: "#FACC15",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) {
      return;
    }

    setFormData({
      name: category.name || "",
      colour: category.colour || "#FACC15",
    });

    setError("");
  }, [category, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!category) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.patch(
        `/categories/${category.id}/`,
        formData
      );

      onCategoryUpdated(response.data);
      onClose();
    } catch (requestError) {
      const responseData = requestError.response?.data;

      if (responseData && typeof responseData === "object") {
        const firstError = Object.values(responseData).flat()[0];

        setError(firstError || "Could not update category.");
      } else {
        setError("Could not update category.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !category) {
    return null;
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="create-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-category-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              Edit category
            </span>

            <h2 id="edit-category-title">
              Update category
            </h2>

            <p>
              Change the category name or color.
            </p>
          </div>

          <button
            className="modal-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close edit category modal"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="create-task-form"
          onSubmit={handleSubmit}
        >
          <div className="modal-form-group full-width">
            <label htmlFor="edit-category-name">
              Category name
            </label>

            <input
              id="edit-category-name"
              name="name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-form-group full-width">
            <label htmlFor="edit-category-colour">
              Color
            </label>

            <input
              id="edit-category-colour"
              name="colour"
              type="color"
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
              className="modal-secondary-button"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              className="modal-primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditCategoryModal;