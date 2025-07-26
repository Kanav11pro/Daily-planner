
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Subject {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', color: 'bg-blue-500' },
  { id: '2', name: 'Physics', color: 'bg-purple-500' },
  { id: '3', name: 'Chemistry', color: 'bg-green-500' },
  { id: '4', name: 'Biology', color: 'bg-red-500' },
  { id: '5', name: 'English', color: 'bg-orange-500' },
];

export const SubjectManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({ name: '', color: 'bg-blue-500' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500',
    'bg-orange-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const handleAdd = () => {
    if (!newSubject.name.trim()) return;
    
    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name.trim(),
      color: newSubject.color
    };
    
    setSubjects([...subjects, subject]);
    setNewSubject({ name: '', color: 'bg-blue-500' });
    setIsAdding(false);
    
    toast({
      title: "Subject Added",
      description: `${subject.name} has been added successfully.`,
    });
  };

  const handleEdit = (id: string, name: string) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, name } : subject
    ));
    setEditingId(null);
    
    toast({
      title: "Subject Updated",
      description: "Subject has been updated successfully.",
    });
  };

  const handleDelete = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    setSubjects(subjects.filter(subject => subject.id !== id));
    
    toast({
      title: "Subject Deleted",
      description: `${subject?.name} has been deleted.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Subject Management</h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Subject name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="flex-1"
              />
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewSubject({ ...newSubject, color })}
                    className={`w-8 h-8 rounded-full ${color} ${
                      newSubject.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                  />
                ))}
              </div>
              <Button onClick={handleAdd} size="sm">
                <Save className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${subject.color}`} />
                  {editingId === subject.id ? (
                    <Input
                      defaultValue={subject.name}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEdit(subject.id, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                      className="w-32"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subject.name}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(editingId === subject.id ? null : subject.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
