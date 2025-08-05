document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const btnPopup = document.querySelector('.btnlogin-popup');
    const btnLogout = document.querySelector('.btnlogout');
    const iconClose = document.querySelector('.icon-close');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    registerLink.addEventListener('click', () => {
        wrapper.classList.add('active');
    });

    loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
    });

    btnPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
    });

    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('active-popup');
    });

    checkAuthStatus();

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (!username || !email || !password) {
            showError(registerError, 'All fields are required');
            return;
        }

        if (!agreeTerms) {
            showError(registerError, 'You must agree to the terms and conditions');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.success) {
                showSuccess(registerError, 'Registration successful! Redirecting...');
                setTimeout(() => {
                    wrapper.classList.remove('active-popup');
                    updateUIForLoggedInUser(data.user);
                }, 1500);
            } else {
                showError(registerError, data.message || 'Registration failed');
            }
        } catch (error) {
            showError(registerError, 'Server error. Please try again later.');
            console.error('Registration error:', error);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            showError(loginError, 'Email and password are required');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe })
            });

            const data = await response.json();

            if (data.success) {
                const username = data.user.username;
                const userEmail = data.user.email;

                showSuccess(loginError, 'Login successful! Redirecting...');

                localStorage.setItem('username', username);
                localStorage.setItem('email', userEmail);

                setTimeout(() => {
                    wrapper.classList.remove('active-popup');
                    updateUIForLoggedInUser({ username });

                    // 🔁 Redirect by email prefix
                    if (userEmail.startsWith('teacher')) {
                        window.location.href = 'Staff.html';
                    } else if (userEmail.startsWith('parent')) {
                        window.location.href = 'Parents portal.html';
                    } else {
                        window.location.href = 'Students portal.html';
                    }
                }, 1500);
            } else {
                showError(loginError, data.message || 'Login failed');
            }
        } catch (error) {
            showError(loginError, 'Server error. Please try again later.');
            console.error('Login error:', error);
        }
    });

    btnLogout.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/logout');
            const data = await response.json();

            if (data.success) {
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                updateUIForLoggedOutUser();
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            if (data.success) {
                updateUIForLoggedInUser(data.user);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        }
    }

    function updateUIForLoggedInUser(user) {
        btnPopup.style.display = 'none';
        btnLogout.style.display = 'inline-block';
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.textContent = `Welcome, ${user.username}`;
        }
    }

    function updateUIForLoggedOutUser() {
        btnPopup.style.display = 'inline-block';
        btnLogout.style.display = 'none';
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.textContent = 'Logo';
        }
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.color = 'red';
        element.style.display = 'block';
    }

    function showSuccess(element, message) {
        element.textContent = message;
        element.style.color = 'green';
        element.style.display = 'block';
    }
});
