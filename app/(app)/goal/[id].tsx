import { Colors } from '@/constants/Colors';
import { getDB } from '@/src/database/db';
import { Goal } from '@/src/features/goals/types/goal.types';
import { TaskItem } from '@/src/features/tasks/components/TaskItem';
import { Task } from '@/src/features/tasks/types/task.types';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function GoalDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [goal, setGoal] = useState<Goal | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // New Task Form
    const [taskName, setTaskName] = useState('');
    const [frequency, setFrequency] = useState('1');

    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            const db = await getDB();

            const goalResult: any = await db.getFirstAsync('SELECT * FROM goals WHERE id = ?', [id]);
            setGoal(goalResult);

            const tasksResult: any = await db.getAllAsync('SELECT * FROM tasks WHERE goalId = ?', [id]);
            setTasks(tasksResult);
        } catch (e) {
            console.error(e);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCreateTask = async () => {
        if (!taskName.trim() || !id) return;

        const freq = parseInt(frequency);
        if (isNaN(freq) || freq < 1) {
            Alert.alert("Invalid Frequency", "Please enter a valid number of days.");
            return;
        }

        try {
            const db = await getDB();
            const newTask: Task = {
                id: Crypto.randomUUID(),
                goalId: id,
                name: taskName,
                frequencyDays: freq,
                streak: 0,
                totalCompleted: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await db.runAsync(
                `INSERT INTO tasks (id, goalId, name, frequencyDays, streak, totalCompleted, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [newTask.id, newTask.goalId, newTask.name, newTask.frequencyDays, 0, 0, newTask.createdAt, newTask.updatedAt]
            );

            setModalVisible(false);
            setTaskName('');
            setFrequency('1');
            loadData();
        } catch (e) {
            console.error("Failed to create task", e);
        }
    };

    if (!goal) return null;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: goal.name }} />

            <View style={styles.goalHeader}>
                <Text style={styles.category}>{goal.category}</Text>
                <Text style={styles.date}>Since {new Date(goal.startDate).toLocaleDateString()}</Text>
            </View>

            <View style={styles.tasksContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tasks</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                        <Ionicons name="add" size={16} color="white" />
                        <Text style={styles.addButtonText}>Add Task</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={tasks}
                    renderItem={({ item }) => (
                        <TaskItem task={item} onPress={() => { }} />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No tasks added yet.</Text>
                    }
                />
            </View>

            {/* Add Task Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>New Task</Text>

                        <Text style={styles.label}>Task Name</Text>
                        <TextInput
                            style={styles.input}
                            value={taskName}
                            onChangeText={setTaskName}
                            placeholder="e.g. Read 10 pages"
                            placeholderTextColor={Colors.dark.icon}
                        />

                        <Text style={styles.label}>Frequency (Days)</Text>
                        <Text style={styles.helperText}>How often should this be done? (e.g. 1 = Daily, 3 = Every 3 days)</Text>
                        <TextInput
                            style={styles.input}
                            value={frequency}
                            onChangeText={setFrequency}
                            keyboardType="number-pad"
                            placeholder="1"
                            placeholderTextColor={Colors.dark.icon}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleCreateTask}>
                                <Text style={styles.saveButtonText}>Add Task</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    goalHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.borderColor,
    },
    category: {
        color: Colors.dark.tint,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    date: {
        color: Colors.dark.icon,
        fontSize: 14,
    },
    tasksContainer: {
        flex: 1,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: '600',
    },
    list: {
        gap: 8,
    },
    addButton: {
        backgroundColor: Colors.dark.success,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 4,
        fontWeight: '600',
        fontSize: 14,
    },
    emptyText: {
        color: Colors.dark.icon,
        textAlign: 'center',
        marginTop: 20,
    },
    // Modal Styles (Reused - could be a shared component)
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
    },
    modalView: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 20,
    },
    label: {
        color: Colors.dark.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    helperText: {
        color: Colors.dark.icon,
        fontSize: 12,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.dark.inputBackground,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        borderRadius: 6,
        padding: 10,
        color: Colors.dark.text,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    cancelButton: {
        backgroundColor: 'transparent',
    },
    saveButton: {
        backgroundColor: Colors.dark.success,
    },
    cancelButtonText: {
        color: Colors.dark.tint,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    }
});
