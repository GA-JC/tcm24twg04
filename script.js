///DROPDOWN MENU NAV
// lista de nav
const destinosBtn = document.getElementById('destinosBtn');
const dropdown = destinosBtn.nextElementSibling; // dropdown

// add event click
    destinosBtn.addEventListener('click', (event) => {
    event.preventDefault(); // prevenir comportamento do link
    dropdown.classList.toggle('active'); // ativar class do dropdown
});

// fechar o dropdown (click)
document.addEventListener('click', (event) => {
    if (!destinosBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active'); // remover classe ao clicar fora
    }
});






/// CAROUSEL IMG INDEX
let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');

// mostrar img
function showImage(index) {
    images.forEach((img, i) => {
        img.style.display = (i === index) ? 'block' : 'none';
    });
}

// img inicial
showImage(currentIndex);

// prox img
function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length; // loop
    showImage(currentIndex); // new img
}

// img ant
function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length; // loop
    showImage(currentIndex); // new img
}

// event click buttons
document.querySelector('.prev').addEventListener('click', showPrevImage);
document.querySelector('.next').addEventListener('click', showNextImage);