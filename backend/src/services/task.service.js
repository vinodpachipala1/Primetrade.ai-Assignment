import {
  createTask,
  getTasksByUser,
  getAllTasks,
  updateTask,
  deleteTask,
} from '../models/task.model.js';

export const createTaskService = async (data, user) => {
  const result = await createTask(data.title, data.description, user.id);
  return result.rows[0];
};

export const getTasksService = async (user) => {
  if (user.role === 'admin') {
    const result = await getAllTasks();
    return result.rows;
  } else {
    const result = await getTasksByUser(user.id);
    return result.rows;
  }
};

export const updateTaskService = async (id, data, user) => {
  const result = await updateTask(
    id,
    data.title,
    data.description,
    data.status,
    user.id,
    user.role
  );

  if (result.rows.length === 0) {
    throw new Error('Task not found or unauthorized');
  }

  return result.rows[0];
};

export const deleteTaskService = async (id, user) => {
  const result = await deleteTask(id, user.id, user.role);

  if (result.rowCount === 0) {
    throw new Error('Task not found or unauthorized');
  }
};