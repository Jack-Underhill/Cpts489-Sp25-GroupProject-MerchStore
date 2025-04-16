document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';

            setTimeout(() => {
                if(data.user?.role === 'admin') {
                    window.location.href = '/admin/adminDashboard.html';
                } else {
                    window.location.href = '/pages/account.html';
                }
            }, 1000);
        } else {
            messageDiv.textContent = data.error || 'Login failed';
            messageDiv.style.color = 'red';
        }
    } catch (err) {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.style.color = 'red';
        console.error('Error:', err);
    }
});