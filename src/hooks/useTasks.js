import { useState, useEffect } from "react";
import taskService from "@/services/api/taskService";
import { toast } from "react-toastify";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        taskService.getCategories()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully!");
      return newTask;
    } catch (err) {
      toast.error("Failed to create task");
      throw err;
    }
  };

  const updateTask = async (id, updateData) => {
    try {
      const updatedTask = await taskService.update(id, updateData);
      setTasks(prev => 
        prev.map(task => task.Id === parseInt(id) ? updatedTask : task)
      );
      toast.success("Task updated successfully!");
      return updatedTask;
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== parseInt(id)));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
      throw err;
    }
  };

  const toggleTaskComplete = async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id);
      setTasks(prev => 
        prev.map(task => task.Id === parseInt(id) ? updatedTask : task)
      );
      
      if (updatedTask.completed) {
        toast.success("Task completed! Great job! 🎉");
      } else {
        toast.info("Task marked as incomplete");
      }
      
      return updatedTask;
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
};

  const reorderTasks = async (reorderedTasks, section) => {
    try {
      await taskService.reorderTasks(reorderedTasks);
      setTasks(prev => {
        const otherTasks = section === 'active' 
          ? prev.filter(task => task.completed)
          : prev.filter(task => !task.completed);
        return [...reorderedTasks, ...otherTasks];
      });
      toast.success("Tasks reordered successfully!");
    } catch (err) {
      toast.error("Failed to reorder tasks");
      throw err;
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCategory = await taskService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success("Category created successfully!");
      return newCategory;
    } catch (err) {
      toast.error("Failed to create category");
      throw err;
    }
  };

const createSubtask = async (taskId, subtaskData) => {
    try {
      const updatedTask = await taskService.createSubtask(taskId, subtaskData);
      setTasks(prev => 
        prev.map(task => task.Id === parseInt(taskId) ? updatedTask : task)
      );
      toast.success("Subtask created successfully!");
      return updatedTask;
    } catch (err) {
      toast.error("Failed to create subtask");
      throw err;
    }
  };

  const updateSubtask = async (taskId, subtaskId, updateData) => {
    try {
      const updatedTask = await taskService.updateSubtask(taskId, subtaskId, updateData);
      setTasks(prev => 
        prev.map(task => task.Id === parseInt(taskId) ? updatedTask : task)
      );
      toast.success("Subtask updated successfully!");
      return updatedTask;
    } catch (err) {
      toast.error("Failed to update subtask");
      throw err;
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      const updatedTask = await taskService.deleteSubtask(taskId, subtaskId);
      setTasks(prev => 
        prev.map(task => task.Id === parseInt(taskId) ? updatedTask : task)
      );
      toast.success("Subtask deleted successfully!");
      return updatedTask;
    } catch (err) {
      toast.error("Failed to delete subtask");
      throw err;
    }
  };

  const toggleSubtaskComplete = async (taskId, subtaskId) => {
    try {
      const updatedTask = await taskService.toggleSubtaskComplete(taskId, subtaskId);
      setTasks(prev => 
        prev.map(task => task.Id === parseInt(taskId) ? updatedTask : task)
      );
      
      const subtask = updatedTask.subtasks.find(s => s.Id === parseInt(subtaskId));
      if (subtask?.completed) {
        toast.success("Subtask completed! 🎉");
      } else {
        toast.info("Subtask marked as incomplete");
      }
      
      return updatedTask;
    } catch (err) {
      toast.error("Failed to update subtask");
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    categories,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    reorderTasks,
    createCategory,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtaskComplete,
    refetch: loadTasks
  };
};