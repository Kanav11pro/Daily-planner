import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Settings, Award, Plus } from 'lucide-react';
import { usePractice } from '@/hooks/usePractice';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { TargetManagementModal } from '@/components/TargetManagementModal';

interface TargetTrackerProps {
  detailed?: boolean;
  onTargetComplete?: () => void;
}

export const TargetTracker = ({ detailed = false, onTargetComplete }: TargetTrackerProps) => {
  const { targets, analytics } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [showManagementModal, setShowManagementModal] = useState(false);

  const getTargetProgress = (target: any) => {
    const today = new Date().toISOString().split('T')[0];
    const isActive = target.start_date <= today && target.end_date >= today;
    
    if (!isActive) return { questionsProgress: 0, timeProgress: 0, isComplete: false };
    
    let relevantSessions;
    if (target.target_type === 'Daily') {
      relevantSessions = analytics.today;
    } else if (target.target_type === 'Weekly') {
      relevantSessions = analytics.week;
    } else {
      relevantSessions = analytics.week;
    }
    
    const questionsProgress = Math.min((relevantSessions.questionsTotal / target.questions_target) * 100, 100);
    const timeProgress = Math.min((relevantSessions.timeTotal / target.time_target) * 100, 100);
    const isComplete = questionsProgress >= 100 && timeProgress >= 100;
    
    return { questionsProgress, timeProgress, isComplete };
  };

  const activeTargets = targets.filter(target => {
    const today = new Date().toISOString().split('T')[0];
    return target.start_date <= today && target.end_date >= today;
  });

  if (!detailed) {
    return (
      <>
        <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Targets
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowManagementModal(true)}
                className="gap-1"
              >
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            </div>
            <CardDescription>Track your daily practice goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTargets.length === 0 ? (
              <div className="text-center py-6">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground mb-3">No active targets</p>
                <Button 
                  onClick={() => setShowManagementModal(true)} 
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Target
                </Button>
              </div>
            ) : (
              activeTargets.slice(0, 2).map((target) => {
                const { questionsProgress, timeProgress, isComplete } = getTargetProgress(target);
                
                return (
                  <div key={target.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{target.target_type}</Badge>
                        <span className="font-medium">{target.subject}</span>
                        {isComplete && <Award className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Questions: {Math.round((questionsProgress / 100) * target.questions_target)}/{target.questions_target}</span>
                        <span>{Math.round(questionsProgress)}%</span>
                      </div>
                      <Progress value={questionsProgress} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Time: {Math.round((timeProgress / 100) * target.time_target)}/{target.time_target}min</span>
                        <span>{Math.round(timeProgress)}%</span>
                      </div>
                      <Progress value={timeProgress} className="h-2" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <TargetManagementModal
          open={showManagementModal}
          onOpenChange={setShowManagementModal}
          onTargetComplete={onTargetComplete}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Target Management</h2>
          <Button onClick={() => setShowManagementModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Target
          </Button>
        </div>

        {activeTargets.length === 0 ? (
          <Card className={themeColors.card}>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Active Targets</h3>
              <p className="text-muted-foreground mb-4">
                Set up practice targets to stay motivated and track your progress effectively.
              </p>
              <Button onClick={() => setShowManagementModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Target
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {activeTargets.map((target) => {
              const { questionsProgress, timeProgress, isComplete } = getTargetProgress(target);
              
              return (
                <Card key={target.id} className={`${themeColors.card} ${isComplete ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={target.target_type === 'Daily' ? 'default' : 'secondary'}>
                          {target.target_type}
                        </Badge>
                        <CardTitle>{target.subject} Target</CardTitle>
                        {isComplete && <Award className="h-5 w-5 text-green-500" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Questions Progress
                          </span>
                          <span className="font-bold">{Math.round(questionsProgress)}%</span>
                        </div>
                        <Progress value={questionsProgress} className="h-3 mb-1" />
                        <p className="text-sm text-muted-foreground">
                          {Math.round((questionsProgress / 100) * target.questions_target)} / {target.questions_target} questions
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Time Progress
                          </span>
                          <span className="font-bold">{Math.round(timeProgress)}%</span>
                        </div>
                        <Progress value={timeProgress} className="h-3 mb-1" />
                        <p className="text-sm text-muted-foreground">
                          {Math.round((timeProgress / 100) * target.time_target)} / {target.time_target} minutes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <TargetManagementModal
        open={showManagementModal}
        onOpenChange={setShowManagementModal}
        onTargetComplete={onTargetComplete}
      />
    </>
  );
};
