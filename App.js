import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SetupScreen from './src/screens/SetupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import HomeScreen from './src/screens/HomeScreen';
import { theme } from './src/styles/theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem('@courses');
      if (storedCourses !== null) {
        const parsed = JSON.parse(storedCourses);
        // Migrate: ensure attendanceLogs exists on all courses
        const migrated = parsed.map(c => ({
          ...c,
          attendanceLogs: c.attendanceLogs || [],
        }));
        setCourses(migrated);
      } else {
        await checkLegacyData();
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLegacyData = async () => {
    try {
      const storedTotal = await AsyncStorage.getItem('@total_days');
      const storedCount = await AsyncStorage.getItem('@days_counted');
      if (storedTotal !== null && storedCount !== null) {
        const legacyCourse = {
          id: 'legacy-course',
          name: 'Khóa học cũ',
          totalDays: parseInt(storedTotal, 10),
          daysCounted: parseInt(storedCount, 10),
          balloonText: 'Thùy Anh',
          attendanceLogs: [],
        };
        const updated = [legacyCourse];
        setCourses(updated);
        await AsyncStorage.setItem('@courses', JSON.stringify(updated));
        await AsyncStorage.removeItem('@total_days');
        await AsyncStorage.removeItem('@days_counted');
      }
    } catch (e) {
      console.error('Failed to migrate legacy data', e);
    }
  };

  // Debounce saves to avoid excessive AsyncStorage writes on rapid taps
  const scheduleSave = useCallback((updatedCourses) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      AsyncStorage.setItem('@courses', JSON.stringify(updatedCourses))
        .catch(e => console.error('Failed to save courses', e));
    }, 300);
  }, []);

  const handleSetupComplete = useCallback((newCourse) => {
    const courseWithLogs = { ...newCourse, attendanceLogs: [] };
    setCourses(prev => {
      const updated = [...prev, courseWithLogs];
      AsyncStorage.setItem('@courses', JSON.stringify(updated))
        .catch(e => console.error('Failed to save new course', e));
      return updated;
    });
    setCurrentScreen('home');
  }, []);

  const handleIncrement = useCallback(() => {
    const log = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setCourses(prev => {
      const updated = prev.map(c => {
        if (c.id === selectedCourseId && c.daysCounted < c.totalDays) {
          return {
            ...c,
            daysCounted: c.daysCounted + 1,
            attendanceLogs: [...(c.attendanceLogs || []), log],
          };
        }
        return c;
      });
      scheduleSave(updated);
      return updated;
    });
  }, [selectedCourseId, scheduleSave]);

  const handleDecrement = useCallback(() => {
    setCourses(prev => {
      const updated = prev.map(c => {
        if (c.id === selectedCourseId && c.daysCounted > 0) {
          const logs = c.attendanceLogs || [];
          return {
            ...c,
            daysCounted: c.daysCounted - 1,
            attendanceLogs: logs.slice(0, -1),
          };
        }
        return c;
      });
      scheduleSave(updated);
      return updated;
    });
  }, [selectedCourseId, scheduleSave]);

  const handleDeleteCourse = useCallback(() => {
    setCourses(prev => {
      const updated = prev.filter(c => c.id !== selectedCourseId);
      AsyncStorage.setItem('@courses', JSON.stringify(updated))
        .catch(e => console.error('Failed to delete course', e));
      return updated;
    });
    setCurrentScreen('home');
  }, [selectedCourseId]);

  const handleSelectCourse = useCallback((course) => {
    setSelectedCourseId(course.id);
    setCurrentScreen('dashboard');
  }, []);

  const handleBack = useCallback(() => setCurrentScreen('home'), []);
  const handleAddNew = useCallback(() => setCurrentScreen('setup'), []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

        {currentScreen === 'home' && (
          <HomeScreen
            courses={courses}
            onSelectCourse={handleSelectCourse}
            onAddNew={handleAddNew}
          />
        )}

        {currentScreen === 'setup' && (
          <SetupScreen
            onSetupComplete={handleSetupComplete}
            onCancel={handleBack}
            hasCourses={courses.length > 0}
          />
        )}

        {currentScreen === 'dashboard' && selectedCourse && (
          <DashboardScreen
            course={selectedCourse}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onDelete={handleDeleteCourse}
            onBack={handleBack}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
