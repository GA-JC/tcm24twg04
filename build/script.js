function init() {
    // strict mode ?
    'use strict';

    //MENU DROPDOWN
    function handleDropdownClick(event) {
      event.preventDefault();
      dropdown.classList.toggle('active'); // add active (visibilidade)
    }
  
    // menu drop
    function initDropdownMenu() {
      const destinosBtn = document.getElementById('destinosBtn'); // button
      const dropdown = destinosBtn ? destinosBtn.nextElementSibling : null;
  
      // add event
      if (destinosBtn) {
        destinosBtn.addEventListener('click', handleDropdownClick);
      }
  
      // fechar menu ao clicar fora
      document.addEventListener('click', function (event) {
        if (destinosBtn && !destinosBtn.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
          dropdown.classList.remove('active'); // remover active
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
    const loadCostsBtn = document.getElementById('loadCostsBtn'); // button
    const table = document.getElementById('custosTable');
    const tableFooter = document.querySelector('.table-footer'); // footer table

    if (loadCostsBtn) { // existência button
      loadCostsBtn.addEventListener('click', function () {
        console.log('Botão "loadCostsBtn" clicado');

        // visibilidade da table
        if (table.classList.contains('show')) {
          table.classList.remove('show'); 
          table.style.display = 'none'; // hide
          tableFooter.style.display = 'none'; // hide
        } else {
          const tbody = table.querySelector('tbody');
          tbody.innerHTML = ''; // clear table

          // requisição arquivo XML
          fetch('/custos.xml')
            .then(function (response) {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.text();
            })
            .then(function (data) {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(data, "text/xml");
              const locais = xmlDoc.getElementsByTagName('local');

              const currentPage = window.location.pathname; // caminho da URL
              let currencySymbol = '';
              let cityName = '';

              // entre $ ou €
              if (currentPage.includes('boston.html')) {
                cityName = 'Boston';
                currencySymbol = '$'; // $ para Boston
              } else if (currentPage.includes('monaco.html')) {
                cityName = 'Monaco';
                currencySymbol = '€'; // € para Monaco
              }

              for (let i = 0; i < locais.length; i++) {
                if (locais[i].getAttribute('nome') === cityName) {
                  const custos = locais[i].getElementsByTagName('custo'); // obter elementos <custo>

                  // elementos <custo> e add linhas
                  for (let j = 0; j < custos.length; j++) {
                    const item = custos[j].getElementsByTagName('item')[0].textContent; // item
                    const valor = custos[j].getElementsByTagName('valor')[0].textContent; // valor

                    const row = document.createElement('tr'); // row
                    row.innerHTML = `<td>${item}</td><td>${currencySymbol}${valor}</td>`; // add currencySymbol
                    tbody.appendChild(row); // add linha body table
                  }

                  table.classList.add('show');
                  table.style.display = 'table';
                  tableFooter.style.display = 'block';
                }
              }
            })
            .catch(function (error) {
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
