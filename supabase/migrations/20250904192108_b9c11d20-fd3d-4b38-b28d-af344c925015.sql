-- Create quick_tags table for custom user tags
CREATE TABLE public.quick_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  icon text DEFAULT NULL,
  study_nature text NOT NULL CHECK (study_nature IN ('Theory', 'Practice', 'Revision')),
  color_class text DEFAULT 'bg-blue-100 border-blue-300 text-blue-700',
  is_default boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.quick_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for quick_tags
CREATE POLICY "Users can view their own tags" 
ON public.quick_tags 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" 
ON public.quick_tags 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" 
ON public.quick_tags 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" 
ON public.quick_tags 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add tags column to tasks table to store selected tag IDs
ALTER TABLE public.tasks ADD COLUMN tag_ids uuid[] DEFAULT ARRAY[]::uuid[];

-- Add study_nature column to tasks table
ALTER TABLE public.tasks ADD COLUMN study_nature text DEFAULT NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_quick_tags_updated_at
BEFORE UPDATE ON public.quick_tags
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default tags for all existing users
INSERT INTO public.quick_tags (user_id, name, icon, study_nature, color_class, is_default)
SELECT 
  id as user_id,
  tag_data.name,
  tag_data.icon,
  tag_data.study_nature,
  tag_data.color_class,
  true as is_default
FROM public.profiles,
(VALUES 
  ('HW', 'ClipboardList', 'Practice', 'bg-orange-100 border-orange-300 text-orange-700'),
  ('Notes', 'FileText', 'Theory', 'bg-blue-100 border-blue-300 text-blue-700'),
  ('Lecture', 'GraduationCap', 'Theory', 'bg-green-100 border-green-300 text-green-700'),
  ('Revision', 'RotateCcw', 'Revision', 'bg-purple-100 border-purple-300 text-purple-700'),
  ('Module', 'Package', 'Practice', 'bg-indigo-100 border-indigo-300 text-indigo-700'),
  ('DPPs', 'BookOpen', 'Practice', 'bg-red-100 border-red-300 text-red-700')
) AS tag_data(name, icon, study_nature, color_class)
ON CONFLICT (user_id, name) DO NOTHING;