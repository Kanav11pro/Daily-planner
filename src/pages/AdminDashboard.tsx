
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SubjectManager } from '@/components/admin/SubjectManager';
import { ChapterManager } from '@/components/admin/ChapterManager';
import { QuickTagManager } from '@/components/admin/QuickTagManager';
import { ThemeManager } from '@/components/admin/ThemeManager';
import { OnboardingManager } from '@/components/admin/OnboardingManager';
import { UserManager } from '@/components/admin/UserManager';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { Navigate } from 'react-router-dom';

type AdminSection = 'overview' | 'subjects' | 'chapters' | 'tags' | 'themes' | 'onboarding' | 'users';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Simple admin check - in production, you'd want proper role-based access
  const isAdmin = user?.email === 'cbforin@gmail.com'; // Replace with your admin email

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AnalyticsOverview />;
      case 'subjects':
        return <SubjectManager />;
      case 'chapters':
        return <ChapterManager />;
      case 'tags':
        return <QuickTagManager />;
      case 'themes':
        return <ThemeManager />;
      case 'onboarding':
        return <OnboardingManager />;
      case 'users':
        return <UserManager />;
      default:
        return <AnalyticsOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="flex">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your ExamAce platform
              </p>
            </header>
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};
