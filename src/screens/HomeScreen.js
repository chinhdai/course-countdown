import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, BookOpen } from 'lucide-react-native';
import { theme } from '../styles/theme';

export default function HomeScreen({ courses, onSelectCourse, onAddNew }) {
    const renderItem = ({ item }) => {
        const progressPercentage = (item.daysCounted / item.totalDays) * 100;
        return (
            <TouchableOpacity
                style={styles.courseCard}
                onPress={() => onSelectCourse(item)}
                activeOpacity={0.7}
            >
                <View style={styles.courseHeader}>
                    <Text style={styles.courseName}>{item.name}</Text>
                    <Text style={styles.courseCount}>{item.daysCounted}/{item.totalDays}</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Khóa Học Của Tôi</Text>
                </View>

                {(!courses || courses.length === 0) ? (
                    <View style={styles.emptyState}>
                        <View style={styles.iconContainer}>
                            <BookOpen size={64} color={theme.colors.border} />
                        </View>
                        <Text style={styles.emptyTitle}>Chưa có khóa học nào</Text>
                        <Text style={styles.emptySubtitle}>Bắt đầu theo dõi tiến độ bằng cách thêm khóa học mới.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={courses}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}

                <TouchableOpacity
                    style={styles.fab}
                    onPress={onAddNew}
                    activeOpacity={0.8}
                >
                    <Plus size={32} color="#FFF" />
                </TouchableOpacity>
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
        padding: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    listContainer: {
        paddingBottom: 100, // padding for FAB
    },
    courseCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.medium,
        marginBottom: theme.spacing.md,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    courseName: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.text,
        flex: 1,
    },
    courseCount: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.md,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.round,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.round,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.small,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.lg,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.button,
    }
});
