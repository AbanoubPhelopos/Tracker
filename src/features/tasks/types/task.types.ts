export interface Task {
    id: string;
    goalId: string;
    name: string;
    frequencyDays: number; // e.g., 1 for daily, 3 for every 3 days
    streak: number;
    totalCompleted: number;
    createdAt: string;
    updatedAt: string;
}

export interface TaskHistory {
    id: string;
    taskId: string;
    completedAt: string;
    durationSeconds: number;
}