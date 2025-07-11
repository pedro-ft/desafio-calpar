import type { Metadata } from "next";
import "./globals.css";
import MudarTema from './components/MudarTema';

export const metadata: Metadata = {
  title: "Lista de Usuários - Desafio Calpar",
  description: "Aplicação para o desafio de programação da Calpar",
  icons: {
    icon: '/Logotipo Grupo Calpar 2.avif'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <MudarTema>
          {children}
        </MudarTema>
      </body>
    </html>
  )
}
