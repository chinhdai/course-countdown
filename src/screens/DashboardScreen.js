import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hand, ArrowLeft, Trash2, RotateCcw, CalendarDays } from 'lucide-react-native';
import { theme } from '../styles/theme';

const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
};

const FloatingText = memo(({ id, startX, text, onComplete }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -250,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            })
        ]).start(() => onComplete(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.balloonContainer,
                {
                    opacity,
                    transform: [{ translateX: startX }, { translateY }]
                }
            ]}
        >
            <Text style={styles.balloonText}>{text}</Text>
        </Animated.View>
    );
});

export default function DashboardScreen({ course, onIncrement, onDecrement, onDelete, onBack }) {
    const [balloons, setBalloons] = useState([]);

    const daysLeft = course.totalDays - course.daysCounted;
    const progressPercentage = Math.min((course.daysCounted / course.totalDays) * 100, 100);
    const isCompleted = course.daysCounted >= course.totalDays;
    const attendanceLogs = course.attendanceLogs || [];
    const reversedLogs = useMemo(() => [...attendanceLogs].reverse(), [attendanceLogs]);

    const handleTap = useCallback(() => {
        onIncrement();
        const newBalloon = {
            id: Date.now().toString() + Math.random().toString(),
            startX: Math.random() * 100 - 50,
        };
        setBalloons(prev => [...prev, newBalloon]);
    }, [onIncrement]);

    const removeBalloon = useCallback((id) => {
        setBalloons(prev => prev.filter(b => b.id !== id));
    }, []);

    const handleUndo = useCallback(() => {
        Alert.alert(
            'Hoàn tác điểm danh?',
            'Xoá buổi học gần nhất khỏi lịch sử?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Hoàn tác', style: 'destructive', onPress: onDecrement },
            ]
        );
    }, [onDecrement]);

    const handleDeleteConfirm = useCallback(() => {
        Alert.alert(
            'Xóa khóa học?',
            'Bạn có chắc chắn muốn xóa khóa học này không? Hành động này không thể hoàn tác.',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: onDelete },
            ]
        );
    }, [onDelete]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header - stays fixed at top */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.iconButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View pointerEvents="none">
                            <ArrowLeft size={24} color={theme.colors.text} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{course.name}</Text>
                    <TouchableOpacity
                        onPress={handleDeleteConfirm}
                        style={[styles.iconButton, { backgroundColor: theme.colors.danger + '1A' }]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View pointerEvents="none">
                            <Trash2 size={20} color={theme.colors.danger} />
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Progress Card */}
                    <View style={styles.card}>
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Đã học</Text>
                                <Text style={styles.statValuePrimary}>{course.daysCounted}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Còn lại</Text>
                                <Text style={styles.statValueSecondary}>{daysLeft}</Text>
                            </View>
                        </View>
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                            </View>
                            <View style={styles.progressTextRow}>
                                <Text style={styles.progressText}>{Math.round(progressPercentage)}% Hoàn thành</Text>
                                <Text style={styles.progressText}>Tổng: {course.totalDays}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Area */}
                    {isCompleted ? (
                        <View style={styles.completedContainer}>
                            <Text style={styles.completedTitle}>Chúc mừng! 🎉</Text>
                            <Text style={styles.completedSubtitle}>Bạn đã hoàn thành toàn bộ khóa học.</Text>
                        </View>
                    ) : (
                        <View style={styles.tapWrapper}>
                            <TouchableOpacity
                                style={styles.tapButtonContainer}
                                activeOpacity={0.7}
                                onPress={handleTap}
                            >
                                <View style={styles.tapButtonOuter} pointerEvents="none">
                                    <View style={styles.tapButtonInner}>
                                        <Hand size={48} color="#FFF" />
                                        <Text style={styles.tapButtonText}>Điểm Danh</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {balloons.map(b => (
                                <FloatingText
                                    key={b.id}
                                    id={b.id}
                                    startX={b.startX}
                                    text={course.balloonText}
                                    onComplete={removeBalloon}
                                />
                            ))}

                            {attendanceLogs.length > 0 && (
                                <TouchableOpacity
                                    style={styles.undoButton}
                                    onPress={handleUndo}
                                    activeOpacity={0.7}
                                >
                                    <RotateCcw size={14} color={theme.colors.textSecondary} />
                                    <Text style={styles.undoText}>Hoàn tác</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Attendance History */}
                    {attendanceLogs.length > 0 && (
                        <View style={styles.historyCard}>
                            <View style={styles.historyHeader}>
                                <CalendarDays size={18} color={theme.colors.primary} />
                                <Text style={styles.historyTitle}>Lịch sử điểm danh</Text>
                                <View style={styles.historyBadgeCount}>
                                    <Text style={styles.historyBadgeCountText}>{attendanceLogs.length}</Text>
                                </View>
                            </View>

                            {reversedLogs.map((log, index) => (
                                <View
                                    key={log.id}
                                    style={[
                                        styles.historyItem,
                                        index < reversedLogs.length - 1 && styles.historyItemBorder,
                                    ]}
                                >
                                    <View style={styles.historySessionBadge}>
                                        <Text style={styles.historySessionText}>
                                            {reversedLogs.length - index}
                                        </Text>
                                    </View>
                                    <Text style={styles.historyDate}>{formatDateTime(log.timestamp)}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>
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
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: theme.spacing.sm,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.small,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xxl,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.medium,
        marginBottom: theme.spacing.xl,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border,
        opacity: 0.5,
    },
    statLabel: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        fontWeight: '500',
    },
    statValuePrimary: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    statValueSecondary: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    progressContainer: {
        width: '100%',
    },
    progressBarBackground: {
        height: 12,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.round,
        overflow: 'hidden',
        marginBottom: theme.spacing.xs,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.round,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    tapWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingVertical: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    tapButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tapButtonOuter: {
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tapButtonInner: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.button,
    },
    tapButtonText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: theme.spacing.sm,
    },
    balloonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 80,
        zIndex: 100,
        elevation: 10,
    },
    balloonText: {
        color: '#FF4081',
        fontSize: 32,
        fontWeight: 'bold',
        textShadowColor: 'rgba(255, 255, 255, 0.9)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    undoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.round,
        ...theme.shadows.small,
    },
    undoText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    completedContainer: {
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        ...theme.shadows.small,
        marginBottom: theme.spacing.xl,
    },
    completedTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.success,
        marginBottom: theme.spacing.sm,
    },
    completedSubtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    historyCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.medium,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        flex: 1,
    },
    historyBadgeCount: {
        backgroundColor: theme.colors.primaryLight,
        borderRadius: theme.radius.round,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
    },
    historyBadgeCountText: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        gap: theme.spacing.md,
    },
    historyItemBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.border,
    },
    historySessionBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historySessionText: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    historyDate: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '400',
    },
});
