import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CollegeSelectionScreen } from './screens/CollegeSelectionScreen';
import DashboardScreen from './screens/DashboardScreen';

const MainNavigator: React.FC = () => {
  const { selectedCollege } = useApp();

  // إذا لم يتم اختيار كلية بعد، تظهر شاشة الاختيار أولاً
  if (!selectedCollege) {
    return <CollegeSelectionScreen />;
  }

  // عرض لوحة التحكم الرئيسية الخاصة بالتطبيق
  return <DashboardScreen />;
};

export function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

export default App;
