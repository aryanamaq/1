let expenses = [];
let balances = {};
const members = ['Alice', 'Bob', 'Charlie'];
let formSubmittedOnce = false;

// DOM Elements
const form = document.getElementById('expense-form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const payer = document.getElementById('payer');
const category = document.getElementById('category');
const tableBody = document.getElementById('transaction-table');
const totalExpenses = document.getElementById('total-expenses');
const breakdown = document.getElementById('breakdown');
const noExpensesPlaceholder = document.getElementById("no-expenses-placeholder");
const expensesTable = document.getElementById("expenses-table");

// Navigation
const navHome = document.getElementById('nav-home');
const navExpenses = document.getElementById('nav-expenses');

// Pages
const pages = {
    home: document.getElementById('home-page'),
    expenses: document.getElementById('expenses-page'),
};

function showPage(pageKey) {
    Object.values(pages).forEach(p => p.hidden = true);
    pages[pageKey].hidden = false;
}

// Initialize balances
function initializeBalances() {
    members.forEach(m => {
        balances[m] = {};
        members.forEach(n => {
            if (m !== n) balances[m][n] = 0;
        });
    });
}

// Form validation
function showError(input, message) {
    let error = input.parentNode.querySelector('.error-message');
    if (!error) {
        error = document.createElement('div');
        error.className = 'error-message';
        input.parentNode.appendChild(error);
    }
    error.textContent = message;
}

function clearError(input) {
    const error = input.parentNode.querySelector('.error-message');
    if (error) error.textContent = '';
}

function validateForm() {
    let valid = true;

    if (!formSubmittedOnce) return true;

    if (!description.value.trim()) {
        showError(description, 'Description is required.');
        valid = false;
    } else clearError(description);

    if (!amount.value.trim()) {
        showError(amount, 'Amount is required.');
        valid = false;
    } else if (isNaN(amount.value) || Number(amount.value) <= 0) {
        showError(amount, 'Must be a number greater than 0.');
        valid = false;
    } else clearError(amount);

    if (!payer.value) {
        showError(payer, 'Please select a payer.');
        valid = false;
    } else clearError(payer);

    if (!category.value) {
        showError(category, 'Please select a category.');
        valid = false;
    } else clearError(category);

    return valid;
}

function clearForm() {
    form.reset();
    formSubmittedOnce = false;
}

function updateBreakdown() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalExpenses.innerText = total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    const summary = [];
    members.forEach(from => {
        members.forEach(to => {
            if (from !== to && balances[from][to] > 0) {
                summary.push(`${from} owes ${to}: ${balances[from][to].toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`);
            }
        });
    });

    breakdown.innerHTML = summary.length
        ? summary.map(s => `<p>${s}</p>`).join('')
        : '<p>No balances yet.</p>';
}

function addExpenseToTable(exp) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${exp.description}</td>
        <td>${exp.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        <td>${exp.payer}</td>
        <td>${exp.category}</td>
    `;
    tableBody.appendChild(row);
}

function updateBalances(exp) {
    const share = exp.amount / members.length;
    members.forEach(m => {
        if (m !== exp.payer) {
            balances[m][exp.payer] += share;
            balances[exp.payer][m] -= share;
        }
    });
}

function saveExpensesToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('balances', JSON.stringify(balances));
}

function loadExpensesFromStorage() {
    const storedExpenses = localStorage.getItem('expenses');
    const storedBalances = localStorage.getItem('balances');

    if (storedExpenses) expenses = JSON.parse(storedExpenses);
    if (storedBalances) balances = JSON.parse(storedBalances);

    if (expenses.length === 0) {
        noExpensesPlaceholder.style.display = "block";
        expensesTable.style.display = "none";
    } else {
        expenses.forEach(exp => addExpenseToTable(exp));
        noExpensesPlaceholder.style.display = "none";
        expensesTable.style.display = "table";
    }

    updateBreakdown();
}


form.addEventListener('submit', function (e) {
    e.preventDefault();
    formSubmittedOnce = true;

    if (!validateForm()) return;

    const exp = {
        description: description.value.trim(),
        amount: parseFloat(amount.value),
        payer: payer.value,
        category: category.value
    };

    expenses.push(exp);
    updateBalances(exp);
    addExpenseToTable(exp);

    noExpensesPlaceholder.style.display = "none";
    expensesTable.style.display = "table";

    updateBreakdown();
    clearForm();
    saveExpensesToStorage();
});


// Real-time validation
[description, amount, payer, category].forEach(input => {
    input.addEventListener('input', () => {
        if (formSubmittedOnce) validateForm();
    });
    input.addEventListener('change', () => {
        if (formSubmittedOnce) validateForm();
    });
});

// Navigation
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
});
navExpenses.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('expenses');
});

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initializeBalances();
    loadExpensesFromStorage();
    showPage('home');
});
