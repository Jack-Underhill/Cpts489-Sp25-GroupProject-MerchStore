document.getElementById('forgot-password-form').addEventListener('submit', async function(e) {
    e.preventDefault()

    const email = document.getElementById('email').value
    const messageDiv = document.getElementById('login-message');

    try {
        const response = await fetch(`/api/findUser/${email}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = 'Email found';
            messageDiv.style.color = 'green';
            window.location.href = `/pages/resetPassword.html?email=${email}`
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