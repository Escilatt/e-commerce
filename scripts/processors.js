document.addEventListener('DOMContentLoaded', function() {
    fetch('../sections/products.json')
      .then(response => response.json())
      .then(data => {
        // Obtener el parámetro 'id' de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const productoId = urlParams.get('id');
  
        // Buscar el producto en el JSON por su id
        const procesador = data.procesadores.find(p => p.id === productoId);
  
        if (procesador) {
          // Actualizar la imagen
          document.getElementById('processor-img').src = procesador.imagen;
          document.getElementById('processor-img').alt = procesador.nombre;
  
          // Actualizar las especificaciones
          document.querySelector('.processor-specs h2').textContent = procesador.nombre;
          document.getElementById('arquitectura').textContent = procesador.arquitectura;
          document.getElementById('nucleos').textContent = procesador.nucleos;
          document.getElementById('hilos').textContent = procesador.hilos;
          document.getElementById('frecuencia').textContent = procesador.frecuencia;
          document.getElementById('frecuenciaTurbo').textContent = procesador.frecuenciaTurbo;
          document.getElementById('socket').textContent = procesador.socket;
          document.getElementById('tdp').textContent = procesador.tdp;
          document.getElementById('tdpMaximo').textContent = procesador.tdpMaximo;
          document.getElementById('nanometros').textContent = procesador.nanometros;
          document.getElementById('precio').textContent = `$${procesador.precio}`;
        } else {
          document.getElementById('detalles-producto').innerHTML = '<p>Producto no encontrado.</p>';
        }
      });
  });