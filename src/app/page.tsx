'use client'
import React, { useState, useEffect } from 'react'
import { Usuario, RespostaAPI } from './components/types'
import ListaUsuarios from './components/ListaUsuarios'

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mensagemErro, setMensagemErro] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://09441c3d-9208-4fa9-a576-ba237af6b17c.mock.pstmn.io/')
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`)
        }

        const data: RespostaAPI = await response.json()

        if (data.Msg !== "Sucesso ao Encontrar usuário.") {
          setMensagemErro(data.Msg || 'Erro desconhecido ao carregar usuários.')
          setUsuarios([])
        } else {
          setUsuarios(data.Dados || [])
          setMensagemErro('')
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error)
        setMensagemErro('Não foi possível conectar à API.')
        setUsuarios([])
      } finally {
        setLoading(false)
      }
    }
    fetchUsuarios()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Lista de Usuários
        </h1>
        {loading && (
          <p className="text-center text-lg text-blue-600">Carregando usuários...</p>
        )}
        {mensagemErro && (
          <p className="text-center text-lg text-red-500 font-semibold">{mensagemErro}</p>
        )}
        {!loading && !mensagemErro && (
          <>

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Usuários Disponíveis</h2>
            <ListaUsuarios
              usuarios={usuarios}
            />
            
          </>
        )}
      </div>
    </div>
  )
}