import pool from '../config/db.js';

export const createTask = (title, description, userId) => {
  return pool.query(
    `INSERT INTO tasks (title, description, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, description, userId]
  );
};

export const getTasksByUser = (userId) => {
  return pool.query(
    `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
};

export const getAllTasks = () => {
  return pool.query(`SELECT * FROM tasks ORDER BY created_at DESC`);
};

export const updateTask = (id, title, description, status, userId, role) => {
  if (role === 'admin') {
    return pool.query(
      `UPDATE tasks SET title=$1, description=$2, status=$3
       WHERE id=$4 RETURNING *`,
      [title, description, status, id]
    );
  }

  return pool.query(
    `UPDATE tasks SET title=$1, description=$2, status=$3
     WHERE id=$4 AND user_id=$5 RETURNING *`,
    [title, description, status, id, userId]
  );
};

export const deleteTask = (id, userId, role) => {
  if (role === 'admin') {
    return pool.query(
      `DELETE FROM tasks WHERE id = $1`,
      [id]
    );
  }

  return pool.query(
    `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
};