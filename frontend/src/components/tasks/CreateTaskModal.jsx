import { useEffect, useState } from "react";
import { X } from "lucide-react";

import api from "../../api/axios";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  priority: "MEDIUM",
  status: "TODO",
  start_date: "",
  due_date: "",
  progress: 0,
};

function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const [formData, setFormData] = useState(initialFormData);
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
    if (!isOpen) {
      setFormData(initialFormData);
      setError("");
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    const payload = {
      ...formData,
      category: formData.category ? Number(formData.category) : null,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
    };

    try {
      const response = await api.post("/tasks/", payload);

      onTaskCreated(response.data);
      onClose();
    } catch (requestError) {
      const responseData = requestError.response?.data;

      if (responseData && typeof responseData === "object") {
        const firstError = Object.values(responseData).flat()[0];
        setError(firstError || "Could not create task.");
      } else {
        setError("Could not create task.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="create-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">New task</span>
            <h2 id="create-task-title">Create a task</h2>
            <p>Add the details and save it to your workspace.</p>
          </div>

          <button
            className="modal-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close create task modal"
          >
            <X size={20} />
          </button>
        </div>

        <form className="create-task-form" onSubmit={handleSubmit}>
          <div className="modal-form-group full-width">
            <label htmlFor="task-title">Title</label>

            <input
              id="task-title"
              name="title"
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-form-group full-width">
            <label htmlFor="task-description">Description</label>

            <textarea
              id="task-description"
              name="description"
              rows="4"
              placeholder="Describe what needs to be done"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="task-category">Category</label>

            <select
              id="task-category"
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
            <label htmlFor="task-priority">Priority</label>

            <select
              id="task-priority"
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
            <label htmlFor="task-status">Status</label>

            <select
              id="task-status"
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
            <label htmlFor="task-progress">Progress</label>

            <input
              id="task-progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="task-start-date">Start date</label>

            <input
              id="task-start-date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="task-due-date">Due date</label>

            <input
              id="task-due-date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="modal-error-message full-width">{error}</p>
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
              {isSubmitting ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateTaskModal;