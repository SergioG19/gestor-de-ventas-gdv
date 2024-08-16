document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userGreeting = document.getElementById('userGreeting');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuGeneral = document.getElementById('menuGeneral');
  const menuInventario = document.getElementById('menuInventario');
  const menuConfig = document.getElementById('menuConfig');
  const dashboardContent = document.getElementById('dashboardContent');

  if (user) {
    userGreeting.textContent = `Bienvenido, ${user.name}`;
  } else {
    window.location.href = 'login.html';
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  // Cargar contenido inicial (General)
  loadGeneralContent();

  // Evento para el menú de General
  menuGeneral.addEventListener('click', loadGeneralContent);

  // Evento para el menú de Inventario
  menuInventario.addEventListener('click', loadInventarioContent);

  // Evento para el menú de Configuración de Usuario
  menuConfig.addEventListener('click', loadConfigContent);

  // Función para cargar el contenido del menú General
  function loadGeneralContent() {
    dashboardContent.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Estadísticas Generales</h2>
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
    `;
    fetchStats();
  }

  async function fetchStats() {
    try {
      const response = await fetch('http://localhost:3000/api/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const stats = await response.json();
      document.getElementById('totalProducts').textContent = stats.totalProducts;
      document.getElementById('totalSold').textContent = stats.totalSold;
      document.getElementById('totalBuyers').textContent = stats.totalBuyers;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  }

  // Función para cargar el contenido del menú Inventario
  function loadInventarioContent() {
    dashboardContent.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Inventario de Productos</h2>
      <button id="addProductBtn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4">Agregar Producto</button>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>En Oferta</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Subido Por</th>
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
    fetchProducts(); // Cargar productos desde la base de datos

    document.getElementById('addProductBtn').addEventListener('click', () => {
      showProductForm();
    });
  }

  // Función para mostrar el formulario de agregar producto
  function showProductForm() {
    dashboardContent.innerHTML += `
      <div id="productForm" class="popup-form active">
        <h2 class="text-xl font-bold mb-4">Agregar Producto</h2>
        <form id="addProductForm" class="space-y-4">
          <div class="form-control">
            <label for="productName" class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input type="text" id="productName" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
          </div>
          <div class="form-control">
            <label for="productOffer" class="block text-sm font-medium text-gray-700">¿En Oferta?</label>
            <select id="productOffer" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
          <div class="form-control">
            <label for="productPrice" class="block text-sm font-medium text-gray-700">Precio</label>
            <input type="number" id="productPrice" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
          </div>
          <div class="form-control">
            <label for="productDescription" class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea id="productDescription" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required></textarea>
          </div>
          <div class="form-control">
            <label for="productCategory" class="block text-sm font-medium text-gray-700">Categoría</label>
            <select id="productCategory" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
              <option value="">Seleccione una categoría</option>
              <option value="Electrodomésticos">Electrodomésticos</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Supermercado">Supermercado</option>
            </select>
          </div>
          <div class="form-control">
            <label for="productImage" class="block text-sm font-medium text-gray-700">Imagen del Producto</label>
            <input type="file" id="productImage" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>
          <div class="form-actions flex justify-end space-x-4">
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" class="cancel-btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('addProductForm').addEventListener('submit', handleProductFormSubmit);
    document.querySelector('.cancel-btn').addEventListener('click', () => {
      document.getElementById('productForm').remove();
    });
  }

  // Función para manejar la sumisión del formulario de producto
  async function handleProductFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('offer', document.getElementById('productOffer').value === 'true');
    formData.append('price', parseFloat(document.getElementById('productPrice').value));
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('category', document.getElementById('productCategory').value);
    
    const productImage = document.getElementById('productImage').files;
    if (productImage.length > 0) {
        formData.append('image', productImage[0]);
    }
    
    formData.append('vendor', user._id);

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'x-auth-token': localStorage.getItem('token')
            },
            body: formData
        });

        if (response.ok) {
            fetchProducts();  // Recargar productos después de agregar uno nuevo
            document.getElementById('productForm').remove();  // Cerrar formulario
        } else {
            const errorResponse = await response.json();
            console.error('Error al agregar producto:', errorResponse);
            alert('Error al agregar producto: ' + (errorResponse.errors[0]?.msg || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Error al agregar producto: ' + error.message);
    }
}

  

  // Función para obtener y filtrar productos por usuario
  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const products = await response.json();
      const vendorProducts = products.filter(product => product.vendor === user._id); // Filtrar por ID de usuario actual
      renderProducts(vendorProducts);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }

  // Renderizar productos en la tabla
  function renderProducts(products) {
    const productsTableBody = document.getElementById('productsTableBody');
    const noProductsMessage = document.getElementById('noProductsMessage');
    productsTableBody.innerHTML = ''; // Limpiar tabla

    if (products.length === 0) {
      noProductsMessage.classList.remove('hidden'); // Mostrar mensaje si no hay productos
    } else {
      noProductsMessage.classList.add('hidden'); // Ocultar mensaje si hay productos
      products.forEach(product => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${product.name}</td>
          <td>${product.offer ? 'Sí' : 'No'}</td>
          <td>$${product.price}</td>
          <td>${product.description}</td>
          <td>${product.category}</td>
          <td>${user.name}</td>
          <td class="table-actions">
            <button class="edit-btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
            <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
          </td>
        `;

        productsTableBody.appendChild(tr);
      });
    }
  }

  // Función para cargar el contenido de configuración de usuario
  function loadConfigContent() {
    dashboardContent.innerHTML = `
      <h2>Configuración de Usuario</h2>
      <p>Aquí puedes editar tu nombre, correo, contraseña y rol.</p>
      <form id="editUserForm">
        <div class="form-control">
          <label for="name">Nombre Completo</label>
          <input type="text" id="name" required value="${user.name}">
        </div>
        <div class="form-control">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" required value="${user.email}">
        </div>
        <div class="form-control">
          <label for="password">Contraseña</label>
          <input type="password" id="password">
        </div>
        <div class="form-control">
          <label for="role">Rol</label>
          <select id="role" required>
            <option value="buyer" ${user.role === 'buyer' ? 'selected' : ''}>Comprador</option>
            <option value="seller" ${user.role === 'seller' ? 'selected' : ''}>Vendedor</option>
          </select>
        </div>
        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Actualizar</button>
      </form>
    `;

    document.getElementById('editUserForm').addEventListener('submit', handleUserUpdate);
  }

  // Manejar la actualización del usuario
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