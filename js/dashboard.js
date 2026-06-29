document.addEventListener("DOMContentLoaded", () => {
  let cashFlowChart = null;
  const dashboardLink = document.getElementById("nav-dashboard");
  const settingsLink = document.getElementById("nav-settings");
  const dashboardSection = document.getElementById("dashboard-page");
  const settingsSection = document.getElementById("settings-page");

  // Restore last page (active) from localStorage 
  const lastPage = localStorage.getItem("activePage") || "dashboard";
  showPage(
    lastPage,
    dashboardLink,
    settingsLink,
    dashboardSection,
    settingsSection,
  );

  if (settingsLink && dashboardLink) {
    settingsLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("activePage", "settings");
      showPage(
        "settings",
        dashboardLink,
        settingsLink,
        dashboardSection,
        settingsSection,
      );
    });

    dashboardLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("activePage", "dashboard");
      showPage(
        "dashboard",
        dashboardLink,
        settingsLink,
        dashboardSection,
        settingsSection,
      );
    });
  }

  // settings
  const fullnameInput = document.querySelector("#full-name");
  const currencySelect = document.querySelector("#currency");
  const saveBtn = document.querySelector(".save-btn");
  const loggedInUser = getLoggedInUser();


  if (loggedInUser && fullnameInput && currencySelect) {
    fullnameInput.value = loggedInUser.username || "";
    currencySelect.value = loggedInUser.currency || "USD ($)";

    saveBtn.addEventListener("click", () => {
      const updatedName = fullnameInput.value.trim();
      const updatedCurrency = currencySelect.value;

      loggedInUser.username = updatedName;
      loggedInUser.currency = updatedCurrency;

      setLoggedInUser(loggedInUser);

      const users = getAllUsers();
      const index = users.findIndex((user) => user.id === loggedInUser.id);
      if (index !== -1) {
        users[index] = loggedInUser;
        saveUsers(users);
      }
      alert("Profile updated successfully.");
    });
  }

  // Transaction modal 
  const addTransaction = document.querySelector("#add-transaction-btn");
  const transactionModal = document.querySelector("#transaction-modal");
  const closeModalBtn = document.querySelector("#close-modal-btn");
  const modal = document.querySelector("#transaction-modal");
  let editingTransactionId = null;

  if (addTransaction && transactionModal && closeModalBtn) {
    addTransaction.addEventListener("click", () => {
      editingTransactionId = null;
      if (document.querySelector("#transaction-form")) {
        document.querySelector("#transaction-form").reset();
      }
      
      const dateInput = document.querySelector("#date");
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }

      document.querySelector("#transaction-modal h1").textContent =
        "Add Transaction";
      transactionModal.classList.add("show-modal");
    });

    closeModalBtn.addEventListener("click", () => {
      transactionModal.classList.remove("show-modal");
      editingTransactionId = null;
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        transactionModal.classList.remove("show-modal");
        editingTransactionId = null;
      }
    });
  }

  // add transaction

  const transactionForm = document.querySelector("#transaction-form");

  if (transactionForm) {
    transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const type = document.querySelector("#type").value;
      const description = document.querySelector("#description").value.trim();
      const amount = parseFloat(document.querySelector("#amount").value);
      const date = document.querySelector("#date").value;
      const category = document.querySelector("#category").value;

      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      if (!description || !amount || !date || !category) {
        alert("All fields are required.");
        return;
      }

      const transaction = {
        id: editingTransactionId ? editingTransactionId : Date.now(),
        type,
        description,
        amount,
        date,
        category,
      };

      const loggedInUser = getLoggedInUser();
      const transactions = loggedInUser.transactions || [];

      const users = getAllUsers();
      const index = users.findIndex((user) => user.id === loggedInUser.id);

      if (index !== -1) {
        if (editingTransactionId) {
          const txIndex = transactions.findIndex(
            (t) => t.id === editingTransactionId,
          );
          if (txIndex !== -1) {
            transactions[txIndex] = transaction;
          }
        } else {
          transactions.push(transaction);
        }

        users[index].transactions = transactions;
        saveUsers(users);
        setLoggedInUser(users[index]);
      }
      transactionForm.reset();
      editingTransactionId = null;
      transactionModal.classList.remove("show-modal");
      updateDashboard();
    });
  }

  function updateDashboard() {
    const user = getLoggedInUser();

    // if (!loggedInUser.transactions) {
    //   loggedInUser.transactions = [];
    // }

    // loggedInUser.transactions.push(transaction);

    const transactions = user.transactions || [];
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    const currentBalance = totalIncome - totalExpense;
    document.querySelector("#stat-balance").textContent =
      `$${currentBalance.toFixed(2)}`;
    document.querySelector("#stat-income").textContent =
      `$${totalIncome.toFixed(2)}`;
    document.querySelector("#stat-expense").textContent =
      `$${totalExpense.toFixed(2)}`;
    document.querySelector("#stat-count").textContent = transactions.length;

    renderChart(totalIncome, totalExpense);
    renderTransactionsList();
  }

  function renderChart(income, expense) {
    const ctx = document.getElementById("chart");
    if (!ctx) return;

    if (cashFlowChart) {
      cashFlowChart.data.datasets[0].data = [income];
      cashFlowChart.data.datasets[1].data = [expense];
      cashFlowChart.update();
    } else {
      cashFlowChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Income vs Expenses"],
          datasets: [
            {
              label: "Income",
              data: [income],
              backgroundColor: "#057a55", 
              barPercentage: 0.8,
              categoryPercentage: 0.5,
            },
            {
              label: "Expenses",
              data: [expense],
              backgroundColor: "#c81e1e", 
              barPercentage: 0.8,
              categoryPercentage: 0.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }
  }
  function renderTransactionsList() {
    const tbody = document.querySelector("#transactions-list");
    const loggedInUser = getLoggedInUser();
    const transactions = loggedInUser.transactions || [];

    tbody.innerHTML = "";

    transactions.forEach((transaction) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td class="${transaction.type === "income" ? "text-green" : "text-red"}">
          ${transaction.type === "income" ? "+" : "-"}$${transaction.amount.toFixed(2)}
        </td>
        <td>
          <button class="edit-btn"><i class="ri-pencil-fill"></i></button>
          <button class="delete-btn"><i class="ri-delete-bin-7-line"></i></button>
        </td>
      `;

      // Edit 
      row.querySelector(".edit-btn").addEventListener("click", () => {
        editingTransactionId = transaction.id;
        document.querySelector("#type").value = transaction.type;
        document.querySelector("#description").value = transaction.description;
        document.querySelector("#amount").value = transaction.amount;
        document.querySelector("#date").value = transaction.date;
        document.querySelector("#category").value = transaction.category;

        document.querySelector("#transaction-modal h1").textContent =
          "Edit Transaction";
        document
          .querySelector("#transaction-modal")
          .classList.add("show-modal");
      });

      // Delete 
      row.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this transaction?")) {
          const users = getAllUsers();
          const index = users.findIndex((u) => u.id === loggedInUser.id);
          if (index !== -1) {
            users[index].transactions = users[index].transactions.filter(
              (t) => t.id !== transaction.id,
            );
            saveUsers(users);
            setLoggedInUser(users[index]);
          }
          updateDashboard();
        }
      });

      tbody.appendChild(row);
    });
  }

  // Reset All 
  const resetBtn = document.querySelector(".reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (
        confirm(
          "Are you sure you want to delete ALL transactions? This cannot be undone.",
        )
      ) {
        const loggedInUser = getLoggedInUser();
        loggedInUser.transactions = [];

        const users = getAllUsers();
        const index = users.findIndex((u) => u.id === loggedInUser.id);
        if (index !== -1) {
          users[index].transactions = [];
          saveUsers(users);
          setLoggedInUser(users[index]);
        }
        updateDashboard();
      }
    });
  }

  // Dark Mode 
  const darkModeToggle = document.querySelector(
    ".switch input[type='checkbox']",
  );
  if (darkModeToggle) {
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "true");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
      }
    });
  }

  updateDashboard();
});

function showPage(
  page,
  dashboardLink,
  settingsLink,
  dashboardSection,
  settingsSection,
) {
  dashboardSection.classList.remove("active-page");
  settingsSection.classList.remove("active-page");

  dashboardLink.classList.remove("active");
  settingsLink.classList.remove("active");

  if (page === "dashboard") {
    dashboardSection.classList.add("active-page");
    dashboardLink.classList.add("active");
  } else {
    settingsSection.classList.add("active-page");
    settingsLink.classList.add("active");
  }
}
