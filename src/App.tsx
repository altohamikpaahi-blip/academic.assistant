import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './screens/LoginScreen';
import { CoursesScreen } from './screens/CoursesScreen';
import { CourseReviewScreen } from './screens/CourseReviewScreen';
import { DashboardScreen } from './screens/DashboardScreen';

function Router() {
  const { screen } = useApp();

  switch (screen.name) {
    case 'login':
      return <LoginScreen />;
    case 'courses':
      return <CoursesScreen semester={screen.semester} />;
    case 'course':
      return <CourseReviewScreen courseId={screen.courseId} />;
    case 'dashboard':
      return <DashboardScreen />;
    default:
      return <LoginScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
