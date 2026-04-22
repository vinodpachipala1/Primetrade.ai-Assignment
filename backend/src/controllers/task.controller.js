import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from '../services/task.service.js';

export const createTask = async (req, res) => {
  try {
    const task = await createTaskService(req.body, req.user);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await getTasksService(req.user);

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    // Add req.user right here as the 3rd argument!
    const task = await updateTaskService(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await deleteTaskService(req.params.id, req.user);

    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};