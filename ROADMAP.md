# JRQuery Roadmap

Este documento lista únicamente las funcionalidades core pendientes por implementar para alinear JRQuery con jQuery (3.6+), incluyendo selección/recorrido, manipulación del DOM, eventos y utilidades de formularios.

## Principios
- Mantener compatibilidad mental con jQuery y ES6 modules
- Priorizar rendimiento (operaciones por lote, evitar reflows)
- Extensibilidad vía `$.fn`

## Roadmap por fases

### Fase 1 — Selección y recorrido (pendiente)
- `.is(selector|fn)`
- `.siblings([selector])`
- `.next([selector])`
- `.prev([selector])`
- Alinear `.first()`, `.last()`, `.eq()` para devolver colecciones JRQuery

**Ejemplos:**
```js
$('.item').is('.active')          // true/false
$('.item').siblings('.selected') // hermanos filtrados
$('.item').next()                 // siguiente hermano
$('.item').prev('.highlight')     // anterior con clase
$('.list').first()                // devolver JRQuery, no Element
```

### Fase 2 — Manipulación del DOM y contenido (pendiente)
- `.replaceWith(content)`
- `.wrap(html|elem)`
- `.unwrap()`
- `.insertBefore(target)`
- `.insertAfter(target)`
- `.replaceAll(target)`

**Ejemplos:**
```js
$('.old').replaceWith('<span>new</span>')
$('.box').wrap('<div class="wrapper"/>')
$('.inner').unwrap()
$('<p>Hi</p>').insertBefore('#target')
$('.clone').insertAfter('.original')
$('<button>').replaceAll('.link')
```

### Fase 3 — Eventos (pendiente)
- `.one(events, [selector], handler)`
- Namespacing de eventos (por ejemplo `click.ns`)
- `off(events, selector, handler)` con soporte de `selector`

**Ejemplos:**
```js
$('.btn').one('click', e => console.log('una vez'))
$('.list').on('click.item', '.item', handler) // namespace .item
$('.list').off('click.item', '.item')         // remove con selector
```

### Fase 4 — Utilidades de formularios y datos (pendiente)
- `.serialize()`
- `.serializeArray()`
- `$.param(obj)`

**Ejemplos:**
```js
$('form').serialize()           // "name=John&age=30"
$('form').serializeArray()     // [{name:"name",value:"John"}, ...]
$.param({a:1, b:[2,3]})        // "a=1&b%5B%5D=2&b%5B%5D=3"
```

## Objetivos técnicos
- Implementar namespacing y `.one` siguiendo jQuery 3.6+
- Normalizar métodos de recorrido para encadenamiento (`first/last/eq`)
- Agrupar inserciones y minimizar reflows en operaciones DOM
- Mantener compatibilidad total con API de utilidades de formularios