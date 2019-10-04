/* globals fetch btoa */

const turdLTrinkets = {
	data                : {
		credentials : {
			username : sessionStorage.getItem('username'),
			password : sessionStorage.getItem('password')
		},
		trinkets    : []
	},

	setCredentials      : function(username, password) {
		this.data.credentials = {
			username : username,
			password : password
		};
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('password', password);
	},

	login               : function(username, password) {
		fetch('https://notes-api.glitch.me/api/notes', {
			headers : {
				Authorization : 'Basic ' + btoa(`${username}:${password}`)
			}
		}).then((response) => {
			if (response.ok) {
				this.setCredentials(username, password);
				this.render();
			} else {
				document.getElementById('login-error').innerText = 'TurdL says you smell like a sea anemone';
				// Add inner HTML to display log in error
			}
		});
	},

	addAuthHeader       : function(headers) {
		if (!headers) {
			headers = {};
		}

		return Object.assign({}, headers, {
			Authorization :
				'Basic ' + btoa(`${turdLTrinkets.data.credentials.username}:${turdLTrinkets.data.credentials.password}`)
		});
	},

	getTrinkets         : function() {
		return fetch('https://notes-api.glitch.me/api/notes', {
			headers : {
				Authorization : 'Basic ' + btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
			}
		})
			.then((response) => response.json())
			.then((trinketsList) => {
				console.log(trinketsList);
				// this.data.trinkets = trinketsList;
				// for loop instead
				// console.log('getTrinkets' + this.data.trinkets.notes);
			});
	},

	render              : function() {
		if (!this.data.credentials.username || !this.data.credentials.password) {
			showLoginForm();
		} else {
			hideLoginForm();
			this.renderTrinkets().then(() => this.renderTrinkets());
		}
	},

	generateTrinketHtml : function() {
		return `<div class="title">POOP</div>
		<div class="edit"></div>
		<div class="tags">POOP</div>
		<div class="content">POOP</div>
		<div class="delete"></div>
		`;
	},

	renderTrinkets      : function() {
		// console.log(this.data.trinkets);
		// console.log(this.data.trinkets);
		document.getElementById('trinketsContainer').innerHTML = this.data.trinkets
			.map(this.generateTrinketHtml())
			.join('/n');
	}
};
console.log({ turdLTrinkets }),
	function showLoginForm() {
		document.getElementById('diveIn').classList.remove('hidden');
	};

function hideLoginForm() {
	document.getElementById('diveIn').classList.add('hidden');
}

function main() {
	turdLTrinkets.render();
	const diveIn = document.querySelector('#diveIn');
	diveIn.addEventListener('submit', function(event) {
		event.preventDefault();
		const turdLUser = new FormData(diveIn);
		const username = turdLUser.get('username');
		const password = turdLUser.get('password');
		turdLTrinkets.login(username, password);
	});
}

turdLTrinkets.getTrinkets();
main();
// 	addTrinket: function() {
// 		const newTrinket = { title: title, tags: tags, content: content };
// 	}
// };
