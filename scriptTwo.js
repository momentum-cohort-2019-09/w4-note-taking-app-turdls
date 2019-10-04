/* globals fetch btoa */



function main() {
	turdLTrinkets.render()
	const diveIn=document.querySelector('#diveIn');
	diveIn.addEventListener('submit', function(event) {
		event.preventDefault();
		const turdLUser=new FormData(diveIn);
		const username=turdLUser.get('username');
		const password=turdLUser.get('password');
		turdLTrinkets.setCredentials(username, password);
	});

}

const turdLTrinkets={
	data: {

		credentials: {
			username: sessionStorage.getItem('username'),
			password: sessionStorage.getItem('password')
		},
		trinkets: []
	},
	// console.log(trinkets)

	setCredentials: function(username, password) {
		this.data.credentials={
			username: username,
			password: password
		};
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('password', password);
	},

	login: function(username, password) {
		fetch('https://notes-api.glitch.me/api/users', {
			headers: {
				'Authorization': 'Basic '+btoa(`${username}:${password}`)
			}
		}).then((response) => {
			if(response.ok) {
				this.setCredentials(username, password);
				this.render();
			} else {
				document.getElementById('login-error').innerText='That is not a valid username and password.';
				// Add inner HTML to display log in error 
			}
		});
	},

	addAuthHeader: function(headers) {
		if(!headers) {
			headers={};
		}

		return Object.assign({}, headers, {
			'Authorization':
				'Basic '+btoa(`${turdLTrinkets.data.credentials.username}:${turdLTrinkets.data.credentials.password}`)
		});
	},

	getTrinkets: function() {

		return fetch('https://notes-api.glitch.me/api/notes', {
			headers: {
				'Authorization': 'Basic '+btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
			}
		})
			.then((response) => response.json())
			.then((trinketsList) => {
				this.data.trinkets.notes=trinketsList
				// console.log(this.data.trinkets.notes=trinketsList)
			}
			);
	},

	render: function() {
		if(!this.data.credentials.username||!this.data.credentials.password) {
			showLoginForm()
		} else {
			hideLoginForm()
			// console.log(this.renderTrinkets())
			this.renderTrinkets().then(() => this.renderTrinkets())
			//?????????WTF .then no fetch (Clinton's line 122)
		}
	},

	renderTrinkets: function() {
		document.getElementById('trinketsContainer').innerHTML=this.data.trinkets.map(generateTrinketHTML()).join('/n')
	}


};

function generateTrinketHTML() {
	console.log(turdLTrinkets.data)

	return `<div class="title">${turdLTrinkets.data.trinkets.title}</div>
	<div class="edit"></div>
	<div class="tags">${turdLTrinkets.data.trinkets.tags}</div>
	<div class="content">${turdLTrinkets.data.trinkets.text}</div>
	<div class="delete"></div>
	`

}

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
