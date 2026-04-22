import pool from '../config/db.js';

export const createUser = (name, username, email, password, role) => {
  return pool.query(
    `INSERT INTO users (name, username, email, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, username, email, role`,
    [name, username, email, password, role]
  );
};

export const findUserByEmail = (email) => {
  return pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
};

export const findUserById = (id) => {
  return pool.query(
    `SELECT id, name, username, email, role FROM users WHERE id = $1`,
    [id]
  );
};