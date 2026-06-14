import * as SQLite from 'expo-sqlite';
import { Tarea } from './Tarea';

const DATABASE_NAME = 'tasks.db';

export const getDbConnection = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};

export const initDatabase = async () => {
  const db = await getDbConnection();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      fechaRecordatorio TEXT,
      completada INTEGER DEFAULT 0
    );
  `);
};

export const insertTarea = async (tarea: Tarea) => {
  const db = await getDbConnection();
  const result = await db.runAsync(
    'INSERT INTO tareas (titulo, descripcion, fechaRecordatorio, completada) VALUES (?, ?, ?, ?)',
    [tarea.titulo, tarea.descripcion, tarea.fechaRecordatorio, tarea.completada ? 1 : 0]
  );
  return result.lastInsertRowId;
};

export const getTareas = async (): Promise<Tarea[]> => {
  const db = await getDbConnection();
  const allRows = await db.getAllAsync<{
    id: number;
    titulo: string;
    descripcion: string;
    fechaRecordatorio: string;
    completada: number;
  }>('SELECT * FROM tareas ORDER BY id DESC');

  return allRows.map((row) => ({
    ...row,
    completada: row.completada === 1,
  }));
};

export const updateTarea = async (tarea: Tarea) => {
  const db = await getDbConnection();
  await db.runAsync(
    'UPDATE tareas SET titulo = ?, descripcion = ?, fechaRecordatorio = ?, completada = ? WHERE id = ?',
    [tarea.titulo, tarea.descripcion, tarea.fechaRecordatorio, tarea.completada ? 1 : 0, tarea.id!]
  );
};

export const deleteTarea = async (id: number) => {
  const db = await getDbConnection();
  await db.runAsync('DELETE FROM tareas WHERE id = ?', [id]);
};