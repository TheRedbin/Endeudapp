const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Agregar transacción
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Por favor ingresa un texto y un monto');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: parseFloat(amount.value.replace(/\./g, '').replace(',', '.'))
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Generar ID aleatorio
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Agregar transacciones al DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
    ${transaction.text} <span>${sign} ${Math.abs(transaction.amount).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

    list.appendChild(item);
}

// Actualizar el balance, ingresos y gastos
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `$${parseFloat(total).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    money_plus.innerText = `$${parseFloat(income).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    money_minus.innerText = `$${parseFloat(expense).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}


// Remover transacción por ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Actualizar transacciones en el almacenamiento local
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Inicializar la aplicación
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}


//decimales en input
function formatoNumero(input) {
    // Obtener el valor actual del input
    let valor = input.value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos

    // Formatear el número
    valor = formatearNumero(valor);

    // Asignar el valor formateado al input
    input.value = valor;
}

function formatearNumero(amount) {
    // Si el número es mayor o igual a 1000, formatearlo con separadores de miles
    if (parseInt(amount) >= 1000) {
        let numero = parseInt(amount); // Convertir a número
        return numero.toLocaleString(); // Utilizar formato de separadores de miles del navegador
    } else {
        return amount;
    }
}

init();

form.addEventListener('submit', addTransaction);
