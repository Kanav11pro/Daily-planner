import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePractice } from '@/hooks/usePractice';
import { Search, Clock, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const ChapterTracker = () => {
  const { chapters, sessions } = usePractice();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const chapterAnalytics = useMemo(() => {
    return chapters.map(chapter => {
      const chapterSessions = sessions.filter(
        s => s.subject === chapter.subject && s.chapter === chapter.chapter_name
      );

      const lastSession = chapterSessions[0]; // Sessions are ordered by date desc
      const daysSinceLastPractice = chapter.last_practiced 
        ? Math.floor((new Date().getTime() - new Date(chapter.last_practiced).getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      // Calculate average performance
      const avgAccuracy = chapterSessions
        .filter(s => s.accuracy_percentage != null)
        .reduce((sum, s, _, arr) => sum + (s.accuracy_percentage! / arr.length), 0);

      const avgQuestionsPerSession = chapterSessions.length > 0 
        ? chapter.total_questions / chapterSessions.length 
        : 0;

      // Determine status
      let status: 'needs-attention' | 'regular' | 'strong' | 'not-started';
      if (chapter.total_questions === 0) {
        status = 'not-started';
      } else if (daysSinceLastPractice > 7 || avgAccuracy < 60) {
        status = 'needs-attention';
      } else if (chapter.total_questions > 50 && avgAccuracy > 80) {
        status = 'strong';
      } else {
        status = 'regular';
      }

      return {
        ...chapter,
        daysSinceLastPractice,
        avgAccuracy: Math.round(avgAccuracy) || 0,
        avgQuestionsPerSession: Math.round(avgQuestionsPerSession),
        sessionsCount: chapterSessions.length,
        status,
        lastSession,
      };
    });
  }, [chapters, sessions]);

  const filteredChapters = chapterAnalytics.filter(chapter => {
    const matchesSearch = chapter.chapter_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || chapter.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const statusGroups = {
    'not-started': filteredChapters.filter(c => c.status === 'not-started'),
    'needs-attention': filteredChapters.filter(c => c.status === 'needs-attention'),
    'regular': filteredChapters.filter(c => c.status === 'regular'),
    'strong': filteredChapters.filter(c => c.status === 'strong'),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-500';
      case 'needs-attention': return 'bg-red-500';
      case 'regular': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started': return <Target className="h-4 w-4" />;
      case 'needs-attention': return <AlertTriangle className="h-4 w-4" />;
      case 'regular': return <TrendingUp className="h-4 w-4" />;
      case 'strong': return <CheckCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'needs-attention': return 'Needs Attention';
      case 'regular': return 'Regular Practice';
      case 'strong': return 'Strong';
      default: return 'Unknown';
    }
  };

  const ChapterCard = ({ chapter }: { chapter: typeof chapterAnalytics[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium truncate">{chapter.chapter_name}</CardTitle>
            <Badge variant="outline" className="mt-1 text-xs">{chapter.subject}</Badge>
          </div>
          <div className={`p-1 rounded-full text-white ${getStatusColor(chapter.status)}`}>
            {getStatusIcon(chapter.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-primary" />
            <span>{chapter.total_questions} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary" />
            <span>{Math.round(chapter.total_time / 60)}h {chapter.total_time % 60}m</span>
          </div>
        </div>

        {chapter.total_questions > 0 && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Mastery Level</span>
                <span>{chapter.mastery_level}%</span>
              </div>
              <Progress value={chapter.mastery_level} className="h-2" />
            </div>

            {chapter.avgAccuracy > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Avg Accuracy</span>
                  <span>{chapter.avgAccuracy}%</span>
                </div>
                <Progress value={chapter.avgAccuracy} className="h-2" />
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <div>Sessions: {chapter.sessionsCount}</div>
              <div>Avg Q/session: {chapter.avgQuestionsPerSession}</div>
              {chapter.last_practiced && (
                <div>
                  Last practiced: {chapter.daysSinceLastPractice === 0 
                    ? 'Today' 
                    : `${chapter.daysSinceLastPractice} days ago`}
                </div>
              )}
            </div>
          </>
        )}

        <Badge 
          variant="secondary" 
          className={`w-full justify-center text-xs ${
            chapter.status === 'needs-attention' ? 'bg-red-50 text-red-700 border-red-200' :
            chapter.status === 'strong' ? 'bg-green-50 text-green-700 border-green-200' :
            chapter.status === 'not-started' ? 'bg-gray-50 text-gray-700 border-gray-200' :
            'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}
        >
          {getStatusLabel(chapter.status)}
        </Badge>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter Progress Tracker</CardTitle>
          <CardDescription>Monitor your practice across all chapters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
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
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Subjects</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-500 text-white rounded-full">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusGroups['not-started'].length}</p>
                <p className="text-xs text-muted-foreground">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500 text-white rounded-full">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusGroups['needs-attention'].length}</p>
                <p className="text-xs text-muted-foreground">Need Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-500 text-white rounded-full">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusGroups['regular'].length}</p>
                <p className="text-xs text-muted-foreground">Regular</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusGroups['strong'].length}</p>
                <p className="text-xs text-muted-foreground">Strong</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapters by Status */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({filteredChapters.length})</TabsTrigger>
          <TabsTrigger value="needs-attention">
            Needs Attention ({statusGroups['needs-attention'].length})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            Not Started ({statusGroups['not-started'].length})
          </TabsTrigger>
          <TabsTrigger value="strong">Strong ({statusGroups['strong'].length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChapters.map(chapter => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="needs-attention">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusGroups['needs-attention'].map(chapter => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="not-started">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusGroups['not-started'].map(chapter => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strong">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusGroups['strong'].map(chapter => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredChapters.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No chapters found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start adding practice sessions to see chapter progress here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};