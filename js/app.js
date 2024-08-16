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
      noResults.style.display = 'block';
    } else {
      noResults.classList.add('hidden');
      noResults.style.display = 'none';
      const start = (currentPage - 1) * productsPerPage;
      const end = start + productsPerPage;
      const paginatedProducts = products.slice(start, end);
      paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('bg-white', 'p-4', 'rounded-md', 'shadow-md', 'border');

        productCard.innerHTML = `
          <img src="${product.image || 'default-image-url.jpg'}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-4">
          <h2 class="text-xl font-bold mb-2">${product.name}</h2>
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