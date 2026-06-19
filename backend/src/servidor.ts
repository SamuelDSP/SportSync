import express from "express";
import cors from "cors";
import financeiroRotas from "./rotas/financeiroRotas.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SportSync API funcionando");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
