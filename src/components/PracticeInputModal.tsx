
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePractice } from '@/hooks/usePractice';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Target, BookOpen, FileText, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';

interface PracticeInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickSelector = ({ 
  options, 
  selectedValue, 
  onSelect, 
  customValue, 
  onCustomChange, 
  label,
  unit = ''
}: {
  options: number[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
  label: string;
  unit?: string;
}) => {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option}
            variant={selectedValue === option ? "default" : "outline"}
            className="cursor-pointer hover:scale-105 transition-transform px-3 py-2"
            onClick={() => {
              onSelect(option);
              setShowCustom(false);
            }}
          >
            {option}{unit}
          </Badge>
        ))}
        <Badge
          variant={showCustom ? "default" : "outline"}
          className="cursor-pointer hover:scale-105 transition-transform px-3 py-2"
          onClick={() => setShowCustom(true)}
        >
          Custom
        </Badge>
      </div>
      
      {showCustom && (
        <div className="animate-fade-in">
          <Input
            type="number"
            placeholder={`Enter ${label.toLowerCase()}`}
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-32"
          />
        </div>
      )}
    </div>
  );
};

const DateQuickSelector = ({ 
  selectedDate, 
  onDateSelect 
}: {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  return (
    <div className="space-y-3">
      <Label>Date *</Label>
      <div className="flex gap-2 mb-2">
        <Badge
          variant={selectedDate === today ? "default" : "outline"}
          className="cursor-pointer hover:scale-105 transition-transform px-4 py-2"
          onClick={() => onDateSelect(today)}
        >
          Today
        </Badge>
        <Badge
          variant={selectedDate === yesterday ? "default" : "outline"}
          className="cursor-pointer hover:scale-105 transition-transform px-4 py-2"
          onClick={() => onDateSelect(yesterday)}
        >
          Yesterday
        </Badge>
      </div>
      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateSelect(e.target.value)}
        className="w-48"
      />
    </div>
  );
};

