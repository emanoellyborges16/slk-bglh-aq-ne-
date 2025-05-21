// server.js
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const apiKey = process.env.OPENWEATHER_API_KEY;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Em produção, restrinja para o domínio do frontend
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/previsao/:cidade', async (req, res) => {
  const { cidade } = req.params;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave da API OpenWeatherMap não configurada no servidor.' });
  }
  if (!cidade) {
    return res.status(400).json({ error: 'Nome da cidade é obrigatório.' });
  }

  const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    console.log(`[Servidor] Buscando previsão para: ${cidade}`);
    const apiResponse = await axios.get(weatherAPIUrl);
    console.log('[Servidor] Dados recebidos da OpenWeatherMap.');
    res.json(apiResponse.data);
  } catch (error) {
    console.error("[Servidor] Erro ao buscar previsão:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Erro ao buscar previsão do tempo no servidor.';
    res.status(status).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
