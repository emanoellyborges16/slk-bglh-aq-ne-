// js/weatherUI.js
/**
 * @file weatherUI.js
 * @description Gerencia a interface da previsão do tempo e exibe os resultados.
 */

import { fetchWeatherForecast } from './weatherService.js';

const uiElements = {
    inputCity: null,
    inputDate: null,
    inputTime: null,
    btnFetch: null,
    resultContainer: null,
    errorContainer: null,
};

function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function findForecastForDateTime(forecastList, targetDateTime) {
    // OpenWeatherMap forecast is in 3-hour intervals, find closest
    let closest = null;
    let minDiff = Infinity;
    for (const item of forecastList) {
        const forecastTime = new Date(item.dt_txt);
        const diff = Math.abs(forecastTime - targetDateTime);
        if (diff < minDiff) {
            minDiff = diff;
            closest = item;
        }
    }
    return closest;
}

function displayForecast(forecast) {
    if (!forecast) {
        return '<p>Previsão não disponível para a data e hora selecionadas.</p>';
    }
    const weatherDesc = forecast.weather[0].description;
    const temp = forecast.main.temp.toFixed(1);
    const rain = forecast.rain ? forecast.rain['3h'] : 0;
    const rainText = rain > 0 ? `Sim, ${rain} mm de chuva` : 'Não';

    return `
        <h3>Previsão para ${formatDateTime(forecast.dt_txt)}</h3>
        <p><strong>Condição:</strong> ${weatherDesc}</p>
        <p><strong>Temperatura:</strong> ${temp} °C</p>
        <p><strong>Chuva:</strong> ${rainText}</p>
    `;
}

async function onFetchClick() {
    const city = uiElements.inputCity.value.trim();
    const dateStr = uiElements.inputDate.value;
    const timeStr = uiElements.inputTime.value;

    uiElements.errorContainer.textContent = '';
    uiElements.resultContainer.innerHTML = '<p>Buscando previsão...</p>';

    if (!city) {
        uiElements.errorContainer.textContent = 'Por favor, informe a cidade.';
        uiElements.resultContainer.innerHTML = '';
        return;
    }
    if (!dateStr) {
        uiElements.errorContainer.textContent = 'Por favor, informe a data.';
        uiElements.resultContainer.innerHTML = '';
        return;
    }
    if (!timeStr) {
        uiElements.errorContainer.textContent = 'Por favor, informe a hora.';
        uiElements.resultContainer.innerHTML = '';
        return;
    }

    try {
        console.log(`Buscando previsão para cidade: ${city}`);
        const forecastData = await fetchWeatherForecast(city);
        console.log('Dados recebidos da API:', forecastData);
        const targetDateTime = new Date(`${dateStr}T${timeStr}:00`);
        const forecast = findForecastForDateTime(forecastData.list, targetDateTime);
        uiElements.resultContainer.innerHTML = displayForecast(forecast);
    } catch (error) {
        console.error('Erro ao buscar previsão:', error);
        uiElements.errorContainer.textContent = `Erro: ${error.message}`;
        uiElements.resultContainer.innerHTML = '';
    }
}

export function initWeatherUI() {
    uiElements.inputCity = document.getElementById('weatherCity');
    uiElements.inputDate = document.getElementById('weatherDate');
    uiElements.inputTime = document.getElementById('weatherTime');
    uiElements.btnFetch = document.getElementById('btnFetchWeather');
    uiElements.resultContainer = document.getElementById('weatherResult');
    uiElements.errorContainer = document.getElementById('weatherError');

    if (uiElements.btnFetch) {
        uiElements.btnFetch.addEventListener('click', onFetchClick);
    }
}
