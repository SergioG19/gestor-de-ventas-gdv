document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('productList');
    const searchBar = document.getElementById('searchBar');
    const filter = document.getElementById('filter');
    const noResults = document.getElementById('noResults');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
  
    let products = [];
    let filteredProducts = [];
    let currentPage = 1;
    const productsPerPage = 4;
  
    // Función para mostrar productos
    function displayProducts(products) {
      productList.innerHTML = '';
      if (products.length === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = products.slice(start, end);
        paginatedProducts.forEach(product => {
          const productCard = document.createElement('div');
          productCard.classList.add('bg-white', 'p-4', 'rounded-md', 'shadow-md', 'border');
  
          productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-4">
            <h2 class="text-xl font-bold mb-2">${product.name}</h2>
            <p class="text-green-600 font-bold">Oferta del Día</p>
            <p class="text-red-600 line-through">$${product.originalPrice ?? ''}</p>
            <p class="text-gray-900 font-bold mb-2">$${product.price}</p>
            <p class="text-green-600">Envío gratis</p>
            <p class="text-gray-700 mb-2">${product.description}</p>
            <p class="text-gray-600 text-sm">Vendedor: ${product.vendor.name}</p>
          `;
  
          productList.appendChild(productCard);
        });
      }
    }
  
    // Función para mostrar paginación
    function displayPagination(totalProducts) {
      pageNumbers.innerHTML = '';
      const totalPages = Math.ceil(totalProducts / productsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('button');
        pageNumber.classList.add('px-4', 'py-2', 'border', 'rounded-md', 'mx-1', 'page-number');
        pageNumber.innerText = i;
        pageNumber.addEventListener('click', () => {
          currentPage = i;
          displayProducts(filteredProducts);
          updatePageNumbers();
        });
        pageNumbers.appendChild(pageNumber);
      }
    }
  
    // Función para actualizar la paginación
    function updatePageNumbers() {
      const pageNumberButtons = document.querySelectorAll('.page-number');
      pageNumberButtons.forEach((button, index) => {
        if (index + 1 === currentPage) {
          button.classList.add('bg-blue-500', 'text-white');
        } else {
          button.classList.remove('bg-blue-500', 'text-white');
        }
      });
    }
  
    // Obtener productos desde el backend
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        products = await response.json();
        filteredProducts = products;
        displayProducts(filteredProducts);
        displayPagination(filteredProducts.length);
        updatePageNumbers();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    // Filtrar productos
    filter.addEventListener('change', (e) => {
      const filterValue = e.target.value;
      if (filterValue === 'all') {
        filteredProducts = products;
      } else if (filterValue === 'price_asc') {
        filteredProducts = [...products].sort((a, b) => a.price - b.price);
      } else if (filterValue === 'price_desc') {
        filteredProducts = [...products].sort((a, b) => b.price - a.price);
      } else if (filterValue === 'category_appliances') {
        filteredProducts = products.filter(product => product.category === 'Electrodomésticos');
      } else if (filterValue === 'category_tech') {
        filteredProducts = products.filter(product => product.category === 'Tecnología');
      } else if (filterValue === 'category_supermarket') {
        filteredProducts = products.filter(product => product.category === 'Supermercado');
      }
      currentPage = 1;
      displayProducts(filteredProducts);
      displayPagination(filteredProducts.length);
      updatePageNumbers();
    });
  
    // Buscar productos
    searchBar.addEventListener('input', (e) => {
      const searchValue = e.target.value.toLowerCase();
      filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue));
      currentPage = 1;
      displayProducts(filteredProducts);
      displayPagination(filteredProducts.length);
      updatePageNumbers();
    });
  
    // Mostrar todos los productos al cargar la página
    fetchProducts();
  
    // Paginación
    prevPage.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayProducts(filteredProducts);
        updatePageNumbers();
      }
    });
  
    nextPage.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        displayProducts(filteredProducts);
        updatePageNumbers();
      }
    });
  });
  