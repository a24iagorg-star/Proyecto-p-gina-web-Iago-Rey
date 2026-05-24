// Memoria local del carrito de compras
let cart = [];

// Función principal para cambiar entre secciones
function switchView(viewName) {
    const heroBanner = document.getElementById('main-hero');

    // Mostrar u ocultar el banner de ESSENTIALS según la sección
    if (viewName === 'coleccion') {
        heroBanner.classList.remove('hidden');
    } else {
        heroBanner.classList.add('hidden');
    }

    // Ocultar todas las secciones de productos
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Quitar la línea de selección activa a todos los enlaces del menú
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Activar la vista seleccionada en la pantalla
    document.getElementById(`view-${viewName}`).classList.add('active');

    // Buscar y marcar como activo el enlace correspondiente en el menú
    const activeLink = document.querySelector(`.nav-link[data-target="${viewName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Mover la pantalla arriba del todo al cambiar de sección
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Si entramos a la sección de la cesta, pintar los artículos actualizados
    if (viewName === 'carrito') {
        renderCart();
    }
}

// Actualizar el número acumulado en el botón del menú "Carrito (X)"
function updateCartBadge() {
    const cartBtn = document.getElementById('cart-btn');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBtn.innerText = `Carrito (${totalItems})`;
}

// Controlar los eventos de clic en los enlaces de navegación del menú
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-target');
        switchView(targetView);
    });
});

// Controlar el clic en el Logo ASTRO para ir a Colección
document.getElementById('nav-logo').addEventListener('click', () => {
    switchView('coleccion');
});

// Controlar el botón "Explorar" del banner para que vaya a Hombre
document.getElementById('explore-btn').addEventListener('click', () => {
    switchView('hombre');
});

// Escuchar clics en todos los botones "Añadir" del catálogo corporativo
const addButtons = document.querySelectorAll('.add-to-cart');
addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price'));

        // Comprobar si el artículo ya estaba seleccionado
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCartBadge();

        // Animación visual verde de confirmación en el botón pulsado
        button.innerText = "¡Añadido!";
        button.style.background = "#27ae60";
        button.style.color = "white";
        setTimeout(() => {
            button.innerText = "Añadir";
            button.style.background = "transparent";
            button.style.color = "#333";
        }, 1000);
    });
});

// Generar visualmente la lista de artículos comprados dentro de la cesta
function renderCart() {
    const listContainer = document.getElementById('cart-items-list');
    const totalContainer = document.getElementById('cart-total');
    listContainer.innerHTML = '';
    
    if (cart.length === 0) {
        listContainer.innerHTML = '<p style="padding: 20px 0; color: #666;">El carrito está vacío.</p>';
        totalContainer.innerText = '0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span><strong>${item.name}</strong> (x${item.quantity})</span>
            <span>${itemTotal.toFixed(2)}€</span>
        `;
        listContainer.appendChild(div);
    });

    totalContainer.innerText = total.toFixed(2);
}

// Evento para el botón de vaciar la cesta completa por completo
document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    renderCart();
    updateCartBadge();
});