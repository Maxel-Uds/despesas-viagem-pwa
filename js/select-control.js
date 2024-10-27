const moedaTo = document.getElementById('moeda-to');
const moedaFrom = document.getElementById('moeda-from');

/**
 * @param {string} moneyCodeTo 
 * @param {HTMLElement} moneyCodeFrom 
 */

function sincronizarMoedas(moneyCodeTo, selectCodeFromElement) {
    if(moneyCodeTo === selectCodeFromElement.value) 
        selectCodeFromElement.value = moneyCodeTo === 'USD' ? 'BRL': 'USD';
}

moedaTo.addEventListener('change', function () {
    sincronizarMoedas(this.value, document.getElementById('moeda-from'));
});

moedaFrom.addEventListener('change', function () {
    sincronizarMoedas(this.value, document.getElementById('moeda-to'));
});