
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { usePractice, PracticeSession } from '@/hooks/usePractice';
import { EditPracticeSessionModal } from '@/components/EditPracticeSessionModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { format } from 'date-fns';

interface PracticeSessionsListProps {
  limit?: number;
}

export const PracticeSessionsList = ({ limit }: PracticeSessionsListProps) => {
  const { sessions, deleteSession } = usePractice();
  const [editingSession, setEditingSession] = useState<PracticeSession | null>(null);
  const [deletingSession, setDeletingSession] = useState<PracticeSession | null>(null);

  const displaySessions = limit ? sessions.slice(0, limit) : sessions;

  const handleDelete = async () => {
    if (deletingSession) {
      try {
        await deleteSession(deletingSession.id);
        setDeletingSession(null);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Chemistry': return 'bg-green-100 text-green-700 border-green-300';
      case 'Mathematics': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      case 'Mixed': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Practice Sessions Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start logging your practice sessions to track your progress.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {displaySessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={getSubjectColor(session.subject)}>
                    {session.subject}
                  </Badge>
                  <span className="font-medium">{session.chapter}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSession(session)}
                    className="h-8 w-8 p-0 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingSession(session)}
                    className="h-8 w-8 p-0 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">{session.questions_solved}/{session.questions_target}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">{session.time_spent}m</div>
                    <div className="text-xs text-gray-500">Time Spent</div>
                  </div>
                </div>
                {session.accuracy_percentage && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">{session.accuracy_percentage}%</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{format(new Date(session.date), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-gray-500">{session.source}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {session.difficulty_level && (
                    <Badge variant="outline" className={getDifficultyColor(session.difficulty_level)}>
                      {session.difficulty_level}
                    </Badge>
                  )}
                  {session.source_details && (
                    <Badge variant="outline">
                      {session.source_details}
                    </Badge>
                  )}
                </div>
              </div>
              
              {session.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{session.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <EditPracticeSessionModal
        session={editingSession}
        open={!!editingSession}
        onClose={() => setEditingSession(null)}
        onSessionUpdated={() => setEditingSession(null)}
      />

      {deletingSession && (
        <DeleteConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setDeletingSession(null)}
        />
      )}
    </>
  );
};
