import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, ArrowLeft } from 'lucide-react-native';
import { theme } from '../styles/theme';

export default function SetupScreen({ onSetupComplete, onCancel, hasCourses }) {
    const [name, setName] = useState('');
    const [days, setDays] = useState('');
    const [balloonText, setBalloonText] = useState('Thùy Anh');
    const [error, setError] = useState('');

    const handleStart = () => {
        const total = parseInt(days, 10);
        if (!name.trim()) {
            setError('Vui lòng nhập tên khóa học');
            return;
        }
        if (!total || isNaN(total) || total <= 0) {
            setError('Vui lòng nhập số buổi hợp lệ (lớn hơn 0)');
            return;
        }
        if (!balloonText.trim()) {
            setError('Vui lòng nhập chữ hiện lên khi điểm danh');
            return;
        }
        setError('');

        const newCourse = {
            id: Date.now().toString(),
            name: name.trim(),
            totalDays: total,
            daysCounted: 0,
            balloonText: balloonText.trim()
        };
        onSetupComplete(newCourse);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {hasCourses && (
                            <TouchableOpacity style={styles.backButton} onPress={onCancel}>
                                <View pointerEvents="none">
                                    <ArrowLeft size={24} color={theme.colors.text} />
                                </View>
                            </TouchableOpacity>
                        )}
                        <View style={styles.inner}>
                            <View style={styles.iconContainer}>
                                <Target size={64} color={theme.colors.primary} />
                            </View>

                            <Text style={styles.title}>Thêm Khóa Học</Text>
                            <Text style={styles.subtitle}>Thiết lập thông tin cho khóa học mới của bạn.</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Tên khóa học</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ví dụ: Khóa học Tiếng Anh"
                                        placeholderTextColor={theme.colors.border}
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text);
                                            if (error) setError('');
                                        }}
                                        maxLength={50}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Tổng số buổi học</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ví dụ: 48"
                                        placeholderTextColor={theme.colors.border}
                                        keyboardType="number-pad"
                                        value={days}
                                        onChangeText={(text) => {
                                            setDays(text.replace(/[^0-9]/g, ''));
                                            if (error) setError('');
                                        }}
                                        maxLength={4}
                                    />
                                    <Text style={styles.inputSuffix}>buổi</Text>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Chữ nổi lên khi điểm danh</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ví dụ: Thùy Anh"
                                        placeholderTextColor={theme.colors.border}
                                        value={balloonText}
                                        onChangeText={(text) => {
                                            setBalloonText(text);
                                            if (error) setError('');
                                        }}
                                        maxLength={20}
                                    />
                                </View>
                            </View>

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    (name && days && balloonText) ? styles.buttonActive : styles.buttonDisabled
                                ]}
                                onPress={handleStart}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>Bắt đầu</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    backButton: {
        padding: theme.spacing.lg,
        alignSelf: 'flex-start',
    },
    inner: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.xxl,
        paddingTop: theme.spacing.lg,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: theme.radius.round,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xxl,
        lineHeight: 22,
    },
    inputGroup: {
        width: '100%',
        marginBottom: theme.spacing.md,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        width: '100%',
        ...theme.shadows.small,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: theme.colors.text,
    },
    inputSuffix: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.sm,
        fontWeight: '500',
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 14,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        alignSelf: 'flex-start',
        marginLeft: theme.spacing.md,
    },
    button: {
        width: '100%',
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    buttonActive: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.button,
    },
    buttonDisabled: {
        backgroundColor: theme.colors.border,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    }
});
