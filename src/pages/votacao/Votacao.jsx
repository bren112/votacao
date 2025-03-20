import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { FaHeart, FaSignOutAlt } from "react-icons/fa";
import supabase from "../../supabaseclient";
import Confetti from "react-confetti";
import "./votacao.css";
import { useWindowSize } from "react-use"; 
import Countdown from "react-countdown";

function Votacao() {
    const { width, height } = useWindowSize(); 
    const [nomeVotante, setNomeVotante] = useState("");
    const [candidatos, setCandidatos] = useState([]);
    const [votanteId, setVotanteId] = useState(null);
    const [candidatoVotado, setCandidatoVotado] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [mensagemVoto, setMensagemVoto] = useState("");
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

        const { data: candidatoData, error: candidatoError } = await supabase
            .from("candidatos")
            .select("quant_votos, imagem")
            .eq("id", candidatoId)
            .single();

        if (candidatoError || !candidatoData) {
            alert("Erro ao buscar os dados do candidato.");
            return;
        }

        const novosVotos = candidatoData.quant_votos + 1;

        await supabase.from("votante").update({ candidato_id: candidatoId }).eq("id", votanteId);
        await supabase.from("candidatos").update({ quant_votos: novosVotos }).eq("id", candidatoId);

        setCandidatoVotado(candidatoId);
        setMensagemVoto("Voto registrado com sucesso!");
        setImagemModal(candidatoData.imagem);
        setShowConfetti(true);

        window.location.href = '#scroll'
        setTimeout(() => {
            setShowConfetti(false);
            setImagemModal(null);
        }, 8000);
    };

    const handleDesvotar = async () => {
        if (!candidatoVotado) return;

        const { data: candidatoData } = await supabase
            .from("candidatos")
            .select("quant_votos, imagem")
            .eq("id", candidatoVotado)
            .single();

        if (!candidatoData) {
            alert("Erro ao buscar o candidato.");
            return;
        }

        const novosVotos = Math.max(0, candidatoData.quant_votos - 1);

        await supabase.from("votante").update({ candidato_id: null }).eq("id", votanteId);
        await supabase.from("candidatos").update({ quant_votos: novosVotos }).eq("id", candidatoVotado);

        setMensagemVoto("Voto removido com sucesso!");
        setImagemModal(candidatoData.imagem);
        setCandidatoVotado(null);

        setTimeout(() => setImagemModal(null), 8000);
    };

    const handleLogout = () => {
        localStorage.removeItem("votante_id"); 
        navigate("/login");
    };
    const dataAlvo = new Date(new Date().getFullYear(), 9, 1, 0, 0, 0); // Outubro (mês 9)

    return (
        <> <br/> <div className="contador">
        Tempo restante para outubro: <Countdown date={dataAlvo} />
    </div>
        <div id="scroll"></div>
            <br />
            <div className="sub-header">
                <button onClick={handleLogout} className="btn-logout">
                    <FaSignOutAlt className="logout-icon" />
                    Logout
                </button>
                
            </div>
            <div className="caixa">
                <h1>SEU VOTO AQUI!</h1>
                {nomeVotante && (
                    <div className="top-bar">
                        <h3><span>{nomeVotante}</span>, você pode votar em 1 candidato!</h3>
                    </div>
                )}
            </div>
            <br />

            <div className="candidatos">
                
                {imagemModal && (
                    <div className="modal-voto" onClick={() => setImagemModal(null)}>
                        <div className="modal-content-voto">
                            <h2>{mensagemVoto}</h2>
                            <img src={imagemModal} alt="Candidato votado/desvotado" />
                        </div>
                    </div>
                )}

                {candidatos.map((candidato) => (
                    <div key={candidato.id} className="candidato">

                        <p>Votos: {candidato.quant_votos}</p>
                        <img 
                            src={candidato.imagem} 
                            alt={candidato.nome} 
                            width="150" 
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
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={500} />}

        </>
    );
}

export default Votacao;
