'use client'
import React from 'react'
import { Usuario } from './types'
interface UsuariosLista {
  usuarios: Usuario[]
  favoritos: string[]
  onToggleFavorite: (nomeUsuario: string) => void
}

export default function ListaUsuarios({ usuarios, favoritos, onToggleFavorite }: UsuariosLista) {
  if (usuarios.length === 0) {
    return <p className="text-gray-600">Nenhum usuário encontrado na API.</p>
  }

  return (
    <ul className="space-y-3">
      {usuarios
        .slice()
        .sort((a, b) => a.Nome.localeCompare(b.Nome))      
        .map((usuario) => (
          <li key={usuario.Nome} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
            <span className="text-lg text-gray-800">
              {usuario.Nome} - {' '}
              <span className={`font-medium ${usuario.Disponivel ? 'text-green-600' : 'text-red-600'}`}>
                {usuario.Disponivel ? 'Disponível' : 'Indisponível'}
              </span>
            </span>
            <button
              onClick={() => onToggleFavorite(usuario.Nome)}
              className={`px-4 py-2 rounded-md text-white font-semibold transition duration-200 ease-in-out
                ${favoritos.includes(usuario.Nome) ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}
              `}
            >
              {favoritos.includes(usuario.Nome) ? '★ Favorito' : '☆ Adicionar aos Favoritos'}
            </button>
          </li>
      ))}
    </ul>
  )
}