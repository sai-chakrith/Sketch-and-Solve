const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Toggle between login and register
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Handle Registration
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = document.querySelector('.sign-up input[name="name"]').value;
    let email = document.querySelector('.sign-up input[name="email"]').value;
    let password = document.querySelector('.sign-up input[name="password"]').value;

    let response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    let result = await response.json();
    alert(result.message || result.error);

    if (result.message) {
        container.classList.remove("active"); // Switch to login form after successful registration
    }
});

// Handle Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.querySelector('.sign-in input[name="email"]').value;
    let password = document.querySelector('.sign-in input[name="password"]').value;

    let response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    let result = await response.json();
    alert(result.message || result.error);

    if (result.message === "Login Successful!") {
        window.location.href = "dashboard.html"; // Redirect to dashboard after login
    }
});
