import React, { useState, useEffect, useCallback } from 'react';
import type { Contato, ContatoSearch, Telefone } from '../types/Contato';
import { buscarContatos, excluirContato, alterarContato } from '../services/contatoService';
import './PesquisaContato.css';

const PesquisaContato: React.FC = () => {
  const [filtros, setFiltros] = useState<ContatoSearch>({ nome: '', numeroTelefone: '' });
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  const [contatoEditando, setContatoEditando] = useState<Contato | null>(null);

  const handleBuscar = useCallback(async (event?: React.FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      const params: ContatoSearch = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v)
      );
      
      const resultados = await buscarContatos(params);
      setContatos(resultados);
      if (resultados.length === 0) {
        setMensagem('Nenhum contato encontrado com os filtros informados.');
      }
    } catch (error) {
      setMensagem('❌ Erro ao realizar a busca.');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    handleBuscar();
  }, [handleBuscar]); 


  const handleIniciarAlteracao = (contato: Contato) => {
    setContatoEditando(JSON.parse(JSON.stringify(contato)));
  };

  const handleContatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContatoEditando(prev => {
        if (!prev) return null;
        return {
            ...prev,
            [name]: name === 'idade' ? Number(value) : value,
        } as Contato;
    });
  };

  const handleTelefoneChange = (index: number, value: string) => {
    setContatoEditando(prev => {
        if (!prev) return null;
        const novosTelefones = [...prev.telefones];
        novosTelefones[index] = { ...novosTelefones[index], numero: value } as Telefone;
        return { ...prev, telefones: novosTelefones };
    });
  };

const handleAdicionarTelefone = () => {
    setContatoEditando(prev => {
        if (!prev) return null;
                const novoTelefone: Telefone = { numero: '', id: undefined }; 
        
        return { ...prev, telefones: [...prev.telefones, novoTelefone] };
    });
};

  const handleSalvarAlteracao = async () => {
    if (!contatoEditando) return;
    setLoading(true);

    try {
        const telefonesValidos = contatoEditando.telefones.filter(t => t.numero.trim() !== '');

        const contatoParaSalvar: Contato = {
            ...contatoEditando,
            telefones: telefonesValidos
        };
        
        await alterarContato(contatoParaSalvar);

        setMensagem('✅ Contato alterado com sucesso!');
        setContatoEditando(null);
        handleBuscar();
        
    } catch (error) {
        setMensagem('❌ Erro ao salvar alteração. Verifique o console.');
    } finally {
        setLoading(false);
    }
  };

  
  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato? Um LOG será gravado na pasta Logs do servidor.')) {
      return;
    }

    try {
      await excluirContato(id);
      setMensagem('✅ Contato excluído com sucesso! (LOG gravado no backend)');
      setContatos(contatos.filter(c => c.id !== id));
    } catch (error) {
      setMensagem('❌ Erro ao excluir contato.');
    }
  };

  return (
    <div className="pesquisa-container">
      <h2>🔎 Pesquisa de Contatos</h2>
      <form onSubmit={handleBuscar} className="filtros-form">
        <input
          type="text"
          placeholder="Pesquisar por Nome"
          value={filtros.nome || ''}
          onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pesquisar por Telefone"
          value={filtros.numeroTelefone || ''}
          onChange={(e) => setFiltros({ ...filtros, numeroTelefone: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Contatos'}
        </button>
      </form>

      {mensagem && <p className={`mensagem ${mensagem.startsWith('✅') ? 'success' : 'error'}`}>{mensagem}</p>}

      {contatos.length > 0 && (
        <table className="contatos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Telefones</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map((contato) => {
                const estaEditando = contatoEditando && contatoEditando.id === contato.id;
                
                if (estaEditando && contatoEditando) {
                    return (
                        <tr key={contato.id} className="editing-row">
                            <td>
                                <input
                                    type="text"
                                    name="nome"
                                    value={contatoEditando.nome}
                                    onChange={handleContatoChange}
                                    className="edit-input"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="idade"
                                    value={contatoEditando.idade}
                                    onChange={handleContatoChange}
                                    className="edit-input age-input"
                                />
                            </td>
                            <td>
                                <div className="telefones-edit-list">
                                    {contatoEditando.telefones.map((telefone, index) => (
                                        <input
                                            key={telefone.id || index}
                                            type="text"
                                            value={telefone.numero}
                                            onChange={(e) => handleTelefoneChange(index, e.target.value)}
                                            className="edit-input phone-input"
                                            placeholder="Número"
                                        />
                                    ))}
                                </div>
                                <button onClick={handleAdicionarTelefone} className="add-phone-btn" disabled={loading}>
                                    + Tel
                                </button>
                            </td>
                            <td className="acoes-cell">
                                <button onClick={handleSalvarAlteracao} className="salvar-btn" disabled={loading}>
                                    💾 Salvar
                                </button>
                                <button onClick={() => setContatoEditando(null)} className="cancelar-btn" disabled={loading}>
                                    ❌ Cancelar
                                </button>
                            </td>
                        </tr>
                    );
                }

                return (
                    <tr key={contato.id}>
                        <td>{contato.nome}</td>
                        <td>{contato.idade}</td>
                        <td>
                            {contato.telefones.map(t => t.numero).join(' / ')}
                        </td>
                        <td className="acoes-cell">
                            {/* Botão de Alteração */}
                            <button onClick={() => handleIniciarAlteracao(contato)} className="alterar-btn" disabled={loading}>
                                ✏️ Alterar
                            </button>
                            {/* Botão de Exclusão */}
                            <button onClick={() => contato.id && handleExcluir(contato.id)} className="excluir-btn" disabled={loading}>
                                🗑️ Excluir
                            </button>
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PesquisaContato;