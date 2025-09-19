import { useState } from "react";
import { X, Calendar, BookOpen, Target, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { usePractice } from "@/hooks/usePractice";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { toast } from "sonner";

interface PracticeSession {
  id: string;
  date: string;
  subject: string;
  chapter: string;
  source: string;
  source_details?: string;
  questions_target: number;
  questions_solved: number;
  accuracy_percentage: number;
  time_spent: number;
  notes?: string;
  created_at: string;
}

interface PracticeSessionsModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export const PracticeSessionsModal = ({ open, onClose, selectedDate }: PracticeSessionsModalProps) => {
  const { user } = useAuth();
  const { sessions, deleteSession } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Filter sessions for the selected date
  const dateSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate.toDateString() === selectedDate.toDateString();
  });

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast.success("Practice session deleted successfully");
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error("Failed to delete practice session");
    }
  };

  const openDeleteDialog = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className={`${themeColors.card} rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${theme === 'midnight' || theme === 'obsidian' ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r ${themeColors.primary}`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Practice Sessions</h2>
                <p className="text-white/80 text-sm">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:scale-110 rounded-full hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 p-6">
            {dateSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <BookOpen className={`h-16 w-16 ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
                <h3 className={`text-lg font-semibold ${themeColors.text} mb-2`}>No Practice Sessions</h3>
                <p className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No practice sessions found for this date.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${themeColors.text}`}>
                      {dateSessions.length} Session{dateSessions.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="text-sm text-gray-500">
                      Total: {dateSessions.reduce((acc, s) => acc + s.questions_solved, 0)} questions
                    </div>
                  </div>

                  {dateSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                        theme === 'midnight' || theme === 'obsidian'
                          ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {session.subject}
                            </Badge>
                            <span className={`text-sm ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
                              •
                            </span>
                            <span className={`text-sm ${themeColors.text}`}>
                              {session.chapter}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>Source:</span>
                              <div className={`font-medium ${themeColors.text}`}>
                                {session.source_details || session.source}
                              </div>
                            </div>
                            
                            <div>
                              <span className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>Questions:</span>
                              <div className={`font-medium ${themeColors.text}`}>
                                {session.questions_solved}
                              </div>
                            </div>
                            
                            <div>
                              <span className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy:</span>
                              <div className={`font-medium ${
                                session.accuracy_percentage >= 80 ? 'text-green-600' :
                                session.accuracy_percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {session.accuracy_percentage}%
                              </div>
                            </div>
                            
                            <div>
                              <span className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>Time:</span>
                              <div className={`font-medium ${themeColors.text}`}>
                                {session.time_spent}min
                              </div>
                            </div>
                          </div>

                          {session.notes && (
                            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>Notes:</span>
                              <div className={`text-sm ${themeColors.text}`}>{session.notes}</div>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(session.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end p-6 border-t ${theme === 'midnight' || theme === 'obsidian' ? 'border-gray-700' : 'border-gray-200'}`}>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {deleteDialogOpen && (
        <DeleteConfirmDialog
          onConfirm={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setSessionToDelete(null);
          }}
        />
      )}
    </>
  );
};