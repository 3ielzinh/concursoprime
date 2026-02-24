-- Add efficiency tracking fields to study_sessions table
-- This enables tracking study quality and effectiveness

ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS focus_level INTEGER CHECK (focus_level >= 1 AND focus_level <= 5);

ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS understanding_level INTEGER CHECK (understanding_level >= 1 AND understanding_level <= 5);

ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS fatigue_level INTEGER CHECK (fatigue_level >= 1 AND fatigue_level <= 5);

ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS efficiency_score DECIMAL(5,2);

-- Add index for better query performance on efficiency queries
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject ON public.study_sessions(subject_name);
CREATE INDEX IF NOT EXISTS idx_study_sessions_efficiency ON public.study_sessions(efficiency_score DESC) WHERE efficiency_score IS NOT NULL;

-- Create a function to calculate efficiency score
CREATE OR REPLACE FUNCTION calculate_efficiency_score(
  focus INTEGER,
  understanding INTEGER,
  fatigue INTEGER
) RETURNS DECIMAL(5,2) AS $$
BEGIN
  -- Formula: (Focus + Understanding + (6 - Fatigue)) / 15 * 100
  -- This gives a score from 0 to 100
  RETURN ((focus + understanding + (6 - fatigue)) / 15.0 * 100)::DECIMAL(5,2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
