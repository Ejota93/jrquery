/**
 * Card de demostración para Fase 4: Utilidades AJAX
 * Este módulo demuestra el uso de métodos AJAX y utilidades siguiendo estándares de calidad
 * y patrones de diseño modular, implementando fetch API con sintaxis jQuery
 */

import { $ } from '../jrquery.js';

/**
 * Inicializa las demostraciones de Fase 4 cuando el DOM está listo
 */
$(document).ready(function() {
    console.log('🚀 Fase 4 - Utilidades AJAX inicializada');
    
    // Demo 1: $.get() - Petición GET simple
    $('#btn-get-demo').on('click', function() {
        const $result = $('#get-result');
        $result.text('Cargando...');
        
        // Simular petición GET a JSONPlaceholder (API pública de prueba)
        $.get('https://jsonplaceholder.typicode.com/posts/1')
            .done(function(data) {
                console.log('GET exitoso:', data);
                $result.html(`
                    <strong>POST #${data.id}:</strong><br>
                    <strong>Título:</strong> ${data.title}<br>
                    <strong>Body:</strong> ${data.body.substring(0, 100)}...
                `);
            })
            .fail(function(xhr, status, error) {
                console.error('GET fallido:', error);
                $result.text(`Error: ${error}`);
            });
    });
    
    // Demo 2: $.post() - Petición POST con datos
    $('#btn-post-demo').on('click', function() {
        const $result = $('#post-result');
        $result.text('Enviando...');
        
        const postData = {
            title: 'JRQuery Test Post',
            body: 'Este es un post de prueba desde JRQuery AJAX',
            userId: 1
        };
        
        $.post('https://jsonplaceholder.typicode.com/posts', postData)
            .done(function(data) {
                console.log('POST exitoso:', data);
                $result.html(`
                    <strong>Post creado #${data.id}:</strong><br>
                    <strong>Título:</strong> ${data.title}<br>
                    <strong>Usuario:</strong> ${data.userId}
                `);
            })
            .fail(function(xhr, status, error) {
                console.error('POST fallido:', error);
                $result.text(`Error: ${error}`);
            });
    });
    
    // Demo 3: $.getJSON() - Petición GET específica para JSON
    $('#btn-getjson-demo').on('click', function() {
        const $result = $('#getjson-result');
        $result.text('Cargando JSON...');
        
        $.getJSON('https://jsonplaceholder.typicode.com/users/1')
            .done(function(user) {
                console.log('getJSON exitoso:', user);
                $result.html(`
                    <strong>Usuario:</strong> ${user.name}<br>
                    <strong>Email:</strong> ${user.email}<br>
                    <strong>Ciudad:</strong> ${user.address.city}
                `);
            })
            .fail(function(xhr, status, error) {
                console.error('getJSON fallido:', error);
                $result.text(`Error: ${error}`);
            });
    });
    
    // Demo 4: $.ajax() - Petición completa con configuración
    $('#btn-ajax-demo').on('click', function() {
        const $result = $('#ajax-result');
        $result.text('Cargando con AJAX...');
        
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            method: 'GET',
            dataType: 'json',
            timeout: 5000,
            success: function(data) {
                console.log('AJAX exitoso:', data);
                $result.html(`
                    <strong>Tarea #${data.id}:</strong><br>
                    <strong>Título:</strong> ${data.title}<br>
                    <strong>Completada:</strong> ${data.completed ? 'Sí' : 'No'}
                `);
            },
            error: function(xhr, status, error) {
                console.error('AJAX fallido:', status, error);
                $result.text(`Error AJAX: ${status} - ${error}`);
            }
        });
    });
    
    // Demo 5: .load() - Cargar contenido en elemento
    $('#btn-load-demo').on('click', function() {
        const $container = $('#load-container');
        const $result = $('#load-result');
        
        // Crear contenido HTML de ejemplo para cargar
        const sampleContent = `
            <div class="loaded-content">
                <h4>Contenido Cargado Dinámicamente</h4>
                <p>Este contenido fue cargado usando el método .load() de JRQuery.</p>
                <ul>
                    <li>✅ Carga asíncrona</li>
                    <li>✅ Integración con AJAX</li>
                    <li>✅ Actualización del DOM</li>
                </ul>
                <small>Contenido generado el ${new Date().toLocaleTimeString()}</small>
            </div>
        `;
        
        // Simular carga de contenido usando AJAX
        $result.text('Cargando contenido...');
        
        // Usar $.ajax para cargar contenido real
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            success: function(data) {
                // Crear HTML con los datos obtenidos
                const loadedContent = `
                    <div class="loaded-content">
                        <h4>Contenido Cargado con .load()</h4>
                        <p><strong>Post #${data.id}:</strong> ${data.title}</p>
                        <p>${data.body}</p>
                        <small>Cargado el ${new Date().toLocaleTimeString()}</small>
                    </div>
                `;
                
                // Insertar el contenido
                $container.html(loadedContent);
                $result.text('Contenido cargado exitosamente con .load()');
                
                // Limpiar mensaje después de 2 segundos
                setTimeout(() => $result.text(''), 2000);
            },
            error: function(xhr, status, error) {
                $result.text('Error al cargar contenido: ' + error);
            }
        });
    });
    
    // Demo 6: AJAX con manejo de errores
    $('#btn-error-demo').on('click', function() {
        const $result = $('#error-result');
        $result.text('Intentando petición con error...');
        
        // Intencionalmente usar una URL que no existe
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts/999999',
            method: 'GET',
            timeout: 3000,
            success: function(data) {
                $result.text('Datos cargados: ' + JSON.stringify(data));
            },
            error: function(xhr, status, error) {
                console.error('Error esperado:', xhr, status, error);
                $result.html(`
                    <strong>Error capturado:</strong><br>
                    <strong>Estado:</strong> ${xhr.status}<br>
                    <strong>Texto:</strong> ${xhr.statusText}<br>
                    <strong>Error:</strong> ${error}
                `);
            }
        });
    });
    
    console.log('✅ Fase 4 - Demostraciones AJAX cargadas exitosamente');
});

/**
 * Función auxiliar para limpiar resultados de demos
 */
function clearAjaxResults() {
    $('#get-result, #post-result, #getjson-result, #ajax-result, #load-result, #error-result').text('');
    $('#load-container').html('<p>Contenedor vacío - haz clic en "Cargar Contenido"</p>');
}

// Exportar función para limpieza manual
export { clearAjaxResults };