function validatePassword() {
    const pass1 = document.getElementById('password')
    const pass2 = document.getElementById('repeat-password')
    const errorMsg = document.getElementById('error-message')
    console.log(pass1.validity)
    console.log('pass1: ', pass1.value)
    console.log('pass2: ', pass2.value)
    if (pass1.value !== pass2.value) {
        errorMsg.textContent = 'Passwords do not match!'
        return false
    } else {
        errorMsg.textContent = ''
        return true
    }
}