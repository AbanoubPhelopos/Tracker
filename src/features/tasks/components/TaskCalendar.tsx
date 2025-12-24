import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaskCalendarProps {
    completedDates: string[];
    onDayPress: (date: Date) => void;
}

export const TaskCalendar = memo(({ completedDates, onDayPress }: TaskCalendarProps) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    const days = [];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Padding for empty slots before 1st of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const isCompleted = (day: number) => {
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return completedDates.includes(dateStr);
    };

    const isToday = (day: number) => {
        return day === today.getDate();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.monthTitle}>{monthNames[currentMonth]} {currentYear}</Text>
            </View>

            <View style={styles.grid}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <Text key={i} style={styles.dayLabel}>{d}</Text>
                ))}

                {days.map((day, index) => {
                    if (day === null) {
                        return <View key={`empty-${index}`} style={styles.dayCell} />;
                    }

                    const completed = isCompleted(day);
                    const todayCell = isToday(day);

                    return (
                        <TouchableOpacity
                            key={day}
                            style={styles.dayCell}
                            onPress={() => {
                                const d = new Date(currentYear, currentMonth, day);
                                onDayPress(d);
                            }}
                        >
                            <View style={[
                                styles.dayCircle,
                                completed && styles.completedCircle,
                                todayCell && !completed && styles.todayCircle
                            ]}>
                                {completed ? (
                                    <Ionicons name="checkmark" size={14} color={Colors.dark.tint} />
                                ) : (
                                    <Text style={[
                                        styles.dayText,
                                        todayCell && styles.todayText
                                    ]}>{day}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    monthTitle: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayLabel: {
        width: '14.28%',
        textAlign: 'center',
        color: Colors.dark.icon,
        fontSize: 12,
        marginBottom: 8,
    },
    dayCell: {
        width: '14.28%', // 7 cols
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedCircle: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.dark.tint, // LeetCode style: blue outline with check
    },
    todayCircle: {
        backgroundColor: 'rgba(35, 134, 54, 0.2)', // Green tint
        borderWidth: 1,
        borderColor: Colors.dark.success,
    },
    dayText: {
        color: Colors.dark.icon,
        fontSize: 12,
    },
    todayText: {
        color: Colors.dark.success,
        fontWeight: 'bold',
    }
});
