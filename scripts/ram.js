document.addEventListener('DOMContentLoaded', function() {
    fetch('../sections/products.json')
      .then(response => response.json())
      .then(data => {
        // Obtener el parámetro 'id' de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const ramId = urlParams.get('id');
  
        // Buscar la memoria RAM en el JSON
        const memoriaRam = data.memoriasRam.find(r => r.id === ramId);
  
        if (memoriaRam) {
          // Actualizar la imagen
          document.getElementById('ram-img').src = memoriaRam.imagen;
          document.getElementById('ram-img').alt = memoriaRam.nombre;
  
          // Actualizar las especificaciones de la memoria RAM
          document.querySelector('.ram-specs h2').textContent = memoriaRam.nombre;
          document.getElementById('tipo').textContent = memoriaRam.tipo;
          document.getElementById('capacidad').textContent = memoriaRam.capacidad;
          document.getElementById('frecuencia').textContent = memoriaRam.frecuencia;
          document.getElementById('latencia').textContent = memoriaRam.latencia;
          document.getElementById('voltaje').textContent = memoriaRam.voltaje;
          document.getElementById('precio').textContent = `$${memoriaRam.precio}`;
        } else {
          document.getElementById('detalles-ram').innerHTML = '<p>Memoria RAM no encontrada.</p>';
        }
      });
  });