function init() {
  // strict mode ?
  'use strict';

// menu drop
function initDropdownMenu() {
  const destinosBtn = document.getElementById('destinosBtn'); // button
  const dropdown = destinosBtn ? destinosBtn.nextElementSibling : null;

  // add event
  if (destinosBtn) {
      // Mostrar dropdown ao passar o mouse
      destinosBtn.addEventListener('mouseenter', function() {
          dropdown.style.display = "block"; // mostrar dropdown ao passar o mouse
      });

      // Esconder dropdown ao sair do mouse
      destinosBtn.addEventListener('mouseleave', function() {
          dropdown.style.display = "none"; // esconder dropdown ao sair
      });

      // Esconder dropdown ao sair do mouse do dropdown
      dropdown.addEventListener('mouseenter', function() {
          dropdown.style.display = "block"; // manter dropdown visível ao passar o mouse
      });

      dropdown.addEventListener('mouseleave', function() {
          dropdown.style.display = "none"; // esconder dropdown ao sair
      });
  }

  // fechar menu ao clicar fora
  document.addEventListener('click', function (event) {
      if (destinosBtn && !destinosBtn.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
          dropdown.style.display = "none"; // Esconde o dropdown ao clicar fora
      }
  });
}

  // CARROSSEL IMGS
  function initCarousel() {
    let currentIndex = 0; // índice atual
    const images = document.querySelectorAll('.carousel img'); // img
    const prevButton = document.querySelector('.prev'); // button ant
    const nextButton = document.querySelector('.next'); // button prox

    function showImage(index) {
      images.forEach(function (img, i) {
        img.style.display = (i === index) ? 'block' : 'none'; // mostrar ou esconder
      });
    }

    // mostrar img inicial
    showImage(currentIndex);

    // mostrar prox img
    function showNextImage() {
      currentIndex = (currentIndex + 1) % images.length; // +
      showImage(currentIndex); // atualizar
    }

    // mostrar img ant
    function showPrevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length; // -
      showImage(currentIndex); // atualizar
    }

    // add event buttons
    if (prevButton) {
      prevButton.addEventListener('click', showPrevImage); // event button ant
  }

  if (nextButton) {
    nextButton.addEventListener('click', showNextImage); // event button prox
  }
}

// DADOS XML TO TABLE
function initLoadCosts() {
  const loadCostsBtn = document.getElementById('loadCostsBtn');
  const table = document.getElementById('custosTable');
  const tableFooter = document.querySelector('.table-footer');

  // verificar o botão antes de add event listener
  if (loadCostsBtn) {
      loadCostsBtn.addEventListener('click', function () {
          console.log('Botão "loadCostsBtn" clicado');

          if (table.classList.contains('show')) {
              table.classList.remove('show');
              table.style.display = 'none';
              tableFooter.style.display = 'none';
          } else {
              const tbody = table.querySelector('tbody');
              tbody.innerHTML = ''; // clear table

              fetch('data/custos.xml')
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.text();
                  })
                  .then(data => {
                      const parser = new DOMParser();
                      const xmlDoc = parser.parseFromString(data, "text/xml");
                      const locais = xmlDoc.getElementsByTagName('local');

                      const currentPage = window.location.pathname;
                      let currencySymbol = '';
                      let cityName = '';

                      if (currentPage.includes('boston.html')) {
                          cityName = 'Boston';
                          currencySymbol = '$';
                      } else if (currentPage.includes('monaco.html')) {
                          cityName = 'Monaco';
                          currencySymbol = '€';
                      }

                      for (let i = 0; i < locais.length; i++) {
                          if (locais[i].getAttribute('nome') === cityName) {
                              const custos = locais[i].getElementsByTagName('custo');

                              for (let j = 0; j < custos.length; j++) {
                                  const item = custos[j].getElementsByTagName('item')[0].textContent;
                                  const valor = custos[j].getElementsByTagName('valor')[0].textContent;

                                  const escapedItem = item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                  const escapedValor = valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

                                  const row = `<tr><td>${escapedItem}</td><td>${currencySymbol}${escapedValor}</td></tr>`;
                                  tbody.innerHTML += row; // add row body
                              }

                              // table
                              table.classList.add('show');
                              table.style.display = 'table';
                              tableFooter.style.display = 'block';
                          }
                      }
                  })
                  .catch(error => {
                      console.error('Erro ao carregar o XML:', error); // erro xml
                  });
          }
      });
  }
}


document.addEventListener('DOMContentLoaded', function () {
  initDropdownMenu();
  initCarousel();
  initLoadCosts();
});
}

init();