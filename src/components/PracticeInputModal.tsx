import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePractice } from '@/hooks/usePractice';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Target, BookOpen, FileText, BarChart } from 'lucide-react';

interface PracticeInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    questions_target: '',
    questions_solved: '',
    time_spent: '',
    difficulty_level: '',
    accuracy_percentage: '',
    notes: '',
  });

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
      await addSession({
        date: formData.date,
        subject: formData.subject as any,
        chapter: formData.chapter,
        source: formData.source as any,
        source_details: formData.source_details || undefined,
        questions_target: parseInt(formData.questions_target) || 0,
        questions_solved: parseInt(formData.questions_solved),
        time_spent: parseInt(formData.time_spent) || 0,
        difficulty_level: formData.difficulty_level as any || undefined,
        accuracy_percentage: parseFloat(formData.accuracy_percentage) || undefined,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Practice Session Added",
        description: "Your practice session has been successfully recorded!",
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        chapter: '',
        source: '',
        source_details: '',
        questions_target: '',
        questions_solved: '',
        time_spent: '',
        difficulty_level: '',
        accuracy_percentage: '',
        notes: '',
      });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Add Practice Session
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value, chapter: '' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="chapter">Chapter *</Label>
                <Select 
                  value={formData.chapter} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, chapter: value }))}
                  disabled={!formData.subject}
                >
                  <SelectTrigger>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Source Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Module">Module</SelectItem>
                      <SelectItem value="PYQs">PYQs (Previous Year Questions)</SelectItem>
                      <SelectItem value="CPPs">CPPs (Class/Test Papers)</SelectItem>
                      <SelectItem value="Reference Books">Reference Books</SelectItem>
                      <SelectItem value="Custom">Custom/Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source_details">Source Details</Label>
                  <Input
                    id="source_details"
                    placeholder="e.g., Allen Module, Cengage Book"
                    value={formData.source_details}
                    onChange={(e) => setFormData(prev => ({ ...prev, source_details: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Progress & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="questions_target">Target Questions</Label>
                  <Input
                    id="questions_target"
                    type="number"
                    placeholder="50"
                    value={formData.questions_target}
                    onChange={(e) => setFormData(prev => ({ ...prev, questions_target: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="questions_solved">Questions Solved *</Label>
                  <Input
                    id="questions_solved"
                    type="number"
                    placeholder="40"
                    value={formData.questions_solved}
                    onChange={(e) => setFormData(prev => ({ ...prev, questions_solved: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time_spent">Time (minutes)</Label>
                  <Input
                    id="time_spent"
                    type="number"
                    placeholder="120"
                    value={formData.time_spent}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_spent: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty_level">Difficulty Level</Label>
                  <Select value={formData.difficulty_level} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accuracy_percentage">Accuracy (%)</Label>
                  <Input
                    id="accuracy_percentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="85"
                    value={formData.accuracy_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, accuracy_percentage: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any observations, difficulties faced, or key learnings..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};