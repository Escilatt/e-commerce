document.addEventListener('DOMContentLoaded', function() {
    fetch('../sections/products.json')
      .then(response => response.json())
      .then(data => {
        // Obtener el parámetro 'id' de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const graficaId = urlParams.get('id');
  
        // Buscar la tarjeta gráfica en el JSON
        const tarjetaGrafica = data.tarjetasGraficas.find(t => t.id === graficaId);
  
        if (tarjetaGrafica) {
          // Actualizar la imagen
          document.getElementById('graphics-img').src = tarjetaGrafica.imagen;
          document.getElementById('graphics-img').alt = tarjetaGrafica.nombre;
  
          // Actualizar las especificaciones de la tarjeta gráfica
          document.querySelector('.graphics-specs h2').textContent = tarjetaGrafica.nombre;
          document.getElementById('arquitectura').textContent = tarjetaGrafica.arquitectura;
          document.getElementById('bus').textContent = tarjetaGrafica.bus;
          document.getElementById('frecuencia').textContent = tarjetaGrafica.frecuencia;
          document.getElementById('frecuenciaTurbo').textContent = tarjetaGrafica.frecuenciaTurbo;
          document.getElementById('memoria').textContent = tarjetaGrafica.memoria;
          document.getElementById('tdp').textContent = tarjetaGrafica.tdp;
          document.getElementById('precio').textContent = `$${tarjetaGrafica.precio}`;
        } else {
          document.getElementById('detalles-grafica').innerHTML = '<p>Tarjeta gráfica no encontrada.</p>';
        }
      });
  });