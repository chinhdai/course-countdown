import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export default class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('App crash:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Đã xảy ra lỗi</Text>
                <Text style={styles.subtitle}>
                    Ứng dụng gặp sự cố ngoài ý muốn. Bạn có thể thử lại.
                </Text>
                <Text style={styles.errorText} numberOfLines={3}>
                    {this.state.error?.message || 'Lỗi không xác định'}
                </Text>
                <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                    <Text style={styles.buttonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.danger,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
        lineHeight: 22,
    },
    errorText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xxl,
        borderRadius: theme.radius.lg,
        ...theme.shadows.button,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
