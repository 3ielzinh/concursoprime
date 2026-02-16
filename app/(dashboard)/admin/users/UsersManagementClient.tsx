'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Profile {
  id: string
  username: string
  first_name: string | null
  is_premium: boolean
  is_staff: boolean
  premium_until: string | null
  created_at: string
}

interface Props {
  initialUsers: Profile[]
}

export default function UsersManagementClient({ initialUsers }: Props) {
  const supabase = createClient()
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'premium'>('all')
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Dados do formulário de edição
  const [editData, setEditData] = useState({
    username: '',
    first_name: '',
    is_premium: false,
    is_staff: false,
    premium_until: ''
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPlan = 
      filterPlan === 'all' ||
      (filterPlan === 'premium' && user.is_premium) ||
      (filterPlan === 'free' && !user.is_premium)
    
    return matchesSearch && matchesPlan
  })

  // Estatísticas
  const stats = {
    total: users.length,
    premium: users.filter(u => u.is_premium).length,
    free: users.filter(u => !u.is_premium).length,
    admins: users.filter(u => u.is_staff).length
  }

  // Abrir modal de edição
  function openEditModal(user: Profile) {
    setSelectedUser(user)
    setEditData({
      username: user.username,
      first_name: user.first_name || '',
      is_premium: user.is_premium,
      is_staff: user.is_staff,
      premium_until: user.premium_until || ''
    })
    setShowEditModal(true)
    setMessage('')
  }

  // Salvar edição
  async function handleSaveEdit() {
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editData.username,
          first_name: editData.first_name,
          is_premium: editData.is_premium,
          is_staff: editData.is_staff,
          premium_until: editData.premium_until || null
        })
        .eq('id', selectedUser.id)

      if (error) throw error

      // Atualizar lista local
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...editData }
          : u
      ))

      setMessage('✅ Usuário atualizado com sucesso!')
      setMessageType('success')
      setShowEditModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      setMessage('❌ Erro ao atualizar usuário')
      setMessageType('error')
    }
  }

  // Abrir modal de exclusão
  function openDeleteModal(user: Profile) {
    setSelectedUser(user)
    setShowDeleteModal(true)
    setMessage('')
  }

  // Confirmar exclusão
  async function handleDelete() {
    if (!selectedUser) return

    try {
      // Deletar do profiles primeiro (se houver registros relacionados, pode precisar de CASCADE)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id)

      if (profileError) throw profileError

      // Deletar usuário do auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedUser.id
      )

      if (authError) {
        console.warn('Erro ao deletar do auth (pode precisar de service_role):', authError)
      }

      // Remover da lista local
      setUsers(users.filter(u => u.id !== selectedUser.id))

      setMessage('✅ Usuário excluído com sucesso!')
      setMessageType('success')
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Erro ao excluir:', error)
      setMessage('❌ Erro ao excluir usuário')
      setMessageType('error')
    }
  }

  // Toggle premium rapidamente
  async function togglePremium(user: Profile) {
    try {
      const newPremiumStatus = !user.is_premium
      const premiumUntil = newPremiumStatus 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 dias
        : null

      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: newPremiumStatus,
          premium_until: premiumUntil
        })
        .eq('id', user.id)

      if (error) throw error

      setUsers(users.map(u => 
        u.id === user.id 
          ? { ...u, is_premium: newPremiumStatus, premium_until: premiumUntil }
          : u
      ))

      setMessage(`✅ Status premium ${newPremiumStatus ? 'ativado' : 'desativado'}`)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Erro:', error)
      setMessage('❌ Erro ao alterar status premium')
      setMessageType('error')
    }
  }

  return (
    <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">👥</span>
            Gestão de Usuários
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Administração de todos os usuários da plataforma
          </p>
        </div>

        <Link
          href="/admin/upload"
          className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition flex items-center gap-2"
        >
          <span>📤</span>
          <span>Upload de Materiais</span>
        </Link>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-500/10 border border-green-500 text-green-400' 
            : 'bg-red-500/10 border border-red-500 text-red-400'
        }`}>
          {message}
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-800">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2">
            Total de Usuários
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
            {stats.total}
          </p>
        </div>

        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-800">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2">
            Membros PRO
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
            {stats.premium}
          </p>
        </div>

        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-800">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2">
            Usuários Free
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
            {stats.free}
          </p>
        </div>

        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-gray-800">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2">
            Administradores
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
            {stats.admins}
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome ou username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterPlan('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterPlan === 'all'
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#0a0a0a] text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterPlan('premium')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterPlan === 'premium'
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#0a0a0a] text-gray-400 hover:text-white'
              }`}
            >
              PRO
            </button>
            <button
              onClick={() => setFilterPlan('free')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterPlan === 'free'
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#0a0a0a] text-gray-400 hover:text-white'
              }`}
            >
              Free
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-gray-800">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Usuário
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Plano
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">
                  Cadastro
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-sm">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white text-sm truncate">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {user.first_name || 'Sem nome'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      {user.is_staff ? (
                        <span className="px-2 py-1 bg-[#D4AF37] text-black text-xs font-semibold rounded">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                          ATIVO
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePremium(user)}
                        className="group"
                      >
                        {user.is_premium ? (
                          <span className="text-[#D4AF37] font-semibold text-sm group-hover:text-[#FFD700]">
                            👑 PRO
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm group-hover:text-gray-300">
                            Free
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 hidden md:table-cell">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
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

      {/* Modal de Edição */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Editar Usuário
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={editData.first_name}
                  onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Premium até</label>
                <input
                  type="date"
                  value={editData.premium_until ? editData.premium_until.split('T')[0] : ''}
                  onChange={(e) => setEditData({ ...editData, premium_until: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.is_premium}
                    onChange={(e) => setEditData({ ...editData, is_premium: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Premium</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.is_staff}
                    onChange={(e) => setEditData({ ...editData, is_staff: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Admin</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-red-500 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">
              ⚠️ Confirmar Exclusão
            </h2>
            
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir o usuário{' '}
              <span className="font-bold text-white">{selectedUser.username}</span>?
              <br />
              <br />
              <span className="text-red-400 text-sm">Esta ação não pode ser desfeita!</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
