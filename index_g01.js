// Attribution(s) below:

const booksURL = 'http://localhost:3000/books'
const URL_BASE = 'http://localhost:3000/'
const list = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const myUser = {"id":1, "username":"pouros"}

document.addEventListener("DOMContentLoaded", function() {

// Function Call(s):
getBooks().then(console.log).catch(console.log);

function getBooks() {
    return fetch(`${URL_BASE}books`)
    .then(r => r.json());
}


} );

/* Attribution:

I used code and ideas from this user's repository to help me write 
this solution:

https://github.com/AlecGrey/bookliker-practice-challenge

Thank you!

*/