import { useEffect, useState } from "react";
import supabase from "../../supabaseclient";
import "./ranking.css";

function Ranking() {
    const [candidatos, setCandidatos] = useState([]);

    useEffect(() => {
        async function fetchRanking() {
            const { data } = await supabase
                .from("candidatos")
                .select("id, nome, imagem, quant_votos")
                .order("quant_votos", { ascending: false });

            if (data) {
                setCandidatos(data);
            }
        }

        fetchRanking();
    }, []);

    return (
        <>
        <br />
        <a id='voltar' href="/criar">Voltar</a>

        <div className="ranking-container">
            <a href="/criar"></a>
            <h1>Ranking dos Candidatos</h1>
            <ul>
                {candidatos.map((candidato, index) => (
                    <li key={candidato.id} className="ranking-item">
                        <span className="posicao">#{index + 1}</span>
                        <img src={candidato.imagem} alt={candidato.nome} className="imagem-candidato" />
                        <span className="nome">{candidato.nome}</span>
                        <span className="votos">Votos: {candidato.quant_votos} </span>
                    </li>
                ))}
            </ul>
        </div>
        <br />
        
        </>
    );
}

export default Ranking;
