/* globals fetch btoa */

let login = function(username, password) {
	fetch('https://notes-api.glitch.me/api/users', {
		headers: {
			Authorization: 'Basic' + btoa('Chuck:password')
		}
	}).then((response) => {
		// console.log(this.headers);
		console.log(response);
		if (response.ok) {
			this.setCredentials(username, password);
			this.render();
		} else {
			document.getElementById('login-error').innerText = 'That is not a valid username and password.';
			// Double check the 'login-error' .. unsure if class exists
		}
	});
};

function main() {
	// turdLTrinkets.render()
	const diveIn = document.querySelector('#diveIn');
	diveIn.addEventListener('submit', function(event) {
		event.preventDefault();
		const turdLUser = new FormData(diveIn);
		const username = turdLUser.get('username');
		const password = turdLUser.get('password');
	});
}

const turdLTrinkets = {
	credentials: {
		username: sessionStorage.getItem('username'),
		password: sessionStorage.getItem('password')
	},

	trinkets: [],

	setCredentials: function(username, password) {
		this.credentials = {
			username: username,
			password: password
		};
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('password', password);
	},

	addAuthHeader: function(headers) {
		if (!headers) {
			headers = {};
		}

		return Object.assign({}, headers, {
			Authorization:
				'Basic ' + btoa(`${turdLTrinkets.credentials.username}:${turdLTrinkets.credentials.password}`)
		});
	},

	getTrinkets: function() {
		console.log(this.addAuthHeader());
		return fetch('https://notes-api.glitch.me/api/notes', {
			headers: this.addAuthHeader()
		})
			.then((response) => response.json())
			.then((response) => {
				if (response.ok) {
					console.log(response);
				}
			});
	}
};

turdLTrinkets.getTrinkets();
// 	addTrinket: function() {
// 		const newTrinket = { title: title, tags: tags, content: content };
// 	}
// };
