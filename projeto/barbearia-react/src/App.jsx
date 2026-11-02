import AgendamentoForm from "./AgendamentosForm";
import Resposta from "./Resposta";
import { useState } from "react";

export default function App() {
  const [mensagem, setMensagem] = useState("");

  return (
    <div className="page">
      <header className="header">
        <a href="#" className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="#2fb457" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L4.5 14" />
            <path d="M11 19h7.2a1.8 1.8 0 0 0 1.6-2.6l-1-1.9" />
            <path d="m14 16-3 3 3 3" />
            <path d="M8.3 9.7 6.5 6.6a1.8 1.8 0 0 1 1.6-2.7c.7 0 1.4.4 1.7 1l1.2 2" />
            <path d="m10.5 5.6 3.7-.2 1.6 3.6" />
            <path d="m9.4 8.8 1.1-3.2-3.2-1" />
            <path d="M16.7 8.4l3.5.2 1-3.4" />
            <path d="M20.2 8.6 18.4 12" />
          </svg>
          <span>BIO-ÓLEO</span>
        </a>

        <nav className="nav">
          <a href="#">INICIO</a>
          <a href="#">SOBRE</a>
          <a href="#" className="active">AGENDAMENTO</a>
        </nav>

        <a href="#" className="account-btn">Minha conta</a>
      </header>

      <main className="main">
        <section className="intro">
          <h1>AGENDE SUA COLETA</h1>
          <p>Escolha o dia da coleta. A empresa confirma o horário e o coletor vai até você buscar o óleo.</p>
        </section>

        <AgendamentoForm setMensagem={setMensagem} />
      </main>

      <Resposta mensagem={mensagem} setMensagem={setMensagem} />
    </div>
  );
}
