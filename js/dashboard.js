document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userGreeting = document.getElementById('userGreeting');
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutBtnSecondary = document.getElementById('logoutBtnSecondary');
  const menuGeneral = document.getElementById('menuGeneral');
  const menuInventario = document.getElementById('menuInventario');
  const menuConfig = document.getElementById('menuConfig');
  const dashboardContent = document.getElementById('dashboardContent');
  const sidebar = document.querySelector('.sidebar');
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const secondaryHamburgerMenu = document.getElementById('secondaryHamburgerMenu');
  const secondaryMenu = document.getElementById('secondaryMenu');
  const closeSidebar = document.getElementById('closeSidebar');
  const backToTop = document.getElementById('backToTop');
  let currentPage = 1;

  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  userGreeting.textContent = `Bienvenido, ${user.name}`;

  logoutBtn.addEventListener('click', handleLogout);
  logoutBtnSecondary.addEventListener('click', handleLogout);

  // Toggle sidebar visibility on mobile
  hamburgerMenu.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Toggle secondary menu visibility
  secondaryHamburgerMenu.addEventListener('click', () => {
    secondaryMenu.style.display = secondaryMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Close sidebar when the close button is clicked
  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });

  // Close sidebar when a menu item is clicked (for mobile)
  [menuGeneral, menuInventario, menuConfig].forEach(menuItem => {
    menuItem.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  });

  // Scroll to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Load General Content by default
  loadGeneralContent();

  menuGeneral.addEventListener('click', loadGeneralContent);
  menuInventario.addEventListener('click', loadInventarioContent);
  menuConfig.addEventListener('click', loadConfigContent);

  // Function to handle logout
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }

  // Function to load General Content
  function loadGeneralContent() {
    dashboardContent.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-4" style="margin-top: 24px;">Estadísticas Generales</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <h3>Total de Productos Publicados</h3>
          <p id="totalProducts">Cargando...</p>
        </div>
        <div class="stat-item">
          <h3>Total de Productos Vendidos</h3>
          <p id="totalSold">Cargando...</p>
        </div>
        <div class="stat-item">
          <h3>Total de Compradores</h3>
          <p id="totalBuyers">Cargando...</p>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4" style="margin-top: 24px;">Historial de Ventas</h2>
      <div class="table-container">
        <table class="responsive-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Comprador</th>
              <th>Email</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody id="salesTableBody">
            <!-- Productos vendidos se cargarán aquí -->
          </tbody>
        </table>
        <div id="paginationControls" class="pagination-controls">
          <!-- Controles de paginación -->
        </div>
      </div>
    `;

    fetchStats();
    fetchSales(); // Cargar las ventas cuando se cargue el contenido general
  }

  // Function to fetch statistics of the authenticated seller
  async function fetchStats() {
    try {
      const response = await fetch('http://localhost:3000/api/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const stats = await response.json();
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('totalSold').textContent = stats.totalSold;
        document.getElementById('totalBuyers').textContent = stats.totalBuyers;
      } else {
        console.error('Error fetching statistics:', response.status);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }

  // Function to fetch and render sales
  async function fetchSales(page = 1) {
    try {
      const response = await fetch(`http://localhost:3000/api/sales?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const salesData = await response.json();
        renderSales(salesData.sales, salesData.totalPages, page);
      } else {
        console.error('Error fetching sales:', response.status);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }

  // Función para renderizar las ventas en la tabla
  function renderSales(sales, totalPages, currentPage) {
    const salesTableBody = document.getElementById('salesTableBody');
    salesTableBody.innerHTML = '';

    sales.forEach(sale => {
        const tr = document.createElement('tr');
        const imageUrl = sale.product.image ? `http://localhost:3000/uploads/${sale.product.image}` : '/images/no-image.png';

        tr.innerHTML = `
            <td><img src="${imageUrl}" alt="${sale.product.name}" style="width: 50px; height: 50px; object-fit: contain;"></td>
            <td>${sale.product.name}</td>
            <td>$${sale.product.price}</td>
            <td>${sale.buyer.name}</td>
            <td>${sale.buyer.email}</td>
            <td>${sale.quantity}</td>
        `;
        salesTableBody.appendChild(tr);
    });

    renderPaginationControls(totalPages, currentPage);
}

