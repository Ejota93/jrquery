# JRQuery Roadmap

Este documento recoge las sugerencias y el plan de evolución para que JRQuery se acerque a la experiencia y API de jQuery, manteniendo prácticas modernas de ES6 modules, buen rendimiento y código limpio.

## Estado actual
- Selectores: `$(selector, context)` con soporte de contexto y `querySelectorAll`.
- Encadenamiento: métodos de instancia retornan `this`.
- Eventos: `.on(tipo, handler)` y delegación `.on(tipo, selector, handler)`, `.off()`.
- DOM: `addClass`, `removeClass`, `toggleClass`, `html`, `text`.
- Atributos/propiedades: `attr`, `removeAttr`, `prop`, `data`, `hasClass`.
- Formularios: `val` de inputs/select/textarea.
- Estilos: `css` getter/setter con estilos computados.
- Recorrido: `find`, `parent`, `children`, `first`, `last`, `eq`, `exists`, `isEmpty`.
- Utilidades: `$.each`, `$.map`, `$.extend`, `$.type`, `$.isArray`, `$.isFunction`, `$.isObject`, `$.trim`, `$.parseJSON`, `$.toJSON`, `$.ready`.
- Atajos y extensibilidad: `$(fn)` (DOM ready), `$.fn = JRQuery.prototype`, `$.find(selector, context)`.

## Principios
- API familiar al estilo jQuery, pero sin contaminar el global.
- ES6 modules, tipado con JSDoc, y compatibilidad con navegadores modernos.
- Rendimiento primero: operaciones por lote, evitar reflows innecesarios, delegación de eventos.
- Extensible: sistema de plugins vía `$.fn`.

## Roadmap por fases

### Fase 1 — Eventos y utilidades esenciales
- [x] Delegación en `.on(tipo, selector, handler)`.
- [ ] `.one(tipo, [selector], handler)` — omitido (no necesario según decisión).
- [x] `.trigger(tipo, [data])` — disparar eventos personalizados.
- [ ] Namespacing de eventos — omitido (no necesario según decisión).
- [x] `$.extend(true, target, ...sources)` — mezcla profunda.

Ejemplos:
```js
// Delegación
$('#lista').on('click', '.item', function(e) { $(this).toggleClass('activo'); });

// Trigger de evento custom
$('#btn').on('ready:data', (e, data) => console.log('Data:', data));
$('#btn').trigger('ready:data', { usuario: 'ana', rol: 'admin' });
```

### Fase 2 — Manipulación del DOM avanzada
- [x] `.append(content)`, `.prepend(content)` — aceptar string, Node, JRQuery.
- [x] `.before(content)`, `.after(content)` — insertar alrededor.
- [x] `.remove()`, `.empty()`, `.clone([deep])`.
- [ ] `.replaceWith(content)` — omitido (no necesario según decisión).
- [x] `.text([value])` y `.html([value])` con funciones callback (como jQuery).

Ejemplos:
```js
$('.lista').append('<li>Nuevo</li>');
$('.item').before(document.createElement('hr'));
$('#panel').empty().append($('#contenido').clone());
```

### Fase 3 — Recorrido y filtrado
- [x] `.closest(selector)` — ancestro más cercano.
- [ ] `.siblings([selector])`, `.next([selector])`, `.prev([selector])`.
- [x] `.filter(selector|fn)`.
- [x] `.not(selector|fn)`.
- [x] `.index([element])` — índice del elemento.

Ejemplos:
```js
$('.item.activo').closest('.contenedor').addClass('focus');
$('.item').filter('.seleccionado').css('color', 'red');
```

### Fase 4 — Ajax y datos
- [ ] `$.ajax(options)` — wrapper de `fetch` con Promises.
- [ ] `$.get(url, [params])`, `$.post(url, data)`.
- [ ] Manejo de `headers`, `timeout`, `json`, `formData`.
- [ ] Hooks simples: `beforeSend`, `success`, `error`, `complete`.

Ejemplos:
```js
$.get('/api/items').then(data => console.log(data));
$.post('/api/items', { nombre: 'JRQuery' }).then(r => console.log(r));
```

### Fase 5 — Animaciones y efectos
- [ ] `fadeIn([dur])`, `fadeOut([dur])` — basado en CSS transitions.
- [ ] `slideUp([dur])`, `slideDown([dur])` — altura animada.
- [ ] `animate(props, [dur], [easing], [complete])` — API simple.
- [ ] `show([dur])`, `hide([dur])`, `toggle([dur])` con animación.

Ejemplos:
```js
$('#modal').fadeIn(200);
$('.panel').slideUp(300).slideDown(300);
```

## API objetivo (resumen)
- Selectores: `$(selector, [context])`, `$(fn)`, `.find(selector)`.
- Eventos: `.on`, `.off`, `.one`, `.trigger`.
- DOM: `.append`, `.prepend`, `.before`, `.after`, `.remove`, `.empty`, `.clone`, `.replaceWith`.
- Atributos: `.attr`, `.removeAttr`, `.prop`, `.data`, `.hasClass`, `.addClass`, `.removeClass`, `.toggleClass`.
- Contenido: `.html([value|fn])`, `.text([value|fn])`, `.val([value])`.
- CSS: `.css(prop)`, `.css({ ... })`, getter/setter.
- Recorrido: `.parent`, `.children`, `.closest`, `.siblings`, `.next`, `.prev`, `.first`, `.last`, `.eq`, `.filter`, `.not`.
- Utilidades: `$.each`, `$.map`, `$.extend`, `$.type`, `$.ready`, `$.find`, `$.ajax`, `$.get`, `$.post`.
- Plugins: `$.fn.miPlugin = function(...) { ... }`.

