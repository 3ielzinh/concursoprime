-- Add subject_name field to study_sessions table
-- This allows users to enter free-form subject names

ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS subject_name TEXT;

-- Make subject_id nullable since we'll use subject_name for now
ALTER TABLE public.study_sessions
  ALTER COLUMN subject_id DROP NOT NULL;

-- Add a constraint to ensure either subject_id or subject_name is provided
ALTER TABLE public.study_sessions
  ADD CONSTRAINT subject_name_or_id_required 
  CHECK (subject_id IS NOT NULL OR subject_name IS NOT NULL);
