// js/features/previsaoTempo/previsaoTempoUI.js
/**
 * @file previsaoTempoUI.js
 * @description Manipulação do DOM específica para a feature de Previsão do Tempo.
 */
import { PREVISAO_DEFAULTS } from '../../config.js';
import { capitalizeFirstLetter, createElement } from '../../utils/helpers.js';

// Elementos do DOM da Previsão (com sufixo 'Previsao' nos IDs do HTML)
const uiElements = {
    erroContainer: document.getElementById('erroContainerPrevisao'),
    nomeCidadeAtual: document.getElementById('nomeCidadeAtualPrevisao'),
    previsaoAtualContainer: document.getElementById('previsaoAtualContainerPrevisao'),
    previsaoDetalhadaContainer: document.getElementById('previsaoDetalhadaContainerPrevisao'),
    controlesInterativos: document.getElementById('controles-interativos-previsao'),
    climaAtualSection: document.getElementById('clima-atual-previsao'),
    previsaoFuturaSection: document.getElementById('previsao-futura-previsao'),
    buscarBtn: document.getElementById('buscarBtnPrevisao'),
    cidadeInput: document.getElementById('cidadeInputPrevisao'),
    filtroDiasSelect: document.getElementById('filtroDiasPrevisao'),
    destacarChuvaCheck: document.getElementById('destacarChuvaPrevisao'),
    destacarTempBaixaCheck: document.getElementById('destacarTempBaixaPrevisao'),
    destacarTempAltaCheck: document.getElementById('destacarTempAltaPrevisao'),
    unidadeToggleBtn: document.getElementById('unidadeToggleBtnPrevisao')
};

export function exibirErro(mensagem) {
    if (uiElements.erroContainer) {
        uiElements.erroContainer.textContent = mensagem;
        uiElements.erroContainer.style.display = 'block';
    }
}

export function limparErro() {
    if (uiElements.erroContainer) {
        uiElements.erroContainer.textContent = '';
        uiElements.erroContainer.style.display = 'none';
    }
}

export function toggleResultadosVisibilidade(mostrar) {
    const display = mostrar ? 'block' : 'none';
    const flexDisplay = mostrar ? 'flex' : 'none'; // Para controles com grid
    if (uiElements.climaAtualSection) uiElements.climaAtualSection.style.display = display;
    if (uiElements.previsaoFuturaSection) uiElements.previsaoFuturaSection.style.display = display;
    if (uiElements.controlesInterativos) uiElements.controlesInterativos.style.display = mostrar ? flexDisplay : 'none';
}

export function setBotaoBuscaEstado(isLoading, loadingText = 'Buscando...', defaultText = 'Ver Previsão') {
    if (uiElements.buscarBtn) {
        uiElements.buscarBtn.disabled = isLoading;
        const textSpan = uiElements.buscarBtn.querySelector('.button-text');
        if (textSpan) textSpan.textContent = isLoading ? loadingText : defaultText;
        else uiElements.buscarBtn.textContent = isLoading ? loadingText : defaultText;
    }
}

export function exibirPrevisaoAtual(data, nomeCidade, unidadeAtual) {
    if (!uiElements.previsaoAtualContainer || !uiElements.nomeCidadeAtual) return;
    if (!data) {
        uiElements.previsaoAtualContainer.innerHTML = '<p class="placeholder-text">Dados do tempo atual indisponíveis.</p>';
        uiElements.nomeCidadeAtual.textContent = '';
        return;
    }
    const tempUn = unidadeAtual === 'metric' ? '°C' : '°F';
    const ventoUn = unidadeAtual === 'metric' ? 'm/s' : 'mph';
    uiElements.nomeCidadeAtual.textContent = nomeCidade;
    uiElements.previsaoAtualContainer.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p><strong>Temperatura:</strong> ${data.main.temp.toFixed(1)}${tempUn}</p>
        <p><strong>Sensação:</strong> ${data.main.feels_like.toFixed(1)}${tempUn}</p>
        <p><strong>Condição:</strong> ${capitalizeFirstLetter(data.weather[0].description)}</p>
        <p><strong>Umidade:</strong> ${data.main.humidity}%</p>
        <p><strong>Vento:</strong> ${data.wind.speed.toFixed(1)} ${ventoUn}</p>
    `;
}

export function exibirPrevisaoFutura(previsoes, opcoes) {
    if (!uiElements.previsaoDetalhadaContainer) return;
    if (!previsoes || previsoes.length === 0) {
        uiElements.previsaoDetalhadaContainer.innerHTML = '<p class="placeholder-text">Previsão futura indisponível.</p>';
        return;
    }
    const { numDias, destacarChuva, destacarTempBaixa, destacarTempAlta, unidadeAtual } = opcoes;
    const tempUn = unidadeAtual === 'metric' ? '°C' : '°F';
    const limBaixa = unidadeAtual === 'metric' ? PREVISAO_DEFAULTS.TEMP_BAIXA_C : PREVISAO_DEFAULTS.TEMP_BAIXA_F;
    const limAlta = unidadeAtual === 'metric' ? PREVISAO_DEFAULTS.TEMP_ALTA_C : PREVISAO_DEFAULTS.TEMP_ALTA_F;
    let html = '';

    previsoes.slice(0, numDias).forEach(dia => {
        let classes = 'weather-card';
        if (destacarChuva && dia.chove) classes += ' dia-chuvoso';
        if (destacarTempBaixa && dia.tempMin < limBaixa) classes += ' temp-baixa';
        if (destacarTempAlta && dia.tempMax > limAlta) classes += ' temp-alta';
        html += `
            <div class="${classes}">
                <h4>${capitalizeFirstLetter(dia.diaSemana)} (${dia.dataFormatada})</h4>
                <img src="https://openweathermap.org/img/wn/${dia.iconePrincipal}@2x.png" alt="${dia.descricaoPrincipal}">
                <p>${capitalizeFirstLetter(dia.descricaoPrincipal)}</p>
                <p>Max: ${dia.tempMax.toFixed(1)}${tempUn}</p>
                <p>Min: ${dia.tempMin.toFixed(1)}${tempUn}</p>
                <p>Umidade: ${dia.umidadeMedia.toFixed(0)}%</p>
                ${dia.chove ? '<p class="alerta-chuva">Chuva</p>' : ''}
            </div>`;
    });
    uiElements.previsaoDetalhadaContainer.innerHTML = html || '<p class="placeholder-text">Sem dados para os filtros.</p>';
}

export function atualizarTextoBotaoUnidade(unidadeAtual) {
    if (uiElements.unidadeToggleBtn) {
        const texto = unidadeAtual === 'metric' ? 'Alternar para Fahrenheit (°F)' : 'Alternar para Celsius (°C)';
        uiElements.unidadeToggleBtn.textContent = texto;
    }
}

export function getPrevisaoUIElements() {
    return uiElements;
}