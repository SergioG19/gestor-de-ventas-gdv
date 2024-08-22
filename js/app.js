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
    let favoriteProducts = [];

    productList.style.display = 'grid';
    productList.style.gap = '20px';
    productList.style.justifyContent = 'center';
    productList.style.padding = '20px';

    const updateGridColumns = () => {
        if (window.innerWidth >= 1024) {
            productList.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else if (window.innerWidth >= 768) {
            productList.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            productList.style.gridTemplateColumns = 'repeat(1, 1fr)';
        }
    };
    updateGridColumns();
    window.addEventListener('resize', updateGridColumns);

    footer.style.position = 'relative';
    footer.style.width = '100%';

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

                productCard.style.width = '100%';
                productCard.style.height = 'auto';
                productCard.style.padding = '20px';
                productCard.style.boxSizing = 'border-box';
                productCard.style.border = '1px solid #ddd';
                productCard.style.borderRadius = '10px';
                productCard.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                productCard.style.backgroundColor = '#fff';

                const imageUrl = product.image ? `http://localhost:3000/uploads/${product.image}` : '';

                const quantityText = product.quantity > 0 ? `Cantidad disponible: ${product.quantity}` : 'Sin stock';

                productCard.innerHTML = `
                    <img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: contain; margin-bottom: 10px; border-radius: 8px;">
                    <h2 style="font-size: 1rem; font-weight: bold; margin-bottom: 8px;">${product.name}</h2>
                    <p style="font-size: 1rem; font-weight: bold; color: #333; margin-bottom: 8px;">$${product.price}</p>
                    <p style="color: green; margin-bottom: 8px;">Envío gratis</p>
                    <p class="product-quantity" style="color: ${product.quantity > 0 ? '#555' : 'red'}; margin-bottom: 8px;">${quantityText}</p>
                    <p style="color: #777; font-size: 0.8rem; margin-bottom: 10px;">Vendedor: ${product.seller.name}</p>
                    <button class="details-btn" style="background-color: #1d4ed8; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Ver detalles</button>
                `;

                productCard.querySelector('.details-btn').addEventListener('click', () => showProductDetails(product));

                productList.appendChild(productCard);
            });
        }
    }

    function displayPagination(totalProducts) {
        pageNumbers.innerHTML = '';
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.classList.add('page-number');
            pageNumber.style.padding = '10px';
            pageNumber.style.margin = '0 5px';
            pageNumber.style.border = '1px solid #ddd';
            pageNumber.style.borderRadius = '5px';
            pageNumber.style.backgroundColor = '#f0f0f0';
            pageNumber.style.cursor = 'pointer';
            pageNumber.innerText = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                renderProducts(filteredProducts);
                updatePageNumbers();
            });
            pageNumbers.appendChild(pageNumber);
        }

        pageNumbers.style.display = 'flex';
        pageNumbers.style.justifyContent = 'center';
        pageNumbers.style.marginTop = '20px';
    }

    function updatePageNumbers() {
        const pageNumberButtons = document.querySelectorAll('.page-number');
        pageNumberButtons.forEach((button, index) => {
            if (index + 1 === currentPage) {
                button.style.backgroundColor = '#1d4ed8';
                button.style.color = '#fff';
            } else {
                button.style.backgroundColor = '#f0f0f0';
                button.style.color = '#000';
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

    async function fetchFavorites() {
        try {
            const response = await fetch('http://localhost:3000/api/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                favoriteProducts = await response.json();
            } else {
                console.error('Error fetching favorites:', response.status);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }

    // Definición de la función showProductDetails
    function showProductDetails(product, hideFavoriteButton = false) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '1000';
        document.body.appendChild(overlay);

        const popup = document.createElement('div');
        popup.classList.add('product-popup');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#fff';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = '1001';
        popup.style.width = '80%';
        popup.style.maxWidth = '600px';
        popup.style.boxSizing = 'border-box';

        const favorite = favoriteProducts.find(fav => fav.product._id === product._id);
        const favoriteId = favorite ? favorite._id : null;

        popup.innerHTML = `
            <div style="position: relative;">
                <button id="closePopupBtn" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                <h2 style="margin-bottom: 10px; font-size: 1.5rem; font-weight: bold;">${product.name}</h2>
                <img src="http://localhost:3000/uploads/${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: contain; border-radius: 10px; margin-bottom: 20px;">
                <p style="margin-bottom: 10px; color: #333;">${product.description}</p>
                <p class="product-quantity" style="margin-bottom: 10px; font-size: 1.2rem; font-weight: bold;">Cantidad disponible: ${product.quantity > 0 ? product.quantity : 'Sin stock'}</p>
                <input type="number" id="purchaseQuantity" value="1" min="1" max="${product.quantity}" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 20px;" ${product.quantity === 0 ? 'disabled' : ''}>
                <button id="buyNowBtn" style="background-color: #16a34a; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin-bottom: 10px;">Comprar Inmediato</button>
                <button id="toggleFavoriteBtn" style="background-color: ${favoriteId ? '#ef4444' : '#4b5563'}; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin-bottom: 10px;" data-favorite-id="${favoriteId || ''}">${favoriteId ? 'Eliminar de Favoritos' : 'Añadir a Favoritos'}</button>
            </div>
        `;

        document.body.appendChild(popup);

        if (hideFavoriteButton) {
            document.getElementById('toggleFavoriteBtn').style.display = 'none';
        }

        document.getElementById('buyNowBtn').addEventListener('click', () => {
            if (product.quantity === 0) {
                alert('Este producto está sin stock.');
                return;
            }
            const purchaseQuantity = parseInt(document.getElementById('purchaseQuantity').value);
    if (purchaseQuantity > 0 && purchaseQuantity <= product.quantity) {
        buyProduct(product, purchaseQuantity, popup, overlay);  // Pasa el objeto product completo
    }
        });

        document.getElementById('toggleFavoriteBtn').addEventListener('click', async () => {
            const toggleFavoriteBtn = document.getElementById('toggleFavoriteBtn');
            const currentFavoriteId = toggleFavoriteBtn.dataset.favoriteId;

            if (currentFavoriteId) {
                const success = await removeFromFavorites(currentFavoriteId);
                if (success) {
                    toggleFavoriteBtn.textContent = 'Añadir a Favoritos';
                    toggleFavoriteBtn.style.backgroundColor = '#4b5563';
                    toggleFavoriteBtn.removeAttribute('data-favorite-id');
                }
            } else {
                const newFavorite = await addToFavorites(product._id);
                if (newFavorite) {
                    toggleFavoriteBtn.textContent = 'Eliminar de Favoritos';
                    toggleFavoriteBtn.style.backgroundColor = '#ef4444';
                    toggleFavoriteBtn.dataset.favoriteId = newFavorite._id;  // Actualizar el ID del favorito recién añadido
                }
            }
        });

        document.getElementById('closePopupBtn').addEventListener('click', () => {
            popup.remove();
            overlay.remove();
            fetchFavorites(); // Recargar los favoritos después de cerrar el popup
        });
    }

    async function buyProduct(product, quantity, popup, overlay) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ productId: product._id, quantity })
            });
    
            if (response.ok) {
                const purchase = await response.json();
                alert('Compra realizada con éxito.');
                product.quantity -= quantity;  // Actualiza la cantidad del producto
                updateProductQuantity(product);  // Actualiza la cantidad en la interfaz
                popup.remove();
                overlay.remove();
                fetchFavorites(); // Recargar la lista de favoritos después de la compra
            } else {
                const errorData = await response.json();
                alert(`Error al comprar: ${errorData.msg}`);
            }
        } catch (error) {
            console.error('Error en la compra:', error);
            alert('Error en la compra. Por favor, intenta de nuevo.');
        }
    }
    
    
    function updateProductQuantity(updatedProduct) {
        // Actualizar la cantidad en la lista de productos
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const detailsBtn = card.querySelector('.details-btn');
            const productNameElement = card.querySelector('h2');
            
            if (productNameElement && productNameElement.textContent === updatedProduct.name) {
                const quantityElement = card.querySelector('.product-quantity');
                if (quantityElement) {
                    quantityElement.textContent = updatedProduct.quantity > 0 ? `Cantidad disponible: ${updatedProduct.quantity}` : 'Sin stock';
                    quantityElement.style.color = updatedProduct.quantity > 0 ? '#555' : 'red';
                }
            }
        });
    
        // Actualizar la cantidad en el modal de detalles (si sigue abierto)
        const quantityElementInPopup = document.querySelector('.product-popup .product-quantity');
        if (quantityElementInPopup) {
            quantityElementInPopup.textContent = updatedProduct.quantity > 0 ? `Cantidad disponible: ${updatedProduct.quantity}` : 'Sin stock';
        }
    }
    

    async function addToFavorites(productId) {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Tienes que iniciar sesión o registrarte para tener tu lista de productos favoritos.');
            return null;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ productId })
            });

            if (response.ok) {
                const favorite = await response.json();
                favoriteProducts.push(favorite);
                alert('Se ha agregado el producto a favoritos correctamente.');
                return favorite;  // Devuelve el favorito recién creado para actualizar el estado
            } else {
                const errorData = await response.json();
                alert(`Error al añadir a favoritos: ${errorData.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al añadir a favoritos:', error);
            alert('Error al añadir a favoritos. Por favor, intenta de nuevo.');
        }
        return null;
    }

    async function removeFromFavorites(favoriteId) {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Tienes que iniciar sesión o registrarte para eliminar productos de tus favoritos.');
            return false;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                favoriteProducts = favoriteProducts.filter(fav => fav._id !== favoriteId);
                alert('Se ha eliminado el producto de favoritos correctamente.');
                return true;  // Indica que se eliminó correctamente
            } else {
                const errorData = await response.json();
                alert(`Error al eliminar de favoritos: ${errorData.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error eliminando de favoritos:', error);
            alert('Error eliminando de favoritos. Por favor, intenta de nuevo.');
        }
        return false;
    }

    fetchFavorites();
    fetchAllProducts();

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

    searchBar.addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase();
        filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue));
        currentPage = 1;
        renderProducts(filteredProducts);
        displayPagination(filteredProducts.length);
        updatePageNumbers();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const favoritesTableBody = document.getElementById('favoritesTableBody');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');

    if (favoritesTableBody) {
        async function fetchFavorites() {
            try {
                const response = await fetch('http://localhost:3000/api/favorites', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    const favorites = await response.json();
                    renderFavorites(favorites);
                } else {
                    console.error('Error fetching favorites:', response.status);
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        }

        function renderFavorites(favorites) {
            favoritesTableBody.innerHTML = '';

            if (favorites.length === 0) {
                noFavoritesMessage.classList.remove('hidden');
                noFavoritesMessage.style.display = 'block';
            } else {
                noFavoritesMessage.classList.add('hidden');
                noFavoritesMessage.style.display = 'none';

                favorites.forEach(favorite => {
                    const product = favorite.product;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><img src="http://localhost:3000/uploads/${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 5px;"></td>
                        <td>${product.name}</td>
                        <td>$${product.price}</td>
                        <td class="table-actions">
                            <button class="delete-btn">Eliminar</button>
                        </td>
                    `;

                    tr.querySelector('.delete-btn').addEventListener('click', () => removeFromFavorites(favorite._id));

                    favoritesTableBody.appendChild(tr);
                });
            }
        }

        async function removeFromFavorites(productId) {
            if (confirm('¿Seguro que deseas eliminar este producto de tus favoritos?')) {
                try {
                    const response = await fetch(`http://localhost:3000/api/favorites/${productId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': localStorage.getItem('token')
                        }
                    });

                    if (response.ok) {
                        fetchFavorites();
                    } else {
                        console.error('Error deleting favorite:', response.status);
                    }
                } catch (error) {
                    console.error('Error deleting favorite:', error);
                }
            }
        }
        fetchFavorites();
    }
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
  
    // Verificación de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Este correo no tiene el formato adecuado. ¿Intentamos de nuevo?');
      return;
    }
  
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
            <a href="favorites.html" class="px-4">Favoritos</a>
            <a href="edit-user.html" class="px-4">Editar Usuario</a>
            <a href="#" id="logoutBtn" class="px-4">Cerrar Sesión</a>
          `;
        } else {
          userNav.innerHTML = `
            <span class="px-4">Hola, ${user.name}</span>
            <a href="favorites.html" class="px-4">Favoritos</a>
            <a href="edit-user.html" class="px-4">Editar Usuario</a>
            <a href="#" id="logoutBtn" class="px-4">Cerrar Sesión</a>
          `;
        }
  
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', handleLogout);
      } else {
        userNav.innerHTML = `
          <a href="login.html" class="px-4">Iniciar Sesión</a>
          <a href="register.html" class="px-4">Registrarse</a>
        `;
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


