
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePractice } from '@/hooks/usePractice';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { 
  Search, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BookOpen,
  Trophy,
  Zap,
  Brain,
  Star,
  Filter
} from 'lucide-react';

// Comprehensive chapter data for JEE subjects
const SUBJECT_CHAPTERS = {
  Physics: [
    'Mechanics', 'Thermodynamics', 'Waves', 'Optics', 'Electricity', 'Magnetism',
    'Modern Physics', 'Gravitation', 'Fluid Mechanics', 'Simple Harmonic Motion',
    'Rotational Motion', 'Work Power Energy', 'Electromagnetic Induction',
    'AC Circuits', 'Semiconductor Electronics', 'Communication Systems',
    'Atomic Structure', 'Nuclear Physics', 'Dual Nature of Matter',
    'Ray Optics', 'Wave Optics', 'Electrostatics', 'Current Electricity'
  ],
  Chemistry: [
    'Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Chemical Equilibrium',
    'Ionic Equilibrium', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry',
    'Coordination Chemistry', 'Organometallic Chemistry', 'Biomolecules',
    'Polymers', 'General Organic Chemistry', 'Hydrocarbons', 'Alkyl Halides',
    'Alcohols and Ethers', 'Aldehydes and Ketones', 'Carboxylic Acids',
    'Nitrogen Compounds', 'Periodic Table', 'Hydrogen', 'S-Block Elements',
    'P-Block Elements', 'D-Block Elements', 'F-Block Elements'
  ],
  Mathematics: [
    'Sets and Relations', 'Functions', 'Trigonometry', 'Complex Numbers',
    'Quadratic Equations', 'Sequences and Series', 'Permutations and Combinations',
    'Binomial Theorem', 'Limits and Derivatives', 'Integrals', 'Differential Equations',
    'Vector Algebra', '3D Geometry', 'Straight Lines', 'Circles', 'Conic Sections',
    'Probability', 'Statistics', 'Mathematical Reasoning', 'Matrices and Determinants',
    'Linear Programming', 'Application of Derivatives', 'Application of Integrals'
  ]
};

