
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Tag, 
  Palette, 
  HelpCircle, 
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

type AdminSection = 'overview' | 'subjects' | 'chapters' | 'tags' | 'themes' | 'onboarding' | 'users';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems = [
  { id: 'overview' as AdminSection, label: 'Overview', icon: LayoutDashboard },
  { id: 'subjects' as AdminSection, label: 'Subjects', icon: BookOpen },
  { id: 'chapters' as AdminSection, label: 'Chapters', icon: FileText },
  { id: 'tags' as AdminSection, label: 'Quick Tags', icon: Tag },
  { id: 'themes' as AdminSection, label: 'Themes', icon: Palette },
  { id: 'onboarding' as AdminSection, label: 'Onboarding', icon: HelpCircle },
  { id: 'users' as AdminSection, label: 'Users', icon: Users },
];

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const { signOut } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">ExamAce Management</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          onClick={signOut}
          variant="outline"
          className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
