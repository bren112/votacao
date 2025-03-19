import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseclient';
import './login.css';
import { Link } from 'react-router-dom';

function Login() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
     
        const votanteId = localStorage.getItem('votante_id');
        if (votanteId) {
            navigate('/votacao'); 
        }
    }, [navigate]);


    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 3) {
            setCpf(value);
        } else if (value.length <= 6) {
            setCpf(value.replace(/(\d{3})(\d{1,})/, '$1.$2'));
        } else if (value.length <= 9) {
            setCpf(value.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3'));
        } else {
            setCpf(value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3-$4'));
        }
    };

    async function handleLogin() {
        if (!cpf || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        const { data, error } = await supabase
            .from('votante')
            .select('id')
            .eq('cpf', cpf)
            .eq('senha', senha)
            .single();

        if (error || !data) {
            alert("CPF ou senha incorretos!");
        } else {
            localStorage.setItem('votante_id', data.id);
            navigate('/votacao');
        }
    }

    return (
        <>
        <br />
        <a id='voltar' href="/">Voltar</a>
            <div className="caixa">
                <h1>REALIZE O LOGIN</h1>
                <h2>E JÁ VOTE!</h2>
            </div>

            <div className="form">
                <input 
                    type="text" 
                    placeholder="Digite seu CPF"
                    value={cpf}
                    onChange={handleCpfChange}
                />
                <br />

                <input 
                    type="password" 
                    placeholder="Digite Sua Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <br />

                <button onClick={handleLogin}>Logar</button>
                <Link to="/cadastro">
                    <br />
                    <a href="">Não tenho uma conta!</a>
                </Link>
            </div>
        </>
    );
}

export default Login;
