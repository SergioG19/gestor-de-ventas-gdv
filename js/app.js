document.addEventListener('DOMContentLoaded', async () => {
  const productList = document.getElementById('productList');
  const searchBar = document.getElementById('searchBar');
  const filter = document.getElementById('filter');
  const noResults = document.getElementById('noResults');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const pageNumbers = document.getElementById('pageNumbers');
  const footer = document.querySelector('footer');

  let products = [];
  let filteredProducts = [];
  let currentPage = 1;
  const productsPerPage = 6;

  // Estilos para el contenedor de productos
  productList.style.display = 'grid';
  productList.style.gap = '20px';
  productList.style.justifyContent = 'center';
  productList.style.padding = '20px';

  // Estilos para grid responsivo
  const updateGridColumns = () => {
    if (window.innerWidth >= 1024) {
      productList.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 3 columnas en pantallas grandes
    } else if (window.innerWidth >= 768) {
      productList.style.gridTemplateColumns = 'repeat(2, 1fr)'; // 2 columnas en pantallas medianas
    } else {
      productList.style.gridTemplateColumns = 'repeat(1, 1fr)'; // 1 columna en pantallas pequeñas
    }
  };
  updateGridColumns();
  window.addEventListener('resize', updateGridColumns);

  // Eliminar absolute positioning en el footer
  footer.style.position = 'relative'; 
  footer.style.width = '100%';

  // Función para mostrar productos en la página de inicio
  function renderProducts(productsToRender) {
    productList.innerHTML = '';
    if (productsToRender.length === 0) {
      noResults.classList.remove('hidden');
      noResults.style.display = 'block';
    } else {
      noResults.classList.add('hidden');
      noResults.style.display = 'none';

      const start = (currentPage - 1) * productsPerPage;
      const end = start + productsPerPage;
      const paginatedProducts = productsToRender.slice(start, end);

      paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Establecer el estilo para las tarjetas de productos responsivas
        productCard.style.width = '100%';
        productCard.style.height = 'auto';
        productCard.style.padding = '20px';
        productCard.style.boxSizing = 'border-box';
        productCard.style.border = '1px solid #ddd';
        productCard.style.borderRadius = '10px';
        productCard.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        productCard.style.backgroundColor = '#fff';

        const imageUrl = product.image ? `http://localhost:3000/uploads/${product.image}` : '';

        productCard.innerHTML = `
          <img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 10px; border-radius: 8px;">
          <h2 style="font-size: 1rem; font-weight: bold; margin-bottom: 8px;">${product.name}</h2>
          <p style="font-size: 1rem; font-weight: bold; color: #333; margin-bottom: 8px;">$${product.price}</p>
          <p style="color: green; margin-bottom: 8px;">Envío gratis</p>
          <p style="color: #555; margin-bottom: 8px;">${product.description}</p>
          <p style="color: #777; font-size: 0.8rem;">Vendedor: ${product.seller.name}</p>
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
        renderProducts(filteredProducts);
        updatePageNumbers();
      });
      pageNumbers.appendChild(pageNumber);
    }

    // Centrar la paginación
    pageNumbers.style.display = 'flex';
    pageNumbers.style.justifyContent = 'center';
    pageNumbers.style.marginTop = '20px';
  }

  // Función para actualizar la paginación
  function updatePageNumbers() {
    const pageNumberButtons = document.querySelectorAll('.page-number');
    pageNumberButtons.forEach((button, index) => {
      if (index + 1 === currentPage) {
        button.classList.add('bg-blue-500', 'text-red');
      } else {
        button.classList.remove('bg-blue-500', 'text-red');
      }
    });
  }
  async function fetchAllProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        products = await response.json();

        filteredProducts = products;
        renderProducts(filteredProducts);
        displayPagination(filteredProducts.length);
        updatePageNumbers();
      } else {
        console.error('Error fetching products:', response.status);
        noResults.classList.remove('hidden');
        noResults.style.display = 'block';
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      noResults.classList.remove('hidden');
      noResults.style.display = 'block';
    }
  }

  // Obtener productos del vendedor autenticado para el dashboard
  async function fetchSellerProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        products = await response.json();
        filteredProducts = products;
        renderProducts(filteredProducts);
        displayPagination(filteredProducts.length);
        updatePageNumbers();
      } else {
        console.error('Error fetching products:', response.status);
        noResults.classList.remove('hidden');
        noResults.style.display = 'block';
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      noResults.classList.remove('hidden');
      noResults.style.display = 'block';
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
    renderProducts(filteredProducts);
    displayPagination(filteredProducts.length);
    updatePageNumbers();
  });

  // Buscar productos
  searchBar.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue));
    currentPage = 1;
    renderProducts(filteredProducts);
    displayPagination(filteredProducts.length);
    updatePageNumbers();
  });

  // Mostrar todos los productos al cargar la página (o solo los del vendedor, según el contexto)
  if (window.location.pathname.includes('dashboard.html')) {
    fetchSellerProducts();
  } else {
    fetchAllProducts();
  }

  // Paginación
  prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts(filteredProducts);
      updatePageNumbers();
    }
  });

  nextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts(filteredProducts);
      updatePageNumbers();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const editUserForm = document.getElementById('editUserForm');
  const userNav = document.getElementById('userNav');

  // Función para manejar el inicio de sesión
  async function handleLogin(event) {
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'index.html';
      } else {
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      alert('Error en el inicio de sesión. Por favor, intenta de nuevo.');
    }
  }

  // Función para manejar el registro
  async function handleRegister(event) {
    event.preventDefault();
    const name = registerForm.name.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const role = registerForm.role.value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      if (response.ok) {
        alert('Registro exitoso. Por favor, inicia sesión.');
        window.location.href = 'login.html';
      } else {
        alert('Error en el registro. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error en el registro. Por favor, intenta de nuevo.');
    }
  }

  // Función para manejar la edición de usuario
  async function handleEditUser(event) {
    event.preventDefault();
    const name = editUserForm.name.value;
    const email = editUserForm.email.value;
    const password = editUserForm.password.value;
    const role = editUserForm.role.value;
    const user = JSON.parse(localStorage.getItem('user'));

    if (confirm('¿Seguro que quieres realizar estos cambios?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/update/${user._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ name, email, password, role })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = 'index.html';
        } else {
          alert('Error al actualizar. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar. Por favor, intenta de nuevo.');
      }
    }
  }

  // Función para cerrar sesión
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }

  // Función para mostrar opciones del usuario autenticado
  function showUserOptions() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role === 'seller') {
        userNav.innerHTML = `
          <span class="px-4">Hola, ${user.name}</span>
          <a href="dashboard.html" class="px-4">Dashboard</a>
          <a href="edit-user.html" class="px-4">Editar Usuario</a>
          <a href="#" id="logoutBtn" class="px-4">Cerrar Sesión</a>
        `;
      } else {
        userNav.innerHTML = `
          <span class="px-4">Hola, ${user.name}</span>
          <a href="edit-user.html" class="px-4">Editar Usuario</a>
          <a href="#" id="logoutBtn" class="px-4">Cerrar Sesión</a>
        `;
      }

      const logoutBtn = document.getElementById('logoutBtn');
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (editUserForm) {
    const user = JSON.parse(localStorage.getItem('user'));
    editUserForm.name.value = user.name;
    editUserForm.email.value = user.email;
    editUserForm.role.value = user.role;
    editUserForm.addEventListener('submit', handleEditUser);
  }

  showUserOptions();
});
