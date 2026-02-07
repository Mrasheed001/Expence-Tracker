const amount = document.getElementById("numInput");
const category = document.getElementById("category");
const discription = document.getElementById("discription");
const date = document.getElementById("dateInput");

const amountError = document.getElementById("amountError");
const discriptionError = document.getElementById("discriptionError");
const dateError = document.getElementById("dateError");
const currencySelect = document.getElementById("currencySelect");


let list = document.getElementById("user-Details");
let userCategory = document.getElementById("category-detail");
let totalAmount = document.getElementById("totalAmount");
let numOfRecordEl = document.getElementById("numOfRecord");




function registerUser() {
    const username = document.getElementById("Surname-input").value.trim();
    const email = document.getElementById("email-input").value.trim();
    const password = document.getElementById("Password-input").value.trim();

    if (!username || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert("Email already registered. Please login.");
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You can now login.");
    window.location.href = "login.html";
}


// ================= FOR MY LOGIN PAGE =================

function loginUser() {
    const email = document.getElementById("email-input").value.trim();
    const password = document.getElementById("Password-input").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => user.email === email && user.password === password);

    if (!validUser) {
        alert("Invalid email or password");
        return;
    }

    // Save logged in user
    localStorage.setItem("loggedInUser", JSON.stringify(validUser));

    alert("Login successful!");
    window.location.href = "home.html"; 
}

function showWelcomeMessage() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const welcomeEl = document.getElementById("welcomeMessage");

    if (!user || !welcomeEl) return;

    // Special users message!!
    if (user.username.toLowerCase() === "omeiza" || 
        user.username.toLowerCase() === "zainab ahuoyiza") {

        welcomeEl.innerText = `Hey baby ❤, 
                               you think say i no go still get your details shey?.
                               anyways!, i love you enjoy your app😘`;
        return; 
    }

    // Normal welcome
    welcomeEl.innerText = `Hi, ${user.username} Welcome Back! 👋`;
}




// ================= ADD EXPENSE =================
function addExpense() {

    amountError.textContent = "";
    discriptionError.textContent = "";
    dateError.textContent = "";

    let hasError = false;

    if (amount.value === "" || Number(amount.value) <= 0) {
        amountError.textContent = "Please enter a valid number!";
        hasError = true;
    }

    if (discription.value === "") {
        discriptionError.textContent = "Description is required";
        hasError = true;
    }

    if (date.value === "") {
        dateError.textContent = "Please select a date!";
        hasError = true;
    }

    if (hasError) return;

    let saveduserDetails = JSON.parse(localStorage.getItem("userdetails")) || [];

    let userDetail = {
    id: Date.now(),
    Amount: amount.value,
    Category: category.value,
    Discription: discription.value,
    Date: date.value,
};


    saveduserDetails.push(userDetail);
    localStorage.setItem("userdetails", JSON.stringify(saveduserDetails));

    amount.value = "";
    discription.value = "";
    date.value = "";

    showExpense();
    showCategory();
    showTotalAmount();
    generateAdvice();
}


// ================= SHOW EXPENSES =================
function showExpense() {
    const saveduserDetails = JSON.parse(localStorage.getItem("userdetails")) || [];
    if (!list) {
        return;
    }
    list.innerHTML = "";

    if (saveduserDetails.length === 0) {
        document.getElementById("show-Expense").style.display = "block";
        return;
    } else {
        document.getElementById("show-Expense").style.display = "none";
    }

    saveduserDetails.slice().reverse().forEach(userDetail => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "fs-5");
        li.dataset.id = userDetail.id;

        li.innerHTML = `
        <div class="d-flex justify-content-between">
            <h2>${userDetail.Date}</h2>   
           <span>₦${userDetail.Amount}</span>

        </div>
        <div class="bg-light p-4 rounded-3 d-flex justify-content-between">
            <div>             
                <span class="fw-bold">${userDetail.Category}</span><br>
                <span class="opacity-75 fw-bold fs-5">${userDetail.Discription}</span>
            </div>
            <div>
                <span class="badge fs-3 text-dark fw-bold m-0">
                        ₦${userDetail.Amount}
            </span>

                <i class="fa fa-trash text-danger trash-icon bg-white" style="display:none; cursor:pointer;"></i>
            </div>
        </div>`;

        list.appendChild(li);
    });

    numOfRecordEl.textContent = saveduserDetails.length;
}


