// js/features/garagemControles/garagemControles.js
/**
 * @file garagemControles.js
 * @description Lógica para os controles da garagem e status do veículo.
 */

let isGarageOpen = false;
let areLightsOn = false;
let isEngineOn = false;

let uiElements = {
    btnToggleGarage: null,
    btnToggleLights: null,
    btnToggleEngine: null,
    statusGarageDoor: null,
    statusCarLights: null,
    statusCarEngine: null,
    carImage: null,
    carLightsOverlay: null,
    engineStatusIndicator: null,
    engineStatusIndicatorDot: null,
    engineStatusIndicatorText: null,
};

function updateGarageUI() {
    if (!uiElements.btnToggleGarage) return;

    uiElements.btnToggleGarage.textContent = isGarageOpen ? 'Fechar Garagem' : 'Abrir Garagem';
    uiElements.btnToggleLights.textContent = areLightsOn ? 'Desligar Luzes' : 'Ligar Luzes';
    uiElements.btnToggleLights.disabled = !isGarageOpen;
    uiElements.btnToggleEngine.textContent = isEngineOn ? 'Desligar Motor' : 'Ligar Motor';
    uiElements.btnToggleEngine.disabled = !isGarageOpen;

    if (uiElements.statusGarageDoor) uiElements.statusGarageDoor.textContent = isGarageOpen ? 'Aberta' : 'Fechada';
    if (uiElements.statusCarLights) uiElements.statusCarLights.textContent = areLightsOn ? 'Acesas' : 'Apagadas';
    if (uiElements.statusCarEngine) uiElements.statusCarEngine.textContent = isEngineOn ? 'Ligado' : 'Desligado';

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
    }
}

function toggleGarageDoor() {
    isGarageOpen = !isGarageOpen;
    if (!isGarageOpen) {
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
    uiElements = {
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

    if (uiElements.btnToggleGarage) uiElements.btnToggleGarage.addEventListener('click', toggleGarageDoor);
    if (uiElements.btnToggleLights) uiElements.btnToggleLights.addEventListener('click', toggleCarLights);
    if (uiElements.btnToggleEngine) uiElements.btnToggleEngine.addEventListener('click', toggleCarEngine);

    updateGarageUI();
    console.log("Módulo de Controles da Garagem inicializado.");
}
