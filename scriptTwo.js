/* globals fetch btoa */

const turdLTrinkets = {
	data                : {
		credentials : {
			username : sessionStorage.getItem('username'),
			password : sessionStorage.getItem('password')
		},
		notes       : []
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
				this.getNotes();
			} else {
				document.getElementById('login-error').innerText = 'TurdL says you smell like a sea anemone';
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

	getNotes            : function() {
		this.data.notes = [];
		fetch('https://notes-api.glitch.me/api/notes', {
			headers : {
				Authorization : 'Basic ' + btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
			}
		})
			.then((response) => response.json())
			.then((data) => {
				for (let note of this.data.notes) {
					this.data.notes.push(note);
				}
				this.generateTrinketHtml();
			});
	},

	// Delete function here

	// render              : function() {
	// 	if (!this.data.credentials.username || !this.data.credentials.password) {
	// 		showLoginForm();
	// 	} else {
	// 		hideLoginForm();
	// 		this.renderTrinkets().then(() => this.renderTrinkets());
	// 	}
	// },

	//tagDivs function to create separate divs for each tag
	tagDiv              : (note) => {
		let tagsHTML = note.tags.map((tag) => `<div class="tag">${tag}</div>`);
		return tagsHTML.join('\n');
	},

	generateTrinketHtml : () => {
		const div = document.getElementById('trinketsContainer');
		div.innerHTML = '';
		for (let note of turdLTrinkets.data.notes) {
			div.innerHTML += `
			<div class="title">${note.title}</div>
			<button class="edit" type="button"></button>
			<div class="tags">${turdLTrinkets.tagDivs(note)}</div>
			<div class="content">${note.text}</div>
			
			<button class="delete" type="button"></button>`;
		}
	},

	main                : () => {
		if (turdLTrinkets.data.credentials.username) {
			turdLTrinkets.render();
			turdLTrinkets.getNotes();
		}

		let login = document.querySelector('.diveIn');
		login.addEventListener('submit', function(event) {
			event.preventDefault();
			let loginInfo = new FormData(login);
			turdLTrinkets.login(loginInfo.get('username'), loginInfo.get('password'));
		});

		let form = document.querySelector('.template');
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			let noteTemplate = new FormData(form);
			turdLTrinkets.postNote(noteTemplate);
		});

		// document.querySelector('.trinketsContainer').addEventListener('click', function (event) {
		// 	event.preventDefault()
		// 	if (event.target.matches('.edit')){

		// 	} else if (event.target.matches('.delete')) {
		// 		turdLTrinkets.deleteTrinket()
		// 	}
		// })
	},

	renderTemplate      : () => {
		document.getElementById('template').innerHTML = `<div class="titleInput">
		<input type="text" name="title" placeholder="Title">
</div>
<div class="anchor">
		<input type="submit" value="Submit">
</div>
<div class="tagsInput">
		<input type="text" name="tags" placeholder="Add Tags or Due Dates">
</div>
<div class="contentInput">
		<input type="text" name="trinket" placeholder="Trinket">
</div>`;
	},

	renderTrinkets      : function() {
		// console.log(this.data.trinkets);
		// console.log(this.data.trinkets);
		document.getElementById('trinketsContainer').innerHTML = this.data.notes
			.map(this.generateTrinketHtml())
			.join('/n');
	},

	postNote            : (template) => {
		let title = template.get('title');
		let text = template.get('content');
		let tags = template.get('tags').slplit(',').map((tag) => tag.trim());
		fetch('https://notes-api.glitch.me/api/notes', {
			method  : 'POST',
			body    : JSON.stringify({ title: title, text: text, tags: tags }),
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : 'Basic ' + btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
			}
		})
			.then((response) => response.json())
			.then((note) => {
				turdLTrinkets.data.notes.push(note);
				turdLTrinkets.generateTrinketHtml();
			})
			.catch((error) => {
				alert(error);
			});
	}

	// console.log({ turdLTrinkets }),
	// 	function showLoginForm() {
	// 		document.getElementById('diveIn').classList.remove('hidden');
	// 	};

	// function hideLoginForm() {
	// 	document.getElementById('diveIn').classList.add('hidden');
	// }
};

turdLTrinkets.main();
// 	addTrinket: function() {
// 		const newTrinket = { title: title, tags: tags, content: content };
// 	}
// };
