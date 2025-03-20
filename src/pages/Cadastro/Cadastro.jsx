import { useState } from 'react';
import './Cadastro.css';
import supabase from '../../supabaseclient'; 

function Cadastro() {
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');

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

    async function handleCadastro() {
        if (!cpf || !nome || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        if (!isValidCPF(cpf)) {
            alert("CPF inválido. Verifique o número e tente novamente.");
            return;
        }

        const { data, error } = await supabase
            .from('votante') 
            .insert([
                {
                    cpf: cpf,
                    nome: nome,
                    senha: senha
                }
            ]);

        if (error) {
            alert("Erro ao cadastrar. Tente novamente.");
        } else {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "/login"; 
        }
    }

    const isValidCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]/g, ''); 
        if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false; 

        let sum = 0;
        let remainder;
        
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        remainder = sum % 11;
        let digit1 = remainder < 2 ? 0 : 11 - remainder;
        if (parseInt(cpf.charAt(9)) !== digit1) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = sum % 11;
        let digit2 = remainder < 2 ? 0 : 11 - remainder;
        if (parseInt(cpf.charAt(10)) !== digit2) return false;

        return true;
    };

    return (
        <>
        <br />
        <a id='voltar' href="/login">Voltar</a>
        <div className="caixa">
            <h1>REALIZE O SEU CADASTRO</h1>
            <h2>E LOGUE!</h2>

            <div className="form">
                <input
                    type="text"
                    placeholder="Digite seu CPF"
                    value={cpf}
                    onChange={handleCpfChange}
                />
                <br />

                <input
                    type="text"
                    placeholder="Digite seu Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <br />

                <input
                    type="password"
                    placeholder="Digite sua Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <br />

                <button onClick={handleCadastro}>Cadastrar</button>
            </div>
        </div></>
    );
}

export default Cadastro;