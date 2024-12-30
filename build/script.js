function init() {
  // strict mode ?
  'use strict';

  // MENU DROP
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
  const downloadBtn = document.getElementById('downloadBtn');

  if (!loadCostsBtn) {
    const currentPage = window.location.pathname;
    if (currentPage.includes('boston.html') || currentPage.includes('monaco.html')) {
      console.error('Botão "loadCostsBtn" não encontrado no DOM.');
    }
    return;
  }

  loadCostsBtn.addEventListener('click', function () {
      console.log('Botão "loadCostsBtn" clicado');

      const tbody = table.querySelector('tbody');
      tbody.innerHTML = ''; // clear table

      // verificar visibilidade
      if (table.classList.contains('show')) {
          table.classList.remove('show');
          table.style.display = 'none';
          tableFooter.style.display = 'none';
          downloadBtn.style.display = 'none';
      } else {
          // if table hidden, fetch
          fetch('custos.xml')
              .then(response => {
                  if (!response.ok) {
                      console.error('Erro na resposta da rede:', response.status, response.statusText);
                      throw new Error('Network response was not ok');
                  }
                  return response.text();
              })
              .then(data => {
                  console.log('Dados XML recebidos:', data);
                  const parser = new DOMParser();
                  const xmlDoc = parser.parseFromString(data, "text/xml");
                  const locais = xmlDoc.getElementsByTagNameNS("https://tcm24twg04.netlify.app", "local");

                  if (locais.length === 0) {
                      console.error('Nenhum local encontrado no XML.');
                      return; // retornar se não houver locais
                  }

                  const currentPage = window.location.pathname;
                  let currencySymbol = '';
                  let cityName = '';

                  // verificar página atual
                  if (currentPage.includes('/boston')) {
                      cityName = 'Boston';
                      currencySymbol = '$';
                  } else if (currentPage.includes('/monaco')) {
                      cityName = 'Monaco';
                      currencySymbol = '€';
                  }

                  console.log('Página atual:', currentPage);
                  console.log('Cidade a verificar:', cityName);
                  let foundCity = false;

                  for (let i = 0; i < locais.length; i++) {
                      console.log('Verificando local:', locais[i].getAttribute('nome'));
                      if (locais[i].getAttribute('nome') === cityName) {
                          foundCity = true;
                          const custos = locais[i].getElementsByTagNameNS("https://tcm24twg04.netlify.app", "custo");

                          if (custos.length === 0) {
                              console.error('Nenhum custo encontrado para a cidade:', cityName);
                              return;
                          }

                          for (let j = 0; j < custos.length; j++) {
                              const item = custos[j].getElementsByTagNameNS("https://tcm24twg04.netlify.app", "item")[0].textContent;
                              const valor = custos[j].getElementsByTagNameNS("https://tcm24twg04.netlify.app", "valor")[0].textContent;

                              const row = document.createElement('tr');
                              const cellItem = document.createElement('td');
                              cellItem.textContent = item;

                              const cellValor = document.createElement('td');
                              cellValor.textContent = `${currencySymbol}${valor}`;

                              row.appendChild(cellItem);
                              row.appendChild(cellValor);
                              tbody.appendChild(row); // add row to table body
                          }

                          // mostrar table dps de carregar os dados
                          table.classList.add('show');
                          table.style.display = 'table';
                          tableFooter.style.display = 'block';
                          downloadBtn.style.display = 'block';
                          console.log('Tabela exibida com os dados carregados.');
                      }
                  }

                  if (!foundCity) {
                      console.error('Cidade não encontrada no XML:', cityName);
                  }
              })
              .catch(error => {
                  console.error('Erro ao carregar o XML:', error);
              });
      }
  });
}

//Botão Download XML e XSD
function initDownloadBtn() {
  const downloadBtn = document.getElementById('downloadBtn');

  if (downloadBtn) {
      downloadBtn.addEventListener('click', function() {
          // criar instância do JSZip
          var zip = new JSZip();

          // requisição para obter os arquivos XML e XSD
          Promise.all([
              fetch('custos.xml').then(response => response.text()),
              fetch('custos.xsd').then(response => response.text())
          ]).then(function(files) {
              // add arquivos ao zip
              zip.file("custos.xml", files[0]); // Add XML
              zip.file("custos.xsd", files[1]); // Add XSD

              // criar ZIP
              zip.generateAsync({ type: "blob" })
                  .then(function(content) {
                      // criar link download
                      var link = document.createElement('a');
                      link.href = URL.createObjectURL(content);
                      link.download = "arquivos_xml-xsd.zip"; // nome zip
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                  });
          }).catch(function(error) {
              console.error('Erro ao baixar os arquivos:', error);
          });
      });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initDropdownMenu();
  initCarousel();
  initLoadCosts();
  initDownloadBtn()
});
}

init();