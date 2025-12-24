export enum GoalCategory {
    HEALTH = 'Health',
    CAREER = 'Career',
    PERSONAL = 'Personal',
    FINANCE = 'Finance',
    RELATIONSHIPS = 'Relationships',
    SPIRITUAL = 'Spiritual',
    LEARNING = 'Learning',
    OTHER = 'Other'
}

export interface Goal {
    id: string;
    userId: string;
    name: string;
    category: GoalCategory;
    startDate: string; // ISO String
    endDate: string;   // ISO String
    isActive: boolean;
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
    syncStatus: 'synced' | 'pending' | 'conflict';
    tasks?: any[]; // Will use Task type when available
}
