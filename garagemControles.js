// js/features/garagemControles/garagemControles.js
/**
 * @file garagemControles.js
 * @description Lógica para os controles da garagem e status do veículo.
 */
// Você importaria de config.js se tivesse GARAGE_SETTINGS, etc.

// Estado da Garagem (simulado)
let isGarageOpen = false;
let areLightsOn = false;
let isEngineOn = false;

// Elementos do DOM da Garagem
const uiElements = {
    btnToggleGarage: document.getElementById('btnToggleGarage'),
    btnToggleLights: document.getElementById('btnToggleLights'),
    btnToggleEngine: document.getElementById('btnToggleEngine'),
    statusGarageDoor: document.getElementById('statusGarageDoor')?.querySelector('.status-value'),
    statusCarLights: document.getElementById('statusCarLights')?.querySelector('.status-value'),
    statusCarEngine: document.getElementById('statusCarEngine')?.querySelector('.status-value'),
    carImage: document.getElementById('carImage'),
    carLightsOverlay: document.getElementById('carLightsOverlay'),
    engineStatusIndicator: document.getElementById('engineStatusIndicator'),
    engineStatusIndicatorDot: document.getElementById('engineStatusIndicator')?.querySelector('.indicator-dot'),
    engineStatusIndicatorText: document.getElementById('engineStatusIndicator')?.querySelector('.indicator-text'),
};

function updateGarageUI() {
    if (!uiElements.btnToggleGarage) return; // Sai se os elementos não existirem

    // Botões
    uiElements.btnToggleGarage.textContent = isGarageOpen ? 'Fechar Garagem' : 'Abrir Garagem';
    uiElements.btnToggleLights.textContent = areLightsOn ? 'Desligar Luzes' : 'Ligar Luzes';
    uiElements.btnToggleLights.disabled = !isGarageOpen;
    uiElements.btnToggleEngine.textContent = isEngineOn ? 'Desligar Motor' : 'Ligar Motor';
    uiElements.btnToggleEngine.disabled = !isGarageOpen;

    // Textos de Status
    if (uiElements.statusGarageDoor) uiElements.statusGarageDoor.textContent = isGarageOpen ? 'Aberta' : 'Fechada';
    if (uiElements.statusCarLights) uiElements.statusCarLights.textContent = areLightsOn ? 'Acesas' : 'Apagadas';
    if (uiElements.statusCarEngine) uiElements.statusCarEngine.textContent = isEngineOn ? 'Ligado' : 'Desligado';

    // Visual do Carro
    if (uiElements.carImage) {
        uiElements.carImage.classList.toggle('garage-closed', !isGarageOpen);
        uiElements.carImage.classList.toggle('lights-on', isGarageOpen && areLightsOn);
    }
    if (uiElements.carLightsOverlay) {
        uiElements.carLightsOverlay.classList.toggle('active', isGarageOpen && areLightsOn);
    }
    if (uiElements.engineStatusIndicator) {
        uiElements.engineStatusIndicator.classList.toggle('engine-on', isGarageOpen && isEngineOn);
        if(uiElements.engineStatusIndicatorText) uiElements.engineStatusIndicatorText.textContent = (isGarageOpen && isEngineOn) ? 'Motor Ligado' : 'Motor Desligado';
        // A cor do ponto é controlada por CSS através da classe .engine-on
    }
}


function toggleGarageDoor() {
    isGarageOpen = !isGarageOpen;
    if (!isGarageOpen) { // Se fechou a garagem
        areLightsOn = false;
        isEngineOn = false;
    }
    updateGarageUI();
}

function toggleCarLights() {
    if (isGarageOpen) {
        areLightsOn = !areLightsOn;
        updateGarageUI();
    }
}

function toggleCarEngine() {
    if (isGarageOpen) {
        isEngineOn = !isEngineOn;
        updateGarageUI();
    }
}

export function initGaragemControles() {
    if (uiElements.btnToggleGarage) uiElements.btnToggleGarage.addEventListener('click', toggleGarageDoor);
    if (uiElements.btnToggleLights) uiElements.btnToggleLights.addEventListener('click', toggleCarLights);
    if (uiElements.btnToggleEngine) uiElements.btnToggleEngine.addEventListener('click', toggleCarEngine);

    updateGarageUI(); // Estado inicial da UI
    console.log("Módulo de Controles da Garagem inicializado.");
}