export interface Usuario {
  Nome: string
  Disponivel: boolean
}

export interface RespostaAPI {
  Msg: string
  Dados?: Usuario[]
}