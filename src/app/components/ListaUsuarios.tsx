import React from 'react'
import { Usuario } from './types'

interface UsuariosLista {
  usuarios: Usuario[]
}

export default function UserList({ usuarios }: UsuariosLista) {
  if (usuarios.length === 0) {
    return <p className="text-gray-600">Nenhum usuário encontrado na API.</p>
  }
  return (
    <ul className="space-y-3">
      {usuarios.map((usuario) => (
        <li key={usuario.Nome} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
          <span className="text-lg text-gray-800">
            {usuario.Nome} - {' '}
            <span className={`font-medium ${usuario.Disponivel ? 'text-green-600' : 'text-red-600'}`}>
              {usuario.Disponivel ? 'Disponível' : 'Indisponível'}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}