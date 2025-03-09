const financeForm = document.getElementById('finance-form');
const financeTable = document.getElementById('finance-table').getElementsByTagName('tbody')[0];
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const balance = document.getElementById('balance');
const financeChart = document.getElementById('financeChart').getContext('2d');

let entries = [];
let chart;

financeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;

    const entry = { date, type, amount, description };
    entries.push(entry);
    updateTable();
    updateTotals();
    updateChart();
    financeForm.reset();
});

function updateTable() {
    financeTable.innerHTML = '';
    entries.forEach((entry, index) => {
        const row = financeTable.insertRow();
        row.insertCell(0).innerText = entry.date;
        row.insertCell(1).innerText = entry.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
        row.insertCell(2).innerText = entry.amount;
        row.insertCell(3).innerText = entry.description;
        const deleteCell = row.insertCell(4);
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus';
        deleteButton.onclick = () => deleteEntry(index);
        deleteCell.appendChild(deleteButton);
    });
}

function deleteEntry(index) {
    entries.splice(index, 1);
    updateTable();
    updateTotals();
    updateChart();
}

function updateTotals() {
    const totalInc = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExp = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    totalIncome.innerText = totalInc;
totalExpense.innerText = totalExp;
    balance.innerText = totalInc - totalExp;
}

function updateChart() {
    const totalInc = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExp = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(financeChart, {
        type: 'pie',
        data: {
            labels: ['Pemasukan', 'Pengeluaran'],
            datasets: [{
                data: [totalInc, totalExp],
                backgroundColor: ['#4CAF50', '#f44336'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Grafik Pemasukan dan Pengeluaran'
                }
            }
        }
    });
}