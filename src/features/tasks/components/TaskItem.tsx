import { Colors } from '@/constants/Colors';
import { Task } from '@/src/features/tasks/types/task.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaskItemProps {
    task: Task;
    onPress: () => void;
}


export const TaskItem = ({ task, onPress }: TaskItemProps) => {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push(`/task/${task.id}` as any)}>
            <View style={styles.content}>
                <Text style={styles.name}>{task.name}</Text>
                <View style={styles.details}>
                    <Ionicons name="repeat" size={12} color={Colors.dark.icon} />
                    <Text style={styles.frequency}>Every {task.frequencyDays} day{task.frequencyDays > 1 ? 's' : ''}</Text>
                </View>
            </View>

            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{task.streak} 🔥</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.card,
        padding: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor, // GitHub border color
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    content: {
        flex: 1,
    },
    name: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    frequency: {
        color: Colors.dark.icon,
        fontSize: 12,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'flex-end',
    },
    statValue: {
        color: Colors.dark.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    statLabel: {
        color: Colors.dark.icon,
        fontSize: 10,
    }
});
