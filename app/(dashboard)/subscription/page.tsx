import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SubscriptionPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.is_premium) {
    return (
      <div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">👑</span>
            Plano PRO Ativo
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Você já é um membro PRO!
          </p>
        </div>

        <div className="max-w-2xl">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] p-8 rounded-xl shadow-2xl text-center">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-3xl font-bold text-black mb-2">
              Você é PRO!
            </h2>
            <p className="text-black/80 mb-6">
              Aproveite todos os recursos exclusivos da plataforma
            </p>

            <div className="bg-black/10 rounded-lg p-4 mt-6">
              <ul className="space-y-2 text-left">
                <li className="flex items-center gap-2 text-black">
                  <span>✅</span>
                  <span>Acesso a todos os módulos</span>
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span>✅</span>
                  <span>Cronograma personalizado</span>
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span>✅</span>
                  <span>Relatórios detalhados</span>
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span>✅</span>
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">👑</span>
          Assine o Plano PRO
        </h1>
        <p className="text-gray-400">
          Desbloqueie todo o potencial da plataforma
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Comparação de Planos */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Plano Gratuito */}
          <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-2">
              Plano Gratuito
            </h3>
            <p className="text-4xl font-bold text-gray-400 mb-6">
              R$ 0<span className="text-lg">/mês</span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-400">
                <span>✅</span>
                <span>Acesso a 3 módulos básicos</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span>✅</span>
                <span>Registro de estudos</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 line-through">
                <span>❌</span>
                <span>Cronograma personalizado</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 line-through">
                <span>❌</span>
                <span>Relatórios detalhados</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 line-through">
                <span>❌</span>
                <span>Suporte prioritário</span>
              </li>
            </ul>

            <p className="text-center text-sm text-gray-500">
              Seu plano atual
            </p>
          </div>

          {/* Plano PRO */}
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700] p-8 rounded-xl shadow-2xl border-2 border-[#D4AF37] relative">
            <div className="absolute top-4 right-4 bg-black text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold">
              POPULAR
            </div>

            <h3 className="text-2xl font-bold text-black mb-2">
              Plano PRO 👑
            </h3>
            <p className="text-4xl font-bold text-black mb-6">
              R$ 49<span className="text-lg">/mês</span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-black">
                <span>✅</span>
                <span><strong>Todos os módulos</strong> disponíveis</span>
              </li>
              <li className="flex items-center gap-2 text-black">
                <span>✅</span>
                <span><strong>Cronograma personalizado</strong></span>
              </li>
              <li className="flex items-center gap-2 text-black">
                <span>✅</span>
                <span><strong>Relatórios detalhados</strong></span>
              </li>
              <li className="flex items-center gap-2 text-black">
                <span>✅</span>
                <span><strong>Suporte prioritário</strong></span>
              </li>
              <li className="flex items-center gap-2 text-black">
                <span>✅</span>
                <span><strong>Novos recursos primeiro</strong></span>
              </li>
            </ul>

            <button className="w-full py-4 px-6 bg-black hover:bg-gray-900 text-[#D4AF37] font-bold rounded-lg transition text-lg">
              🚀 Assinar Agora
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">
            Perguntas Frequentes
          </h2>

          <div className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-semibold text-white p-4 bg-[#0a0a0a] rounded-lg">
                Posso cancelar a qualquer momento?
              </summary>
              <p className="p-4 text-gray-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem custos adicionais.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-white p-4 bg-[#0a0a0a] rounded-lg">
                Quais são as formas de pagamento?
              </summary>
              <p className="p-4 text-gray-400">
                Aceitamos cartão de crédito, débito, Pix e boleto bancário.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-white p-4 bg-[#0a0a0a] rounded-lg">
                Tem período de teste?
              </summary>
              <p className="p-4 text-gray-400">
                Sim! Oferecemos 7 dias de teste grátis para você conhecer todos os recursos.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
