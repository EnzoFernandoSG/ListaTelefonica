import React, { useState } from 'react';
import type { Telefone } from '../types/Contato';
import { incluirContato } from '../services/contatoService';
import './CadastroContato.css';

const CadastroContato: React.FC = () => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');
  const [telefones, setTelefones] = useState<Telefone[]>([{ numero: '' }]);
  const [mensagem, setMensagem] = useState('');
  
  const handleTelefoneChange = (index: number, value: string) => {
    const novosTelefones = telefones.map((tel, i) =>
      i === index ? { ...tel, numero: value } : tel
    );
    setTelefones(novosTelefones);
  };

  const adicionarTelefone = () => {
    setTelefones([...telefones, { numero: '' }]);
  };

  const removerTelefone = (index: number) => {
    if (telefones.length > 1) {
        setTelefones(telefones.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMensagem('');

    if (!nome || !idade || telefones.some(t => t.numero === '')) {
      setMensagem('Por favor, preencha o nome, idade e pelo menos um número de telefone.');
      return;
    }
    
    const telefonesValidos = telefones.filter(t => t.numero.trim() !== '');

    const novoContato = {
      nome,
      idade: Number(idade),
      telefones: telefonesValidos
    };

    try {
      await incluirContato(novoContato);
      setMensagem('✅ Contato cadastrado com sucesso!');
      setNome('');
      setIdade('');
      setTelefones([{ numero: '' }]);
    } catch (error) {
      setMensagem('❌ Erro ao cadastrar o contato. Verifique o console.');
    }
  };

  return (
    <div className="cadastro-container">
      <h2>👤 Cadastro de Contato</h2>
      <form onSubmit={handleSubmit} className="cadastro-form">
        
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="idade">Idade:</label>
          <input
            id="idade"
            type="number"
            value={idade}
            onChange={(e) => setIdade(parseInt(e.target.value) || '')}
            min="1"
            required
          />
        </div>

        <div className="telefones-section">
          <h3>📞 Telefones</h3>
          {telefones.map((telefone, index) => (
            <div key={index} className="telefone-input-group">
              <input
                type="text"
                placeholder={`Telefone ${index + 1}`}
                value={telefone.numero}
                onChange={(e) => handleTelefoneChange(index, e.target.value)}
                required={index === 0}
              />
              {telefones.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removerTelefone(index)}
                  className="remover-btn"
                >
                  -
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={adicionarTelefone} className="adicionar-btn">
            ➕ Adicionar Telefone
          </button>
        </div>

        <button type="submit" className="incluir-btn">
          💾 Incluir Contato
        </button>

        {mensagem && <p className={`mensagem ${mensagem.startsWith('✅') ? 'success' : 'error'}`}>{mensagem}</p>}
      </form>
    </div>
  );
};

export default CadastroContato;