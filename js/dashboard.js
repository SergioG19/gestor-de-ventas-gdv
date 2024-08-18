document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userGreeting = document.getElementById('userGreeting');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuGeneral = document.getElementById('menuGeneral');
  const menuInventario = document.getElementById('menuInventario');
  const menuConfig = document.getElementById('menuConfig');
  const dashboardContent = document.getElementById('dashboardContent');

  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  userGreeting.textContent = `Bienvenido, ${user.name}`;

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

  // Función para obtener estadísticas del vendedor autenticado
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
        console.error('Error al obtener estadísticas:', response.status);
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  }

  // Función para cargar el contenido del menú Inventario
  function loadInventarioContent() {
    dashboardContent.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-4" style="margin-top: 24px;">Inventario de Productos</h2>
      <button id="addProductBtn" class="hover:bg-green-600 text-black px-4 py-2 rounded mb-4" style="background-color: #00b4d8; margin-top: 24px;">Agregar Producto</button>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Categoría</th>
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
    fetchProducts(); // Cargar productos del vendedor autenticado desde la base de datos

    document.getElementById('addProductBtn').addEventListener('click', () => {
      showProductForm();
    });
  }

  // Función para mostrar el formulario de agregar producto
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
        <form id="addProductForm" class="space-y-4">
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
    document.body.classList.add('form-open'); // Añadir clase para opacar el fondo

    document.getElementById('addProductForm').addEventListener('submit', (e) => handleProductFormSubmit(e, product._id));
    document.querySelector('.cancel-btn').addEventListener('click', () => {
      formContainer.remove();
      overlay.remove(); // Eliminar overlay al cerrar el formulario
      document.body.classList.remove('form-open');
    });
  }

  // Función para manejar la sumisión del formulario de producto
  async function handleProductFormSubmit(e, productId) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('price', parseFloat(document.getElementById('productPrice').value));
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('category', document.getElementById('productCategory').value);

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
        fetchProducts();  // Recargar productos después de agregar/editar uno nuevo
        document.getElementById('productForm').remove();  // Cerrar formulario
        document.querySelector('.overlay').remove(); // Eliminar overlay al cerrar el formulario
        document.body.classList.remove('form-open'); // Quitar opacidad del fondo
      } else {
        const errorResponse = await response.json();
        console.error('Error al procesar el producto:', errorResponse);
        alert('Error al procesar el producto: ' + (errorResponse.errors[0]?.msg || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al procesar el producto:', error);
      alert('Error al procesar el producto: ' + error.message);
    }
  }

  // Función para obtener y filtrar productos por usuario (vendedor autenticado)
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
        console.error('Error al obtener productos:', response.status);
      }
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
        noProductsMessage.style.display = 'block';
    } else {
        noProductsMessage.classList.add('hidden'); // Ocultar mensaje si hay productos
        noProductsMessage.style.display = 'none';
        products.forEach(product => {
            const tr = document.createElement('tr');

            // Asegúrate de que la ruta de la imagen esté correctamente formada
            const imageUrl = product.image ? `http://localhost:3000/uploads/${product.image}` : '/images/no-image.png';

            tr.innerHTML = `
                <td><img src="${imageUrl}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.description}</td>
                <td>${product.category}</td>
                <td class="table-actions">
                    <button class="edit-btn" style="background-color: #3b82f6; color: white; padding: 5px 10px; border: none; border-radius: 4px;">Editar</button>
                    <button class="delete-btn" style="background-color: #ef4444; color: white; padding: 5px 10px; border: none; border-radius: 4px;">Eliminar</button>
                </td>
            `;

            tr.querySelector('.edit-btn').addEventListener('click', () => showProductForm(product));
            tr.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product._id));

            productsTableBody.appendChild(tr);
        });
    }
}



  // Función para eliminar un producto
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
          fetchProducts(); // Recargar productos después de eliminar
        } else {
          console.error('Error al eliminar producto:', response.status);
          alert('Error al eliminar producto.');
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto: ' + error.message);
      }
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