// Función para renderizar los controles de paginación
// Función para renderizar los controles de paginación
function renderPaginationControls(totalPages, currentPage) {
  const paginationControls = document.getElementById('paginationControls');
  paginationControls.innerHTML = '';
  paginationControls.style.display = 'flex';
  paginationControls.style.justifyContent = 'center';
  paginationControls.style.marginTop = '20px';

  const createButton = (text, disabled, onClick) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.classList.add('page-button');
      button.disabled = disabled;
      button.style.padding = '10px 15px';
      button.style.margin = '0 5px';
      button.style.border = '1px solid #ddd';
      button.style.borderRadius = '5px';
      button.style.backgroundColor = disabled ? '#f0f0f0' : '#1d4ed8';
      button.style.color = disabled ? '#999' : '#fff';
      button.style.cursor = disabled ? 'not-allowed' : 'pointer';
      button.addEventListener('click', onClick);
      return button;
  };

  // Botón Anterior
  const prevButton = createButton('Anterior', currentPage === 1, () => {
      if (currentPage > 1) {
          fetchSales(currentPage - 1);
      }
  });
  paginationControls.appendChild(prevButton);

  // Botones de página
  for (let i = 1; i <= totalPages; i++) {
      const button = createButton(i, false, () => fetchSales(i));
      if (i === currentPage) {
          button.style.backgroundColor = '#3b82f6';
          button.style.color = '#ffffff';
      }
      paginationControls.appendChild(button);
  }

  // Botón Siguiente
  const nextButton = createButton('Siguiente', currentPage === totalPages, () => {
      if (currentPage < totalPages) {
          fetchSales(currentPage + 1);
      }
  });
  paginationControls.appendChild(nextButton);
}


