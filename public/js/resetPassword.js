document.getElementById('reset-password-form').addEventListener('submit', async function(e) {
    e.preventDefault()

    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    const password = document.getElementById('password').value
    const repeatPassword = document.getElementById('repeat-password').value
    const messageDiv = document.getElementById('error-message');

    if (password !== repeatPassword) {
        messageDiv.textContent = 'Passwords do not match!';
        messageDiv.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`/api/resetPassword`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = 'Email found';
            messageDiv.style.color = 'green';
            window.location.href = '/pages/login.html'
        } else {
            messageDiv.textContent = data.error || 'Email not found';
            messageDiv.style.color = 'red';
        }
    } catch (err) {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.style.color = 'red';
        console.error('Error:', err);
    }
})