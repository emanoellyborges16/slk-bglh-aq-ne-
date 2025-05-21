// js/utils/helpers.js
/**
 * Capitaliza a primeira letra de uma string.
 * @param {string} str - A string para capitalizar.
 * @returns {string} A string com a primeira letra maiúscula.
 */
export function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || !str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Cria um elemento HTML com atributos e conteúdo de texto opcionais.
 * @param {string} tagName - O nome da tag HTML (ex: 'div', 'p', 'img').
 * @param {object} [attributes={}] - Um objeto com atributos a serem definidos no elemento.
 * @param {string} [textContent=''] - O conteúdo de texto do elemento.
 * @returns {HTMLElement} O elemento HTML criado.
 */
export function createElement(tagName, attributes = {}, textContent = '') {
    const element = document.createElement(tagName);
    for (const key in attributes) {
        if (Object.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// Poderia adicionar debounce, throttle aqui se necessário