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
        className="w-full p-2.5 bg-background border border-border-color rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-text-primary placeholder-text-secondary"
        value={termoBusca}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}