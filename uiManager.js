// js/features/previsaoTempo/previsaoTempoService.js
/**
 * @file previsaoTempoService.js
 * @description Lógica de serviço para a feature de Previsão do Tempo (API calls, processamento de dados).
 */
import { API_KEY_WEATHER, WEATHER_API_URLS, PREVISAO_DEFAULTS, UI_MESSAGES } from '../../config.js';

/**
 * Função genérica para fetch de dados da API.
 */
async function fetchData(url, errorMessageContext) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorData = { message: response.statusText };
            try { errorData = await response.json(); } catch (e) { /* ignore */ }
            console.error(`${errorMessageContext} - Status: ${response.status}`, errorData);
            throw new Error(UI_MESSAGES.API_ERROR(response.status, errorData.message));
        }
        return await response.json();
    } catch (error) {
        if (error.message.startsWith("Erro na API")) throw error;
        console.error(`Network/other error for ${url}:`, error);
        throw new Error(UI_MESSAGES.NETWORK_ERROR);
    }
}

export async function buscarCoordenadas(cidade) {
    if (!API_KEY_WEATHER || API_KEY_WEATHER === 'SUA_CHAVE_API_AQUI') {
        throw new Error(UI_MESSAGES.API_KEY_MISSING);
    }
    const url = `${WEATHER_API_URLS.GEO}?q=${encodeURIComponent(cidade)}&limit=1&appid=${API_KEY_WEATHER}`;
    const data = await fetchData(url, `Geo for "${cidade}"`);
    if (!data || data.length === 0) throw new Error(UI_MESSAGES.CITY_NOT_FOUND(cidade));
    const nome = (data[0].local_names && data[0].local_names.pt) ? data[0].local_names.pt : data[0].name;
    return { lat: data[0].lat, lon: data[0].lon, nome };
}

export async function buscarPrevisaoAtual(lat, lon, units) {
    const url = `${WEATHER_API_URLS.CURRENT}?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=${units}&lang=${PREVISAO_DEFAULTS.LANG}`;
    return fetchData(url, "Current Weather");
}

export async function buscarPrevisaoFutura(lat, lon, units) {
    const url = `${WEATHER_API_URLS.FORECAST}?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=${units}&lang=${PREVISAO_DEFAULTS.LANG}`;
    return fetchData(url, "Forecast Weather");
}

export function processarDadosPrevisaoFutura(apiData) {
    if (!apiData || !apiData.list || apiData.list.length === 0) return [];
    const previsoesDiarias = {};
    apiData.list.forEach(item => {
        const diaKey = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!previsoesDiarias[diaKey]) {
            previsoesDiarias[diaKey] = {
                dataObj: new Date(item.dt * 1000), tempsMin: [], tempsMax: [],
                descricoes: {}, icones: {}, umidades: [], ventos: [], chuvas: []
            };
        }
        const d = previsoesDiarias[diaKey];
        d.tempsMin.push(item.main.temp_min);
        d.tempsMax.push(item.main.temp_max);
        d.umidades.push(item.main.humidity);
        d.ventos.push(item.wind.speed);
        d.descricoes[item.weather[0].description] = (d.descricoes[item.weather[0].description] || 0) + 1;
        d.icones[item.weather[0].icon.replace('n', 'd')] = (d.icones[item.weather[0].icon.replace('n', 'd')] || 0) + 1;
        d.chuvas.push((item.rain && item.rain['3h'] > 0) || item.weather[0].main.toLowerCase().includes('rain') || item.weather[0].main.toLowerCase().includes('drizzle'));
    });

    return Object.values(previsoesDiarias).map(d => {
        const desc = Object.keys(d.descricoes).length > 0 ? Object.keys(d.descricoes).reduce((a, b) => d.descricoes[a] > d.descricoes[b] ? a : b) : 'N/A';
        const icon = Object.keys(d.icones).length > 0 ? Object.keys(d.icones).reduce((a, b) => d.icones[a] > d.icones[b] ? a : b) : '01d';
        return {
            dataFormatada: d.dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            diaSemana: d.dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
            tempMin: d.tempsMin.length > 0 ? Math.min(...d.tempsMin) : 0,
            tempMax: d.tempsMax.length > 0 ? Math.max(...d.tempsMax) : 0,
            descricaoPrincipal: desc,
            iconePrincipal: icon,
            umidadeMedia: d.umidades.length > 0 ? d.umidades.reduce((s, v) => s + v, 0) / d.umidades.length : 0,
            chove: d.chuvas.some(c => c)
        };
    }).slice(0, PREVISAO_DEFAULTS.MAX_FORECAST_DAYS);
}