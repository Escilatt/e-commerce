let carrito = [];

// Función para agregar un producto al carrito
function agregarAlCarrito(event) {
    const boton = event.target; // El botón que se hizo clic
    const producto = boton.closest('.oferta, .producto, .processor-details, .graphics-details, .ram-details'); // Busca el contenedor del producto
    const id = producto.id; // ID del producto
    const nombre = producto.querySelector('h3, h2').innerText; // Nombre del producto
    const precioTexto = producto.querySelector('p, #precio').innerText; // Texto del precio
    const precio = parseFloat(precioTexto.split('$')[1]); // Extrae el precio
    const imagen = producto.querySelector('img, .processor-img').src; // Imagen del producto

    // Obtener la cantidad ingresada por el usuario
    const cantidadInput = producto.querySelector('.cantidad-input');
    const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 1;

    if (cantidad <= 0 || isNaN(cantidad)) {
        mostrarNotificacion('Por favor, ingresa una cantidad válida.');
        return;
    }

    const item = {
        id,
        nombre,
        precio,
        imagen,
        cantidad
    };

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find((item) => item.id === id);
    if (itemExistente) {
        itemExistente.cantidad += cantidad; // Sumar la cantidad ingresada
    } else {
        carrito.push(item); // Agregar el producto con la cantidad ingresada
    }

    actualizarCarrito();
    guardarCarritoEnLocalStorage();
    mostrarNotificacion('Producto agregado al carrito');
}

// Función para actualizar el carrito en la interfaz
function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');

    if (listaCarrito && totalCarrito) {
        listaCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" style="width:50px;">
                ${item.nombre} - $${item.precio.toFixed(2)}
                <input type="number" class="cantidad-carrito" value="${item.cantidad}" min="1" data-id="${item.id}">
                <button class="eliminar-btn" onclick="eliminarDelCarrito('${item.id}')">
                    <span class="icono-eliminar">🗑️</span> Eliminar
                </button>
            `;
            listaCarrito.appendChild(li);
            total += item.precio * item.cantidad;
        });

        totalCarrito.innerText = total.toFixed(2);

        // Agregar eventos a los inputs de cantidad en el carrito
        const inputsCantidad = document.querySelectorAll('.cantidad-carrito');
        inputsCantidad.forEach((input) => {
            input.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const nuevaCantidad = parseInt(e.target.value, 10);
                actualizarCantidadEnCarrito(id, nuevaCantidad);
            });
        });
    }
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidadEnCarrito(id, nuevaCantidad) {
    const producto = carrito.find((item) => item.id === id);

    if (producto && nuevaCantidad > 0) {
        producto.cantidad = nuevaCantidad;
        actualizarCarrito();
        guardarCarritoEnLocalStorage();
    } else {
        mostrarNotificacion('La cantidad debe ser mayor que 0.');
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter((item) => item.id !== id);
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
    mostrarNotificacion('Carrito vaciado');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');

    if (notificacion) {
        notificacion.innerText = mensaje;
        notificacion.style.display = 'block';
        notificacion.style.animation = 'fadein 0.5s';

        setTimeout(() => {
            notificacion.style.animation = 'fadeout 0.5s';
            setTimeout(() => {
                notificacion.style.display = 'none';
            }, 500);
        }, 3000);
    } else {
        console.error('El elemento #notificacion no existe en el DOM.');
    }
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

// Evento para vaciar el carrito
document.getElementById('vaciar-carrito')?.addEventListener('click', vaciarCarrito);

// Cargar el carrito al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeLocalStorage();

    // Agregar eventos a los botones "Añadir al carrito"
    const botonesAgregar = document.querySelectorAll('.add-to-cart');
    botonesAgregar.forEach((boton) => {
        boton.addEventListener('click', agregarAlCarrito);
    });
});

// Evento para pagar el carrito
document.getElementById('pagar-carrito')?.addEventListener('click', () => {
    if (carrito.length > 0) {
        alert('Redirigiendo al proceso de pago...');
        // Aquí puedes redirigir al usuario a una página de pago
    } else {
        alert('El carrito está vacío. Agrega productos antes de pagar.');
    }
});

document.getElementById('formulario-registro').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los datos del formulario
    const datos = {
        nombre_usuario: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        contrasena: document.getElementById('contrasena').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
    };

    try {
        // Enviar los datos al backend
        const respuesta = await fetch('http://localhost:3000/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });

        // Procesar la respuesta del backend
        const resultado = await respuesta.json();
        console.log(resultado); // Mostrar el resultado en la consola
        alert(resultado); // Mostrar un mensaje al usuario
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al registrar el usuario');
    }
});