import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersManagementClient from './UsersManagementClient'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verificar se é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.is_staff) {
    redirect('/dashboard')
  }

  // Buscar todos os usuários
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return <UsersManagementClient initialUsers={users || []} />
}
