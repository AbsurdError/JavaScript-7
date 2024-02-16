
document.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.tagName === 'A') {
        console.log(event.target.href); 
        route(event);
        handleLocation();
    }
});

const route = (event) => {
    window.history.pushState({}, '', event.target.href);
}

const routes = {
    '/log-in': 'log-in.html',
    '/log-up': 'log-up.html',
    '/comments': 'comments.html',
    '/posts': 'posts.html'
}

const handleLocation = async () => {
    let path = window.location.pathname;
    if (path === '/posts') {
        document.querySelector('.wrap').innerHTML = '<h1 class="title">🎮My posts🎮</h1><div class="scroll__block"></div>'; // Исправленная строка
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => printPosts(data)); 
    } else {
        let html = await fetch(routes[path]).then(response => response.text());
        document.querySelector('.wrap').innerHTML = html;
    }
}

window.onpopstate = handleLocation; 
window.route = route; 
handleLocation();

const getPosts = () => {
    document.querySelector('.wrap').innerHTML = '<h1>🎮My posts🎮</h1>';
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => printPosts(data)); 
}

function printPosts(posts) {
    posts.forEach(post => { 
        const postElement = document.createElement('div');
        postElement.classList.add('block');
        postElement.innerHTML = `
            <h4 class='title'> ${post.title}</h4>
            <p class='text'> ${post.body} </p>
            <button class="toggle-comments-btn">Show Comments</button>
            <div class='comments' id='comments-${post.id}' style="display: none;"></div>
        `;
        document.querySelector('.scroll__block').appendChild(postElement);

        const commentsContainer = postElement.querySelector(`#comments-${post.id}`);
        const toggleButton = postElement.querySelector('.toggle-comments-btn');

        toggleButton.addEventListener('click', () => {
            if (commentsContainer.style.display === 'none') {
                commentsContainer.style.display = 'block';
                toggleButton.textContent = 'Hide Comments';
            } else {
                commentsContainer.style.display = 'none';
                toggleButton.textContent = 'Show Comments';
            }
        });

        fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
            .then(response => response.json())
            .then(comments => {
                comments.forEach(comment => {
                    commentsContainer.insertAdjacentHTML('beforeend',
                        `<div class='comment'>
                            <strong>${comment.name}</strong> <br>: ${comment.body}
                        </div>`
                    );
                });
            });
    });
}

// registration //
let users = [],
    isAuth = false;
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn_reg')){
        let form = document.forms[0],
        login = form.elements[0].value,
        email = form.elements[1].value,
        psw = form.elements[2].value,
        psw2 = form.elements[3].value;
        event.preventDefault();
        if (psw === psw2 && psw !== ''){
            users.push({login,email,psw})
            isAuth = true;
        } else {
            isAuth = false;
        }
        console.log(users)
        console.log(isAuth)
    }
})
// Authorization //
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn_auth')){
        let form = document.forms[0],
            login = form.elements[0].value,
            psw = form.elements[1].value;

        event.preventDefault();

        let authenticatedUser = users.find(user => user.login === login && user.psw === psw);

        if (authenticatedUser){
            isAuth = true;
        } else {
            isAuth = false;
        }

        console.log(isAuth);
    }
});