## Consideraciones de rendimiento
- Delegación de eventos sobre contenedores en lugar de muchos listeners.
- Operaciones DOM por lote; evitar múltiples inserciones encadenadas sin fragmentos.
- Usar `DocumentFragment` para `.append/.prepend` masivos.
- Evitar forzar reflow: leer estilos antes de escribirlos.
- Reutilizar colecciones; evitar selecciones redundantes.

## Compatibilidad y diseño
- ES6 modules; transpilar si se apunta a navegadores antiguos.
- API compatible mentalmente con jQuery, pero moderna (no polutes global).
- Tipado con JSDoc; documentación generable.

## Testing
- Unit tests por método (instancia y estáticos).
- Pruebas de integración en ejemplos interactivos.
- Casos de borde: colecciones vacías, nodos no válidos, contexto inválido.

## Documentación
- Ejemplos por categoría (Eventos, DOM, CSS, Ajax, Animaciones).
- Tabla de equivalencias jQuery → JRQuery.
- Guía de migración.

## Backlog sugerido
- `.serialize()` y `.serializeArray()` para formularios.
- `$.param()` para construir query strings.
- Easing predefinidos para animaciones.
- Modo estricto de selección (errores claros en selectores inválidos).

## Criterios de aceptación
- API estable, con pruebas y ejemplos.
- Rendimiento razonable en colecciones medianas.
- Sin errores de consola en ejemplos.
- Documentación clara y actualizada.

---

Si quieres priorizar, recomiendo: Fase 2 (DOM), Fase 3 (recorrido), Fase 1 (eventos avanzados), y luego Ajax y Animaciones. Puedo empezar implementando `.append/.prepend/.closest/.siblings/.one` de inmediato.

## Ejemplos de uso ampliados

### Selectores y Ready
```js
// Atajo DOM ready
$(function() {
  console.log('DOM listo con $(fn)');
});

// Selección con contexto
const contenedor = $('#contenedor')[0];
const items = $('.item', contenedor);
items.first().addClass('inicial');
```

### Eventos
```js
// Delegación: manejar clicks en elementos futuros dentro de un contenedor
$('#lista').on('click', '.item', function(e) {
  $(this).toggleClass('activo');
});

// Una sola vez (propuesto en Fase 1)
$('#boton').one('click', () => console.log('Solo una vez'));

// (Namespacing omitido)

// Trigger de evento personalizado (propuesto en Fase 1)
$('#btn').on('ready:data', (e, data) => console.log('Data:', data));
$('#btn').trigger('ready:data', { usuario: 'ana', rol: 'admin' });
```

### Manipulación del DOM
```js
// Agregar y anteponer contenido
$('.lista').append('<li>Al final</li>');
$('.lista').prepend('<li>Al inicio</li>');

// Insertar alrededor
$('.item').before('<hr>');
$('.item').after('<hr>');

// Remover y vaciar
$('.item.eliminar').remove();
$('#panel').empty();

// Clonar (propuesto en Fase 2)
const clon = $('#plantilla').clone(true); // deep clone
$('#destino').append(clon);

// Reemplazar (propuesto en Fase 2)
$('. marcador').replaceWith('<span>Nuevo</span>');
```

### Recorrido y filtrado
```js
// Ancestro más cercano (propuesto en Fase 3)
$('.chip.activo').closest('.tarjeta').addClass('focus');

// Hermanos (propuesto en Fase 3)
$('.item.seleccionado').siblings().addClass('hermano');
$('.item').next('.destacado').addClass('siguiente');
$('.item').prev().addClass('previo');

// Filtrar y excluir (propuesto en Fase 3)
$('.item')
  .filter((i, el) => el.textContent.includes('JRQuery'))
  .addClass('match');

$('.item').not('.disabled').addClass('enabled');
```

### Atributos, datos y formularios
```js
// Atributos
$('.link').attr('href', '/home');
$('.link').removeAttr('target');

// Propiedades
$('#check').prop('checked', true);

// Data (atributos data-* y/o almacenamiento interno)
$('#user').data('role', 'admin');
const rol = $('#user').data('role');

// Formularios
$('#nombre').val('JRQuery');
const valor = $('#nombre').val();
```

### CSS
```js
// Establecer múltiples estilos a la vez
$('.btn').css({
  color: 'white',
  backgroundColor: 'tomato',
  padding: '8px 12px',
});

// Obtener un estilo computado
const color = $('.btn').css('color');
```

### Ajax (propuesto en Fase 4)
```js
// Llamada genérica
$.ajax({
  url: '/api/items',
  method: 'GET',
  headers: { 'Accept': 'application/json' },
  timeout: 8000,
}).then(resp => resp.json()).then(data => console.log(data));

// Atajos
$.get('/api/items').then(data => console.log(data));
$.post('/api/items', { nombre: 'JRQuery' }).then(r => console.log(r));
```

### Animaciones y efectos (propuesto en Fase 5)
```js
$('#modal').fadeIn(200);
$('#modal .cerrar').on('click', () => $('#modal').fadeOut(200));

$('.panel').slideDown(300).slideUp(300);

// Animate simple
$('.box').animate({ opacity: 0.5 }, 250, 'linear', () => console.log('done'));
```

### Plugins
```js
// Extender la API con un plugin simple
$.fn.toggleDisabled = function() {
  return this.each((i, el) => {
    const $el = $(el);
    $el.prop('disabled', !$el.prop('disabled'));
  });
};

$('button').toggleDisabled();
```