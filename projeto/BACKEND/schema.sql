CREATE DATABASE IF NOT EXISTS agendamento;
USE agendamento;

DROP TABLE IF EXISTS agendamentos;

CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_local VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    observacoes VARCHAR(200),
    dia DATE NOT NULL
);
