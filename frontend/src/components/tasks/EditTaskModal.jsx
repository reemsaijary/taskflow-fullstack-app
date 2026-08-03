import { useEffect, useState } from "react";
import { X } from "lucide-react";

import api from "../../api/axios";

function EditTaskModal({
  isOpen,
  task,
  onClose,
  onTaskUpdated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    status: "TODO",
    start_date: "",
    due_date: "",
    progress: 0,
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
      } catch {
        setError("Could not load categories.");
      }
    };

    fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (!task) {
      return;
    }

    setFormData({
      title: task.title || "",
      description: task.description || "",
      category: task.category || "",
      priority: task.priority || "MEDIUM",
      status: task.status || "TODO",
      start_date: task.start_date || "",
      due_date: task.due_date || "",
      progress: task.progress ?? 0,
    });

    setError("");
  }, [task, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!task) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload = {
      ...formData,
      category: formData.category
        ? Number(formData.category)
        : null,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
    };

    try {
      const response = await api.patch(
        `/tasks/${task.id}/`,
        payload
      );

      onTaskUpdated(response.data);
      onClose();
    } catch (requestError) {
      const responseData = requestError.response?.data;

      if (responseData && typeof responseData === "object") {
        const firstError = Object.values(responseData).flat()[0];
        setError(firstError || "Could not update task.");
      } else {
        setError("Could not update task.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="create-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Edit task</span>

            <h2 id="edit-task-title">
              Update task details
            </h2>

            <p>
              Change the task information and save your updates.
            </p>
          </div>

          <button
            className="modal-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close edit task modal"
          >
            <X size={20} />
          </button>
        </div>

        <form className="create-task-form" onSubmit={handleSubmit}>
          <div className="modal-form-group full-width">
            <label htmlFor="edit-task-title-input">Title</label>

            <input
              id="edit-task-title-input"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-form-group full-width">
            <label htmlFor="edit-task-description">
              Description
            </label>

            <textarea
              id="edit-task-description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="edit-task-category">Category</label>

            <select
              id="edit-task-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">No category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label htmlFor="edit-task-priority">Priority</label>

            <select
              id="edit-task-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="modal-form-group">
            <label htmlFor="edit-task-status">Status</label>

            <select
              id="edit-task-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="modal-form-group">
            <label htmlFor="edit-task-progress">Progress</label>

            <input
              id="edit-task-progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="edit-task-start-date">
              Start date
            </label>

            <input
              id="edit-task-start-date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="edit-task-due-date">
              Due date
            </label>

            <input
              id="edit-task-due-date"
              name="due_date"
              type="date"
              value={formData.due_date}
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
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditTaskModal;