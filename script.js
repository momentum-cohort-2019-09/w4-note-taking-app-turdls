const uuidv4 = require('uuid/v4');
let credentials = {
	username: sessionStorage.getItem('username'),
	password: sessionStorage.getItem('password')
};

function basicAuthCreds(username, password) {
	return 'Basic ' + btoa(`${username}:${password}`);
}

function hideLoginForm() {
	document.getElementById('diveIn').classList.add('hidden');
}

function showLoginForm() {
	document.getElementById('diveIn').classList.remove('hidden');
}

function renderPage() {
	if (!credentials.username || !credentials.password) {
		showLoginForm();
	} else {
		hideLoginForm();
	}
}

function main () {
    renderPage()
    // how to change login vs sign up
    const loginForm = document.querySelector('#diveIn')
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault()
        const formData = new FormData(loginForm)
        const username = formData.get('username')
        const password = formData.get('password')

        fetch('https://notes-api.glitch.me/api/users', {
        headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            }
        })
    }
	.then(response) => {
    	if (response.ok) {
        	credentials.username = username
        	credentials.password = password
        	sessionStorage.setItem('username', username)
        	sessionStorage.setItem('password', password)
        	renderPage()
    	} else {
        	document.querySelector('#login-error').innerText = 'TurdL says you smell like a sea anemone (must be valid username and password)'
    	}
	})
}