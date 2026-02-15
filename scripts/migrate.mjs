// Script para executar migração no Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pvugplqtptiuwblgcnek.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dWdwbHF0cHRpdXdibGdjbmVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTEwMTUyNSwiZXhwIjoyMDg2Njc3NTI1fQ.YgpBV0OYrQebvFj_aaO4T18h2DzYwuuKPEc6cXpTCXE'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('Executando migração: add_subject_name...')
  
  try {
    // Adicionar coluna subject_name
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.study_sessions ADD COLUMN IF NOT EXISTS subject_name TEXT;`
    })
    
    if (error1) {
      console.log('Info:', error1.message)
    }

    // Tornar subject_id nullable
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.study_sessions ALTER COLUMN subject_id DROP NOT NULL;`
    })
    
    if (error2) {
      console.log('Info:', error2.message)
    }

    console.log('✅ Migração concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error)
    
    // Tentar método alternativo - via API direta
    console.log('\nTentando método alternativo via SQL Editor...')
    console.log('Execute este SQL manualmente no Supabase SQL Editor:')
    console.log(`
-- Add subject_name field to study_sessions table
ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS subject_name TEXT;

-- Make subject_id nullable since we'll use subject_name for now
ALTER TABLE public.study_sessions
  ALTER COLUMN subject_id DROP NOT NULL;

-- Add a constraint to ensure either subject_id or subject_name is provided
ALTER TABLE public.study_sessions
  DROP CONSTRAINT IF EXISTS subject_name_or_id_required;
  
ALTER TABLE public.study_sessions
  ADD CONSTRAINT subject_name_or_id_required 
  CHECK (subject_id IS NOT NULL OR subject_name IS NOT NULL);
    `)
  }
}

runMigration()
