import React, { useState, useEffect } from 'react';
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
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'setup', 'dashboard'
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem('@courses');
      if (storedCourses !== null) {
        setCourses(JSON.parse(storedCourses));
      } else {
        checkLegacyData();
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLegacyData = async () => {
    // Migrate old data if it exists
    const storedTotal = await AsyncStorage.getItem('@total_days');
    const storedCount = await AsyncStorage.getItem('@days_counted');

    if (storedTotal !== null && storedCount !== null) {
      const legacyCourse = {
        id: 'legacy-course',
        name: 'Khóa học cũ',
        totalDays: parseInt(storedTotal, 10),
        daysCounted: parseInt(storedCount, 10),
        balloonText: 'Thùy Anh'
      };
      setCourses([legacyCourse]);
      await AsyncStorage.setItem('@courses', JSON.stringify([legacyCourse]));
      await AsyncStorage.removeItem('@total_days');
      await AsyncStorage.removeItem('@days_counted');
    }
  };

  const handleSetupComplete = async (newCourse) => {
    try {
      const updatedCourses = [...courses, newCourse];
      await AsyncStorage.setItem('@courses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      setCurrentScreen('home');
    } catch (e) {
      console.error('Failed to save setup data', e);
    }
  };

  const handleIncrement = () => {
    try {
      const updatedCourses = courses.map(c => {
        if (c.id === selectedCourseId && c.daysCounted < c.totalDays) {
          return { ...c, daysCounted: c.daysCounted + 1 };
        }
        return c;
      });
      setCourses(updatedCourses);
      AsyncStorage.setItem('@courses', JSON.stringify(updatedCourses)).catch(e => console.error(e));
    } catch (e) {
      console.error('Failed to update count', e);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const updatedCourses = courses.filter(c => c.id !== selectedCourseId);
      setCourses(updatedCourses);
      await AsyncStorage.setItem('@courses', JSON.stringify(updatedCourses));
      setCurrentScreen('home');
    } catch (e) {
      console.error('Failed to delete course', e);
    }
  };

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
            onSelectCourse={(course) => {
              setSelectedCourseId(course.id);
              setCurrentScreen('dashboard');
            }}
            onAddNew={() => setCurrentScreen('setup')}
          />
        )}

        {currentScreen === 'setup' && (
          <SetupScreen
            onSetupComplete={handleSetupComplete}
            onCancel={() => setCurrentScreen('home')}
            hasCourses={courses.length > 0}
          />
        )}

        {currentScreen === 'dashboard' && selectedCourse && (
          <DashboardScreen
            course={selectedCourse}
            onIncrement={handleIncrement}
            onDelete={handleDeleteCourse}
            onBack={() => setCurrentScreen('home')}
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
