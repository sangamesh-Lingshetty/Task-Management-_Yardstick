"use client";
import { useEffect, useState } from "react";
import { Check, Trash2, Edit3, Save, Plus } from "lucide-react";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    add: false,
    delete: null,
    update: false,
    fetch: false,
    toggle: null,
  });

  const toastConfig = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const simulateDelay = () =>
    new Promise((resolve) => setTimeout(resolve, 3000));

  useEffect(() => {
    fetchTasks();
    return () => {
      toast.dismiss();
    };
  }, []);

  async function fetchTasks() {
    setLoadingStates((prev) => ({ ...prev, fetch: true }));
    try {
      await simulateDelay();
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to fetch tasks", toastConfig);
    } finally {
      setLoadingStates((prev) => ({ ...prev, fetch: false }));
    }
  }

  async function addTask() {
    if (!title.trim() && !description.trim()) {
      toast.error("Title is required", toastConfig);
      return;
    }

    setLoadingStates((prev) => ({ ...prev, add: true }));
    try {
      await simulateDelay();
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description, dueDate }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to add task");

      toast.success("Task Added Successfully", toastConfig);
      setTitle("");
      setDescription("");
      setDueDate("");
      await fetchTasks();
    } catch (error) {
      toast.error("Failed to add task");
    } finally {
      setLoadingStates((prev) => ({ ...prev, add: false }));
    }
  }

  async function updateTask() {
    if (!editingTask) return;

    setLoadingStates((prev) => ({ ...prev, update: true }));
    try {
      await simulateDelay();
      const res = await fetch("/api/tasks", {
        method: "PUT",
        body: JSON.stringify({
          id: editingTask._id,
          title,
          description,
          dueDate,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to update task");

      toast.success("Task Updated Successfully", toastConfig);
      setEditingTask(null);
      setTitle("");
      setDescription("");
      setDueDate("");
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task", toastConfig);
    } finally {
      setLoadingStates((prev) => ({ ...prev, update: false }));
    }
  }

  async function toggleTask(id, completed) {
    setLoadingStates((prev) => ({ ...prev, toggle: id }));
    try {
      await simulateDelay();
      const res = await fetch("/api/tasks", {
        method: "PUT",
        body: JSON.stringify({ id, completed: !completed }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to toggle task");

      toast.success("Task status updated", toastConfig);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to toggle task:", error);
      toast.error("Failed to toggle task status", toastConfig);
    } finally {
      setLoadingStates((prev) => ({ ...prev, toggle: null }));
    }
  }

  async function deleteTask(id) {
    setLoadingStates((prev) => ({ ...prev, delete: id }));
    try {
      await simulateDelay();
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      toast.success("Task deleted successfully", toastConfig);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task", toastConfig);
    } finally {
      setLoadingStates((prev) => ({ ...prev, delete: null }));
    }
  }

  const startEditing = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(
      task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : ""
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-blue-500 border-solid rounded-full border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-3xl font-bold text-white text-center">
            Task Manager
          </h1>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            required
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            required
            placeholder="Task Description "
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={editingTask ? updateTask : addTask}
            disabled={loadingStates.add || loadingStates.update}
            className="w-full flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50"
          >
            {loadingStates.add || loadingStates.update ? (
              <LoadingSpinner />
            ) : editingTask ? (
              <>
                <Save className="mr-2" /> Update Task
              </>
            ) : (
              <>
                <Plus className="mr-2" /> Add Task
              </>
            )}
          </button>
        </div>

        <div className="p-6 pt-0 space-y-2 max-h-80 overflow-y-auto">
          {loadingStates.fetch ? (
            <div className="flex justify-center p-4">
              <LoadingSpinner />
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex-grow">
                  <div
                    className={`font-semibold ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div
                      className={`text-sm ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {task.description}
                    </div>
                  )}
                  {task.dueDate && (
                    <div
                      className={`text-sm ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      Due date: {format(new Date(task.dueDate), "yyyy-MM-dd")}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {!task.completed && (
                    <button
                      onClick={() => startEditing(task)}
                      disabled={loadingStates.toggle === task._id}
                      className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                    >
                      <Edit3 size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => toggleTask(task._id, task.completed)}
                    disabled={loadingStates.toggle === task._id}
                    className="text-green-500 hover:text-green-600 disabled:opacity-50"
                  >
                    {loadingStates.toggle === task._id ? (
                      <LoadingSpinner />
                    ) : (
                      <Check size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    disabled={loadingStates.delete === task._id}
                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    {loadingStates.delete === task._id ? (
                      <LoadingSpinner />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default TaskManagerPage;
