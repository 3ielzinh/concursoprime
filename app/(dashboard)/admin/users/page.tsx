import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">👥</span>
          Gestão de Usuários
        </h1>
        <p className="text-gray-400">
          Administração de todos os usuários da plataforma
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Total de Usuários
          </h3>
          <p className="text-3xl font-bold text-[#D4AF37]">
            {users?.length || 0}
          </p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Membros PRO
          </h3>
          <p className="text-3xl font-bold text-[#D4AF37]">
            {users?.filter((u) => u.is_premium).length || 0}
          </p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Usuários Free
          </h3>
          <p className="text-3xl font-bold text-[#D4AF37]">
            {users?.filter((u) => !u.is_premium).length || 0}
          </p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Administradores
          </h3>
          <p className="text-3xl font-bold text-[#D4AF37]">
            {users?.filter((u) => u.is_staff).length || 0}
          </p>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold">
                          {u.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {u.username}
                          </div>
                          <div className="text-sm text-gray-400">
                            {u.first_name || 'Sem nome'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.is_staff ? (
                        <span className="px-2 py-1 bg-[#D4AF37] text-black text-xs font-semibold rounded">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                          ATIVO
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.is_premium ? (
                        <span className="text-[#D4AF37] font-semibold">👑 PRO</span>
                      ) : (
                        <span className="text-gray-400">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-[#D4AF37] hover:text-[#FFD700] font-medium">
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
