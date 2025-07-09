import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, onToggleSubtaskComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.Id);
    } finally {
      setIsCompleting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return "AlertTriangle";
      case "medium": return "Clock";
      case "low": return "CheckCircle2";
      default: return "Circle";
    }
};

  const handleToggleSubtask = async (subtaskId) => {
    try {
      await onToggleSubtaskComplete(task.Id, subtaskId);
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  };

  // Calculate progress based on subtasks
  const calculateProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.completed ? 100 : 0;
    }
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isToday = format(new Date(task.dueDate), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const progress = calculateProgress();
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`task-card group ${task.completed ? "completed" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>

<div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <h3 className={`font-semibold text-lg task-title ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </h3>
              {hasSubtasks && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon 
                    name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                    className="w-4 h-4" 
                  />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasSubtasks && (
                <div className="flex items-center gap-2">
                  <ProgressRing progress={progress} size={32} strokeWidth={3} />
                  <span className="text-xs text-gray-500">
                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                  </span>
                </div>
              )}
              <Badge variant="primary" size="sm">
                {task.category}
              </Badge>
              <div className={`w-3 h-3 rounded-full priority-${task.priority} shadow-sm`}></div>
            </div>
          </div>

          {task.description && (
            <p className={`text-sm mb-3 ${task.completed ? "text-gray-500" : "text-gray-600"}`}>
              {task.description}
            </p>
          )}

          {/* Subtasks Section */}
          {hasSubtasks && isExpanded && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ApperIcon name="List" className="w-4 h-4" />
                Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
              </h4>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.Id} className="flex items-center gap-2 subtask-item">
                    <Checkbox
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.Id)}
                      className="subtask-checkbox"
                    />
                    <span className={`text-sm ${subtask.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name={getPriorityIcon(task.priority)} className="w-4 h-4" />
                <span className="capitalize">{task.priority}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span className={`${isOverdue ? "text-red-600 font-medium" : isToday ? "text-amber-600 font-medium" : ""}`}>
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                  {isOverdue && " (Overdue)"}
                  {isToday && " (Today)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
              >
                <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {task.completed && task.completedAt && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="CheckCircle2" className="w-4 h-4 text-green-500" />
            <span>Completed on {format(new Date(task.completedAt), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;