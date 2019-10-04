/* globals fetch btoa */



function main() {
	// turdLTrinkets.render()
	const diveIn = document.querySelector('#diveIn');
	console.log({ diveIn })
	diveIn.addEventListener('submit', function (event) {
		event.preventDefault();
		const turdLUser = new FormData(diveIn);
		const username = turdLUser.get('username');
		const password = turdLUser.get('password');
		// Add code to set the credentials here
		turdLTrinkets.setCredentials(username, password);
	});

}

const turdLTrinkets = {
	data: {

		credentials: {
			username: sessionStorage.getItem('username'),
			password: sessionStorage.getItem('password')
		}
	},

	trinkets: [],

	setCredentials: function (username, password) {
		this.data.credentials = {
			username: username,
			password: password
		};
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('password', password);
	},

	login: function (username, password) {
		fetch('https://notes-api.glitch.me/api/users', {
			headers: {
				'Authorization': 'Basic ' + btoa(`${username}:${password}`)
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
	},

	addAuthHeader: function (headers) {
		if (!headers) {
			headers = {};
		}

		return Object.assign({}, headers, {
			'Authorization':
				'Basic ' + btoa(`${turdLTrinkets.data.credentials.username}:${turdLTrinkets.data.credentials.password}`)
		});
	},

	getTrinkets: function () {
		// console.log(this.addAuthHeader());
		console.log({ credentials: this.data.credentials })
		return fetch('https://notes-api.glitch.me/api/notes', {
			headers: {
				'Authorization': 'Basic ' + btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
			}
		})
			.then((response) => response.json())
			.then((response) => {
				// FIX ME
			}
			);
	},

	render: function () {
		if (!this.data.credentials.username || !this.data.credentials.passwword) {
			showLoginForm()
		} else {
			hideLoginForm()
			this.getTrinkets().then(() => this.renderTrinkets())
		}
	}
};

function showLoginForm() {
	document.getElementById('diveIn').classList.remove('hidden')
}

function hideLoginForm() {
	document.getElementById('diveIn').classList.add('hidden')
}


turdLTrinkets.getTrinkets();
main()
// 	addTrinket: function() {
// 		const newTrinket = { title: title, tags: tags, content: content };
// 	}
// };
