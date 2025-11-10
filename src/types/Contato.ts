export interface Telefone {
  id?: number; 
  numero: string;
}

export interface Contato {
  id?: number; 
  nome: string;
  idade: number;
  telefones: Telefone[]; 
}

export interface ContatoSearch {
  nome?: string;
  numeroTelefone?: string;
}