// ================= SHOW CATEGORY SUMMARY =================
function showCategory() {
    let saveduserDetails = JSON.parse(localStorage.getItem("userdetails")) || [];
    if (!userCategory) {
        return;
    }
    userCategory.innerHTML = "";

    if (saveduserDetails.length === 0) {
        document.getElementById("category-text").style.display = "block";
        return;
    } else {
        document.getElementById("category-text").style.display = "none";
    }

    const totals = {};

    saveduserDetails.forEach(userDetail => {
        if (!totals[userDetail.Category]) {
            totals[userDetail.Category] = 0;
        }
        totals[userDetail.Category] += Number(userDetail.Amount);
    });

    const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);

    for (let cat in totals) {
        const percent = ((totals[cat] / totalSpent) * 100).toFixed(0);

        userCategory.innerHTML += `
        <div class="bg-light p-4 rounded-4 m-2">
            <div class="d-flex justify-content-between">
                <label>${cat}</label> 
                <span>₦${totals[cat]}</span>
            </div>
        <input type="range" min="0" max="100" value="${percent}" class="category-slider mb-3" style="width:100%;">
        </div> <br class="m-2>`;
    }

    updateSlider();
}


// ================= SLIDER COLOR =================
function updateSlider() {
    document.querySelectorAll(".category-slider").forEach(slider => {
        const percent = (slider.value / slider.max) * 100;
        slider.style.background = `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${percent}%, #e5e7eb ${percent}%)`;
    });
}


// ================= TOTAL AMOUNT =================
function showTotalAmount() {
    let saveduserDetails = JSON.parse(localStorage.getItem("userdetails")) || [];

    const addedAmount = saveduserDetails.reduce((acc, current) =>
        acc + Number(current.Amount || 0), 0
    ).toFixed(2);
    if (!totalAmount) {
        return;
    }
    totalAmount.innerHTML = `₦${addedAmount}`;
}


// ================= DELETE EXPENSE =================
function deleteExpence(id) {
    let saved = JSON.parse(localStorage.getItem("userdetails")) || [];
    saved = saved.filter(expence => expence.id !== id);
    localStorage.setItem("userdetails", JSON.stringify(saved));

    showExpense();
    showCategory();
    showTotalAmount();
    generateAdvice();
}


// ================= EVENTS =================
document.addEventListener("DOMContentLoaded", () => {
    showWelcomeMessage();
    showExpense();
    showCategory();
    showTotalAmount();
    generateAdvice();

if (list) {

    list.addEventListener("mouseover", (e) => {
        const item = e.target.closest("li");
        if (!item) return;
        item.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
        const trash = item.querySelector(".trash-icon");
        if (trash) trash.style.display = "inline-block";
    });

    list.addEventListener("mouseout", (e) => {
        const item = e.target.closest("li");
        if (!item) return;
        item.style.boxShadow = 'none';
        const trash = item.querySelector(".trash-icon");
        if (trash) trash.style.display = "none";
    });

    list.addEventListener("click", function (e) {
        if (e.target.classList.contains("trash-icon")) {
            const item = e.target.closest("li");
            const id = Number(item.dataset.id);
            deleteExpence(id);
        }
    });

}

});
function generateAdvice() {
    const adviceBox = document.getElementById("adviceBox");
    if (!adviceBox) return;

    let saveduserDetails = JSON.parse(localStorage.getItem("userdetails")) || [];

    if (saveduserDetails.length === 0) {
        adviceBox.innerText = "";
        return;
    }

    const totals = {};

    saveduserDetails.forEach(exp => {
        totals[exp.Category] = (totals[exp.Category] || 0) + Number(exp.Amount);
    });

    let highestCategory = Object.keys(totals).reduce((a, b) =>
        totals[a] > totals[b] ? a : b
    );

    let advice = `📊 Your highest spending is on ${highestCategory}. `;

    if (totals[highestCategory] > 50000) {
        advice += "Consider setting a budget for this category.";
    } else if (totals[highestCategory] > 20000) {
        advice += "You may want to reduce spending in this area.";
    } else {
        advice += "Your spending is still under control. Good job!";
    }

    adviceBox.innerText = advice;
}


