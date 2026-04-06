function calculateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
        if (t.type === "income") {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });
    const balance = totalIncome - totalExpense;
    document.getElementById("income").innerText = "Income: " + totalIncome;
    document.getElementById("expense").innerText = "Expense: " + totalExpense;
    document.getElementById("balance").innerText = "Balance: " + balance;
}
function displayTransactions(data) {
    let html = `
      <tr>
         <th>Date</th>
         <th>Amount</th>
         <th>Category</th>
         <th>Type</th>
     </tr>   
    `;
    data.forEach(t => {
        html += `
           <tr>
             <td>${t.date}</td>
             <td>${t.amount}</td>
             <td>${t.category}</td>
             <td>${t.type}</td>
           </tr>
        `;
    });
    document.getElementById("transactions").innerHTML = html;
}
document.getElementById("search").addEventListener("input", function(e) {
    const value = e.target.value.toLowerCase();
    const filtered = transactions.filter(t =>
        t.category.toLocaleLowerCase().includes(value)
    );
    displayTransactions(filtered);
});
function createLineChart() {
    const labels = transactions.map(t => t.date);
    const data = transactions.map(t => t.amount);
    new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Transaction Amount",
                data: data,
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#22c55e",
                pointBorderColor: "fff",
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: { size: 14}
                    }
                },
                tooltip: {
                    backgroundColor: "#1e293b",
                    titleColor: "fff",
                    bodyColor: "fff",
                    borderColor: "#4f46e5",
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: { color: "#cbd5f5" },
                    grid: { color: "rgba(255,255,255,0.05)"}
                },
                y: {
                    ticks: { color: "#cbd5f5" },
                    grid: { color: "rbga(255,255,255,0.05)"}
                }
            }
        }
    });
}
function createPieChart() {
    let categoryTotals = {};
    transactions.forEach(t => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
    });
    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "#6366f1",
                    "#22c55e",
                    "#f59e0b",
                    "#ef4444",
                    "#06b6d4",
                    "#a855f7"
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            }
        }
    });
}
function generateInsights() {
    let categoryTotals = {};
    let totalExpense = 0;
    transactions.forEach(t => {
        if(t.type === "expense") {
            categoryTotals[t.category]=
                (categoryTotals[t.category] || 0) + t.amount;
            totalExpense += t.amount;
        }
    });
    let highest = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );
    let avgExpense = Math.round(totalExpense/transactions.length);
    document.getElementById("insights").innerHTML = `
       <b>Highest spending category: </b> ${highest} <br><br>
       <b>Total Expense:</b>₹${totalExpense} <br><br> 
       <b>Average Expense:</b> ₹${avgExpense}
    `; 
    document.getElementById("extraInsight1").innerHTML = 
        "<b>Total Transaction:</b>" + transactions.length;
    document.getElementById("extraInsight2").innerHTML = 
        "<b>Net Balance:</b> ₹" + 
        (transactions.reduce((a,t) => 
            t.type === "income" ? a + t.amount : a-t.amount,0));
}
const roleSelect = document.getElementById("role");
const addBtn = document.getElementById("addBtn");
roleSelect.addEventListener("change", function() {
    const role = roleSelect.value;
    if(role === "admin") {
        addBtn.style.display = "block";
    } else {
        addBtn.style.display = "none";
    }
});
addBtn.addEventListener("click", function() {
    const amount = prompt("Enter amount:");
    const category = prompt("Enter category:");
    const type = prompt("Enter type(income/expense):");
    const newTransaction = {
        date: new Date().toISOString().split("T")[0],
        amount: Number(amount),
        category: category,
        type: type
    };
    transactions.push(newTransaction);
});
function showSection(section) {
    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("transactionsSection").style.display = "none";
    document.getElementById("insightsSection").style.display = "none";
    if (section === "dashboard") {
        document.getElementById("dashboardSection").style.display = "block";
    }
    if (section === "transactions") {
        document.getElementById("transactionsSection").style.display = "block";
    }
    if (section === "insights") {
        document.getElementById("insightsSection").style.display = "block";
    }
}
window.onload = function() {
    calculateSummary()
    displayTransactions(transactions);
    generateInsights();
    createLineChart();
    createPieChart();
    showSection("dashboard");
};