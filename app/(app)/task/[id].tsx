import { Colors } from '@/constants/Colors';
import { getDB } from '@/src/database/db';
import { DayStatsModal } from '@/src/features/tasks/components/DayStatsModal';
import { TaskCalendar } from '@/src/features/tasks/components/TaskCalendar';
import { TaskTimer } from '@/src/features/tasks/components/TaskTimer';
import { Task, TaskHistory } from '@/src/features/tasks/types/task.types';
import * as Crypto from 'expo-crypto';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function TaskDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [history, setHistory] = useState<TaskHistory[]>([]);

    // Calendar & Stats
    const [completedDates, setCompletedDates] = useState<string[]>([]);
    const [statsModalVisible, setStatsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Loading
    const [loading, setLoading] = useState(true);

    // Animation
    const confettiRef = useRef<ConfettiCannon>(null);

    const loadTaskData = useCallback(async () => {
        if (!id) return;
        try {
            const db = await getDB();

            // Check for type column existence (hacky fix for dev env if migration not run)
            // In a real app we'd have a migration. Here we assume the field exists or is ignored?
            // SQLite is permissive.

            const taskRes: any = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', [id]);
            setTask(taskRes);

            const historyRes: any = await db.getAllAsync('SELECT * FROM task_history WHERE taskId = ? ORDER BY completedAt DESC', [id]);
            setHistory(historyRes);

            const dates = historyRes.map((h: TaskHistory) => {
                const date = new Date(h.completedAt);
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            });
            setCompletedDates([...new Set(dates)] as string[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadTaskData();
    }, [loadTaskData]);

    const handleSaveTime = async (durationSeconds: number) => {
        if (!task) return;
        try {
            const db = await getDB();
            const newHistoryId = Crypto.randomUUID();
            const completedAt = new Date().toISOString();
            const todayStr = completedAt.split('T')[0];

            // Insert History
            await db.runAsync(
                `INSERT INTO task_history (id, taskId, completedAt, durationSeconds) VALUES (?, ?, ?, ?)`,
                [newHistoryId, task.id, completedAt, durationSeconds]
            );

            // STREAK LOGIC
            const alreadyDoneToday = completedDates.includes(todayStr);
            let newStreak = task.streak;
            let totalCompleted = task.totalCompleted + 1;

            if (!alreadyDoneToday) {
                // If not done today, we optimistically increment.
                // NOTE: Real streak logic should strictly check sequential days.
                // For this quick update, if it wasn't done today, we assume the user is keeping the streak alive.
                // A better check would be: was it done yesterday?
                newStreak += 1; // Simplistic increment for now as requested "done today = streak"

                // Explode logic!
                confettiRef.current?.start();
            }

            await db.runAsync(
                `UPDATE tasks SET totalCompleted = ?, streak = ? WHERE id = ?`,
                [totalCompleted, newStreak, task.id]
            );

            loadTaskData();
        } catch (e) {
            console.error("Failed to save progress", e);
        }
    };

    const handleMarkDone = () => {
        // Log an event as 0 duration
        handleSaveTime(0);
    };

    if (loading || !task) return <View style={styles.container} />;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Stack.Screen options={{ title: 'Task Details' }} />

                <View style={styles.titleSection}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={styles.statsText}>
                        Details: {task.type === 'event' ? 'Event' : 'Duration'} • Every {task.frequencyDays} day{task.frequencyDays > 1 ? 's' : ''}
                    </Text>
                </View>

                {/* 1. Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{task.streak} 🔥</Text>
                        <Text style={styles.statLabel}>Current Streak</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{task.totalCompleted}</Text>
                        <Text style={styles.statLabel}>Total Completions</Text>
                    </View>
                </View>

                {/* 2. Calendar (Reordered to top) */}
                <Text style={styles.sectionHeader}>Activity History</Text>
                <TaskCalendar
                    completedDates={completedDates}
                    onDayPress={(date) => {
                        setSelectedDate(date);
                        setStatsModalVisible(true);
                    }}
                />

                {/* 3. Logger / Done Button */}
                <Text style={styles.sectionHeader}>Log Progress</Text>
                {task.type === 'event' ? (
                    <TouchableOpacity style={styles.markDoneButton} onPress={handleMarkDone}>
                        <Text style={styles.markDoneText}>Mark as Done</Text>
                    </TouchableOpacity>
                ) : (
                    <TaskTimer onSave={handleSaveTime} />
                )}

            </ScrollView>

            <DayStatsModal
                visible={statsModalVisible}
                onClose={() => setStatsModalVisible(false)}
                date={selectedDate}
                history={history}
            />

            <ConfettiCannon
                count={200}
                origin={{ x: -10, y: 0 }}
                autoStart={false}
                ref={confettiRef}
                fadeOut={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: 16,
    },
    titleSection: {
        marginBottom: 24,
    },
    taskName: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statsText: {
        color: Colors.dark.icon,
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        alignItems: 'center',
    },
    statValue: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        color: Colors.dark.icon,
        fontSize: 12,
        marginTop: 4,
    },
    sectionHeader: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 24,
    },
    markDoneButton: {
        backgroundColor: Colors.dark.success,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    markDoneText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
