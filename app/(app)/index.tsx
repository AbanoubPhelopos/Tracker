import { Colors } from '@/constants/Colors';
import { getDB } from '@/src/database/db';
import { GoalItem } from '@/src/features/goals/components/GoalItem';
import { Goal, GoalCategory } from '@/src/features/goals/types/goal.types'; // Fixed Import
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Modal, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function GoalsScreen() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [goalName, setGoalName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<GoalCategory>(GoalCategory.PERSONAL);

    const loadGoals = useCallback(async () => {
        try {
            const db = await getDB();
            const result = await db.getAllAsync('SELECT * FROM goals ORDER BY createdAt DESC');
            setGoals(result as Goal[]);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadGoals();
        }, [loadGoals])
    );

    const handleCreateGoal = async () => {
        if (!goalName.trim()) return;

        try {
            const db = await getDB();
            const newGoal: Goal = {
                id: Crypto.randomUUID(),
                userId: 'local-user', // dynamic in real app
                name: goalName,
                category: selectedCategory,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(), // User input ideally
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                syncStatus: 'pending'
            };

            await db.runAsync(
                `INSERT INTO goals (id, userId, name, category, startDate, endDate, isActive, createdAt, updatedAt, syncStatus)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [newGoal.id, newGoal.userId, newGoal.name, newGoal.category, newGoal.startDate, newGoal.endDate, newGoal.isActive ? 1 : 0, newGoal.createdAt, newGoal.updatedAt, newGoal.syncStatus]
            );

            setModalVisible(false);
            setGoalName('');
            loadGoals();
        } catch (e) {
            console.error("Failed to create goal", e);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Your Goals',
                headerRight: () => (
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                        <Ionicons name="add" size={20} color="white" />
                        <Text style={styles.addButtonText}>New</Text>
                    </TouchableOpacity>
                )
            }} />

            <FlatList
                data={goals}
                renderItem={({ item }) => <GoalItem goal={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadGoals} tintColor={Colors.dark.tint} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No goals yet. Start by creating one!</Text>
                    </View>
                }
            />

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>New Monthly Goal</Text>

                        <Text style={styles.label}>Goal Name</Text>
                        <TextInput
                            style={styles.input}
                            value={goalName}
                            onChangeText={setGoalName}
                            placeholder="e.g. Learn Docker"
                            placeholderTextColor={Colors.dark.icon}
                        />

                        <Text style={styles.label}>Category</Text>
                        <View style={styles.categoryContainer}>
                            {Object.values(GoalCategory).map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryChip, selectedCategory === cat && styles.selectedCategoryChip]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text style={[styles.categoryText, selectedCategory === cat && styles.selectedCategoryText]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleCreateGoal}>
                                <Text style={styles.saveButtonText}>Create Goal</Text>
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
    list: {
        padding: 16,
    },
    addButton: { // GitHub Green Button style
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
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: Colors.dark.icon,
    },
    // Modal Styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)', // Overlay
        padding: 20,
    },
    modalView: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
    input: {
        backgroundColor: Colors.dark.inputBackground,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        borderRadius: 6,
        padding: 10,
        color: Colors.dark.text,
        marginBottom: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
    },
    selectedCategoryChip: {
        backgroundColor: Colors.dark.tint,
        borderColor: Colors.dark.tint,
    },
    categoryText: {
        color: Colors.dark.text,
        fontSize: 12,
    },
    selectedCategoryText: {
        color: '#fff',
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
