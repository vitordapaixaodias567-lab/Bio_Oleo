import AgendamentoForm from "./AgendamentosForm";
import Resposta from "./Resposta";
import { useState } from "react";
import "./App.css";

export default function App() {
  const [mensagem, setMensagem] = useState("");

  return (
    <div>
      <AgendamentoForm setMensagem={setMensagem} />
      <Resposta mensagem={mensagem} />
    </div>
  );
}