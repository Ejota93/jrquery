# Optimización de JRQuery

## Introducción

JRQuery es una librería ligera para manipulación del DOM inspirada en jQuery. El objetivo de este ciclo de optimización es reducir trabajo innecesario, eliminar duplicaciones, minimizar reflows y escrituras redundantes de estilo/HTML, y mejorar la robustez de la API sin cambiar su superficie pública. Las mejoras se enfocan en operaciones frecuentes (clases, búsqueda, inserción, visibilidad) y en pequeños ajustes que evitan iteraciones y asignaciones extra.

## Resumen de Optimizaciones

- Eliminación del método duplicado `css` y consolidación en una única implementación con soporte de getter/setter.
- Soporte ampliado en `parseSelector` para `HTMLCollection`, `Document` y `DocumentFragment` (mejor `$(document)` y colecciones nativas).
- Manejo de múltiples clases en `addClass`, `removeClass` y `toggleClass` en una sola llamada.
- Deduplicación de resultados en `find`, `parent` y `children` para evitar trabajo repetido.
- Detección robusta de instancias JRQuery en `append/prepend/before/after` usando `instanceof` con fallback.
- Uso de `el.remove()` cuando está disponible en `remove`.
- Mejora de `show/hide/toggle` usando `getComputedStyle` para minimizar escrituras y reflows.
- Evitar escrituras redundantes en `html` y `text` cuando el valor no cambia.

## Detalle Técnico de Optimizaciones

### 1) Eliminación del método `css` duplicado

- Problema: Existían dos definiciones de `css` en `src/jrquery.js` (`412–431` y `633–656`). Esto aumenta la ambigüedad y tamaño del código; la segunda sobreescribe la primera.
- Solución: Eliminar la primera definición y mantener la segunda que soporta getters y setters. Referencia original: `src/jrquery.js:412` y `src/jrquery.js:633`.
- Beneficios: Menor superficie de código, comportamiento único y claro, menor riesgo de incoherencias.
- Métricas: Reducción de ~20 líneas. No aplican métricas de tiempo de ejecución directas.

### 2) Manejo de múltiples clases

- Problema: `addClass/removeClass/toggleClass` aceptaban un único token, forzando múltiples llamadas o bucles adicionales.
- Solución: Aceptar varios tokens separados por espacios y aplicar `classList.add(...tokens)` y `classList.remove(...tokens)`; en `toggleClass` aplicar por token.
- Beneficios: Menos iteraciones y llamadas por operación; API más expresiva.
- Métricas: En escenarios con 3–5 clases, se reduce de N iteraciones por clase a 1 iteración por elemento; mejora micro de uso de `classList` con argumentos extendidos.

### 3) Soporte ampliado en `parseSelector`

- Problema: `$(document)` y colecciones nativas como `HTMLCollection` no se mapeaban, resultando en colecciones vacías o necesidad de conversión manual.
- Solución: Reconocer `HTMLCollection`, `Document` y `DocumentFragment` y devolver arrays adecuados. Referencia: `src/jrquery.js:33`.
- Beneficios: Mejor experiencia con `$.ready`, delegación de eventos sobre `document`, y soporte directo de colecciones del DOM.
- Métricas: Evita conversiones manuales; rendimiento neutro o ligeramente mejor por menos branching en uso real.

### 4) Deduplicación en `find`, `parent` y `children`

- Problema: Las operaciones podían producir duplicados, incrementando trabajo en encadenamientos posteriores.
- Solución: Usar `Set` para evitar insertar nodos ya vistos preservando el orden del documento.
- Beneficios: Menor volumen de elementos en colecciones, menos iteraciones posteriores y menor consumo de memoria temporal.
- Métricas: Dependiente del árbol; en colecciones con 10–20% de duplicados, el ahorro en bucles posteriores es proporcional.

### 5) Detección robusta de JRQuery en inserciones

- Problema: La verificación de JRQuery comprobaba solo la forma del objeto (`val && Array.isArray(val.elements)`), susceptible a falsos positivos.
- Solución: Usar `val instanceof JRQuery` con fallback de forma para máxima compatibilidad entre bundles.
- Beneficios: Menor coste de verificación y mayor robustez.
- Métricas: Micro-mejora; reduce checks y evita casos límite.

### 6) `remove` con API nativa

- Problema: Uso de `parentNode.removeChild(el)` siempre, aunque `el.remove()` existe y es más directo.
- Solución: Preferir `el.remove()` y fallback a `removeChild`.
- Beneficios: Menor código ejecutado por eliminación y claridad.
- Métricas: Micro-mejora por menor interacción con el nodo padre.

### 7) `show/hide/toggle` conscientes del estilo computado

- Problema: Escribir `display: 'block'` incondicionalmente puede romper layouts y provocar reflows innecesarios.
- Solución: Consultar `getComputedStyle`; en `show` intentar `style.display = ''` y solo usar `'block'` si sigue en `'none'`; en `hide` evitar escribir si ya está oculto; en `toggle` combinar ambas.
- Beneficios: Menos escrituras de estilo, reflows más controlados, preserva `display` original cuando existe.
- Métricas: Mejora dependiente del layout; reduce escrituras redundantes especialmente en grandes colecciones.

### 8) Evitar escrituras redundantes en `html` y `text`

- Problema: Asignaciones repetidas del mismo contenido generan trabajo innecesario.
- Solución: Comparar el contenido actual con el nuevo antes de asignar en ambos casos (string y callback).
- Beneficios: Menos mutaciones del DOM, menos eventos de layout/paint.
- Métricas: Mejora depende de patrones de uso; cuando el contenido no cambia frecuentemente, evita la mayoría de escrituras.

