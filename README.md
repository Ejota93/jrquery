# JRQuery — Librería ligera inspirada en jQuery (ES6 Modules)

JRQuery es una librería JavaScript ligera que se inspira en la API y experiencia de jQuery, manteniendo prácticas modernas con ES6 modules, buen rendimiento y código claro. No contamina el espacio global: se importa explícitamente como `import { $ } from './src/jrquery.js'`.


## Características Principales
- Selectores tipo jQuery (`#id`, `.clase`, `tag`), devolviendo colecciones JRQuery.
- Encadenamiento de métodos y operaciones sobre colecciones.
- **Fase 1 - Selección y recorrido**:
  - `.is(selector|fn|element)` - Verifica si elementos coinciden con criterios.
  - `.siblings([selector])` - Obtiene hermanos, opcionalmente filtrados.
  - `.next([selector])` - Siguiente elemento hermano.
  - `.prev([selector])` - Elemento hermano anterior.
  - `.first()`, `.last()`, `.eq(index)` - Retornan JRQuery para encadenamiento.
- Eventos con `.on()` y `.trigger()` con delegación.
- Manipulación de clases: `.addClass()`, `.removeClass()`, `.toggleClass()`.
- Atributos y estilos: `.attr()`, `.removeAttr()`, `.css()`.
- Visibilidad: `.show()`, `.hide()`, `.toggle()`.
- Recorrido y utilidades: `.each()`, `$.each()`, `$.map()`, `$.trim()`, `$.type()`, `$.isArray()`, `$.isFunction()`, `$.isObject()`.
- DOM (Fase 2): `.append()`, `.prepend()`, `.before()`, `.after()`, `.empty()`, `.clone()`.
- Contenido (Fase 2): `.text()`, `.html()` soportan getter y setter; ahora también aceptan callbacks `fn(index, current)`.
- Recorrido y filtrado (Fase 3): `.closest()`, `.filter(selector|fn)`, `.not(selector|fn|element|collection)`, `.index([needle])`.


## Estructura del Proyecto
```
JRQuery/
├── ejemplos.html            # Página de demostración con 13 secciones
├── index.html               # Landing minimal con enlace a ejemplos
├── src/
│   ├── jrquery.js           # Núcleo de la librería JRQuery
│   ├── modules/
│   │   ├── card-phase1.js   # Ejemplos Fase 1 (selección/recorrido)
│   │   ├── card-phase2.js   # Ejemplos Fase 2 (DOM)
│   │   ├── card-phase3.js   # Ejemplos Fase 3 (recorrido/filtrado)
│   │   └── card-phase4.js   # Ejemplos Fase 4 (AJAX/utilidades)
│   └── style.css            # Estilos de soporte para los ejemplos
├── dist/                    # Build generado por Vite
├── ROADMAP.md               # Plan de evolución y estado
├── package.json             # Scripts y dependencias (pnpm)
└── test.js                  # (opcional) script de pruebas rápidas
```


## Ejecutar el Proyecto
- Requisitos: Node 18+, pnpm.
- Instalar dependencias: `pnpm install`
- Desarrollo: `pnpm run dev` y abrir `http://localhost:5173/ejemplos.html`
- Build: `pnpm run build`


## Uso Básico
```html
<script type="module">
  import { $ } from './src/jrquery.js';

  $(document).ready(function() {
    // Selección
    const items = $('.item');

    // Encadenamiento
    items.addClass('highlight').css('color', 'blue');

    // Fase 1 - Selección y recorrido
    // Verificar si elementos coinciden
    if (items.is('.active')) {
      console.log('Hay elementos activos');
    }
    
    // Navegación entre hermanos
    const activeItem = $('.item.active').first();
    const siblings = activeItem.siblings('.item');
    const nextItem = activeItem.next();
    const prevItem = activeItem.prev();
    
    // Encadenamiento con first(), last(), eq()
    $('.list')
      .first()           // Primer elemento .list
      .addClass('first')
      .next()            // Siguiente hermano
      .addClass('second');
    
    // Obtener elemento por índice
    const middleItem = items.eq(Math.floor(items.length / 2));

    // Eventos
    $('#btn').on('click', function() {
      $('#panel').toggle();
    });

    // Fase 4 - AJAX y Utilidades
    // Petición GET simple
    $.get('https://jsonplaceholder.typicode.com/posts/1')
      .done(function(data) {
        console.log('Post obtenido:', data.title);
      })
      .fail(function(xhr, status, error) {
        console.error('Error:', error);
      });

    // Cargar contenido con .load()
    $('#contenedor').load('fragmento.html', function() {
      console.log('Contenido cargado');
    });
  });
</script>
```


