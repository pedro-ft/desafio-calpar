'use client'
import React from 'react'
import { Usuario } from './types'
import Image from 'next/image'
interface ListaUsuariosProps {
  usuarios: Usuario[]
  favoritos: string[]
  onToggleFavorite: (nomeUsuario: string) => void
}

export default function ListaUsuarios({ usuarios, favoritos, onToggleFavorite }: ListaUsuariosProps) {
  if (usuarios.length === 0) {
    return <p className="text-text-secondary">Nenhum usuário encontrado.</p>
  }

  return (
    <ul className="space-y-0">
      {usuarios
        .slice()
        .sort((a, b) => a.Nome.localeCompare(b.Nome))      
        .map((usuario) => (
          <li key={usuario.Nome} className="flex items-center justify-between py-2 px-1 border-b border-border-color last:border-b-0 transition-colors duration-200 hover:bg-gray-700/30">
            <div className="flex items-center">
              <Image
                src="/usuario.svg"
                alt="Ícone de Usuário"
                width={32}
                height={32}
                className="rounded-full mr-3 bg-gray-50 dark:bg-gray-700 p-1"
              />       
              <span className="text-text-primary text-base font-medium block">
                {usuario.Nome} - {' '}
                <span className={`text-sm font-normal ${usuario.Disponivel ? 'text-green-500' : 'text-red-500'}`}>
                  {usuario.Disponivel ? 'Disponível' : 'Indisponível'}
                </span>
              </span>
            </div>
            <button
              onClick={() => onToggleFavorite(usuario.Nome)}
              className={`p-2 rounded-full transition duration-200 ease-in-out
              ${
                favoritos.includes(usuario.Nome)
                  ?
                    'text-text-secondary hover:text-text-primary hover:bg-red-300 dark:hover:bg-red-400'
                  :
                    'text-text-secondary hover:text-text-primary hover:bg-gray-300 dark:hover:bg-gray-500' 
              }
            `}
            >
              {favoritos.includes(usuario.Nome) ? '★ Favorito' : '☆ Adicionar aos Favoritos'}
            </button>
          </li>
      ))}
    </ul>
  )
}