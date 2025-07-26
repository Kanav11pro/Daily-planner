
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QuickTag {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_TAGS: QuickTag[] = [
  { id: '1', name: 'Revision', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Practice', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Mock Test', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Formula', color: 'bg-yellow-100 text-yellow-800' },
  { id: '5', name: 'Important', color: 'bg-red-100 text-red-800' },
  { id: '6', name: 'Difficult', color: 'bg-orange-100 text-orange-800' },
];

export const QuickTagManager = () => {
  const [tags, setTags] = useState<QuickTag[]>(DEFAULT_TAGS);
  const [newTagName, setNewTagName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ];

  const handleAdd = () => {
    if (!newTagName.trim()) return;
    
    const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)];
    const tag: QuickTag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: randomColor
    };
    
    setTags([...tags, tag]);
    setNewTagName('');
    setIsAdding(false);
    
    toast({
      title: "Tag Added",
      description: `${tag.name} tag has been created.`,
    });
  };

  const handleDelete = (id: string) => {
    const tag = tags.find(t => t.id === id);
    setTags(tags.filter(tag => tag.id !== id));
    
    toast({
      title: "Tag Deleted",
      description: `${tag?.name} tag has been deleted.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quick Tags Management</h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Available Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="flex items-center gap-2 mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <Input
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1"
              />
              <Button onClick={handleAdd}>Add</Button>
              <Button onClick={() => setIsAdding(false)} variant="outline">Cancel</Button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-2">
                <Badge className={tag.color}>
                  {tag.name}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(tag.id)}
                  className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {tags.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No tags created yet. Add your first tag!
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tag Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Tags help students categorize and filter their tasks</li>
            <li>• Use descriptive names that students will understand</li>
            <li>• Common tags include: Revision, Practice, Mock Test, Important, etc.</li>
            <li>• Tags are automatically available in the task creation modal</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
