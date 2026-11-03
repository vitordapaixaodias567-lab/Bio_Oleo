import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const PORT = 3000;

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "agendamento",
};

app.use(express.json());
app.use(cors());

app.post("/salvar-agendamento", async (req, res) => {
    const {
        nome,
        telefone,
        dia,
        hora,
        rua,
        casa,
        bairro,
        complemento,
        quantidade_litros,
        observacoes,
    } = req.body;

    if (!nome || !telefone || !dia || !hora || !rua || !casa || !bairro || !quantidade_litros) {
        return res
            .status(400)
            .json({ sucesso: false, mensagem: "Preencha todos os campos." });
    }

    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        const insertQuery = `
            INSERT INTO agendamentos (nome, telefone, dia, hora, rua, casa, bairro, complemento, quantidade_litros, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.execute(insertQuery, [
            nome,
            telefone,
            dia,
            hora,
            rua,
            casa,
            bairro,
            complemento || null,
            quantidade_litros,
            observacoes || null,
        ]);

        const mensagem = `Olá ${nome}, aguardamos você no dia ${dia} às ${hora} horas.`;

        res.status(200).json({
            sucesso: true,
            id: result.insertId,
            mensagem,
        });
    } catch (err) {
        console.error("Erro ao processar o agendamento:", err);
        res
            .status(500)
            .json({ sucesso: false, mensagem: "Erro ao salvar o agendamento" });
    } finally {
        if (connection) await connection.end();
    }
});

app.get("/listar-agendamento", async (_req, res) => {
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute("SELECT * FROM agendamentos");
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erro ao listar o agendamento:", err);
        res
            .status(500)
            .json({ mensagem: "Erro interno ao buscar o agendamento" });
    } finally {
        if (connection) await connection.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});