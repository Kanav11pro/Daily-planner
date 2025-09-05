import React, { useState } from 'react';
import { Plus, X, Edit3, Palette, BookOpen, Brain, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickTag, useQuickTags } from '@/hooks/useQuickTags';
import { toast } from 'sonner';

interface CustomTagManagerProps {
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
  onTagsChange: () => void;
}

const iconOptions = [
  { value: 'BookOpen', label: 'Book', icon: BookOpen },
  { value: 'Brain', label: 'Brain', icon: Brain },
  { value: 'RotateCcw', label: 'Rotate', icon: RotateCcw },
  { value: 'Edit3', label: 'Edit', icon: Edit3 },
];

const colorOptions = [
  { value: 'bg-blue-100 border-blue-300 text-blue-700', label: 'Blue', preview: 'bg-blue-500' },
  { value: 'bg-green-100 border-green-300 text-green-700', label: 'Green', preview: 'bg-green-500' },
  { value: 'bg-orange-100 border-orange-300 text-orange-700', label: 'Orange', preview: 'bg-orange-500' },
  { value: 'bg-purple-100 border-purple-300 text-purple-700', label: 'Purple', preview: 'bg-purple-500' },
  { value: 'bg-red-100 border-red-300 text-red-700', label: 'Red', preview: 'bg-red-500' },
  { value: 'bg-indigo-100 border-indigo-300 text-indigo-700', label: 'Indigo', preview: 'bg-indigo-500' },
];

const studyNatureIcons = {
  Theory: Brain,
  Practice: Edit3,
  Revision: RotateCcw,
};

export const CustomTagManager: React.FC<CustomTagManagerProps> = ({ selectedTags, onTagSelect, onTagsChange }) => {
  const { tags, addTag, updateTag, deleteTag } = useQuickTags();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<QuickTag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'BookOpen',
    study_nature: 'Theory' as 'Theory' | 'Practice' | 'Revision',
    color_class: 'bg-blue-100 border-blue-300 text-blue-700',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      icon: 'BookOpen',
      study_nature: 'Theory',
      color_class: 'bg-blue-100 border-blue-300 text-blue-700',
    });
  };

  const handleCreateTag = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    const newTag = await addTag({
      name: formData.name,
      icon: formData.icon,
      study_nature: formData.study_nature,
      color_class: formData.color_class,
      is_default: false,
    });

    if (newTag) {
      toast.success('Tag created successfully!');
      resetForm();
      setIsCreateModalOpen(false);
      onTagsChange();
    } else {
      toast.error('Failed to create tag');
    }
  };

  const handleEditTag = async () => {
    if (!editingTag || !formData.name.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    const updated = await updateTag(editingTag.id, {
      name: formData.name,
      icon: formData.icon,
      study_nature: formData.study_nature,
      color_class: formData.color_class,
    });

    if (updated) {
      toast.success('Tag updated successfully!');
      resetForm();
      setEditingTag(null);
      onTagsChange();
    } else {
      toast.error('Failed to update tag');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    const success = await deleteTag(tagId);
    if (success) {
      toast.success('Tag deleted successfully!');
      onTagsChange();
    } else {
      toast.error('Failed to delete tag');
    }
  };

  const startEditing = (tag: QuickTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      icon: tag.icon || 'BookOpen',
      study_nature: tag.study_nature,
      color_class: tag.color_class,
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || BookOpen;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Quick Tags</Label>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tagName">Tag Name</Label>
                <Input
                  id="tagName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Assignment"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Study Nature</Label>
                <Select 
                  value={formData.study_nature} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, study_nature: value as any }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Theory">🧠 Theory</SelectItem>
                    <SelectItem value="Practice">✏️ Practice</SelectItem>
                    <SelectItem value="Revision">🔄 Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(option => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color_class: color.value }))}
                      className={`p-3 rounded-lg border-2 flex items-center justify-center ${
                        formData.color_class === color.value ? 'border-indigo-500 shadow-md' : 'border-gray-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${color.preview}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateTag} className="flex-1">
                  Create Tag
                </Button>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tags.map(tag => {
          const IconComponent = getIconComponent(tag.icon || 'BookOpen');
          const StudyNatureIcon = studyNatureIcons[tag.study_nature];
          const isSelected = selectedTags.includes(tag.id);
          
          return (
            <div
              key={tag.id}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 hover:shadow-md'
              } ${tag.color_class} group`}
            >
              <button
                type="button"
                onClick={() => onTagSelect(tag.id)}
                className="w-full h-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-white/30'} group-hover:bg-white/50 transition-colors`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-sm block">{tag.name}</span>
                      <span className="text-xs opacity-70 flex items-center">
                        <StudyNatureIcon className="h-3 w-3 mr-1" />
                        {tag.study_nature}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-indigo-500 text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </button>
              
              {!tag.is_default && (
                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(tag);
                    }}
                    className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(tag.id);
                    }}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Dialog open={editingTag !== null} onOpenChange={() => setEditingTag(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTagName">Tag Name</Label>
              <Input
                id="editTagName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Assignment"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Study Nature</Label>
              <Select 
                value={formData.study_nature} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, study_nature: value as any }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theory">🧠 Theory</SelectItem>
                  <SelectItem value="Practice">✏️ Practice</SelectItem>
                  <SelectItem value="Revision">🔄 Revision</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Icon</Label>
              <Select 
                value={formData.icon} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color_class: color.value }))}
                    className={`p-3 rounded-lg border-2 flex items-center justify-center ${
                      formData.color_class === color.value ? 'border-indigo-500 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${color.preview}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditTag} className="flex-1">
                Update Tag
              </Button>
              <Button variant="outline" onClick={() => setEditingTag(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};