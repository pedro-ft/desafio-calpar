'use client'
import React from 'react'
import Image from 'next/image'

interface ListaFavoritosProps {
  favoritos: string[]
  onRemoveFavorite: (nomeUsuario: string) => void
}

export default function ListaFavoritos({ favoritos, onRemoveFavorite }: ListaFavoritosProps) {
  if (favoritos.length === 0) {
    return null
  }

  return (
    <>
      <ul className="space-y-0">
        {favoritos
          .slice()
          .sort((a, b) => a.localeCompare(b))  
          .map((nomeFav) => (
            <li key={nomeFav} className="flex items-center justify-between py-2 px-1 border-b border-border-color last:border-b-0 transition-colors duration-200 hover:bg-gray-700/30">
              <div className="flex items-center">
                <Image
                  src="/usuario.svg"
                  alt="Ícone de Usuário"
                  width={32}
                  height={32}
                  className="rounded-full mr-3 bg-gray-50 dark:bg-gray-700 p-1"
                />
                <span className="text-text-primary text-base font-medium">{nomeFav}</span>
              </div>
              <button
                onClick={() => onRemoveFavorite(nomeFav)}
                className="p-2 rounded-full transition duration-200 ease-in-out text-text-secondary hover:text-text-primary hover:bg-gray-300 dark:hover:bg-gray-500"
                aria-label={`Remover ${nomeFav} dos favoritos`}
              >
                Remover
              </button>
            </li>
        ))}
      </ul>
    </>
  )
}