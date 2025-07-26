
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Clock, BookOpen } from 'lucide-react';

// Mock user data - in a real app, this would come from your database
const mockUsers = [
  {
    id: '1',
    email: 'student1@example.com',
    name: 'Rajesh Kumar',
    exam: 'JEE Main',
    institute: 'Allen',
    studyHours: '6-8 hours',
    joinDate: '2024-01-15',
    tasksCompleted: 45,
    isActive: true
  },
  {
    id: '2',
    email: 'student2@example.com',
    name: 'Priya Sharma',
    exam: 'NEET',
    institute: 'Aakash',
    studyHours: '8-10 hours',
    joinDate: '2024-01-20',
    tasksCompleted: 62,
    isActive: true
  },
  // Add more mock users as needed
];

export const UserManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Today</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">456</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">JEE Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">789</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">NEET Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">445</p>
              </div>
              <BookOpen className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Exam</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Institute</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Study Hours</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tasks</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-slate-800">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{user.exam}</Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{user.institute}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{user.studyHours}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{user.tasksCompleted}</td>
                    <td className="py-4 px-4">
                      <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
