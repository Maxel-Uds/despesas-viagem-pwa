const API_KEY = "c89f4303952215935d290275";
const items = [];

document.getElementById('expense-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const descricao = document.getElementById('descricao').value;
    const quantidade = document.getElementById('quantidade').value;
    const valor = document.getElementById('valor').value;
    const moedaTo = document.getElementById('moeda-to').value;
    const moedaFrom = document.getElementById('moeda-from').value;
    const itemId = document.getElementById('button').getAttribute('item-id');

    const item = {
        itemId,
        descricao,
        quantidade,
        valor,
        moedaTo,
        moedaFrom
    };

    adicionarItem(item);
    limparFormulario();
});


async function adicionarItem(despesa) {
    const result = await obterTaxaCambio(despesa.moedaFrom, despesa.moedaTo, despesa.valor, despesa.quantidade)

    if (!despesa.itemId) despesa['itemId'] = Date.now();

    despesa['result'] = result;

    var itemIndex = buscarIndexById(despesa.itemId)

    itemIndex >= 0 ? items[itemIndex] = despesa : items.push(despesa);

    criarListItem(despesa);
    calcularTotal();
}

function calcularTotal() {
    let totalMoedaBRL = 0;
    let totalMoedaUSD = 0;

    items.forEach(despesa => {
        if (despesa.moedaFrom === "USD") {
            totalMoedaUSD += despesa.quantidade * despesa.valor;
            totalMoedaBRL += despesa.result;
        } else {
            totalMoedaUSD += despesa.result;
            totalMoedaBRL += despesa.quantidade * despesa.valor;
        }
    });

    document.getElementById('totalMoedaBRL').textContent = `Total (BRL): ${totalMoedaBRL.toFixed(2)}`;
    document.getElementById('totalMoedaUSD').textContent = `Total (USD): ${totalMoedaUSD.toFixed(2)}`;
}


function limparFormulario() {
    document.getElementById('descricao').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('button').setAttribute('item-id', '');
}

async function obterTaxaCambio(moedaFrom, moedaTo, valor, quantidade) {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${moedaFrom}/${moedaTo}/${valor * quantidade}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.conversion_result;
    } catch (error) {
        console.error('Erro ao obter a taxa de câmbio:', error.message);
        throw error;
    }
}

function criarListItem(despesa) {
    const ul = document.getElementById('despesas');

    if (document.getElementById(despesa.itemId)) {
        ul.removeChild(document.getElementById(despesa.itemId));
    }

    // Ícone de edição
    const editIcon = document.createElement('i');
    editIcon.className = 'fas fa-edit icon-manage';
    editIcon.onclick = () => editarItem(despesa);

    // Ícone de exclusão
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash icon-manage';
    deleteIcon.onclick = () => deletarItem(despesa.itemId);

    const iconDiv = document.createElement('div');
    iconDiv.className = 'div-icon';

    iconDiv.appendChild(editIcon);
    iconDiv.appendChild(deleteIcon);

    const li = document.createElement('li');

    li.textContent = `${despesa.descricao} (Qtd. ${despesa.quantidade}): ${despesa.valor * despesa.quantidade} ${despesa.moedaFrom} => ${despesa.result.toFixed(2)} ${despesa.moedaTo}`;

    li.setAttribute('id', despesa.itemId)
    li.appendChild(iconDiv);

    ul.appendChild(li);
}

function editarItem(despesa) {
    document.getElementById('descricao').value = despesa.descricao;
    document.getElementById('quantidade').value = despesa.quantidade;
    document.getElementById('valor').value = despesa.valor;
    document.getElementById('button').setAttribute('item-id', despesa.itemId);
}

function deletarItem(id) {
    var confirmacao = confirm("Tem certeza que deseja excluir este item?");
    
    if (confirmacao) {
        var itemIndex = buscarIndexById(id);
        items.splice(itemIndex, 1);

        var deletedItemTag = document.getElementById(id);
        var lista = document.getElementById('despesas');

        lista.removeChild(deletedItemTag);
        calcularTotal();
    }
}

function buscarIndexById(id) {
    return items.findIndex(despesa => despesa.itemId === id);
}