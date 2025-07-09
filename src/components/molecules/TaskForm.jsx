import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";

const TaskForm = ({ onSubmit, categories, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    dueDate: "",
    subtasks: []
  });

  const [errors, setErrors] = useState({});
  const [newSubtask, setNewSubtask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      dueDate: "",
      subtasks: []
    });
    setErrors({});
    setNewSubtask("");
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        Id: Date.now(), // Temporary ID, will be replaced by service
        title: newSubtask.trim(),
        completed: false
      };
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, subtask]
      }));
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(s => s.Id !== subtaskId)
    }));
  };

  const handleSubtaskKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubtask();
    }
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <ApperIcon name="Plus" className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-display font-bold text-gray-900">
          Create New Task
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter task title..."
            error={errors.title}
            required
          />
          
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter task description..."
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            required
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
          
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
            required
          />
</div>

        {/* Subtasks Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Subtasks (Optional)
          </label>
          
          <div className="flex gap-2">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={handleSubtaskKeyPress}
              placeholder="Add a subtask..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddSubtask}
              disabled={!newSubtask.trim()}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
          </div>

          {formData.subtasks.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.subtasks.map((subtask) => (
                <div key={subtask.Id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-sm text-gray-700">{subtask.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubtask(subtask.Id)}
                  >
                    <ApperIcon name="X" className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            loading={loading}
            className="group"
          >
            <ApperIcon 
              name="Plus" 
              className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200"
            />
            Create Task
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;