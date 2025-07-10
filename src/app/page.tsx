'use client'
import React, { useState, useEffect } from 'react'
import { Usuario, RespostaAPI } from './components/types'
import ListaUsuarios from './components/ListaUsuarios'
import ListaFavoritos from './components/ListaFavoritos'
import BarraPesquisa from './components/BarraPesquisa'

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
            await buscarNomeCidade(latitude, longitude);

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
          'User-Agent': 'DesafioCalparApp/1.0 (pedroTaborda)'
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
        setLocalizacao(`Cidade não encontrada (Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)})`)
      }
    } catch (error: any) {
      console.error(error.message)
      setLocalizacao(null)
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.Nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 sm:p-8">
      <div className="max-w-md mx-auto bg-card-background rounded-xl shadow-lg overflow-hidden md:max-w-xl lg:max-w-2xl">
        <div className="p-4 sm:p-6 bg-background border-b border-border-color">
          <h1 className="text-xl font-bold text-text-primary mb-2"> 
            Lista de Usuários - Calpar
            <span className="block text-sm font-normal text-text-secondary mt-1">
              {localizacao && <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-icon-color inline-block" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {localizacao}
              </span>}
              {erroLocalizacao && <span className="text-red-500">{erroLocalizacao}</span>}
              {!localizacao && !erroLocalizacao && !loading && (
                 <span className="text-text-secondary">Aguardando localização...</span>
              )}
            </span>
          </h1>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400 inline-block" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72a1 1 0 01.588-1.81h3.462a1 1 0 00.95-.69L9.049 2.927z" />
                      </svg>
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
  );
}