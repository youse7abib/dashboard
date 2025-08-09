
//login

// theme
if (localStorage.getItem('theme') === 'white') {
    document.body.classList.add('white-theme');
}

document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('white-theme');
    if (document.body.classList.contains('white-theme')) {
        localStorage.setItem('theme', 'white');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});



