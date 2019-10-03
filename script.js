const uuid4 = require('uuid/v4');
let credentials = {
	username : sessionStorage.getItem('username'),
	password : sessionStorage.getItem('password')
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