## API Implementada (resumen)
- Selección y colección:
  - `$()` crea colecciones JRQuery desde selectores, elementos o arrays.
  - `.elements` expone el array interno; `.length` y `.exists()` ayudan a chequear.
- **Fase 1 - Selección y recorrido**:
  - `.is(selector|fn|element)` - Verifica coincidencia con selector, función o elemento.
  - `.siblings([selector])` - Obtiene hermanos, opcionalmente filtrados por selector.
  - `.next([selector])` - Siguiente hermano, opcionalmente filtrado.
  - `.prev([selector])` - Hermano anterior, opcionalmente filtrado.
  - `.first()`, `.last()`, `.eq(index)` - Retornan JRQuery para encadenamiento.
- Eventos:
  - `.on(event, selector?, handler)` soporta delegación; `.trigger(event, data?)`.
- Clases y estilos:
  - `.addClass(name)`, `.removeClass(name)`, `.toggleClass(name)`.
  - `.css(name, value)` o `.css(object)`.
- Atributos:
  - `.attr(name)` getter, `.attr(name, value)` setter, `.removeAttr(name)`.
- Visibilidad:
  - `.show()`, `.hide()`, `.toggle()`.
- Recorrido y utilidades:
  - `.each(fn)`, `$.each(array, fn)`, `$.map(array, fn)`, `$.trim(string)`, `$.type(value)`, `$.isArray(value)`, `$.isFunction(value)`, `$.isObject(value)`.
- **Fase 4 - Utilidades AJAX**:
  - `$.ajax(options)` - Peticiones AJAX con fetch API, compatible con jQuery.
  - `$.get(url, data?, success?, dataType?)` - Petición GET simplificada.
  - `$.post(url, data?, success?, dataType?)` - Petición POST simplificada.
  - `$.getJSON(url, data?, success?)` - Petición GET esperando JSON.
  - `.load(url, callback?)` - Carga contenido HTML en elementos.
- Manipulación del DOM (Fase 2):
  - `.append(html|element)`, `.prepend(html|element)`.
  - `.before(html|element)`, `.after(html|element)`.
  - `.empty()`, `.clone(deepEvents?)`.
- Contenido (Fase 2):
  - `.html()` getter; `.html(value|string)` setter; `.html(fn(index, current))`.
  - `.text()` getter; `.text(value|string)` setter; `.text(fn(index, current))`.
- Recorrido y filtrado (Fase 3):
  - `.closest(selector)` devuelve el ancestro más cercano por elemento.
  - `.filter(selector|fn)` filtra la colección. Con función recibe `(index, element)`.
  - `.not(selector|fn|element|collection)` excluye elementos de la colección.
  - `.index()` índice del primer elemento respecto a sus hermanos; `.index(selector|element)` índice del primer match dentro de la colección.
- **Fase 4 - Utilidades AJAX**:
  - `$.ajax(options)` - Peticiones AJAX con fetch API, compatible con jQuery.
  - `$.get(url, data?, success?, dataType?)` - Petición GET simplificada.
  - `$.post(url, data?, success?, dataType?)` - Petición POST simplificada.
  - `$.getJSON(url, data?, success?)` - Petición GET esperando JSON.
  - `.load(url, callback?)` - Carga contenido HTML en elementos.


## Ejemplos Incluidos (ejemplos.html)
La página `ejemplos.html` contiene 13 secciones con botones y código demostrativo:

1) Selectores
- Demuestra selección por `#id`, `.clase` y `tag`, y lectura de contenido con `.text()`.
- Acción: `Probar Selectores` muestra resultados en `#selector-resultado`.

2) Manipulación de Clases
- `.addClass('red')`, `.removeClass('green')`, `.toggleClass('highlight')` sobre `.box`.
- Acciones: agregar rojo, remover verde, alternar highlight.

3) Manipulación de Contenido
- `.html()` y `.text()` como getter y setter.
- Acciones: obtener/establecer HTML y texto en `#contenido-ejemplo`.

4) Manejo de Eventos
- `.on('click')` y `.on('mouseover')`; `.trigger('ready:data', payload)`.
- Acciones: click en `#boton-evento`, disparar evento custom; hover en `.evento-parrafo`.

5) Iteración con `each()`
- `.each(fn)` sobre `.lista-item`, construyendo un reporte.
- Acción: `Iterar Elementos` genera salida en `#iteracion-resultado`.

