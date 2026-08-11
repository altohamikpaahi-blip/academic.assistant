import React from 'react';
import { useApp } from '../context/AppContext';
import { colleges } from '../data/courses';
import { Building2, Cpu, Wrench } from 'lucide-react';

export const CollegeSelectionScreen: React.FC = () => {
  const { setSelectedCollege } = useApp();

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-8 h-8 text-indigo-600" />;
      case 'Wrench':
        return <Wrench className="w-8 h-8 text-indigo-600" />;
      default:
        return <Building2 className="w-8 h-8 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          اختر الكلية الخاصة بك
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          يرجى اختيار الكلية لعرض السمسترات والمواد الدراسية التابعة لها
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {colleges.map((college) => (
              <button
                key={college.id}
                onClick={() => setSelectedCollege(college)}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-right group cursor-pointer"
              >
                <div className="flex-shrink-0 ml-4 p-2 bg-gray-100 rounded-lg group-hover:bg-white">
                  {getIcon(college.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                    {college.name}
                  </h3>
                  {college.description && (
                    <p className="text-sm text-gray-500">{college.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
