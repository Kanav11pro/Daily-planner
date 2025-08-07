-- Create practice_sessions table for tracking daily question practice
CREATE TABLE public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Mathematics')),
  chapter TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('Module', 'PYQs', 'CPPs', 'Reference Books', 'Custom')),
  source_details TEXT,
  questions_target INTEGER NOT NULL DEFAULT 0,
  questions_solved INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0, -- in minutes
  difficulty_level TEXT CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard', 'Mixed')),
  accuracy_percentage FLOAT CHECK (accuracy_percentage >= 0 AND accuracy_percentage <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practice_chapters table for chapter-wise tracking
CREATE TABLE public.practice_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Mathematics')),
  chapter_name TEXT NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  total_time INTEGER NOT NULL DEFAULT 0, -- in minutes
  last_practiced DATE,
  revision_priority INTEGER CHECK (revision_priority >= 1 AND revision_priority <= 5) DEFAULT 3,
  mastery_level FLOAT CHECK (mastery_level >= 0 AND mastery_level <= 100) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject, chapter_name)
);

-- Create practice_targets table for goal tracking
CREATE TABLE public.practice_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('Daily', 'Weekly', 'Monthly')),
  subject TEXT NOT NULL, -- can be 'All' or specific subject
  questions_target INTEGER NOT NULL DEFAULT 0,
  time_target INTEGER NOT NULL DEFAULT 0, -- in minutes
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_targets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for practice_sessions
CREATE POLICY "Users can view their own practice sessions" 
ON public.practice_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own practice sessions" 
ON public.practice_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practice sessions" 
ON public.practice_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own practice sessions" 
ON public.practice_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for practice_chapters
CREATE POLICY "Users can view their own practice chapters" 
ON public.practice_chapters 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own practice chapters" 
ON public.practice_chapters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practice chapters" 
ON public.practice_chapters 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own practice chapters" 
ON public.practice_chapters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for practice_targets
CREATE POLICY "Users can view their own practice targets" 
ON public.practice_targets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own practice targets" 
ON public.practice_targets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practice targets" 
ON public.practice_targets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own practice targets" 
ON public.practice_targets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_practice_sessions_updated_at
BEFORE UPDATE ON public.practice_sessions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_practice_chapters_updated_at
BEFORE UPDATE ON public.practice_chapters
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_practice_targets_updated_at
BEFORE UPDATE ON public.practice_targets
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_practice_sessions_user_date ON public.practice_sessions(user_id, date);
CREATE INDEX idx_practice_sessions_subject ON public.practice_sessions(subject);
CREATE INDEX idx_practice_chapters_user_subject ON public.practice_chapters(user_id, subject);
CREATE INDEX idx_practice_targets_user_type ON public.practice_targets(user_id, target_type);