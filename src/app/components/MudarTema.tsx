'use client'
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface TemaContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
const TemaContext = createContext<TemaContextType | undefined>(undefined)

export const useTema = () => {
  const context = useContext(TemaContext)
  if (context === undefined) {
    throw new Error('Erro ao trocar de tema.')
  }
  return context
}

interface MudarTemaProps {
  children: ReactNode
}

export default function MudarTema({ children }: MudarTemaProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const temaSalvo = localStorage.getItem('theme')
    if (temaSalvo === 'light' || temaSalvo === 'dark') {
      setTheme(temaSalvo)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
    setMounted(true)
  }, [])
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <TemaContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </TemaContext.Provider>
  )
}