// Función para cargar el contenido del inventario
function loadInventarioContent() {
    dashboardContent.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-4" style="margin-top: 24px;">Inventario de Productos</h2>
        <button id="addProductBtn" class="hover:bg-green-600 text-black px-4 py-2 rounded mb-4" style="background-color: #00b4d8; margin-top: 24px;">Agregar Producto</button>

        <div id="successMessage" class="text-green-500 font-bold mb-4 hidden" style="margin-top:24px;"></div>

        <div class="table-container">
            <table class="responsive-table">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="productsTableBody">
                    <!-- Productos se cargarán aquí -->
                </tbody>
            </table>
        </div>
        <p id="noProductsMessage" class="text-gray-600 mt-4 hidden">Todavía no se ha agregado ningún producto.</p>
    `;
    fetchProducts(); // Cargar los productos del vendedor autenticado desde la base de datos

    document.getElementById('addProductBtn').addEventListener('click', () => {
        showProductForm();
    });
}


  // Function to show the product form
  function showProductForm(product = {}) {
    let existingForm = document.getElementById('productForm');
    if (existingForm) {
        existingForm.style.display = 'block';
        return;
    }

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const formContainer = document.createElement('div');
    formContainer.id = 'productForm';
    formContainer.classList.add('popup-form', 'active');
    formContainer.innerHTML = `
        <div class="form-container">
            <h2 class="text-xl font-bold mb-4">${product._id ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form id="addProductForm" class="space-y-4 responsive-form">
                <div class="form-control">
                    <label for="productName" class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input type="text" id="productName" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required value="${product.name || ''}">
                </div>
                <div class="form-control">
                    <label for="productPrice" class="block text-sm font-medium text-gray-700">Precio</label>
                    <input type="number" id="productPrice" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required value="${product.price || ''}">
                </div>
                <div class="form-control">
                    <label for="productDescription" class="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea id="productDescription" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>${product.description || ''}</textarea>
                </div>
                <div class="form-control">
                    <label for="productCategory" class="block text-sm font-medium text-gray-700">Categoría</label>
                    <select id="productCategory" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
                        <option value="">Seleccione una categoría</option>
                        <option value="Electrodomésticos" ${product.category === 'Electrodomésticos' ? 'selected' : ''}>Electrodomésticos</option>
                        <option value="Tecnología" ${product.category === 'Tecnología' ? 'selected' : ''}>Tecnología</option>
                        <option value="Supermercado" ${product.category === 'Supermercado' ? 'selected' : ''}>Supermercado</option>
                    </select>
                </div>
                <div class="form-control">
                    <label for="productQuantity" class="block text-sm font-medium text-gray-700">Cantidad</label>
                    <input type="number" id="productQuantity" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required value="${product.quantity || 1}">
                </div>
                <div class="form-control">
                    <label for="productImage" class="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                    <input type="file" id="productImage" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div class="form-actions flex justify-end space-x-4">
                    <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">${product._id ? 'Actualizar' : 'Guardar'}</button>
                    <button type="button" class="cancel-btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    dashboardContent.appendChild(formContainer);
    document.body.classList.add('form-open');

    document.getElementById('addProductForm').addEventListener('submit', (e) => handleProductFormSubmit(e, product._id));
    document.querySelector('.cancel-btn').addEventListener('click', () => {
        formContainer.remove();
        overlay.remove();
        document.body.classList.remove('form-open');
    });
  }

  // Function to handle product form submission
  async function handleProductFormSubmit(e, productId) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('price', parseFloat(document.getElementById('productPrice').value));
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('category', document.getElementById('productCategory').value);
    formData.append('quantity', parseInt(document.getElementById('productQuantity').value));  // Añadir cantidad

    const imageFile = document.getElementById('productImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
      const url = productId ? `http://localhost:3000/api/products/${productId}` : 'http://localhost:3000/api/products';
      const method = productId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: formData
      });

      if (response.ok) {
        // Display success message
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = productId ? 'Producto actualizado con éxito' : 'Producto agregado con éxito';
        successMessage.classList.remove('hidden');
        successMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);

        // Reload products to reflect the changes
        fetchProducts();
        document.getElementById('productForm').remove();  // Close form
        document.querySelector('.overlay').remove(); // Remove overlay when form is closed
        document.body.classList.remove('form-open'); // Remove background opacity
      } else {
        const errorResponse = await response.json();
        console.error('Error processing the product:', errorResponse);
        if (errorResponse.errors && errorResponse.errors.length > 0) {
          alert('Error processing the product: ' + errorResponse.errors[0].msg);
        }
      }
    } catch (error) {
      console.error('Network or other error:', error);
    }
  }

  // Function to fetch and filter products by the authenticated user (seller)
  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const products = await response.json();
        renderProducts(products);
      } else {
        console.error('Error fetching products:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Function to render products in the table
  function renderProducts(products) {
    const productsTableBody = document.getElementById('productsTableBody');
    const noProductsMessage = document.getElementById('noProductsMessage');
    productsTableBody.innerHTML = ''; // Clear table

    if (products.length === 0) {
      noProductsMessage.classList.remove('hidden'); 
      noProductsMessage.style.display = 'block';
    } else {
      noProductsMessage.classList.add('hidden');
      noProductsMessage.style.display = 'none';
      products.forEach(product => {
        const tr = document.createElement('tr');

        // Ensure the image path is correctly formed
        const imageUrl = product.image ? `http://localhost:3000/uploads/${product.image}` : '/images/no-image.png';

        tr.innerHTML = `
          <td><img src="${imageUrl}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain;"></td>
          <td>${product.name}</td>
          <td>$${product.price}</td>
          <td>${product.description}</td>
          <td>${product.category}</td>
          <td>${product.quantity}</td>  <!-- Mostrar cantidad -->
          <td class="table-actions">
            <button class="edit-btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Editar</button>
            <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
          </td>
        `;

        tr.querySelector('.edit-btn').addEventListener('click', () => showProductForm(product));
        tr.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product._id));

        productsTableBody.appendChild(tr);
      });
    }
  }

  // Function to delete a product
  async function deleteProduct(productId) {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        });

        if (response.ok) {
          fetchProducts(); // Reload products after deletion
        } else {
          console.error('Error deleting product:', response.status);
          alert('Error deleting product.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      }
    }
  }

  // Handle user update
  async function handleUserUpdate(event) {
    event.preventDefault();
    const editUserForm = event.target;
    const name = editUserForm.name.value;
    const email = editUserForm.email.value;
    const password = editUserForm.password.value;
    const role = editUserForm.role.value;

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
});
