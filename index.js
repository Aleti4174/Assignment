
const expenseForm = document.getElementById("expense-form");

const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");

const expenseList = document.getElementById("expense-list");
const totalExpenses = document.getElementById("total-expenses");

const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const emptyMessage = document.getElementById("empty-message");

let expenses = [];
let editIndex = -1;


// Add Expense
expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount = Number(amountInput.value);
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;

    if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        description === "" ||
        category === ""
    ) {
        alert("Please enter valid details");
        return;
    }

    const expense = {
        amount: amount,
        description: description,
        category: category
    };

    if (editIndex === -1) {

        expenses.push(expense);

    } else {

        expenses[editIndex] = expense;
        editIndex = -1;

    }

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    displayExpenses();

    expenseForm.reset();

    submitBtn.textContent = "Add Expense";
    cancelBtn.classList.add("d-none");

});


// Display Expenses
function displayExpenses() {

    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach(function(expense, index) {

        total += expense.amount;

        const row = document.createElement("tr");

        const amountCell = document.createElement("td");
        amountCell.textContent = "₹" + expense.amount.toFixed(2);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = expense.description;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        const actionCell = document.createElement("td");

        // Edit Button
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "btn btn-warning btn-sm me-2";

        editButton.addEventListener("click", function() {
            editExpense(index);
        });

        // Delete Button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger btn-sm";

        deleteButton.addEventListener("click", function() {
            deleteExpense(index);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(amountCell);
        row.appendChild(descriptionCell);
        row.appendChild(categoryCell);
        row.appendChild(actionCell);

        expenseList.appendChild(row);

    });

    totalExpenses.textContent = total.toFixed(2);

    emptyMessage.classList.toggle(
        "d-none",
        expenses.length > 0
    );

}


// Edit Expense
function editExpense(index) {

    const expense = expenses[index];

    amountInput.value = expense.amount;
    descriptionInput.value = expense.description;
    categoryInput.value = expense.category;

    editIndex = index;

    submitBtn.textContent = "Update Expense";
    cancelBtn.classList.remove("d-none");

    expenseForm.scrollIntoView({
        behavior: "smooth"
    });

}


// Delete Expense
function deleteExpense(index) {

    if (!confirm("Are you sure you want to delete this expense?")) {
        return;
    }

    expenses.splice(index, 1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    if (editIndex === index) {

        editIndex = -1;
        expenseForm.reset();

        submitBtn.textContent = "Add Expense";
        cancelBtn.classList.add("d-none");

    } else if (editIndex > index) {

        editIndex--;

    }

    displayExpenses();

}


// Cancel Edit
cancelBtn.addEventListener("click", function() {

    editIndex = -1;

    expenseForm.reset();

    submitBtn.textContent = "Add Expense";
    cancelBtn.classList.add("d-none");

});


// Initial display
// Do not fetch expenses from Local Storage on reload.
displayExpenses();
