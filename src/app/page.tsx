'use client'
import React, { useState, useEffect } from 'react'
import { Usuario, RespostaAPI } from './components/types'
import ListaUsuarios from './components/ListaUsuarios'
import ListaFavoritos from './components/ListaFavoritos'
import BarraPesquisa from './components/BarraPesquisa'
import { useTema } from './components/MudarTema'
import Image from 'next/image'

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mensagemErro, setMensagemErro] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [localizacao, setLocalizacao] = useState<string | null>(null)
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState<string>('')
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
            await buscarNomeCidade(latitude, longitude)

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

  const buscarNomeCidade = async (latitude: number, longitude: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'DesafioCalparApp/1.0 (pedrofetaborda@gmail.com)'
        }
      })
      if (!response.ok) {
        throw new Error(`Erro ao buscar nome da cidade.`)
      }

      const data = await response.json()

      if (data && data.address) {
        const cidade = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || 'Cidade desconhecida'
        const pais = data.address.country || ''

        setLocalizacao(`${cidade}${pais ? `, ${pais}` : ''}`)
      } else {
        setLocalizacao(`Cidade não encontrada`)
      }
    } catch (error: unknown) {
      console.error("Erro na geocodificação reversa:", error)
      setErroLocalizacao(`Não foi possível obter a cidade.`);
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.Nome.toLowerCase().includes(termoBusca.toLowerCase())
  )

  const { theme, toggleTheme } = useTema()

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 sm:p-8">
      <div className="max-w-md mx-auto bg-card-background rounded-xl shadow-lg overflow-hidden md:max-w-xl lg:max-w-2xl">
        <div className="p-4 sm:p-6 bg-background border-b border-border-color">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/Logotipo Grupo Calpar 2.avif"
                alt="Logo Calpar"
                width={48}
                height={48}
                className='mr-3'
              />    
              <h1 className="text-xl font-bold text-text-primary"> 
                Lista de Usuários
                <span className="block text-sm font-normal text-text-secondary mt-1">
                  {localizacao && !erroLocalizacao && <span className="flex items-center">
                    {localizacao}
                  </span>}
                  {erroLocalizacao && <span className="text-red-500">{erroLocalizacao}</span>}
                  {!localizacao && !erroLocalizacao && (
                    <span className="text-text-secondary">Aguardando localização...</span>
                  )}
                </span>
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full focus:outline-none focus:ring-2 transition-colors duration-300
                bg-gray-200 dark:bg-gray-800 text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              aria-label={`Mudar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
            >
              {theme === 'light' ? (
                <Image
                  src="/sol.svg"
                  alt="Ícone Sol"
                  width={32} 
                  height={32} 
                />
              ) : (
                <Image
                  src="/lua.svg"
                  alt="Ícone Lua"
                  width={32}
                  height={32} 
                />
              )}
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {loading && (
            <p className="text-center text-lg text-text-secondary">Carregando usuários...</p>
          )}

          {mensagemErro && (
            <p className="text-center text-lg text-red-500 font-semibold">{mensagemErro}</p>
          )}

          {!loading && !mensagemErro && (
            <>
              <BarraPesquisa
                termoBusca={termoBusca}
                onSearchChange={setTermoBusca}
              />
              {favoritos.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-base font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    <span className="flex items-center">
                      Favoritos
                    </span>
                  </h2>
                  <ListaFavoritos
                    favoritos={favoritos}
                    onRemoveFavorite={toggleFavorito}
                  />
                </div>
              )}
              <hr className="my-6 border-border-color" />
              <h2 className="text-base font-medium text-text-secondary mb-2 uppercase tracking-wider">Usuários Disponíveis</h2>
              <ListaUsuarios
                usuarios={usuariosFiltrados}
                favoritos={favoritos}
                onToggleFavorite={toggleFavorito}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}