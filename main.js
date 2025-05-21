// js/main.js
/**
 * @file main.js
 * @description Ponto de entrada principal da aplicação Garagem Inteligente.
 *              Inicializa todos os módulos e features.
 */

import { initGaragemControles } from './garagemControles.js';
import { initRevisaoCarro } from './revisaoCarro.js';
import { initWeatherUI } from './weatherUI.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Garagem Inteligente JS Edition - Carregando...");

    // Inicializa a feature de Controles da Garagem
    initGaragemControles();

    // Inicializa a feature de Revisão do Carro
    initRevisaoCarro();

    // Inicializa a feature de Previsão do Tempo
    initWeatherUI();

    // Foco inicial no input da cidade para previsão, se existir
    const cidadeInputEl = document.getElementById('cidadeInputPrevisao');
    if (cidadeInputEl) {
        cidadeInputEl.focus();
    }

    console.log("Garagem Inteligente JS Edition - Pronta!");
});
