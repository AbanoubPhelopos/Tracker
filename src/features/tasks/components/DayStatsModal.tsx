import { Colors } from '@/constants/Colors';
import { TaskHistory } from '@/src/features/tasks/types/task.types';
import React, { useMemo } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DayStatsModalProps {
    visible: boolean;
    onClose: () => void;
    date: Date;
    history: TaskHistory[];
}

export const DayStatsModal = ({ visible, onClose, date, history }: DayStatsModalProps) => {

    const stats = useMemo(() => {
        // Target Local Date (Start/End of day)
        // 'date' passed in is 00:00 Local Time of the selected day.

        const isSameDay = (d1: Date, d2: Date) => {
            return d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
        };

        // 1. Total time for this specific date
        const todaysLogs = history.filter(h => {
            const hDate = new Date(h.completedAt); // Converts UTC ISO to Local Date
            return isSameDay(hDate, date);
        });
        const totalSeconds = todaysLogs.reduce((acc, curr) => acc + curr.durationSeconds, 0);

        // 2. 7-Day Average
        // Average of the 7 days LEADING UP to this date (exclusive of the date itself? or inclusive?)
        // "Average of the last 7 days" usually implies the past window.

        let widowTotal = 0;

        // Loop 7 days backwards from yesterday
        for (let i = 1; i <= 7; i++) {
            const d = new Date(date);
            d.setDate(date.getDate() - i);

            const dailyLogs = history.filter(h => {
                const hDate = new Date(h.completedAt);
                return isSameDay(hDate, d);
            });

            const dailySum = dailyLogs.reduce((acc, curr) => acc + curr.durationSeconds, 0);
            widowTotal += dailySum;
        }

        const average = widowTotal / 7;

        return {
            totalSeconds,
            average,
            count: todaysLogs.length
        };
    }, [date, history]);

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins}m`;
        const hours = (mins / 60).toFixed(1);
        return `${hours}h`;
    };

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                    <Text style={styles.title}>{date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>

                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{formatTime(stats.totalSeconds)}</Text>
                            <Text style={styles.statLabel}>Total Time</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.count}</Text>
                            <Text style={styles.statLabel}>Sessions</Text>
                        </View>
                    </View>

                    <View style={styles.comparison}>
                        <Text style={styles.comparisonText}>
                            7-Day Avg: <Text style={{ fontWeight: 'bold', color: Colors.dark.tint }}>{formatTime(stats.average)}</Text>
                        </Text>
                        {stats.totalSeconds > stats.average ? (
                            <Text style={{ color: Colors.dark.success, marginTop: 4 }}>
                                ▲ Above average
                            </Text>
                        ) : (
                            <Text style={{ color: Colors.dark.icon, marginTop: 4 }}>
                                ▼ Below average
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 40,
    },
    modalView: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 20,
    },
    statRow: {
        flexDirection: 'row',
        gap: 32,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.dark.icon,
        marginTop: 4,
    },
    comparison: {
        alignItems: 'center',
        marginBottom: 24,
        padding: 12,
        backgroundColor: Colors.dark.inputBackground,
        borderRadius: 8,
        width: '100%',
    },
    comparisonText: {
        color: Colors.dark.text,
        fontSize: 14,
    },
    closeButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    closeButtonText: {
        color: Colors.dark.tint,
        fontSize: 16,
        fontWeight: '600',
    }
});