6) Control de Visibilidad
- `.show()`, `.hide()`, `.toggle()`.
- Acciones: mostrar/ocultar/alternar `#elemento-visibilidad`.

7) Manipulación de Atributos
- `.attr('href')` getter/setter, `.removeAttr('title')`.
- Acciones: obtener/cambiar `href` y remover `title` en `#enlace-ejemplo`.

8) Aplicación de Estilos
- `.css('prop', 'valor')` y `.css({ ... })` con múltiples propiedades.
- Acciones: aplicar estilo individual, múltiples estilos y reset.

9) Funciones Utilitarias
- `$.each`, `$.map`, `$.trim`, `$.type`, `$.isArray`, `$.isFunction`, `$.isObject`, y `$.extend(true, ...)`.
- Acción: `Probar Utilidades` muestra salida consolidada.

10) Delegación `.on()` y `$.extend` profundo
- Delegación sobre `#delegacion-contenedor` para `.deleg-item`.
- `$.extend(true, ...)` mezcla profunda preservando arrays y objetos anidados.
- Acciones: agregar ítem dinámico, reset y probar `$.extend`.

11) Manipulación del DOM (Fase 2)
- `.append`, `.prepend`, `.before`, `.after`, `.empty`, `.clone(true)` sobre `#fase2-list`.
- Nuevos ejemplos con callbacks:
  - `Texto con callback (.text(fn))`: transforma cada `li` a "<índice>: <texto MAYÚSCULAS>".
  - `HTML con callback (.html(fn))`: envuelve el contenido en `<span class="index">` con el índice.
- Selección de `li` con toggle de `.highlight` vía delegación.

12) Recorrido y filtrado: `.closest()` y `.filter()`
- Delegación click en `.p3-label` que busca el `<li>` más cercano con `.closest('li')`, alterna `.highlight` y muestra el índice entre hermanos con `.index()`.
- Filtrado:
  - `.filter('.active')` por selector.
  - `.filter(fn)` por función (ej. contiene "JRQuery").
  - `.not('.active')` para excluir activos.
- Índices:
  - `.index()` índice del primer `li` entre sus hermanos.
  - `.index('.active')` índice del primer activo dentro de la colección.
- Acciones: activar pares (`.addClass('active')`), filtrar activos y texto, excluir no activos, índices y reset.

13) Fase 4 - Utilidades AJAX
- `$.get()`: Petición GET a JSONPlaceholder para obtener un post.
- `$.post()`: Petición POST para crear un nuevo post.
- `$.getJSON()`: Obtener datos JSON de usuarios.
- `$.ajax()`: Petición completa con configuración personalizada.
- `.load()`: Cargar contenido HTML en un contenedor.
- Manejo de errores y visualización de resultados en tiempo real.
- Acciones: ejecutar cada tipo de petición AJAX y limpiar resultados.


## Ejemplos de Callbacks en `.text()` y `.html()`
```js
// .text(fn): i = índice, actual = contenido de texto
$('#fase2-list li').text(function(i, actual) {
  return (i + 1) + ': ' + String(actual).toUpperCase();
});

// .html(fn): i = índice, actual = HTML actual
$('#fase2-list li').html(function(i, actual) {
  return '<span class="index">' + (i + 1) + '</span> ' + actual;
});
```
- `this` dentro del callback apunta al elemento actual.
- Si el callback retorna `null`/`undefined`, el contenido no se modifica.


## Estilos de Ejemplo
- `src/style.css` incluye estilos para `.demo-section`, `.demo-button`, `.box`, `.red`, `.blue`, `.green`, `.highlight`, `.hidden`, `.lista-ejemplo`, `.active` y separadores `hr`.
- La clase `.active` y `.blue` se usan en la Sección 12 para marcar y diferenciar elementos.


## Desarrollo y Buenas Prácticas
- ES6 modules en todos los ejemplos; sin variables globales.
- Delegación de eventos para elementos dinámicos.
- Encadenamiento seguro y operaciones sobre colecciones JRQuery.
- Código organizado por "cards" de fase en `src/modules/`.


## Estado del Roadmap
- Fase 2: métodos de DOM y callbacks en `.text()`/`.html()` completados.
- Fase 3: `.closest`, `.filter`, `.not`, `.index` completados.
- Fase 4: Utilidades AJAX (`$.ajax`, `$.get`, `$.post`, `$.getJSON`, `.load`) completadas.
- Ver `ROADMAP.md` para próximos pasos y sugerencias.


## Contribuir
- Sugerencias y PRs son bienvenidos.
- Por favor mantén el estilo y filosofía del proyecto: simple, moderno y claro.