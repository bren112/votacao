import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaSignOutAlt } from "react-icons/fa";
import supabase from "../../supabaseclient";
import "./votacao.css";

function Votacao() {
    const [nomeVotante, setNomeVotante] = useState("");
    const [candidatos, setCandidatos] = useState([]);
    const [votanteId, setVotanteId] = useState(null);
    const [candidatoVotado, setCandidatoVotado] = useState(null);
    const [imagemModal, setImagemModal] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchVotante() {
            const votanteId = localStorage.getItem("votante_id");

            if (!votanteId) {
                alert("Você precisa estar logado para votar!");
                navigate("/");
                return;
            }

            setVotanteId(votanteId);

            const { data: votoData } = await supabase
                .from("votante")
                .select("candidato_id")
                .eq("id", votanteId)
                .single();

            if (votoData && votoData.candidato_id) {
                setCandidatoVotado(votoData.candidato_id);
            }

            const { data } = await supabase
                .from("votante")
                .select("nome")
                .eq("id", votanteId)
                .single();

            if (data) {
                setNomeVotante(data.nome);
            }
        }

        async function fetchCandidatos() {
            const { data } = await supabase
                .from("candidatos")
                .select("id, nome, idade, imagem, quant_votos");

            if (data) {
                setCandidatos(data);
            }
        }

        fetchVotante();
        fetchCandidatos();
    }, [navigate]);

    const handleVotacao = async (candidatoId) => {
        if (candidatoVotado) {
            alert("Você já votou! Para votar em outro candidato, primeiro remova seu voto.");
            return;
        }
    
        const { error: insertVotanteError } = await supabase
            .from("votante")
            .update({ candidato_id: candidatoId }) 
            .eq("id", votanteId);
    
        if (insertVotanteError) {
            alert("Erro ao registrar seu voto.");
            return;
        }
    
        const { data: candidatoData, error: candidatoError } = await supabase
            .from("candidatos")
            .select("quant_votos")
            .eq("id", candidatoId)
            .single();
    
        if (candidatoError || !candidatoData) {
            alert("Erro ao buscar os dados do candidato.");
            return;
        }
    
        const votosAtuais = candidatoData.quant_votos;
        const novosVotos = votosAtuais + 1; 
    
       
        const { error: updateCandidatoError } = await supabase
            .from("candidatos")
            .update({ quant_votos: novosVotos })
            .eq("id", candidatoId);
    
        if (updateCandidatoError) {
            alert("Erro ao atualizar os votos do candidato.");
            return;
        }
    
        alert("Voto registrado com sucesso!");
        setCandidatoVotado(candidatoId);
        window.location.href = "/votacao";

    };
    
    
    const handleDesvotar = async () => {
        if (!candidatoVotado) return;
    
      
        const { data: candidatoData, error: candidatoError } = await supabase
            .from("candidatos")
            .select("quant_votos")
            .eq("id", candidatoVotado)
            .single();
    
        if (candidatoError || !candidatoData) {
            alert("Erro ao buscar o candidato.");
            return;
        }
    
        const votosAtuais = candidatoData.quant_votos;
        const novosVotos = votosAtuais > 0 ? votosAtuais - 1 : 0;
    
     
        const { error: updateVotanteError } = await supabase
            .from("votante")
            .update({ candidato_id: null })
            .eq("id", votanteId);
    
        if (updateVotanteError) {
            alert("Erro ao remover o voto.");
            return;
        }
    
       
        const { error: updateCandidatoError } = await supabase
            .from("candidatos")
            .update({ quant_votos: novosVotos })
            .eq("id", candidatoVotado);
    
        if (updateCandidatoError) {
            alert("Erro ao atualizar os votos.");
            return;
        }
    
        alert("Voto removido com sucesso!");
        setCandidatoVotado(null);
        window.location.href = "/votacao";

    };
    
    

    const handleLogout = () => {
        localStorage.removeItem("votante_id"); 
        navigate("/login");
    };

    return (
        <>
        <br />
        <div className="sub-header">
               <button onClick={handleLogout} className="btn-logout">
            <FaSignOutAlt className="logout-icon" />
               Logout
             </button></div>
            <div className="caixa">
     
                <h1>SEU VOTO AQUI!</h1>
                {nomeVotante && (
                    <div className="top-bar">
                        <h3><span>{nomeVotante}</span>, você pode votar em 1 candidato!</h3>
                    
                    </div>
                )}
            </div>
<br/>
            <div className="candidatos">
                {candidatos.map((candidato) => (
                    <div key={candidato.id} className="candidato">
                        <p>Votos: {candidato.quant_votos}</p>
                        <img 
                            src={candidato.imagem} 
                            alt={candidato.nome} 
                            width="150" 
                            onClick={() => setImagemModal(candidato.imagem)}
                            className="clicavel"
                        />
                        <div className="infos">
                            <h3>{candidato.nome}</h3>
                            <h3>{candidato.idade} anos</h3>
                        </div>
                        {candidatoVotado === candidato.id ? (
                            <button onClick={handleDesvotar} className="btn-votar votado">
                                <FaHeart className="heart-icon" />
                                Desvotar
                            </button>
                        ) : (
                            <button onClick={() => handleVotacao(candidato.id)} className="btn-votar">
                                <FaHeart className="heart-icon" />
                                Votar
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {imagemModal && (
                <div className="modal" onClick={() => setImagemModal(null)}>
                    <div className="modal-content">
                        <img src={imagemModal} alt="Imagem ampliada" />
                    </div>
                </div>
            )}
        </>
    );
}

export default Votacao;
