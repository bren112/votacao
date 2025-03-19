import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseclient";

function CriarCandidato() {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [imagem, setImagem] = useState(null);
    const navigate = useNavigate();

    async function handleCadastro() {
        if (!nome || !imagem || !idade) {
            alert("Preencha todos os campos!");
            return;
        }

        // Nome único para a imagem (ex: timestamp + nome original)
        const nomeArquivo = `${Date.now()}_${imagem.name}`;

        // Fazendo upload da imagem para o bucket 'desenho'
        const { data, error: uploadError } = await supabase
            .storage
            .from("desenho")
            .upload(nomeArquivo, imagem);

        if (uploadError) {
            alert("Erro ao fazer upload da imagem: " + uploadError.message);
            return;
        }

        // Verificando se o upload foi bem-sucedido
        if (!data || !data.Key) {
            alert("Erro ao fazer upload da imagem, tente novamente.");
            return;
        }

        // Gerando URL pública da imagem após o upload
        const { publicURL, error: urlError } = supabase
            .storage
            .from("desenho")
            .getPublicUrl(nomeArquivo);

        if (urlError) {
            alert("Erro ao gerar URL da imagem: " + urlError.message);
            return;
        }

        // Verificando se a URL foi gerada corretamente
        if (!publicURL) {
            alert("Erro ao obter a URL pública da imagem.");
            return;
        }

        // Inserindo o candidato no banco de dados com a URL da imagem
        const { error } = await supabase
            .from("candidatos")
            .insert([
                { nome, idade, imagem: publicURL }
            ]);

        if (error) {
            alert("Erro ao cadastrar candidato: " + error.message);
        } else {
            alert("Candidato cadastrado com sucesso!");
            navigate("/votacao");
        }
    }

    return (
        <div className="caixa">
            <h1>CADASTRAR CANDIDATO</h1>

            <div className="form">
                <input
                    type="text"
                    placeholder="Nome do Candidato"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <br />

                <input
                    type="text"
                    placeholder="Idade do Candidato"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                />
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagem(e.target.files[0])}
                />
                <br />

                <button onClick={handleCadastro}>Cadastrar</button>
            </div>
        </div>
    );
}

export default CriarCandidato;
