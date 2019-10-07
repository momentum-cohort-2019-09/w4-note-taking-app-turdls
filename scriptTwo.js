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
				document.getElementById('login-error').innerText = 'Turtle says you smell like a sea anemone';
			}
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
				for (let note of data.notes) {
					this.data.notes.push(note);
				}
				this.generateTrinketHtml();
			});
	},

	deleteTrinket       : (noteId) => {
		fetch(`https://notes-api.glitch.me/api/notes/${noteId}`, {
			method  : 'DELETE',
			headers : {
				Authorization :
					'Basic ' +
					btoa(`${turdLTrinkets.data.credentials.username}:${turdLTrinkets.data.credentials.password}`)
			}
		}).then((response) => {
			if (response.ok) {
				turdLTrinkets.data.notes = turdLTrinkets.data.notes.filter((note) => note._id !== noteId);

				turdLTrinkets.generateTrinketHtml();
			}
		});
	},

	render              : function() {
		document.querySelector('.backgroundImage1').classList.add('hidden');
		document.querySelector('.diveIn').classList.add('hidden');
		document.getElementById('trinketWrapper').classList.remove('hidden');
		document.querySelector('.backgroundImage2').classList.remove('hidden');
	},

	tagDiv              : (note) => {
		let tagsHTML = note.tags.map((tag) => `<div class="tag">${tag}</div>`);
		return tagsHTML.join('\n');
	},

	generateTrinketHtml : () => {
		const div = document.querySelector('.trinketWrapper');
		div.innerHTML = '';
		for (let note of turdLTrinkets.data.notes) {
			div.innerHTML += `
			<div class="containerEachTrinket" data-id="${note._id}">
			<button class="edit" type="button">Edit</button>
			<img src="turtle.png" class="turtle">
			<div class="title" data-title="${note.title}">${note.title}</div>
			
			<div class="tags" data-tags="${note.tags}">${turdLTrinkets.tagDiv(note)}</div>
			
			<div class="content" data-text="${note.text}">${note.text}</div>
			
			<button class="delete" type="button">Delete</button>
			</div>
			`;
		}
	},

	showEditForm        : (title, tags, content) => {
		const tempDiv = document.querySelector('.template');
		tempDiv.innerHTML = '';
		for (let note of turdLTrinkets.data.notes) {
			// console.log(title);
			tempDiv.innerHTML = `
			<div class="updateNote">
		<button class="update" type="button">Save Edits</button>
</div><div class="titleInput">
		<input type="text" name="title" value="${title ? title : ''}">
</div>
<div class="tagsInput">
		<input type="text" name="tags" value="${tags ? tags : ''}">
</div>
<div class="contentInput">
		<input type="text" name="trinket" value="${content ? content : ''}"></div>`;
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
		form.addEventListener('click', function(event) {
			event.preventDefault();
			if (event.target.matches('.newNew')) {
				let noteTemplate = new FormData(form);
				turdLTrinkets.postNote(noteTemplate);
			} else if (event.target.matches('.update')) {
				turdLTrinkets.deleteTrinket(updateID);
				let noteTemplate = new FormData(form);
				turdLTrinkets.postNote(noteTemplate);
				turdLTrinkets.renderTrinkets();
			}
		});

		document.querySelector('.new').addEventListener('click', function(event) {
			event.preventDefault();
			event.target.classList.add('hidden');
			turdLTrinkets.renderTemplate();
		});

		let updateID = '';

		document.querySelector('.trinketWrapper').addEventListener('click', function(event) {
			event.preventDefault();
			if (event.target.matches('.edit')) {
				updateID = event.target.parentElement.dataset.id;
				turdLTrinkets.showEditForm(
					event.target.nextElementSibling.nextElementSibling.dataset.title,
					event.target.nextElementSibling.nextElementSibling.nextElementSibling.dataset.tags,
					event.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.dataset
						.text
				);
			} else if (event.target.matches('.delete')) {
				turdLTrinkets.deleteTrinket(event.target.parentElement.dataset.id);
			}
		});

		let searchForm = document.querySelector('.searchField');
		let search = document.getElementById('search');
		let innerDiv = document.querySelector('.trinketWrapper');
		innerDiv.innerHTML = '';
		searchForm.addEventListener('submit', function(event) {
			event.preventDefault();
			for (let note of turdLTrinkets.data.notes) {
				if (note.tags.includes(search.value)) {
					let filteredNoteArray = [];
					filteredNoteArray.push(note);

					for (let note of filteredNoteArray) {
						console.log(note);
						innerDiv.innerHTML += `
					<div class="containerEachTrinket">
					<button class="edit" type="button">Edit</button>
					<div class="title">${note.title}</div>
					
					<div class="tags">${note.tags}</div>
					<div class="content">${note.text}</div>
					
					<button class="delete" type="button">Delete</button>
					</>`;
					}
				}
			}
		});
	},

	renderTemplate      : () => {
		return (document.querySelector('#template').innerHTML = `<div class="titleInput">
		<div class="anchor">
		<input class="newNew" type="submit" value="Submit"></div>
		<input type="text" name="title" placeholder="Title">
		</div>


	<div class="tagsInput">
		<input type="text" name="tags" placeholder="Add Tags or Due Dates">
	</div>
	<div class="contentInput">
		<input type="text" name="trinket" placeholder="Trinket">
	</div>`);
	},

	renderTrinkets      : function() {
		// console.log(this.data.trinkets);
		// console.log(this.data.trinkets);
		document.getElementById('trinketsContainer').innerHTML = turdLTrinkets.data.notes
			.map(this.generateTrinketHtml())
			.join('/n');
	},

	postNote            : (template) => {
		let title = template.get('title');
		let text = template.get('trinket');
		let tags = template.get('tags').split(',').map((tag) => tag.trim());
		fetch('https://notes-api.glitch.me/api/notes', {
			method  : 'POST',
			body    : JSON.stringify({ title: title, text: text, tags: tags }),
			headers : {
				'Content-Type' : 'application/json',
				Authorization  :
					'Basic ' +
					btoa(`${turdLTrinkets.data.credentials.username}:${turdLTrinkets.data.credentials.password}`)
			}
		})
			.then((response) => response.json())
			.then((note) => {
				turdLTrinkets.data.notes.push(note);
				turdLTrinkets.generateTrinketHtml();
				document.querySelector('#template').innerHTML = '';
				document.querySelector('.new').classList.remove('hidden');
			})
			.catch((error) => {
				alert(error);
			});
	}
};

turdLTrinkets.main();
