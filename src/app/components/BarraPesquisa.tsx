'use client'
import React from 'react'

interface Pesquisa {
  termoBusca: string
  onSearchChange: (termo: string) => void
}

export default function BarraPesquisa({ termoBusca, onSearchChange }: Pesquisa) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Buscar usuário"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={termoBusca}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}