## Ejemplos Antes/Después

### Múltiples clases en una llamada

Original (`src/jrquery.js:63`):

```js
addClass(className) {
  if (!className) return this;
  this.elements.forEach(element => {
    element.classList.add(className);
  });
  return this;
}
```

Optimizado:

```js
addClass(className) {
  if (!className) return this;
  const tokens = String(className).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return this;
  this.elements.forEach(element => {
    element.classList.add(...tokens);
  });
  return this;
}
```

Explicación: se aceptan múltiples clases separadas por espacios, reduciendo iteraciones y llamadas a `classList`.

### `parseSelector` con `HTMLCollection` y `Document`

Original (`src/jrquery.js:33`):

```js
if (Array.isArray(selector) || selector instanceof NodeList) {
  return Array.from(selector);
}
```

Optimizado:

```js
if (Array.isArray(selector) || selector instanceof NodeList || (typeof HTMLCollection !== 'undefined' && selector instanceof HTMLCollection)) {
  return Array.from(selector);
}
if ((typeof Document !== 'undefined' && selector instanceof Document) || (typeof DocumentFragment !== 'undefined' && selector instanceof DocumentFragment)) {
  return [selector];
}
```

Explicación: se soportan colecciones nativas y nodos raíz, mejorando `$(document)` y flujos de eventos.

### Deduplicación en `find`

Original (`src/jrquery.js:691`):

```js
const foundElements = [];
this.elements.forEach(element => {
  const matches = element.querySelectorAll(selector);
  foundElements.push(...Array.from(matches));
});
```

Optimizado:

```js
const foundElements = [];
const seen = new Set();
this.elements.forEach(element => {
  element.querySelectorAll(selector).forEach(node => {
    if (!seen.has(node)) {
      seen.add(node);
      foundElements.push(node);
    }
  });
});
```

Explicación: se evitan duplicados preservando el orden de documento.

### `show/hide/toggle` conscientes de `display`

Original (`src/jrquery.js:732–766`):

```js
show() { this.elements.forEach(el => { el.style.display = 'block'; }); }
hide() { this.elements.forEach(el => { el.style.display = 'none'; }); }
toggle() { this.elements.forEach(el => { el.style.display = (el.style.display === 'none') ? 'block' : 'none'; }); }
```

Optimizado:

```js
show() {
  this.elements.forEach(element => {
    const computed = window.getComputedStyle(element);
    if (computed.display === 'none') {
      element.style.display = '';
      if (window.getComputedStyle(element).display === 'none') {
        element.style.display = 'block';
      }
    }
  });
}
hide() {
  this.elements.forEach(element => {
    const computed = window.getComputedStyle(element);
    if (computed.display !== 'none') {
      element.style.display = 'none';
    }
  });
}
toggle() {
  this.elements.forEach(element => {
    const computed = window.getComputedStyle(element);
    if (computed.display === 'none') {
      element.style.display = '';
      if (window.getComputedStyle(element).display === 'none') {
        element.style.display = 'block';
      }
    } else {
      element.style.display = 'none';
    }
  });
}
```

Explicación: se evita forzar `'block'` cuando no es necesario y se reduce la cantidad de escrituras de estilo.

### Evitar escrituras redundantes en `html`/`text`

Original (`src/jrquery.js:115–127` y `144–156`): asigna siempre el valor calculado.

Optimizado:

```js
const current = element.innerHTML;
const next = html.call(element, i, current);
if (next !== undefined && next !== null) {
  const str = String(next);
  if (str !== current) {
    element.innerHTML = str;
  }
}
```

Explicación: se compara con el contenido actual para evitar mutaciones innecesarias del DOM.

## Resultados

### Comparativas de rendimiento

Las optimizaciones apuntan a reducir operaciones redundantes y duplicadas. Las mejoras reales dependen del tamaño de las colecciones y patrones de uso.

| Área | Cambio | Observación |
|------|--------|-------------|
| Clases | `add/remove/toggle` múltiples | Menos llamadas a `classList` por operación |
| Búsqueda | Deduplicación en `find/parent/children` | Menos elementos a procesar en encadenamientos |
| Visibilidad | `show/hide/toggle` con `computed` | Menos escrituras de estilo y reflows |
| Contenido | `html/text` sin escrituras redundantes | Menos mutaciones del DOM |

### Métricas cuantificables

No se incluyen cifras instrumentadas en este documento. Se recomienda medir en el entorno destino con `Performance` API y `console.time` en escenarios representativos.

### Gráficos o tablas

Se proporciona tabla de cambios y observaciones cualitativas. Gráficos cuantitativos quedan como trabajo futuro tras instrumentación.

## Consideraciones adicionales

- Impacto: Cambios son retrocompatibles y no alteran la API; la deduplicación puede cambiar el conteo de elementos en casos donde se esperaban duplicados, lo cual es normalmente deseable.
- Limitaciones: No se implementó índice inverso para acelerar `off(eventType, handler)`; se mantiene la estructura actual O(n) por lista de handlers.
- Recomendaciones futuras:
  - Instrumentar microbenchmarks en páginas reales para obtener métricas concretas.
  - Añadir índice `originalHandler → wrapped` para `off` y reducir coste de eliminación.
  - Añadir `show` que restaure `display` original por tag mediante una pequeña tabla de defaults.

## Referencias

- Archivo principal: `src/jrquery.js`
- Ubicaciones originales relevantes: `src/jrquery.js:33`, `src/jrquery.js:63`, `src/jrquery.js:412`, `src/jrquery.js:633`, `src/jrquery.js:691`, `src/jrquery.js:732`.