// js/revisaoCarro.js
/**
 * @file revisaoCarro.js
 * @description Lógica para marcar e exibir a revisão do carro.
 */

const STORAGE_KEY = 'carRevision';

const uiElements = {
    inputDate: null,
    inputNotes: null,
    btnSave: null,
    displayRevision: null,
    btnConfirmPayment: null,
    paymentStatus: null,
};

function loadRevision() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }
    return null;
}

function saveRevision(revision) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(revision));
}

function updateDisplay() {
    const revision = loadRevision();
    if (!uiElements.displayRevision) return;

    if (revision && revision.date) {
        uiElements.displayRevision.innerHTML = `
            <p><strong>Próxima Revisão:</strong> ${revision.date}</p>
            <p><strong>Notas:</strong> ${revision.notes || 'Nenhuma'}</p>
        `;
    } else {
        uiElements.displayRevision.textContent = 'Nenhuma revisão marcada.';
    }

    if (uiElements.paymentStatus) {
        if (revision && revision.paymentConfirmed) {
            uiElements.paymentStatus.style.display = 'block';
        } else {
            uiElements.paymentStatus.style.display = 'none';
        }
    }
}

function onSaveClick() {
    if (!uiElements.inputDate) return;

    const date = uiElements.inputDate.value;
    const notes = uiElements.inputNotes ? uiElements.inputNotes.value : '';

    if (!date) {
        alert('Por favor, selecione uma data para a revisão.');
        return;
    }

    // Reset payment confirmation on new save
    saveRevision({ date, notes, paymentConfirmed: false });
    updateDisplay();
    alert('Revisão salva com sucesso!');
}

function onConfirmPaymentClick() {
    const revision = loadRevision();
    if (!revision) {
        alert('Nenhuma revisão marcada para confirmar pagamento.');
        return;
    }
    revision.paymentConfirmed = true;
    saveRevision(revision);
    updateDisplay();
    alert('Pagamento confirmado com sucesso!');
}

export function initRevisaoCarro() {
    uiElements.inputDate = document.getElementById('revisionDate');
    uiElements.inputNotes = document.getElementById('revisionNotes');
    uiElements.btnSave = document.getElementById('btnSaveRevision');
    uiElements.displayRevision = document.getElementById('revisionDisplay');
    uiElements.btnConfirmPayment = document.getElementById('btnConfirmPayment');
    uiElements.paymentStatus = document.getElementById('paymentStatus');

    if (uiElements.btnSave) {
        uiElements.btnSave.addEventListener('click', onSaveClick);
    }
    if (uiElements.btnConfirmPayment) {
        uiElements.btnConfirmPayment.addEventListener('click', onConfirmPaymentClick);
    }

    updateDisplay();
    console.log('Módulo de Revisão do Carro inicializado.');
}
