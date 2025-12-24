import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('tracker.db');
  }
  return db;
};

export const initDatabase = async () => {
  const database = await getDB();
  await database.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      syncStatus TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      goalId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'time', -- 'time' or 'event'
      frequencyDays INTEGER NOT NULL,
      streak INTEGER DEFAULT 0,
      totalCompleted INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (goalId) REFERENCES goals (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_history (
      id TEXT PRIMARY KEY NOT NULL,
      taskId TEXT NOT NULL,
      completedAt TEXT NOT NULL,
      durationSeconds INTEGER,
      FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE
    );
  `);
  console.log('Database initialized');
};
