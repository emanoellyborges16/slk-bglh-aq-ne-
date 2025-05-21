// js/weatherService.js
/**
 * @file weatherService.js
 * @description Serviço para buscar dados de previsão do tempo usando OpenWeatherMap API.
 */

const API_KEY = '6e5bfd748da14668a0f80594decf83d6'; // Chave de API fornecida pelo usuário
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export async function fetchWeatherForecast(city) {
    if (!city) {
        throw new Error('Cidade não informada');
    }
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Chave de API não autorizada. Verifique sua chave no OpenWeatherMap.');
        }
        throw new Error(`Erro ao buscar previsão do tempo: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}
