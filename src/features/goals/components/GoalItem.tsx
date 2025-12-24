import { Colors } from '@/constants/Colors';
import { Goal } from '@/src/features/goals/types/goal.types';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GoalItemProps {
    goal: Goal;
}

export const GoalItem = ({ goal }: GoalItemProps) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/goal/${goal.id}` as any)}
        >
            <View style={styles.header}>
                <Text style={styles.name}>{goal.name}</Text>
                <View style={[styles.badge, styles.activeBadge]}>
                    <Text style={styles.badgeText}>{goal.category}</Text>
                </View>
            </View>
            <Text style={styles.date}>Starts: {new Date(goal.startDate).toLocaleDateString()}</Text>
            {/* Minimal stats could go here */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.card,
        padding: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        color: Colors.dark.tint, // GitHub link color
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        color: Colors.dark.icon,
        fontSize: 12,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
    },
    activeBadge: {
        backgroundColor: 'rgba(56, 139, 253, 0.1)', // Subtle blue tint
        borderColor: 'rgba(56, 139, 253, 0.4)',
    },
    badgeText: {
        color: Colors.dark.text,
        fontSize: 12,
    }
});
