import express from "express";
import cors from "cors";
import financeiroRotas from "./rotas/financeiroRotas.js";

const app = express();
const port = process.env["PORT"] ?? 3000;

app.use(cors());
app.use(express.json());
app.use("/financeiro", financeiroRotas);

app.get("/", (req, res) => {
    res.send("SportSync API funcionando");
});

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "sportsync-api",
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