export const PracticeInputModal = ({ open, onOpenChange }: PracticeInputModalProps) => {
  const { addSession } = usePractice();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    chapter: '',
    source: '',
    source_details: '',
    questions_solved: '',
    time_spent: '',
    accuracy_percentage: '',
    notes: '',
  });

  const [quickSelections, setQuickSelections] = useState({
    questionsSelected: null as number | null,
    timeSelected: null as number | null,
  });

  const subjectChapters = {
    Physics: [
      'Mechanics - Kinematics', 'Mechanics - Laws of Motion', 'Mechanics - Work, Energy & Power',
      'Mechanics - Rotational Motion', 'Mechanics - Gravitation', 'Mechanics - SHM',
      'Thermal Physics', 'Kinetic Theory of Gases', 'Thermodynamics',
      'Waves & Sound', 'Electromagnetic Waves', 'Optics - Ray Optics',
      'Optics - Wave Optics', 'Electrostatics', 'Current Electricity',
      'Magnetic Effects of Current', 'Electromagnetic Induction', 'AC Circuits',
      'Modern Physics - Dual Nature', 'Modern Physics - Atoms & Nuclei'
    ],
    Chemistry: [
      'Atomic Structure', 'Chemical Bonding', 'Periodic Table',
      'Chemical Thermodynamics', 'Chemical Equilibrium', 'Ionic Equilibrium',
      'Redox Reactions', 'Electrochemistry', 'Chemical Kinetics',
      'Surface Chemistry', 'Solid State', 'Solutions',
      'General Organic Chemistry', 'Hydrocarbons', 'Haloalkanes & Haloarenes',
      'Alcohols, Phenols & Ethers', 'Aldehydes & Ketones', 'Carboxylic Acids',
      'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life',
      's-block Elements', 'p-block Elements', 'd & f-block Elements',
      'Coordination Compounds', 'Metallurgy'
    ],
    Mathematics: [
      'Sets, Relations & Functions', 'Complex Numbers', 'Quadratic Equations',
      'Sequences & Series', 'Permutations & Combinations', 'Binomial Theorem',
      'Matrices & Determinants', 'Trigonometry', 'Inverse Trigonometry',
      'Heights & Distances', 'Limits', 'Continuity & Differentiability',
      'Applications of Derivatives', 'Indefinite Integration', 'Definite Integration',
      'Applications of Integrals', 'Differential Equations', 'Coordinate Geometry - Straight Lines',
      'Coordinate Geometry - Circles', 'Coordinate Geometry - Conic Sections',
      'Vector Algebra', '3D Geometry', 'Probability', 'Statistics'
    ]
  };

  const sourceSubcategories = {
    Module: ['Ex 1', 'Ex 1A', 'Ex 2', 'Ex 2A'],
    PYQs: ['Mains', 'Advanced'],
    CPPs: ['Core Practice Problems'],
    NCERT: [],
    Other: []
  };

  const getDifficultyFromSource = (source: string, sourceDetails: string) => {
    if (source === 'PYQs') return 'Hard';
    if (source === 'Module') {
      if (sourceDetails === 'Ex 1') return 'Easy';
      if (sourceDetails === 'Ex 1A') return 'Medium';
      if (sourceDetails === 'Ex 2') return 'Mixed';
      if (sourceDetails === 'Ex 2A') return 'Hard';
    }
    if (source === 'CPPs') return 'Easy';
    if (source === 'NCERT') return 'Medium';
    return 'Medium';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.chapter || !formData.questions_solved) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields (Subject, Chapter, Questions Solved).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const difficultyLevel = getDifficultyFromSource(formData.source, formData.source_details);
      
      await addSession({
        date: formData.date,
        subject: formData.subject as any,
        chapter: formData.chapter,
        source: formData.source as any,
        source_details: formData.source_details || undefined,
        questions_target: 0,
        questions_solved: parseInt(formData.questions_solved),
        time_spent: parseInt(formData.time_spent) || 0,
        difficulty_level: difficultyLevel as any,
        accuracy_percentage: parseFloat(formData.accuracy_percentage) || undefined,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Practice Session Added! 🎉",
        description: "Your practice session has been successfully recorded!",
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        chapter: '',
        source: '',
        source_details: '',
        questions_solved: '',
        time_spent: '',
        accuracy_percentage: '',
        notes: '',
      });
      setQuickSelections({ questionsSelected: null, timeSelected: null });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add practice session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-primary/10 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
            Add Practice Session
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DateQuickSelector
                  selectedDate={formData.date}
                  onDateSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                />

                <div className="space-y-3">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value, chapter: '' }))}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">📚 Physics</SelectItem>
                      <SelectItem value="Chemistry">🧪 Chemistry</SelectItem>
                      <SelectItem value="Mathematics">📐 Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="chapter">Chapter *</Label>
                <Select 
                  value={formData.chapter} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, chapter: value }))}
                  disabled={!formData.subject}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.subject && subjectChapters[formData.subject as keyof typeof subjectChapters]?.map((chapter) => (
                      <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Source Info */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Source Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="source">Source</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value, source_details: '' }))}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Module">📖 Module</SelectItem>
                      <SelectItem value="PYQs">🎯 PYQs (Previous Year Questions)</SelectItem>
                      <SelectItem value="CPPs">⚡ CPPs (Core Practice Problems)</SelectItem>
                      <SelectItem value="NCERT">📚 NCERT</SelectItem>
                      <SelectItem value="Other">🔧 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.source && sourceSubcategories[formData.source as keyof typeof sourceSubcategories].length > 0 && (
                  <div className="space-y-3">
                    <Label htmlFor="source_details">Source Details</Label>
                    <Select value={formData.source_details} onValueChange={(value) => setFormData(prev => ({ ...prev, source_details: value }))}>
                      <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder="Select details" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceSubcategories[formData.source as keyof typeof sourceSubcategories].map((detail) => (
                          <SelectItem key={detail} value={detail}>{detail}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.source === 'Other' && (
                  <div className="space-y-3">
                    <Label htmlFor="source_details">Custom Source</Label>
                    <Input
                      id="source_details"
                      placeholder="e.g., Allen Module, Cengage Book"
                      value={formData.source_details}
                      onChange={(e) => setFormData(prev => ({ ...prev, source_details: e.target.value }))}
                      className="h-12 text-lg"
                    />
                  </div>
                )}
              </div>

              {formData.source && formData.source_details && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    <span className="font-medium">Auto-detected Difficulty:</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getDifficultyFromSource(formData.source, formData.source_details)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Info */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Progress & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickSelector
                  options={[10, 20, 30, 50]}
                  selectedValue={quickSelections.questionsSelected}
                  onSelect={(value) => {
                    setQuickSelections(prev => ({ ...prev, questionsSelected: value }));
                    setFormData(prev => ({ ...prev, questions_solved: value.toString() }));
                  }}
                  customValue={formData.questions_solved}
                  onCustomChange={(value) => {
                    setFormData(prev => ({ ...prev, questions_solved: value }));
                    setQuickSelections(prev => ({ ...prev, questionsSelected: null }));
                  }}
                  label="Questions Solved *"
                />

                <QuickSelector
                  options={[30, 60, 90, 120]}
                  selectedValue={quickSelections.timeSelected}
                  onSelect={(value) => {
                    setQuickSelections(prev => ({ ...prev, timeSelected: value }));
                    setFormData(prev => ({ ...prev, time_spent: value.toString() }));
                  }}
                  customValue={formData.time_spent}
                  onCustomChange={(value) => {
                    setFormData(prev => ({ ...prev, time_spent: value }));
                    setQuickSelections(prev => ({ ...prev, timeSelected: null }));
                  }}
                  label="Time Spent"
                  unit=" min"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="accuracy_percentage">Accuracy (%)</Label>
                <Input
                  id="accuracy_percentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  value={formData.accuracy_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, accuracy_percentage: e.target.value }))}
                  className="h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Notes (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any observations, difficulties faced, or key learnings..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-8 py-3 text-lg">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                'Add Session 🚀'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
