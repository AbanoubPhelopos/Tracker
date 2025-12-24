import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            router.replace('/' as any);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>GT</Text>
                    </View>
                    <Text style={styles.title}>Sign in to GoalTracker</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Username or email address</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={Colors.dark.icon}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>New to GoalTracker? </Text>
                    <TouchableOpacity onPress={() => router.push('/register' as any)}>
                        <Text style={styles.link}>Create an account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.dark.text,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
        fontSize: 20,
    },
    title: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: '300',
    },
    card: {
        backgroundColor: Colors.dark.card,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        padding: 20,
    },
    label: {
        color: Colors.dark.text,
        fontSize: 14,
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
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.dark.success,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    footer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.dark.borderColor,
        padding: 16,
        borderRadius: 6,
    },
    footerText: {
        color: Colors.dark.text,
    },
    link: {
        color: Colors.dark.tint,
    },
});
