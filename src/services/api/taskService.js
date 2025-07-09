import tasksData from "../mockData/tasks.json";
import categoriesData from "../mockData/categories.json";

class TaskService {
  constructor() {
    this.tasks = this.loadTasks();
    this.categories = this.loadCategories();
  }

  loadTasks() {
    const stored = localStorage.getItem("taskflow-tasks");
    return stored ? JSON.parse(stored) : [...tasksData];
  }

  loadCategories() {
    const stored = localStorage.getItem("taskflow-categories");
    return stored ? JSON.parse(stored) : [...categoriesData];
  }

  saveTasks() {
    localStorage.setItem("taskflow-tasks", JSON.stringify(this.tasks));
  }

  saveCategories() {
    localStorage.setItem("taskflow-categories", JSON.stringify(this.categories));
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    return this.tasks.find(task => task.Id === parseInt(id));
  }

async create(taskData) {
    await this.delay();
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      subtasks: taskData.subtasks ? taskData.subtasks.map((subtask, index) => ({
        Id: Math.max(...this.tasks.flatMap(t => t.subtasks || []).map(s => s.Id), 0) + index + 1,
        title: subtask.title,
        completed: false
      })) : []
    };
    this.tasks.push(newTask);
    this.saveTasks();
    return { ...newTask };
  }
  async update(id, updateData) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    this.saveTasks();
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks.splice(index, 1);
    this.saveTasks();
    return true;
  }

  async toggleComplete(id) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    const task = this.tasks[index];
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    
    this.saveTasks();
    return { ...task };
  }

  async getCategories() {
    await this.delay();
    return [...this.categories];
  }

  async createCategory(categoryData) {
    await this.delay();
    const newCategory = {
      Id: Math.max(...this.categories.map(c => c.Id), 0) + 1,
      ...categoryData
    };
    this.categories.push(newCategory);
    this.saveCategories();
    return { ...newCategory };
  }

  async getCompletedTasks() {
    await this.delay();
    return this.tasks.filter(task => task.completed);
  }

  async getActiveTasks() {
    await this.delay();
    return this.tasks.filter(task => !task.completed);
  }

  async getTasksByCategory(category) {
    await this.delay();
    return this.tasks.filter(task => task.category === category);
  }

  async getTasksByPriority(priority) {
    await this.delay();
    return this.tasks.filter(task => task.priority === priority);
  }

  async getTodaysTasks() {
    await this.delay();
    const today = new Date().toISOString().split("T")[0];
    return this.tasks.filter(task => 
      task.dueDate === today && !task.completed
    );
  }

  async getOverdueTasks() {
    await this.delay();
    const today = new Date().toISOString().split("T")[0];
    return this.tasks.filter(task => 
      task.dueDate < today && !task.completed
    );
}

  async reorderTasks(reorderedTasks) {
    await this.delay();
    
    // Update the order property for each task
    reorderedTasks.forEach((task, index) => {
      const taskIndex = this.tasks.findIndex(t => t.Id === task.Id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].order = index;
      }
    });
    
    this.saveTasks();
    return true;
  }
async createSubtask(taskId, subtaskData) {
    await this.delay();
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(taskId));
    if (taskIndex === -1) throw new Error("Task not found");
    
    const task = this.tasks[taskIndex];
    if (!task.subtasks) task.subtasks = [];
    
    const newSubtask = {
      Id: Math.max(...this.tasks.flatMap(t => t.subtasks || []).map(s => s.Id), 0) + 1,
      title: subtaskData.title,
      completed: false
    };
    
    task.subtasks.push(newSubtask);
    this.saveTasks();
    return { ...task };
  }

  async updateSubtask(taskId, subtaskId, updateData) {
    await this.delay();
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(taskId));
    if (taskIndex === -1) throw new Error("Task not found");
    
    const task = this.tasks[taskIndex];
    if (!task.subtasks) throw new Error("Subtask not found");
    
    const subtaskIndex = task.subtasks.findIndex(s => s.Id === parseInt(subtaskId));
    if (subtaskIndex === -1) throw new Error("Subtask not found");
    
    task.subtasks[subtaskIndex] = { ...task.subtasks[subtaskIndex], ...updateData };
    this.saveTasks();
    return { ...task };
  }

  async deleteSubtask(taskId, subtaskId) {
    await this.delay();
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(taskId));
    if (taskIndex === -1) throw new Error("Task not found");
    
    const task = this.tasks[taskIndex];
    if (!task.subtasks) throw new Error("Subtask not found");
    
    const subtaskIndex = task.subtasks.findIndex(s => s.Id === parseInt(subtaskId));
    if (subtaskIndex === -1) throw new Error("Subtask not found");
    
    task.subtasks.splice(subtaskIndex, 1);
    this.saveTasks();
    return { ...task };
  }

  async toggleSubtaskComplete(taskId, subtaskId) {
    await this.delay();
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(taskId));
    if (taskIndex === -1) throw new Error("Task not found");
    
    const task = this.tasks[taskIndex];
    if (!task.subtasks) throw new Error("Subtask not found");
    
    const subtaskIndex = task.subtasks.findIndex(s => s.Id === parseInt(subtaskId));
    if (subtaskIndex === -1) throw new Error("Subtask not found");
    
    task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
    
    // Auto-complete parent task if all subtasks are complete
    if (task.subtasks.length > 0 && task.subtasks.every(s => s.completed)) {
      task.completed = true;
      task.completedAt = new Date().toISOString();
    }
    
    this.saveTasks();
    return { ...task };
  }
}
export default new TaskService();