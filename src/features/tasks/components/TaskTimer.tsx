import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TaskTimerProps {
    onSave: (durationSeconds: number) => void;
}

export const TaskTimer = ({ onSave }: TaskTimerProps) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'timer' | 'manual'>('timer');
    const [manualMinutes, setManualMinutes] = useState('');
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const stopTimer = () => {
        setIsActive(false);
        if (seconds > 0) {
            onSave(seconds);
            setSeconds(0);
        }
    };

    const saveManual = () => {
        const mins = parseInt(manualMinutes);
        if (!isNaN(mins) && mins > 0) {
            onSave(mins * 60);
            setManualMinutes('');
        }
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setMode('timer')} style={[styles.tab, mode === 'timer' && styles.activeTab]}>
                    <Text style={[styles.tabText, mode === 'timer' && styles.activeTabText]}>Timer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('manual')} style={[styles.tab, mode === 'manual' && styles.activeTab]}>
                    <Text style={[styles.tabText, mode === 'manual' && styles.activeTabText]}>Manual Log</Text>
                </TouchableOpacity>
            </View>

            {mode === 'timer' ? (
                <View style={styles.timerContent}>
                    <Text style={styles.timeDisplay}>{formatTime(seconds)}</Text>
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={[styles.controlButton, isActive ? styles.pauseBtn : styles.startBtn]}
                            onPress={toggleTimer}
                        >
                            <Ionicons name={isActive ? "pause" : "play"} size={24} color="white" />
                        </TouchableOpacity>

                        {(seconds > 0 || isActive) && (
                            <TouchableOpacity style={[styles.controlButton, styles.stopBtn]} onPress={stopTimer}>
                                <Ionicons name="stop" size={24} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                <View style={styles.manualContent}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Minutes"
                            placeholderTextColor={Colors.dark.icon}
                            keyboardType="number-pad"
                            value={manualMinutes}
                            onChangeText={setManualMinutes}
                        />
                        <Text style={styles.inputUnit}>min</Text>
                    </View>
                    <TouchableOpacity style={styles.saveBtn} onPress={saveManual}>
                        <Text style={styles.saveBtnText}>Log Time</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: Colors.dark.inputBackground,
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: Colors.dark.card,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    tabText: {
        color: Colors.dark.icon,
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
        color: Colors.dark.text,
    },
    timerContent: {
        alignItems: 'center',
    },
    timeDisplay: {
        fontSize: 48,
        fontWeight: '200',
        color: Colors.dark.text,
        fontVariant: ['tabular-nums'],
        marginBottom: 16,
    },
    controls: {
        flexDirection: 'row',
        gap: 20,
    },
    controlButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startBtn: {
        backgroundColor: Colors.dark.success,
    },
    pauseBtn: {
        backgroundColor: Colors.dark.warning,
    },
    stopBtn: {
        backgroundColor: Colors.dark.danger,
    },
    manualContent: {
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        backgroundColor: Colors.dark.inputBackground,
        color: Colors.dark.text,
        fontSize: 24,
        padding: 12,
        borderRadius: 8,
        width: 120,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
    },
    inputUnit: {
        color: Colors.dark.icon,
        fontSize: 16,
        marginLeft: 8,
    },
    saveBtn: {
        backgroundColor: Colors.dark.tint,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 6,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
    }
});
