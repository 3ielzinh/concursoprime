-- Script para definir usuário como administrador
-- Execute no Supabase SQL Editor (https://app.supabase.com)

-- Opção 1: Definir usuário por username
UPDATE profiles 
SET is_staff = true
WHERE username = 'admin';

-- Opção 2: Definir usuário por email (se você souber o email)
-- UPDATE profiles 
-- SET is_staff = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com');

-- Opção 3: Definir o primeiro usuário cadastrado como admin
-- UPDATE profiles 
-- SET is_staff = true
-- WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Verificar se funcionou
SELECT 
  id,
  username,
  first_name,
  is_staff,
  is_premium,
  created_at
FROM profiles
WHERE is_staff = true;
