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
    <ul className="space-y-0">
      {usuarios
        .slice()
        .sort((a, b) => a.Nome.localeCompare(b.Nome))      
        .map((usuario) => (
          <li key={usuario.Nome} className="flex items-center justify-between py-2 px-1 border-b border-border-color last:border-b-0 transition-colors duration-200 hover:bg-gray-700/30">
            <span className="text-text-primary text-base font-medium block">
              {usuario.Nome} - {' '}
              <span className={`text-sm font-normal ${usuario.Disponivel ? 'text-green-500' : 'text-red-500'}`}>
                {usuario.Disponivel ? 'Disponível' : 'Indisponível'}
              </span>
            </span>
            <button
              onClick={() => onToggleFavorite(usuario.Nome)}
              className={`p-2 rounded-full transition duration-200 ease-in-out
                ${favoritos.includes(usuario.Nome) ? 'text-yellow-400 hover:text-yellow-300' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              {favoritos.includes(usuario.Nome) ? '★ Favorito' : '☆ Adicionar aos Favoritos'}
            </button>
          </li>
      ))}
    </ul>
  )
}