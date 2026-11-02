export default function Resposta({ mensagem, setMensagem }) {
    if (!mensagem) return null;

    // clique na mensagem para fechar
    return <p id="resposta" onClick={() => setMensagem("")}>{mensagem}</p>
}
