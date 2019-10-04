const app={
	data: {
		credentials: {
			username: sessionStorage.getItem('username'),
			password: sessionStorage.getItem('password')
		},
		lists: []
	},

	getItem: function(itemId) {
		// Loop through each list's items looking for the item with id == itemId
		for(let groceryList of this.data.lists) {
			const item=groceryList.items.find(item => item.id===itemId)
			if(item) {
				return item
			}
		}
	},

	setCredentials: function(username, password) {
		this.data.credentials={
			username: username,
			password: password
		}
		sessionStorage.setItem('username', username)
		sessionStorage.setItem('password', password)
	},

	addAuthHeader: function(headers) {
		if(!headers) { headers={} }

		return Object.assign({}, headers, {
			'Authorization': 'Basic '+btoa(`${app.data.credentials.username}:${app.data.credentials.password}`)
		})
	},

	login: function(username, password) {
		fetch('http://localhost:3000/lists', {
			headers: {
				'Authorization': 'Basic '+btoa(`${username}:${password}`)
			}
		})
			.then(response => {
				if(response.ok) {
					this.setCredentials(username, password)
					this.render()
				} else {
					document.getElementById('login-error').innerText='That is not a valid username and password.'
				}
			})
	},

	addItem: function(listId, name) {
		const uuid=uuidv4()
		const newItem={ 'name': name, 'listId': listId, 'id': uuid }

		// Find the list to add the item to.
		// Go ahead and add the item before we make the POST request to add it to the DB.
		// Update the page to show the item.
		const groceryList=this.data.lists.find(list => list.id===listId)
		groceryList.items.push(newItem)
		this.renderListsAndItems()

		fetch('http://localhost:3000/items/', {
			method: 'POST',
			body: JSON.stringify(newItem),
			headers: this.addAuthHeader({
				'Content-Type': 'application/json'
			})
		})
			.then(response => { })
	},

	retrieveListsAndItems: function() {
		return fetch('http://localhost:3000/lists?_embed=items', {
			headers: app.addAuthHeader()
		})
			.then(response => response.json())
			.then(listsData => {
				this.data.lists=listsData
				console.log(this.data)
			})
			.catch(error => {
				console.log(error)
			})
	},

	renderListsAndItems: function() {
		document.getElementById('lists').innerHTML=this.data.lists.map(generateListHTML).join('\n')
	},

	markItem: function(itemNode) {
		const itemId=itemNode.dataset.itemId
		const item=this.getItem(itemId)
		const markedOff=item.markedOff

		fetch(`http://localhost:3000/items/${itemId}`, {
			method: 'PATCH',
			body: JSON.stringify({ 'markedOff': !markedOff }),
			headers: this.addAuthHeader({ 'Content-Type': 'application/json' })
		})
			.then(response => response.json())
			.then(itemFromServer => {
				item.markedOff=itemFromServer.markedOff
				if(item.markedOff) {
					itemNode.classList.add('strike')
				} else {
					itemNode.classList.remove('strike')
				}
			})
	},

	render: function() {
		if(!this.data.credentials.username||!this.data.credentials.password) {
			showLoginForm()
		} else {
			hideLoginForm()
			this.retrieveListsAndItems().then(() => this.renderListsAndItems())
		}
	}
}

function generateListHTML(list) {
	function strikeClass(item) {
		if(item.markedOff) {
			return 'strike'
		} else {
			return ''
		}
	}

	return `
  <section class="shadow-1 pv1 ph3 mb4">
    <h2 class="mt3">${list.name}</h2>
    <ul class="list pl0">
      ${list.items.map(item => `<li class="pa1 mb1 grocery-item ${strikeClass(item)}" 
        data-item-id="${item.id}">${item.name}</li>`).join('\n')}      
      <li class="mb2"><a class="add-item-link" href="#">+ Add</a></li>      
    </ul>
    <form class="add-item-form hidden mb2" data-list-id="${list.id}">
      <input type="text" name="name" />
      <button type="submit">Add item to list</button>
    </form>
  </section>
  `
}

function showLoginForm() {
	document.getElementById('login-form').classList.remove('hidden')
	document.getElementById('lists').classList.add('hidden')
}

function hideLoginForm() {
	document.getElementById('login-form').classList.add('hidden')
	document.getElementById('lists').classList.remove('hidden')
}

function main() {
	app.render()

	const loginForm=document.querySelector('#login-form')
	loginForm.addEventListener('submit', function(event) {
		event.preventDefault()
		const formData=new FormData(loginForm)
		const username=formData.get('username')
		const password=formData.get('password')
		app.login(username, password)
	})

	document.querySelector('#lists').addEventListener('click', (event) => {
		if(event.target.matches('.add-item-link')) {
			event.preventDefault()
			const listItem=event.target.parentElement
			const form=listItem.parentElement.nextElementSibling
			listItem.classList.add('hidden')
			form.classList.remove('hidden')
		}

		if(event.target.matches('.grocery-item')) {
			app.markItem(event.target)
		}
	})

	document.querySelector('#lists').addEventListener('submit', function(event) {
		if(event.target.matches('.add-item-form')) {
			event.preventDefault()
			const form=event.target
			const formData=new FormData(form)
			const name=formData.get('name')
			const listId=form.dataset.listId

			app.addItem(listId, name)
		}
	})
}

main()