import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Votacao from "./pages/votacao/Votacao";
import Cadastro from "./pages/Cadastro/Cadastro";
// import CriarCandidato from "./pages/Candidato/CriarCandidato";
import CadastrarCandidato from "./pages/Candidato/Recado";
import Ranking from "./pages/Candidato/Ranking";
import AutoDrawingCanvas from "./pages/teste/Desenho";
function App() {
  return (
    <BrowserRouter>
      <div id="root">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/votacao" element={<Votacao />} />
            <Route path="/cadastro" element={<Cadastro />} />           
            <Route path="/criar" element={<CadastrarCandidato />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/auto" element={<AutoDrawingCanvas />} />
                
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
