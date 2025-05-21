// js/config.js
/**
 * @file config.js
 * @description Configurações globais, constantes e chaves de API.
 */

// --- Configurações da API OpenWeatherMap ---
// IMPORTANTE: Substitua 'SUA_CHAVE_API_AQUI' pela sua chave real.
export const API_KEY_WEATHER = 'SUA_CHAVE_API_AQUI'; // <<== COLOQUE SUA CHAVE AQUI!!!

export const WEATHER_API_URLS = {
    GEO: 'https://api.openweathermap.org/geo/1.0/direct',
    CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
    FORECAST: 'https://api.openweathermap.org/data/2.5/forecast'
};

// --- Configurações da Previsão do Tempo ---
export const PREVISAO_DEFAULTS = {
    UNIT: 'metric', // 'metric' (Celsius) ou 'imperial' (Fahrenheit)
    LANG: 'pt_br',  // Idioma para as descrições
    MAX_FORECAST_DAYS: 5,
    TEMP_BAIXA_C: 10,
    TEMP_ALTA_C: 30,
    TEMP_BAIXA_F: 50, // ~10°C
    TEMP_ALTA_F: 86   // ~30°C
};

export const LOCAL_STORAGE_KEYS = {
    WEATHER_UNIT: 'garagemInteligenteJS_WeatherUnit'
};

export const UI_MESSAGES = {
    API_KEY_MISSING: "ATENÇÃO: Chave da API OpenWeatherMap não configurada em js/config.js. A previsão do tempo não funcionará.",
    CITY_NOT_FOUND: (cidade) => `Cidade "${cidade}" não encontrada. Verifique o nome.`,
    NETWORK_ERROR: "Erro de rede ao buscar previsão. Verifique sua conexão.",
    API_ERROR: (status, msg) => `Erro na API de previsão (${status}): ${msg || 'Tente mais tarde.'}`,
    GENERIC_ERROR: "Ocorreu um erro inesperado na previsão. Tente novamente.",
    NO_CITY_INPUT: "Por favor, digite o nome de uma cidade."
};

// --- Configurações da Garagem (se houver) ---
// Exemplo:
// export const GARAGE_SETTINGS = {
//     DEFAULT_DOOR_STATE: 'closed', // 'open' or 'closed'
// };

// --- Constantes Gerais da UI ---
// (Pode adicionar aqui se tiver muitas constantes de classes CSS ou IDs)