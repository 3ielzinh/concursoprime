-- Add subject_name and color fields to schedules table
-- This allows users to enter free-form subject names and customize colors

ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS subject_name TEXT;

ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';

-- Make subject_id nullable since we'll use subject_name for now
ALTER TABLE public.schedules
  ALTER COLUMN subject_id DROP NOT NULL;

-- Add a constraint to ensure either subject_id or subject_name is provided
ALTER TABLE public.schedules
  DROP CONSTRAINT IF EXISTS subject_name_or_id_required;

ALTER TABLE public.schedules
  ADD CONSTRAINT subject_name_or_id_required 
  CHECK (subject_id IS NOT NULL OR subject_name IS NOT NULL);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day_of_week ON public.schedules(day_of_week);
