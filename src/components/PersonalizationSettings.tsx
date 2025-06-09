
import { useState, useEffect } from "react";
import { Plus, X, GripVertical, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface PersonalizationSettingsProps {
  onClose: () => void;
}

export const PersonalizationSettings = ({ onClose }: PersonalizationSettingsProps) => {
  const [quickTags, setQuickTags] = useState([
    { id: '1', value: 'lecture-complete', label: 'Lecture Complete', emoji: '🎓' },
    { id: '2', value: 'lecture-hw', label: 'Lecture H.W [Modules/DPPs/Sheets]', emoji: '✍️' },
    { id: '3', value: 'lecture-notes', label: 'Lecture Notes', emoji: '📝' },
    { id: '4', value: 'chapter-reading', label: 'Chapter Reading', emoji: '📚' },
    { id: '5', value: 'formula-practice', label: 'Formula Practice', emoji: '📊' },
    { id: '6', value: 'notes-revision', label: 'Notes Revision', emoji: '🔄' },
    { id: '7', value: 'concept-clarity', label: 'Concept Clarity', emoji: '💡' },
    { id: '8', value: 'previous-year', label: 'Previous Year Questions', emoji: '📑' },
    { id: '9', value: 'quick-review', label: 'Quick Review', emoji: '⚡' }
  ]);

  const [subjects, setSubjects] = useState({
    Maths: [
      'Basic of Mathematics', 'Quadratic Equation', 'Complex Number', 'Permutation Combination',
      'Sequences and Series', 'Binomial Theorem', 'Trigonometric Ratios & Identities'
    ],
    Chemistry: [
      'Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements',
      'Chemical Bonding and Molecular Structure', 'Thermodynamics (C)'
    ],
    Physics: [
      'Mathematics in Physics', 'Units and Dimensions', 'Motion In One Dimension',
      'Motion In Two Dimensions', 'Laws of Motion'
    ],
    Biology: [
      'The Living World', 'Biological Classification', 'Plant Kingdom',
      'Animal Kingdom', 'Morphology of Flowering Plants'
    ]
  });

  const [newTag, setNewTag] = useState({ label: '', emoji: '' });
  const [newChapter, setNewChapter] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Maths');

  const addQuickTag = () => {
    if (!newTag.label.trim()) return;
    
    const tag = {
      id: Date.now().toString(),
      value: newTag.label.toLowerCase().replace(/\s+/g, '-'),
      label: newTag.label.trim(),
      emoji: newTag.emoji || '📝'
    };
    
    setQuickTags([...quickTags, tag]);
    setNewTag({ label: '', emoji: '' });
    toast.success('Quick tag added successfully!');
  };

  const removeQuickTag = (id: string) => {
    setQuickTags(quickTags.filter(tag => tag.id !== id));
    toast.success('Quick tag removed!');
  };

  const updateQuickTag = (id: string, updates: Partial<typeof quickTags[0]>) => {
    setQuickTags(quickTags.map(tag => 
      tag.id === id ? { ...tag, ...updates } : tag
    ));
  };

  const addChapter = () => {
    if (!newChapter.trim()) return;
    
    setSubjects({
      ...subjects,
      [selectedSubject]: [...subjects[selectedSubject], newChapter.trim()]
    });
    setNewChapter('');
    toast.success('Chapter added successfully!');
  };

  const removeChapter = (subject: string, chapterIndex: number) => {
    setSubjects({
      ...subjects,
      [subject]: subjects[subject].filter((_, index) => index !== chapterIndex)
    });
    toast.success('Chapter removed!');
  };

  const saveSettings = () => {
    // Here you would save to Supabase or localStorage
    localStorage.setItem('userQuickTags', JSON.stringify(quickTags));
    localStorage.setItem('userSubjects', JSON.stringify(subjects));
    toast.success('Settings saved successfully!');
    onClose();
  };

  useEffect(() => {
    // Load saved settings
    const savedTags = localStorage.getItem('userQuickTags');
    const savedSubjects = localStorage.getItem('userSubjects');
    
    if (savedTags) {
      setQuickTags(JSON.parse(savedTags));
    }
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Personalization Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="tags" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tags">Quick Tags</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
            </TabsList>

            <TabsContent value="tags" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Quick Tags</CardTitle>
                  <p className="text-sm text-gray-600">
                    Customize your quick action tags for faster task creation
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            value={tag.emoji}
                            onChange={(e) => updateQuickTag(tag.id, { emoji: e.target.value })}
                            className="w-12 text-center"
                            maxLength={2}
                          />
                          <Input
                            value={tag.label}
                            onChange={(e) => updateQuickTag(tag.id, { label: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuickTag(tag.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <Label className="text-base font-medium">Add New Quick Tag</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        placeholder="🎯"
                        value={newTag.emoji}
                        onChange={(e) => setNewTag({ ...newTag, emoji: e.target.value })}
                        className="w-16 text-center"
                        maxLength={2}
                      />
                      <Input
                        placeholder="Tag name"
                        value={newTag.label}
                        onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
                        className="flex-1"
                      />
                      <Button onClick={addQuickTag} disabled={!newTag.label.trim()}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chapters" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Chapters</CardTitle>
                  <p className="text-sm text-gray-600">
                    Customize your subject chapters for better organization
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    {Object.keys(subjects).map((subject) => (
                      <Button
                        key={subject}
                        variant={selectedSubject === subject ? "default" : "outline"}
                        onClick={() => setSelectedSubject(subject)}
                        className="text-sm"
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {subjects[selectedSubject]?.map((chapter, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                      >
                        <span className="flex-1">{chapter}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChapter(selectedSubject, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <Label className="text-base font-medium">Add New Chapter to {selectedSubject}</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        placeholder="Chapter name"
                        value={newChapter}
                        onChange={(e) => setNewChapter(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addChapter()}
                      />
                      <Button onClick={addChapter} disabled={!newChapter.trim()}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={saveSettings}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
