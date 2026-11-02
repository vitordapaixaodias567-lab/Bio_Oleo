import express from "express";
import mysql from 'mysql2/promise';
import cors from 'cors';
import { Connection } from "mysql2";

const app = express();
const PORT = 3000;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'agendamento'
};

app.use(express.json());
app.use(cors());

app.post('/salvar-agendamento', async (req, res) => {
   const { tipoLocal, endereco, quantidade, observacoes, dia } = req.body;

   // A empresa não trabalha sábado e domingo
   const diaSemana = new Date(`${dia}T12:00:00`).getDay();
   if (diaSemana === 0 || diaSemana === 6) {
     return res.status(400).json({ message: 'A empresa não faz coletas aos sábados e domingos.' });
   }

   let connection;

   try {
    connection = await mysql.createConnection(dbConfig);

    const insertQuery = `
    INSERT INTO agendamentos (tipo_local, endereco, quantidade, observacoes, dia)
    VALUES (?,?,?,?,?);
    `;
    const [result] = await connection.execute(insertQuery, [tipoLocal, endereco, quantidade, observacoes, dia]);

    const messagem = `Sua coleta de ${quantidade} litros de óleo no endereço ${endereco} está agendada para o dia ${dia}. A empresa vai confirmar o horário com você.`;

    res.status(200).json({ 
        sucesso: true, 
        id: result.insertId,
        message: messagem 
    });

   } catch (err) {
     console.error('Erro ao processar o agendamento ', err);
     res.status(500).json({ message: 'Erro ao salvar o agendamento' });
   } finally {
     if (connection) {
        connection.end();
     }
   }
});

app.get('/listar-agendamento', async(req, res) => {
   let connection;

   try {
     
     connection = await mysql.createConnection(dbConfig);
     console.log('Conectador ao banco Mysql')

     const [rows] = await connection.execute('SELECT * FROM agendamentos');
     res.status(200).json(rows);

   } catch (err) {
      console.error('Erro ao listar o agendamento', err);
      res.status(500).send( {message: 'Erro interno ao buscar o agendamento'})
   } if(connection){
     connection.end();
   };
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});