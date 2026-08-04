import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Folder,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import api from "../api/axios";
import CreateCategoryModal from "../components/categories/CreateCategoryModal";
import EditCategoryModal from "../components/categories/EditCategoryModal";
import DeleteCategoryModal from "../components/categories/DeleteCategoryModal";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/dashboard.css";
import "../styles/categories.css";

function CategoriesPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] =
  useState(null);

  const [isDeletingCategory, setIsDeletingCategory] =
  useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesPageData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [categoriesResponse, tasksResponse] =
          await Promise.all([
            api.get("/categories/"),
            api.get("/tasks/"),
          ]);

        setCategories(categoriesResponse.data);
        setTasks(tasksResponse.data);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          navigate("/login", { replace: true });
          return;
        }

        setError("Could not load your categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesPageData();
  }, [navigate]);

  const categoriesWithTaskCount = useMemo(() => {
    return categories.map((category) => {
      const taskCount = tasks.filter(
        (task) => task.category === category.id
      ).length;

      return {
        ...category,
        taskCount,
      };
    });
  }, [categories, tasks]);

  const uncategorizedTaskCount = useMemo(() => {
    return tasks.filter((task) => !task.category).length;
  }, [tasks]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login", { replace: true });
  };

  const handleCategoryCreated = (category) => {
    setCategories((current) => [
      category,
      ...current,
    ]);
  };

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === updatedCategory.id
          ? updatedCategory
          : category
      )
    );
  };
const handleOpenDeleteModal = (category) => {
  setCategoryToDelete(category);
};

const handleCloseDeleteModal = () => {
  if (isDeletingCategory) {
    return;
  }

  setCategoryToDelete(null);
};

const handleDeleteCategory = async () => {
  if (!categoryToDelete) {
    return;
  }

  setIsDeletingCategory(true);
  setError("");

  try {
    await api.delete(
      `/categories/${categoryToDelete.id}/`
    );

    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) =>
          category.id !== categoryToDelete.id
      )
    );

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.category === categoryToDelete.id
          ? {
              ...task,
              category: null,
              category_name: null,
            }
          : task
      )
    );

    setCategoryToDelete(null);
  } catch (requestError) {
    if (requestError.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/login", { replace: true });
      return;
    }

    setError("Could not delete the category.");
  } finally {
    setIsDeletingCategory(false);
  }
};
  return (
    <div className="dashboard-page">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
      />

      <div className="dashboard-content">
        <Navbar
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="categories-main">
          <section className="categories-header">
            <div>
              <span className="categories-eyebrow">
                Workspace organization
              </span>

              <h1>Categories</h1>

              <p>
                Group related tasks and keep your workspace
                organized.
              </p>
            </div>

            <button
              className="create-category-button"
              type="button"
              onClick={() =>
                setIsCreateModalOpen(true)
              }
            >
              <Plus size={19} />
              Create category
            </button>
          </section>

          <section className="categories-summary">
            <article>
              <span>Total categories</span>
              <strong>{categories.length}</strong>
            </article>

            <article>
              <span>Categorized tasks</span>
              <strong>
                {tasks.length - uncategorizedTaskCount}
              </strong>
            </article>

            <article>
              <span>Uncategorized tasks</span>
              <strong>{uncategorizedTaskCount}</strong>
            </article>
          </section>

          {isLoading && (
            <p className="categories-message">
              Loading categories...
            </p>
          )}

          {error && (
            <p className="categories-message error">
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            categoriesWithTaskCount.length === 0 && (
              <section className="categories-empty-state">
                <Folder size={34} />

                <h2>No categories yet</h2>

                <p>
                  Create your first category to organize your
                  tasks.
                </p>
              </section>
            )}

          {!isLoading &&
            !error &&
            categoriesWithTaskCount.length > 0 && (
              <section className="categories-grid">
                {categoriesWithTaskCount.map((category) => (
                  <article
                    className="category-card"
                    key={category.id}
                  >
                    <div className="category-card-top">
                      <div
                        className="category-icon"
                        style={{
                          backgroundColor:
                            category.colour || "#FACC15",
                        }}
                      >
                        <Folder size={21} />
                      </div>

                      <div className="category-actions">
                        <button
                          className="category-edit-button"
                          type="button"
                          title="Edit category"
                          aria-label={`Edit ${category.name}`}
                          onClick={() =>
                            handleOpenEditModal(category)
                          }
                        >
                          <Pencil size={16} />
                        </button>

              <button
                className="category-delete-button"
                type="button"
                title="Delete category"
                aria-label={`Delete ${category.name}`}
                onClick={() =>
                    handleOpenDeleteModal(category)
                }
                >
                <Trash2 size={16} />
                </button>
                      </div>
                    </div>

                    <div className="category-card-content">
                      <h2>{category.name}</h2>

                      <p>
                        {category.taskCount} task
                        {category.taskCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="category-card-footer">
                      <span
                        className="category-colour-dot"
                        style={{
                          backgroundColor:
                            category.colour || "#FACC15",
                        }}
                      />

                      <span>
                        {category.colour || "#FACC15"}
                      </span>
                    </div>
                  </article>
                ))}
              </section>
            )}
        </main>
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        onCategoryCreated={handleCategoryCreated}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        category={selectedCategory}
        onClose={handleCloseEditModal}
        onCategoryUpdated={handleCategoryUpdated}
      />

      <DeleteCategoryModal
        isOpen={Boolean(categoryToDelete)}
        category={categoryToDelete}
        isDeleting={isDeletingCategory}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteCategory}
        />
    </div>
  );
}

export default CategoriesPage;