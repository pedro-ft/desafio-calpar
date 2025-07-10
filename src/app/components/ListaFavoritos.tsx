'use client'
import React from 'react'

interface FavoritosLista {
  favoritos: string[]
  onRemoveFavorite: (nomeUsuario: string) => void
}

export default function ListaFavoritos({ favoritos, onRemoveFavorite }: FavoritosLista) {
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
              <span className="text-text-primary text-base font-medium">{nomeFav}</span>
              <button
                onClick={() => onRemoveFavorite(nomeFav)}
                className="p-2 rounded-full text-red-500 hover:text-red-400 transition duration-200 ease-in-out"
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