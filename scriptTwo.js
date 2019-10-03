const turdLTrinkets = {
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
			Authorization: 'Basic ' + btoa(`${app.data.credentials.username}:${app.data.credentials.password}`)
		});
	},

	getTrinkets: function() {
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
