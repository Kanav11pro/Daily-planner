
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Chapter {
  id: string;
  name: string;
  subject: string;
  order: number;
}

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];

const DEFAULT_CHAPTERS: Chapter[] = [
  { id: '1', name: 'Algebra', subject: 'Mathematics', order: 1 },
  { id: '2', name: 'Calculus', subject: 'Mathematics', order: 2 },
  { id: '3', name: 'Mechanics', subject: 'Physics', order: 1 },
  { id: '4', name: 'Thermodynamics', subject: 'Physics', order: 2 },
  { id: '5', name: 'Organic Chemistry', subject: 'Chemistry', order: 1 },
];

export const ChapterManager = () => {
  const [chapters, setChapters] = useState<Chapter[]>(DEFAULT_CHAPTERS);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newChapter, setNewChapter] = useState({ name: '', subject: '', order: 1 });
  const { toast } = useToast();

  const filteredChapters = selectedSubject === 'all' 
    ? chapters 
    : chapters.filter(chapter => chapter.subject === selectedSubject);

  const handleAdd = () => {
    if (!newChapter.name.trim() || !newChapter.subject) return;
    
    const chapter: Chapter = {
      id: Date.now().toString(),
      name: newChapter.name.trim(),
      subject: newChapter.subject,
      order: newChapter.order
    };
    
    setChapters([...chapters, chapter]);
    setNewChapter({ name: '', subject: '', order: 1 });
    setIsAdding(false);
    
    toast({
      title: "Chapter Added",
      description: `${chapter.name} has been added to ${chapter.subject}.`,
    });
  };

  const handleDelete = (id: string) => {
    const chapter = chapters.find(c => c.id === id);
    setChapters(chapters.filter(chapter => chapter.id !== id));
    
    toast({
      title: "Chapter Deleted",
      description: `${chapter?.name} has been deleted.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Chapter Management</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Chapter
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Chapter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <Input
                placeholder="Chapter name"
                value={newChapter.name}
                onChange={(e) => setNewChapter({ ...newChapter, name: e.target.value })}
              />
              <Select value={newChapter.subject} onValueChange={(value) => setNewChapter({ ...newChapter, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Order"
                value={newChapter.order}
                onChange={(e) => setNewChapter({ ...newChapter, order: parseInt(e.target.value) || 1 })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1">Add</Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {SUBJECTS.map((subject) => {
          const subjectChapters = chapters.filter(c => c.subject === subject);
          if (selectedSubject !== 'all' && selectedSubject !== subject) return null;
          if (subjectChapters.length === 0) return null;
          
          return (
            <Card key={subject}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {subject}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subjectChapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter) => (
                    <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {chapter.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          (Order: {chapter.order})
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(chapter.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
