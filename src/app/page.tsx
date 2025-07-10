'use client'
import React, { useState, useEffect } from 'react'
import { Usuario, RespostaAPI } from './components/types'
import ListaUsuarios from './components/ListaUsuarios'
import ListaFavoritos from './components/ListaFavoritos'

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mensagemErro, setMensagemErro] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [localizacao, setLocalizacao] = useState<string | null>(null)
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null)
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const favoritosSalvos = localStorage.getItem('favoritos')
      return favoritosSalvos ? JSON.parse(favoritosSalvos) : []
    }
    return []
  })

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoritos', JSON.stringify(favoritos))
    }
  }, [favoritos])

  const toggleFavorito = (nomeUsuario: string) => {
    setFavoritos(prevFavoritos => {
      if (prevFavoritos.includes(nomeUsuario)) {
        return prevFavoritos.filter(nome => nome !== nomeUsuario)
      } else {
        return [...prevFavoritos, nomeUsuario]
      }
    })
  }

  useEffect(() => {
    const obterLocalizacaoAutomatica = () => {
      if ("geolocation" in navigator) {
        setErroLocalizacao(null)
        setLocalizacao("Obtendo sua localização...")

        navigator.geolocation.getCurrentPosition(
          async (position) => { 
            const { latitude, longitude } = position.coords
            setLocalizacao(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`)

          },
          (error) => {
            let mensagemErro = ""
            switch (error.code) {
              case error.PERMISSION_DENIED:
                mensagemErro = "Permissão de geolocalização negada."
                break
              case error.POSITION_UNAVAILABLE:
                mensagemErro = "Informação de localização indisponível."
                break
              case error.TIMEOUT:
                mensagemErro = "Tempo limite excedido ao tentar obter a localização."
                break
              default:
                mensagemErro = `Erro desconhecido ao obter localização`
                break
            }
            setErroLocalizacao(mensagemErro)
            setLocalizacao(null)
          },
          {
            enableHighAccuracy: true, 
            timeout: 5000,          
            maximumAge: 0            
          }
        )
      } else {
        setLocalizacao(null)
      }
    }

    obterLocalizacaoAutomatica()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">       
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Lista de Usuários
          {localizacao && <span className="block text-xl font-normal text-gray-600 mt-2">{localizacao}</span>}
          {erroLocalizacao && <span className="block text-xl font-normal text-red-500 mt-2">{erroLocalizacao}</span>}
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
              favoritos={favoritos}
              onToggleFavorite={toggleFavorito}
            />
            <ListaFavoritos
              favoritos={favoritos}
              onRemoveFavorite={toggleFavorito}
            />
          </>
        )}
      </div>
    </div>
  )
}