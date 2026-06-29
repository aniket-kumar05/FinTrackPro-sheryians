//this is for common layout

const sidebar = document.querySelector("#sidebar");
const header = document.querySelector("#header");
const modalContainer = document.querySelector("#modal-container");
function renderSidebar() {
  if (!sidebar) return;

  sidebar.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="logo">
        <div class="logo-icon">
          <i class="ri-stack-fill"></i>
        </div>
        <div class="logo-text">
          <h2>FinTrack Pro</h2>
          <p>Enterprise Finance</p>
        </div>
        </div>

        <nav class="sidebar-nav">

          <a href="#" id="nav-dashboard" class="nav-link active">
          <i class="ri-dashboard-fill"></i>
             Dashboard
          </a>

          <a href="#" id="nav-settings" class="nav-link">
          <i class="ri-settings-4-fill"></i>

             Settings
          </a>
        </nav>
      </div>

      <button id="add-transaction-btn" class="add-transaction-btn">
        + Add Transaction
      </button>
    </aside>
  `;
}

function renderHeader() {
  const user = getLoggedInUser();

  document.querySelector("#header").innerHTML = `

        <header class="header">

            <div></div>

            <div class="header-right">

                <h4>

                    ${user.username}

                </h4>

                <button id="logout-btn">
                <i class="ri-logout-box-r-line"></i>

                    Logout

                </button>

            </div>

        </header>

    `;
  document.querySelector("#logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}

function renderTransaction() {
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal" id="transaction-modal">
        <div class="modal-container">
            <div class="modal-header">
                <h1>Add Transaction</h1>
                <button id="close-modal-btn">
                    <i class="ri-close-line"></i>
                </button>
        </div>
            <form id="transaction-form" type="submit">
                <div class="form-group">
                    <label for="type">Type</label>
                    <select name="type" id="type">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="amount">Description</label>
                    <input type="text" name="description" id="description" placeholder="e.g. Amazon, Salary, Coffee"/>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="amount">Amount</label>
                        <input type="number" name="amount" id="amount"/>
                    </div>
                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="date" name="date" id="date" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select name="category" id="category" placeholder="Select a Category">
                        <option value="" selected disabled>Select a Category</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Recharge Bills">Recharge Bills</option>
                        <option value="Petrol & Auto">Petrol & Auto</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Salary">Salary</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button type="submit" id="save-transaction-btn" class="save-transaction-btn">Save Transaction</button>
            </form>
            
        </div>
            
    </div>`;
}

renderHeader();
renderSidebar();
renderTransaction();
