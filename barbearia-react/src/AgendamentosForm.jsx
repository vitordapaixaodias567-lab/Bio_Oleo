import { useState } from "react";
import logo from "./assets/3d_green_gradient_recycle_sign-Photoroom.png";

export default function AgendamentoForm({ setMensagem }) {
  const [nome, setNome] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [telefone, setTelefone] = useState("");
  const [rua, setRua] = useState("");
  const [casa, setCasa] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensagem("Aguarde, processando seu agendamento...");

    const dadosAgendamentos = {
      nome,
      telefone,
      dia,
      hora,
      rua,
      casa,
      bairro,
      complemento,
      quantidade_litros: quantidade,
      observacoes,
    };

    try {
      const response = await fetch("http://localhost:3000/salvar-agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAgendamentos),
      });

      const result = await response.json();

      if (response.ok) {
        setMensagem(result.mensagem);
      } else {
        setMensagem("Erro ao agendar: " + result.mensagem);
      }
    } catch (error) {
      console.error("Erro na requisição", error);
      setMensagem("Erro de conexão com o servidor");
    }
  };

  const diaFormatado = dia ? dia.split("-").reverse().join("/") : "—";

  return (
    <div className="ag-page">
      <header className="nave-bar">
        <div className="logo-titulo">
          <img src={logo} alt="Bio-Óleo" />
          <h1>BIO-ÓLEO</h1>
        </div>

        <nav className="navegacao">
          <a href="#">INICIO</a>
          <a href="#">SOBRE</a>
          <a href="#"><span>AGENDAMENTOS</span></a>
          <a href="#">Minha conta</a>
        </nav>
      </header>

      <main className="ag-main">
        <h1 className="ag-title">Agende sua coleta</h1>
        <p className="ag-subtitle">
          Escolha o dia e o horário. O coletor vai até você buscar o óleo.
        </p>

        <div className="ag-layout">
          <form id="agendamento-form" className="ag-card" onSubmit={handleSubmit}>
            <div className="ag-grid">
              <div className="ag-field">
                <label className="ag-label">Nome</label>
                <input
                  className="ag-input"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="ag-field">
                <label className="ag-label">Telefone</label>
                <input
                  className="ag-input"
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>

              <div className="ag-field">
                <label className="ag-label">Rua / Número</label>
                <div className="ag-row">
                  <input
                    className="ag-input"
                    type="text"
                    placeholder="Rua"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    required
                  />
                  <input
                    className="ag-input"
                    type="number"
                    placeholder="Nº"
                    value={casa}
                    onChange={(e) => setCasa(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ag-field">
                <label className="ag-label">Bairro</label>
                <input
                  className="ag-input"
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  required
                />
              </div>

              <div className="ag-field ag-full">
                <label className="ag-label">Complemento / referência (opcional)</label>
                <input
                  className="ag-input"
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>

              <div className="ag-field">
                <label className="ag-label">Data da coleta</label>
                <input
                  className="ag-input"
                  type="date"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  required
                />
              </div>

              <div className="ag-field">
                <label className="ag-label">Hora</label>
                <input
                  className="ag-input"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
              </div>

              <div className="ag-field ag-full">
                <label className="ag-label">Quantidade estimada de óleo (litros)</label>
                <input
                  className="ag-input"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  required
                />
                <p className="ag-hint">
                  O valor final é pago pela quantidade de litros coletados.
                </p>
              </div>

              <div className="ag-field ag-full">
                <label className="ag-label">Observações (opcional)</label>
                <textarea
                  className="ag-textarea"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>
            </div>

            <button className="ag-button" type="submit">
              Confirmar agendamento
            </button>
          </form>

          <aside className="ag-summary">
            <h2>Resumo do agendamento</h2>
            <div className="ag-summary-item">
              <span>Data</span>
              <strong>{diaFormatado}</strong>
            </div>
            <div className="ag-summary-item">
              <span>Hora</span>
              <strong>{hora || "—"}</strong>
            </div>
            <div className="ag-summary-item">
              <span>Bairro</span>
              <strong>{bairro || "—"}</strong>
            </div>
            <div className="ag-summary-item">
              <span>Óleo estimado</span>
              <strong>{quantidade ? `${quantidade} L` : "—"}</strong>
            </div>
            <div className="ag-summary-note">
              Depois da coleta, você recebe a confirmação do serviço.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}