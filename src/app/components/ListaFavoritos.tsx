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
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Meus Favoritos</h2>
      <ul className="space-y-3">
        {favoritos.map((nomeFav) => (
          <li key={nomeFav} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
            <span className="text-lg text-gray-800">{nomeFav}</span>
            <button
              onClick={() => onRemoveFavorite(nomeFav)}
              className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-200 ease-in-out"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}