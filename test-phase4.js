/**
 * Test de Fase 4 - Utilidades AJAX
 * Verifica el funcionamiento de los métodos AJAX implementados
 */

import { $, JRQuery } from './src/jrquery.js';

console.log('🧪 Iniciando tests de Fase 4 - AJAX...');

// Mock de fetch para tests
const originalFetch = global.fetch;
let fetchCalls = [];

// Función auxiliar para crear respuestas mock
function createMockResponse(data, status = 200, statusText = 'OK') {
    return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        statusText,
        headers: new Headers({
            'Content-Type': typeof data === 'object' ? 'application/json' : 'text/html'
        }),
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data))
    });
}

// Mock fetch
function mockFetch(url, options = {}) {
    fetchCalls.push({ url, options });
    
    // Respuestas predefinidas para diferentes endpoints
    if (url.includes('jsonplaceholder.typicode.com/posts/1')) {
        return createMockResponse({
            id: 1,
            title: 'Test Post',
            body: 'This is a test post'
        });
    }
    
    if (url.includes('jsonplaceholder.typicode.com/posts') && options.method === 'POST') {
        return createMockResponse({
            id: 101,
            title: JSON.parse(options.body).title,
            body: JSON.parse(options.body).body
        });
    }
    
    if (url.includes('jsonplaceholder.typicode.com/users')) {
        return createMockResponse([
            { id: 1, name: 'Test User 1' },
            { id: 2, name: 'Test User 2' }
        ]);
    }
    
    if (url.includes('test.html')) {
        return createMockResponse('<div>Test HTML content</div>');
    }
    
    if (url.includes('error')) {
        return createMockResponse({ error: 'Not found' }, 404, 'Not Found');
    }
    
    return createMockResponse({});
}

// Sustituir fetch global
global.fetch = mockFetch;

// Test 1: $.get() básico
console.log('\n✅ Test 1: $.get() básico');
try {
    const promise = $.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('¿Retorna promesa?', promise instanceof Promise); // true
    
    promise.then(data => {
        console.log('¿Datos recibidos?', data.title === 'Test Post'); // true
    });
} catch (error) {
    console.error('Error en $.get():', error.message);
}

// Test 2: $.get() con parámetros
console.log('\n✅ Test 2: $.get() con parámetros');
try {
    const promise = $.get('https://jsonplaceholder.typicode.com/users', { id: 1 });
    promise.then(data => {
        console.log('¿Datos con parámetros?', Array.isArray(data)); // true
    });
} catch (error) {
    console.error('Error en $.get() con parámetros:', error.message);
}

// Test 3: $.post()
console.log('\n✅ Test 3: $.post()');
try {
    const postData = {
        title: 'Nuevo Post',
        body: 'Contenido del nuevo post'
    };
    
    const promise = $.post('https://jsonplaceholder.typicode.com/posts', postData);
    promise.then(data => {
        console.log('¿Post creado?', data.id === 101); // true
        console.log('¿Título correcto?', data.title === 'Nuevo Post'); // true
    });
} catch (error) {
    console.error('Error en $.post():', error.message);
}

// Test 4: $.getJSON()
console.log('\n✅ Test 4: $.getJSON()');
try {
    const promise = $.getJSON('https://jsonplaceholder.typicode.com/users');
    promise.then(data => {
        console.log('¿JSON recibido?', Array.isArray(data)); // true
        console.log('¿Datos correctos?', data.length === 2); // true
    });
} catch (error) {
    console.error('Error en $.getJSON():', error.message);
}

// Test 5: $.ajax() con configuración completa
console.log('\n✅ Test 5: $.ajax() con configuración completa');
try {
    const ajaxConfig = {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'GET',
        dataType: 'json',
        timeout: 5000,
        success: function(data) {
            console.log('¿Callback success ejecutado?', data.title === 'Test Post'); // true
        },
        error: function(xhr, status, error) {
            console.error('Error en ajax:', error);
        }
    };
    
    const promise = $.ajax(ajaxConfig);
    console.log('¿Retorna promesa?', promise instanceof Promise); // true
} catch (error) {
    console.error('Error en $.ajax():', error.message);
}

// Test 6: $.ajax() con string URL
console.log('\n✅ Test 6: $.ajax() con string URL');
try {
    const promise = $.ajax('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'GET'
    });
    console.log('¿Funciona con string URL?', promise instanceof Promise); // true
} catch (error) {
    console.error('Error en $.ajax() con string:', error.message);
}

// Test 7: Manejo de errores
console.log('\n✅ Test 7: Manejo de errores');
try {
    const promise = $.get('https://api.example.com/error');
    promise
        .then(data => {
            console.log('Esta parte no debería ejecutarse');
        })
        .catch(error => {
            console.log('¿Error capturado correctamente?', error !== undefined); // true
        });
} catch (error) {
    console.error('Error en manejo de errores:', error.message);
}

// Test 8: .load() method
console.log('\n✅ Test 8: .load() method');
try {
    // Crear elementos de prueba
    const container = $('<div id="test-container"></div>');
    document.body.appendChild(container.elements[0]);
    
    const result = container.load('test.html', function(data) {
        console.log('¿Callback ejecutado?', data === '<div>Test HTML content</div>'); // true
        console.log('¿Contenido cargado?', container.html() === '<div>Test HTML content</div>'); // true
    });
    
    console.log('¿Retorna JRQuery?', result instanceof JRQuery); // true
    
    // Limpiar
    setTimeout(() => {
        container.remove();
    }, 100);
} catch (error) {
    console.error('Error en .load():', error.message);
}

// Test 9: Verificar llamadas fetch
console.log('\n✅ Test 9: Verificar llamadas fetch');
setTimeout(() => {
    console.log('¿Se realizaron llamadas fetch?', fetchCalls.length > 0); // true
    console.log('¿Primer llamada correcta?', fetchCalls[0].url.includes('jsonplaceholder')); // true
    
    // Restaurar fetch original
    global.fetch = originalFetch;
    
    console.log('\n🎉 ¡Todos los tests de Fase 4 completados!');
}, 500);

// Nota: JRQuery debe estar disponible en el scope del módulo
// Este test se ejecuta en un entorno con soporte para ES6 modules y fetch API