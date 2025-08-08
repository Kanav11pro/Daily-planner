
-- Add celebration tracking and enhanced target features
ALTER TABLE practice_sessions 
ADD COLUMN celebration_shown BOOLEAN DEFAULT FALSE,
ADD COLUMN streak_day INTEGER DEFAULT 0;

-- Add target tracking enhancements
ALTER TABLE practice_targets 
ADD COLUMN streak_count INTEGER DEFAULT 0,
ADD COLUMN best_streak INTEGER DEFAULT 0,
ADD COLUMN motivation_level VARCHAR(20) DEFAULT 'medium',
ADD COLUMN reminder_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN last_reminder TIMESTAMP,
ADD COLUMN accountability_score DECIMAL(3,1) DEFAULT 0.0;

-- Create celebration triggers table
CREATE TABLE IF NOT EXISTS celebration_triggers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL, -- 'daily_goal', 'streak', 'target_complete', etc.
    trigger_value INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE celebration_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own celebration triggers" ON celebration_triggers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own celebration triggers" ON celebration_triggers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own celebration triggers" ON celebration_triggers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own celebration triggers" ON celebration_triggers
    FOR DELETE USING (auth.uid() = user_id);
