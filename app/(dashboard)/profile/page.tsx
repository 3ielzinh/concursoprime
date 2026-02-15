import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">👤</span>
          Meu Perfil
        </h1>
        <p className="text-gray-400">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Informações Pessoais */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">
            Informações Pessoais
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                defaultValue={profile?.username || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={user.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                defaultValue={profile?.first_name || ''}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                defaultValue={profile?.phone || ''}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
            </div>

            <button className="w-full py-3 px-6 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition">
              💾 Salvar Alterações
            </button>
          </div>
        </div>

        {/* Plano Atual */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">
            📦 Plano Atual
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">
                {profile?.is_premium ? (
                  <>
                    <span className="text-[#D4AF37]">👑 Plano PRO</span>
                  </>
                ) : (
                  'Plano Gratuito'
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {profile?.is_premium
                  ? 'Acesso completo a todos os recursos'
                  : 'Recursos limitados disponíveis'}
              </p>
            </div>

            {!profile?.is_premium && (
              <a
                href="/subscription"
                className="px-6 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition"
              >
                Upgrade
              </a>
            )}
          </div>
        </div>

        {/* Meta de Estudos */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">
            🎯 Meta de Estudos
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Horas por semana
            </label>
            <input
              type="number"
              defaultValue={profile?.study_goal_hours || 20}
              min="1"
              max="168"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a0a0a] text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Defina quantas horas você deseja estudar por semana
            </p>
          </div>

          <button className="w-full mt-4 py-3 px-6 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition">
            Atualizar Meta
          </button>
        </div>
      </div>
    </div>
  )
}
