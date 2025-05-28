// js/main.js
/**
 * @file main.js
 * @description Ponto de entrada principal da aplicação Garagem Inteligente.
 *              Inicializa todos os módulos e features.
 */

// Configurações e Mensagens Globais (podem ser usadas por vários módulos)
import { API_KEY_WEATHER, PREVISAO_DEFAULTS, LOCAL_STORAGE_KEYS, UI_MESSAGES } from './config.js';

// Serviços e UI da Previsão do Tempo
import {
    buscarCoordenadas,
    buscarPrevisaoAtual,
    buscarPrevisaoFutura,
    processarDadosPrevisaoFutura
} from './features/previsaoTempo/previsaoTempoService.js';
import {
    exibirErro as exibirErroPrevisao,
    limparErro as limparErroPrevisao,
    toggleResultadosVisibilidade as toggleResultadosPrevisao,
    setBotaoBuscaEstado as setBotaoBuscaPrevisao,
    exibirPrevisaoAtual as exibirPrevisaoAtualUI,
    exibirPrevisaoFutura as exibirPrevisaoFuturaUI,
    atualizarTextoBotaoUnidade as atualizarBotaoUnidadeUI,
    getPrevisaoUIElements
} from './features/previsaoTempo/previsaoTempoUI.js';

// Controles da Garagem
import { initGaragemControles } from './features/garagemControles/garagemControles.js';


// --- Módulo/Namespace para a Feature de Previsão do Tempo ---
const previsaoTempoApp = {
    estado: {
        dadosPrevisaoFutura: null,
        nomeCidadeAtual: '',
        coordsAtuais: { lat: null, lon: null },
        unidadeAtual: PREVISAO_DEFAULTS.UNIT
    },
    ui: getPrevisaoUIElements(), // Pega os elementos do DOM uma vez

    async buscarEExibirPrevisao() {
        if (!this.ui.cidadeInput) return;
        const cidade = this.ui.cidadeInput.value.trim();

        if (!cidade) {
            exibirErroPrevisao(UI_MESSAGES.NO_CITY_INPUT);
            return;
        }
        if (!API_KEY_WEATHER || API_KEY_WEATHER === 'SUA_CHAVE_API_AQUI') {
            exibirErroPrevisao(UI_MESSAGES.API_KEY_MISSING);
            if (this.ui.buscarBtn) this.ui.buscarBtn.disabled = true;
            return;
        }

        limparErroPrevisao();
        toggleResultadosPrevisao(false);
        setBotaoBuscaPrevisao(true);

        try {
            const coords = await buscarCoordenadas(cidade);
            this.estado.nomeCidadeAtual = coords.nome;
            this.estado.coordsAtuais = { lat: coords.lat, lon: coords.lon };

            const [previsaoAtualData, previsaoFuturaRaw] = await Promise.all([
                buscarPrevisaoAtual(coords.lat, coords.lon, this.estado.unidadeAtual),
                buscarPrevisaoFutura(coords.lat, coords.lon, this.estado.unidadeAtual)
            ]);

            this.estado.dadosPrevisaoFutura = processarDadosPrevisaoFutura(previsaoFuturaRaw);
            
            exibirPrevisaoAtualUI(previsaoAtualData, this.estado.nomeCidadeAtual, this.estado.unidadeAtual);
            this.renderizarPrevisaoFutura(); // Usa as opções atuais dos controles
            toggleResultadosPrevisao(true);

        } catch (error) {
            console.error("Erro ao buscar ou processar previsão:", error);
            exibirErroPrevisao(error.message || UI_MESSAGES.GENERIC_ERROR);
            toggleResultadosPrevisao(false);
        } finally {
            setBotaoBuscaPrevisao(false);
        }
    },

    getOpcoesRenderizacao() {
        return {
            numDias: this.ui.filtroDiasSelect ? parseInt(this.ui.filtroDiasSelect.value) : 5,
            destacarChuva: this.ui.destacarChuvaCheck ? this.ui.destacarChuvaCheck.checked : false,
            destacarTempBaixa: this.ui.destacarTempBaixaCheck ? this.ui.destacarTempBaixaCheck.checked : false,
            destacarTempAlta: this.ui.destacarTempAltaCheck ? this.ui.destacarTempAltaCheck.checked : false,
            unidadeAtual: this.estado.unidadeAtual
        };
    },

    renderizarPrevisaoFutura() {
        if (this.estado.dadosPrevisaoFutura) {
            exibirPrevisaoFuturaUI(this.estado.dadosPrevisaoFutura, this.getOpcoesRenderizacao());
        }
    },

    alternarUnidade() {
        this.estado.unidadeAtual = (this.estado.unidadeAtual === 'metric') ? 'imperial' : 'metric';
        atualizarBotaoUnidadeUI(this.estado.unidadeAtual);
        localStorage.setItem(LOCAL_STORAGE_KEYS.WEATHER_UNIT, this.estado.unidadeAtual);

        if (this.estado.nomeCidadeAtual && this.estado.coordsAtuais.lat !== null) {
            this.buscarEExibirPrevisao(); // Re-busca com a cidade atual e nova unidade
        }
    },

    configurarEventListeners() {
        if (this.ui.buscarBtn) this.ui.buscarBtn.addEventListener('click', () => this.buscarEExibirPrevisao());
        if (this.ui.cidadeInput) this.ui.cidadeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.buscarEExibirPrevisao();
        });
        if (this.ui.filtroDiasSelect) this.ui.filtroDiasSelect.addEventListener('change', () => this.renderizarPrevisaoFutura());
        
        const checks = [this.ui.destacarChuvaCheck, this.ui.destacarTempBaixaCheck, this.ui.destacarTempAltaCheck];
        checks.forEach(check => {
            if (check) check.addEventListener('change', () => this.renderizarPrevisaoFutura());
        });

        if (this.ui.unidadeToggleBtn) this.ui.unidadeToggleBtn.addEventListener('click', () => this.alternarUnidade());
    },

    inicializar() {
        const unidadeSalva = localStorage.getItem(LOCAL_STORAGE_KEYS.WEATHER_UNIT);
        if (unidadeSalva && (unidadeSalva === 'metric' || unidadeSalva === 'imperial')) {
            this.estado.unidadeAtual = unidadeSalva;
        }
        atualizarBotaoUnidadeUI(this.estado.unidadeAtual);
        this.configurarEventListeners();

        if (!API_KEY_WEATHER || API_KEY_WEATHER === 'SUA_CHAVE_API_AQUI') {
            exibirErroPrevisao(UI_MESSAGES.API_KEY_MISSING);
            if (this.ui.buscarBtn) this.ui.buscarBtn.disabled = true;
            if (this.ui.cidadeInput) this.ui.cidadeInput.disabled = true;
        }
        console.log("Módulo de Previsão do Tempo (JS Puro) inicializado.");
    }
};


// --- Ponto de Entrada Principal da Aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Garagem Inteligente JS Edition - Carregando...");

    // Inicializa a feature de Previsão do Tempo
    previsaoTempoApp.inicializar();

    // Inicializa a feature de Controles da Garagem
    initGaragemControles();

    // Foco inicial no input da cidade para previsão
    const cidadeInputEl = document.getElementById('cidadeInputPrevisao');
    if (cidadeInputEl) {
        cidadeInputEl.focus();
    }

    console.log("Garagem Inteligente JS Edition - Pronta!");
});