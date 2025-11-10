import api from './api';
import type { Contato, ContatoSearch } from '../types/Contato';
import axios, { AxiosError } from 'axios';

export const incluirContato = async (contatoData: Omit<Contato, 'id'>): Promise<Contato> => {
  try {
    const response = await api.post<Contato>('/Contatos', contatoData); 
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Erro ao incluir contato (Axios):', error.message);
        if (error.response) {
          console.error('Detalhes da Resposta (400):', error.response.data); 
        }
    } else {
        console.error('Erro desconhecido ao incluir contato:', error);
    }
    throw error;
  }
};

export const buscarContatos = async (params: ContatoSearch = {}): Promise<Contato[]> => {
  try {
    const response = await api.get<Contato[]>('/Contatos', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    return []; 
  }
};

export const alterarContato = async (contatoData: Contato): Promise<void> => {
  try {
    await api.put(`/Contatos/${contatoData.id}`, contatoData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Erro ao alterar contato (Axios):', error.message);
        if (error.response) {
            console.error('Detalhes da Resposta:', error.response.data);
        }
    } else {
        console.error('Erro desconhecido ao alterar contato:', error);
    }
    throw error;
  }
};

export const excluirContato = async (contatoId: number): Promise<void> => {
  try {
    await api.delete(`/Contatos/${contatoId}`);
  } catch (error) {
    console.error('Erro ao excluir contato:', error);
    throw error;
  }
};