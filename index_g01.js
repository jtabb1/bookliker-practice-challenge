// Attribution(s) below:

const booksURL = 'http://localhost:3000/books'
const URL_BASE = 'http://localhost:3000/'
const list = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const myUser = {"id":1, "username":"pouros"}

document.addEventListener("DOMContentLoaded", function() {

// Function Call(s):
// getBooks().then(console.log).catch(console.log);
appendBooksToList(list)
list.addEventListener('click', renderListItemToShowPanel)
showPanel.addEventListener('click', likeBook)

// function getBooks() {
//     return fetch(`${URL_BASE}books/1`)
//     .then(r => r.json());
// }

// Understood
function appendBooksToList(list) {
    // loads items from database into a list of book titles
    fetch(booksURL)
        .then(resp => resp.json())
        .then(json => {
            appendListItemsFromCollection(list, json)
        })
}

// Understood
function appendListItemsFromCollection(list, collection) {
    // takes in a collection and appends each item to a list tag
    for (const book of collection) {
        const listItem = createListItem(book)
        list.appendChild(listItem)
    }
}

// Understood.  I would say string title instead of format title
//  in the 2nd comment below based on what the code seems to be doing.
function createListItem(bookObject) {
    // abstracting single book item creation
    const li = document.createElement('li')
    li.dataset.BookId = bookObject.id
    // conditionally format title based on existence of subtitle
    li.textContent = bookTitleByObject(bookObject)
    return li
}

// Understood.  This is a great stretch feature beyond the
//  requirements of the assignment.
function bookTitleByObject(bookObject) {
    let bookTitle
    if (!!bookObject.subtitle && bookObject.subtitle != "") {
        bookTitle = `${bookObject.title}: ${bookObject.subtitle}`
    } else {
        bookTitle = bookObject.title 
    }
    return bookTitle
}

// Understood.  Awesome use of the "event.target" [pointer?] to
//  target specific li elements.  Also I like how the if 
//  so that   
function renderListItemToShowPanel(event) {
    if (event.target.tagName != "LI") {return}
    
    const bookId = event.target.dataset.BookId
    renderBookById(bookId)
}

// Understood
function renderBookById(id) {
    fetch(booksURL+'/'+id)
        .then(res => res.json())
        .then(json => {
            renderShowPanelData(json)
        })
}

// Understood
function renderShowPanelData(bookObj) {
    // create show panel info from object, then clear & append page
    const img = document.createElement('img')
    img.src = bookObj.img_url

    const bookTitle = document.createElement('h1')
    bookTitle.textContent = bookTitleByObject(bookObj)

    const author = document.createElement('h3')
    author.className = 'author'
    author.textContent = bookObj.author

    const description = document.createElement('p')
    description.textContent = bookObj.description

    const likeButton = document.createElement('button')
    likeButton.id = 'like'

    const likedBy = document.createElement('h3')
    likedBy.textContent = 'Liked By:'
    // a likelist is an unordered list with users
    const likeList = document.createElement('ul')
    for (const user of bookObj.users) {
        const userItem = document.createElement('li')
        userItem.dataset.userId = user.id
        userItem.textContent = user.username
        likeList.appendChild(userItem)
    }

    showPanel.innerHTML = ""
    showPanel.dataset.bookId = bookObj.id
    showPanel.append(img, bookTitle, author, description, likeButton, likedBy, likeList)

    if (listIncludesUser(currentLikedUsers(), myUser)) {
        likeButton.textContent = ' unlike '
    } else {
        likeButton.textContent = ' like '
    }
}

/*   */

function likeBook(event) {
    if (event.target.tagName != 'BUTTON') {return}
    
    toggleLikeList(myUser)
}

function toggleLikeList(user) {
    configObject = createPatchObject(user)
    
    fetch(booksURL+'/'+showPanel.dataset.bookId, configObject)
        .then(res => res.json())
        .then(json => {
            renderLikeList(json.users)
            toggleLikeButton()
        })
}

function toggleLikeButton() {
    button = showPanel.querySelector('#like')
    if (button.textContent === ' like ') {
        button.textContent = ' unlike '
    } else {
        button.textContent = ' like '
    }
}

function renderLikeList(userCollection) {
    const likeList = showPanel.querySelector('ul')
    likeList.innerHTML = ''
    for (const user of userCollection) {
        const userItem = document.createElement('li')
        userItem.dataset.userId = user.id
        userItem.textContent = user.username
        likeList.appendChild(userItem)
    }
}

function createPatchObject(user) {
    // creates a flexible patch object to pass to our fetch()
    const currentUsers = currentLikedUsers()
    let patchBody

    if (listIncludesUser(currentUsers, user)) {
        patchBody = currentUsers.filter(u => u.id != user.id)
    } else {
        patchBody = [...currentUsers]
        patchBody.push(user)
    }

    return {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({'users': patchBody})
    }
}

function currentLikedUsers() {
    // returns array of current liked users as sendable object
    const arr = []
    for (const user of showPanel.querySelector('ul').children) {
        arr.push({
            'id': parseInt(user.dataset.userId),
            'username': user.textContent
        })
    }
    return arr
}

function listIncludesUser(collection, desiredUser) {
    for (const user of collection) {
        if (user.id === desiredUser.id) {return true}
    }
    return false
}


/* */

} );

/* Attribution:

I used code and ideas from this user's repository to help me write 
this solution:

https://github.com/AlecGrey/bookliker-practice-challenge

Thank you!

*/




























