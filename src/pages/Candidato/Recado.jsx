import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseclient';

function CadastrarCandidato() {
  const [candidatos, setCandidatos] = useState([]);
  const [novoNome, setNovoNome] = useState('');
  const [novaIdade, setNovaIdade] = useState('');
  const [novaImagem, setNovaImagem] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCandidatos(); 
    }
  }, [isAuthenticated]);

  const fetchCandidatos = async () => {
    try {
      const { data, error } = await supabase.from('candidatos').select('*');
      if (error) {
        throw error;
      }
      setCandidatos(data);
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

 
    if (usuario === 'ti' && senha === 'ti1010') {
      setIsAuthenticated(true);
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  const handleSubmitCandidato = async (event) => {
    event.preventDefault();
    try {
      let publicUrl = '';

      
      if (novaImagem) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('desenho')
          .upload(`candidatos/${novoNome}.png`, novaImagem, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase
          .storage
          .from('desenho')
          .getPublicUrl(`candidatos/${novoNome}.png`);
        publicUrl = data.publicUrl;
      }


      const { data, error } = await supabase.from('candidatos').insert([{
        nome: novoNome,
        idade: novaIdade,
        imagem: publicUrl,
      }]);

      if (error) {
        throw error;
      }

      alert('Candidato cadastrado com sucesso:', data);
      setNovoNome('');
      setNovaIdade('');
      setNovaImagem(null);
      fetchCandidatos();
    } catch (error) {
      alert('Erro ao cadastrar candidato:', error.message);
    }
  };

  const handleExcluirCandidato = async (id) => {
    if (window.confirm('Tem certeza que quer excluir este candidato?')) {
      try {
        const { data, error } = await supabase.from('candidatos').delete().eq('id', id);
        if (error) {
          throw error;
        }
        alert('Candidato excluído com sucesso:', data);
        fetchCandidatos();
      } catch (error) {
        alert('Erro ao excluir candidato:', error.message);
      }
    }
  };

  return (
    <>
      {!isAuthenticated ? (
   
        <div className="login-container">
          <a href="/login">Voltar</a>
          <br />
          <h2>Login Administrativo</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button type="submit">Entrar</button>
          </form>
        </div>
      ) : (
  
        <div className="admin-container">
          <a href="/login">Voltar</a>

          <h2>Área Administrativa - Cadastro de Candidatos</h2>
          <div className="form-container">
            <form onSubmit={handleSubmitCandidato}>
              <h3>Novo Candidato</h3>
              <input
                type="text"
                placeholder="Nome do Candidato"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Idade do Candidato"
                value={novaIdade}
                onChange={(e) => setNovaIdade(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNovaImagem(e.target.files[0])}
                required
              />
              <button type="submit">Cadastrar Candidato</button>
            </form>
          </div>

          <div className="candidatos">
           
            {candidatos.map((candidato) => (

              <div key={candidato.id} className="candidato">
           
                  <div className="card">
                    <div className="infos">
                <h4>{candidato.nome}</h4>
                <p>Idade: {candidato.idade}</p></div></div>
                <img src={candidato.imagem} alt={candidato.nome} className="candidato-img" />
                <button onClick={() => handleExcluirCandidato(candidato.id)} className="delete-button">Excluir</button>
              </div>



            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .login-container {
          padding: 20px;
          background-color: #f4f4f4;
          max-width: 400px;
          margin: 50px auto;
          border-radius: 10px;
        }

        .infos2{
     
        }
        .admin-container {
          padding: 20px;
          background-color: #f4f4f4;
          max-width: 900px;
          margin: 0 auto;
          border-radius: 10px;
        }

        h2 {
          font-size: 3rem;
          text-align: center;
          color: #333;
        }

        .form-container {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }

        button {
          background-color: var(--verde);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }

        .candidatos-list {
       
}
        }

        .candidato-item {
      background-color: aquamarine;
  
        }

        .candidato-img {
          width: 100px;
          height: auto;
          margin-top: 10px;
        }

        .delete-button {
          background-color: #dc3545;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .delete-button:hover {
          background-color: #c82333;
        }
      `}</style>
    </>
  );
}

export default CadastrarCandidato;