export const ComprehensiveChapterTracker = () => {
  const { sessions, chapters } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const comprehensiveChapterData = useMemo(() => {
    const allChapters = [];
    
    // Create comprehensive chapter data
    Object.entries(SUBJECT_CHAPTERS).forEach(([subject, chapterList]) => {
      chapterList.forEach(chapterName => {
        const existingChapter = chapters.find(
          c => c.subject === subject && c.chapter_name === chapterName
        );
        
        const chapterSessions = sessions.filter(
          s => s.subject === subject && s.chapter === chapterName
        );

        const totalQuestions = chapterSessions.reduce((sum, s) => sum + s.questions_solved, 0);
        const totalTime = chapterSessions.reduce((sum, s) => sum + s.time_spent, 0);
        const avgAccuracy = chapterSessions.length > 0 
          ? chapterSessions
              .filter(s => s.accuracy_percentage != null)
              .reduce((sum, s, _, arr) => sum + (s.accuracy_percentage! / arr.length), 0)
          : 0;

        const lastPracticeDate = chapterSessions.length > 0 
          ? chapterSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
          : null;

        const daysSinceLastPractice = lastPracticeDate 
          ? Math.floor((new Date().getTime() - new Date(lastPracticeDate).getTime()) / (1000 * 60 * 60 * 24))
          : Infinity;

        // Determine mastery level based on questions solved and accuracy
        let masteryLevel = 0;
        if (totalQuestions > 0) {
          masteryLevel = Math.min(100, (totalQuestions / 50) * 50 + (avgAccuracy * 0.5));
        }

        // Determine status
        let status: 'not-started' | 'needs-attention' | 'in-progress' | 'strong' | 'mastered';
        if (totalQuestions === 0) {
          status = 'not-started';
        } else if (masteryLevel < 30 || daysSinceLastPractice > 14) {
          status = 'needs-attention';
        } else if (masteryLevel < 60) {
          status = 'in-progress';
        } else if (masteryLevel < 85) {
          status = 'strong';
        } else {
          status = 'mastered';
        }

        allChapters.push({
          id: existingChapter?.id || `${subject}-${chapterName}`,
          subject,
          chapter_name: chapterName,
          totalQuestions,
          totalTime,
          avgAccuracy: Math.round(avgAccuracy),
          sessionsCount: chapterSessions.length,
          masteryLevel: Math.round(masteryLevel),
          status,
          daysSinceLastPractice,
          lastPracticeDate,
          revision_priority: existingChapter?.revision_priority || 3
        });
      });
    });

    return allChapters;
  }, [sessions, chapters]);

  const filteredChapters = comprehensiveChapterData.filter(chapter => {
    const matchesSearch = chapter.chapter_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || chapter.subject === selectedSubject;
    const matchesStatus = statusFilter === 'all' || chapter.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const statusCounts = {
    'not-started': comprehensiveChapterData.filter(c => c.status === 'not-started').length,
    'needs-attention': comprehensiveChapterData.filter(c => c.status === 'needs-attention').length,
    'in-progress': comprehensiveChapterData.filter(c => c.status === 'in-progress').length,
    'strong': comprehensiveChapterData.filter(c => c.status === 'strong').length,
    'mastered': comprehensiveChapterData.filter(c => c.status === 'mastered').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-500';
      case 'needs-attention': return 'bg-red-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'strong': return 'bg-blue-500';
      case 'mastered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started': return <Target className="h-4 w-4" />;
      case 'needs-attention': return <AlertTriangle className="h-4 w-4" />;
      case 'in-progress': return <TrendingUp className="h-4 w-4" />;
      case 'strong': return <Star className="h-4 w-4" />;
      case 'mastered': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'needs-attention': return 'Needs Attention';
      case 'in-progress': return 'In Progress';
      case 'strong': return 'Strong';
      case 'mastered': return 'Mastered';
      default: return 'Unknown';
    }
  };

  const ChapterCard = ({ chapter }: { chapter: typeof comprehensiveChapterData[0] }) => (
    <Card className={`${themeColors.card} ${themeColors.glow} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 ${
      chapter.status === 'mastered' ? 'border-l-green-500' :
      chapter.status === 'strong' ? 'border-l-blue-500' :
      chapter.status === 'in-progress' ? 'border-l-yellow-500' :
      chapter.status === 'needs-attention' ? 'border-l-red-500' :
      'border-l-gray-500'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold truncate flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {chapter.chapter_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs font-medium">
                {chapter.subject}
              </Badge>
              <Badge 
                className={`text-xs text-white ${getStatusColor(chapter.status)}`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(chapter.status)}
                  {getStatusLabel(chapter.status)}
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mastery Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center gap-1">
              <Brain className="h-4 w-4" />
              Mastery Level
            </span>
            <span className="text-sm font-bold">{chapter.masteryLevel}%</span>
          </div>
          <Progress value={chapter.masteryLevel} className="h-3" />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600">{chapter.totalQuestions}</div>
            <div className="text-xs text-muted-foreground">Questions</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-600">
              {Math.round(chapter.totalTime / 60)}h {chapter.totalTime % 60}m
            </div>
            <div className="text-xs text-muted-foreground">Time</div>
          </div>
        </div>

        {/* Accuracy & Sessions */}
        {chapter.totalQuestions > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="text-sm font-bold text-purple-600">{chapter.avgAccuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <div className="text-sm font-bold text-orange-600">{chapter.sessionsCount}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
          </div>
        )}

        {/* Last Practice */}
        {chapter.lastPracticeDate && (
          <div className="text-xs text-muted-foreground text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            Last practiced: {
              chapter.daysSinceLastPractice === 0 ? 'Today' :
              chapter.daysSinceLastPractice === 1 ? '1 day ago' :
              `${chapter.daysSinceLastPractice} days ago`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Comprehensive Chapter Tracker
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your progress across all {Object.values(SUBJECT_CHAPTERS).flat().length} chapters
        </p>
      </div>

      {/* Filters */}
      <Card className={`${themeColors.card} ${themeColors.glow}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Subjects</SelectItem>
                <SelectItem value="Physics">⚛️ Physics</SelectItem>
                <SelectItem value="Chemistry">🧪 Chemistry</SelectItem>
                <SelectItem value="Mathematics">📐 Mathematics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="needs-attention">Needs Attention</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="strong">Strong</SelectItem>
                <SelectItem value="mastered">Mastered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className={`${themeColors.card} hover:shadow-lg transition-shadow cursor-pointer`} onClick={() => setStatusFilter(status)}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${getStatusColor(status)} text-white rounded-full`}>
                  {getStatusIcon(status)}
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{getStatusLabel(status)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredChapters.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <Card className={`${themeColors.card} text-center py-12`}>
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No chapters found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or start practicing to see chapter progress here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
