import { useState } from "react";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const LOCAIS = {
  residencia: { nome: "Residência", quantidades: [5, 10, 20, 50], padrao: 20 },
  comercial: { nome: "Restaurante, condomínio ou indústria", quantidades: [50, 100, 200, 500], padrao: 100 },
};

// "2026-11-05"
function paraTexto(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function AgendamentoForm({ setMensagem }) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [tipoLocal, setTipoLocal] = useState("residencia");
  const [endereco, setEndereco] = useState("");
  const [quantidade, setQuantidade] = useState(20);
  const [observacoes, setObservacoes] = useState("");
  const [dia, setDia] = useState(null); // objeto Date
  const [mes, setMes] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));

  // A empresa não trabalha sábado e domingo
  const diaDisponivel = (d) => d > hoje && d.getDay() !== 0 && d.getDay() !== 6;

  const escolherLocal = (tipo) => {
    setTipoLocal(tipo);
    setQuantidade(LOCAIS[tipo].padrao);
  };

  const mudarMes = (valor) => {
    setMes(new Date(mes.getFullYear(), mes.getMonth() + valor, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (endereco.trim().length < 8) {
      setMensagem("Informe o endereço completo da coleta.");
      return;
    }
    if (!dia) {
      setMensagem("Escolha uma data para a coleta.");
      return;
    }

    setMensagem("Aguarde, processando seu agendamento...");

    const dadosAgendamentos = {
      tipoLocal,
      endereco,
      quantidade,
      observacoes,
      dia: paraTexto(dia),
    };

    try {
      const response = await fetch("http://localhost:3000/salvar-agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAgendamentos),
      });

      const result = await response.json();

      if (response.ok) {
        setMensagem(result.message);
      } else {
        setMensagem("Erro ao agendar: " + result.message);
      }
    } catch (error) {
      console.error("Erro na requisição", error);
      setMensagem("Erro de conexão com o servidor");
    }
  };

  // ----- monta os dias do calendário -----
  const vazios = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay();
  const totalDias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const diasDoMes = [];
  for (let i = 1; i <= totalDias; i++) {
    diasDoMes.push(new Date(mes.getFullYear(), mes.getMonth(), i));
  }

  return (
    <div className="layout">
      <form className="card" id="agendamento-form" onSubmit={handleSubmit}>

        <div className="field">
          <span className="label">Tipo de local</span>
          <div className="toggle-group">
            <button type="button"
              className={tipoLocal === "residencia" ? "pill active" : "pill"}
              onClick={() => escolherLocal("residencia")}>
              Residência
            </button>
            <button type="button"
              className={tipoLocal === "comercial" ? "pill active" : "pill"}
              onClick={() => escolherLocal("comercial")}>
              Restaurante, condomínio ou indústria
            </button>
          </div>
        </div>

        <div className="columns">

          <div className="col">
            <div className="field">
              <label className="label">Endereço da coleta</label>
              <div className="input-wrap">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ffcf1f"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <input
                  type="text"
                  value={endereco}
                  placeholder="Rua, número, bairro e cidade"
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <span className="label">Quantidade estimada de óleo</span>
              <div className="qty-group">
                {LOCAIS[tipoLocal].quantidades.map((litros) => (
                  <button type="button" key={litros}
                    className={litros === quantidade ? "qty active" : "qty"}
                    onClick={() => setQuantidade(litros)}>
                    {litros} L
                  </button>
                ))}
              </div>
              <small className="hint">O valor final é pago pela quantidade de litros coletados.</small>
            </div>

            <div className="field">
              <label className="label">Observações (opcional)</label>
              <textarea
                rows="3"
                maxLength="200"
                value={observacoes}
                placeholder="Ex.: deixar a bombona ao lado do portão."
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>

          <div className="col">
            <div className="field">
              <span className="label">Data da coleta</span>
              <div className="calendar">
                <div className="cal-head">
                  <button type="button" disabled={mes <= mesAtual} onClick={() => mudarMes(-1)}>&lsaquo;</button>
                  <strong>{MESES[mes.getMonth()]} {mes.getFullYear()}</strong>
                  <button type="button" onClick={() => mudarMes(1)}>&rsaquo;</button>
                </div>

                <div className="cal-grid cal-week">
                  <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                </div>

                <div className="cal-grid">
                  {Array.from({ length: vazios }, (_, i) => <span key={"v" + i}></span>)}

                  {diasDoMes.map((d) => {
                    let classe = "day";
                    if (d.getTime() === hoje.getTime()) classe += " today";
                    if (dia && d.getTime() === dia.getTime()) classe += " selected";

                    return (
                      <button type="button" key={d.getDate()} className={classe}
                        disabled={!diaDisponivel(d)}
                        onClick={() => { setDia(d); setMensagem(""); }}>
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
              <small className="hint">Coletas de segunda a sexta. Sábados e domingos a empresa não atende.</small>
            </div>
          </div>

        </div>

        <input type="submit" className="btn-confirm" value="Confirmar agendamento" />
      </form>

      <aside className="summary">
        <h2>Resumo do agendamento</h2>
        <dl>
          <div><dt>Local</dt><dd>{LOCAIS[tipoLocal].nome}</dd></div>
          <div>
            <dt>Data</dt>
            <dd>{dia ? `${DIAS_SEMANA[dia.getDay()]}, ${dia.getDate()} de ${MESES[dia.getMonth()].toLowerCase()}` : "—"}</dd>
          </div>
          <div><dt>Óleo estimado</dt><dd>{quantidade} L</dd></div>
        </dl>
        <p className="summary-note">
          <i></i>
          A empresa vai confirmar o horário da coleta. Depois, você recebe a nota fiscal e acompanha o veículo em tempo real.
        </p>
      </aside>
    </div>
  );
}
