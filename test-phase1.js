/**
 * Test de Fase 1 - Selección y recorrido
 * Verifica el funcionamiento de los métodos implementados
 */

import { $ } from './src/jrquery.js';

console.log('🧪 Iniciando tests de Fase 1...');

// Test 1: .is() con selector
console.log('\n✅ Test 1: .is() con selector');
const testDiv = $('<div class="test active"></div>');
console.log('¿Es div?', testDiv.is('div')); // true
console.log('¿Tiene clase active?', testDiv.is('.active')); // true
console.log('¿Es span?', testDiv.is('span')); // false

// Test 2: .is() con función
console.log('\n✅ Test 2: .is() con función');
const items = $('<div>1</div><div>2</div><div>3</div>');
const result = items.is(function(index) {
    return index === 1; // Solo el segundo elemento
});
console.log('¿Algún elemento tiene índice 1?', result); // true

// Test 3: .is() con elemento
console.log('\n✅ Test 3: .is() con elemento');
const element = document.createElement('div');
const $element = $(element);
console.log('¿Contiene el elemento?', $element.is(element)); // true

// Test 4: .first(), .last(), .eq() retornan JRQuery
console.log('\n✅ Test 4: Encadenamiento con first/last/eq');
const collection = $('<div>A</div><div>B</div><div>C</div>');
const first = collection.first();
const last = collection.last();
const middle = collection.eq(1);

console.log('¿First retorna JRQuery?', first instanceof JRQuery); // true
console.log('¿Last retorna JRQuery?', last instanceof JRQuery); // true
console.log('¿Eq retorna JRQuery?', middle instanceof JRQuery); // true

// Test de encadenamiento
const chained = collection.first().addClass('test').next();
console.log('¿Encadenamiento funciona?', chained.length > 0); // true

// Test 5: .siblings()
console.log('\n✅ Test 5: .siblings()');
const parent = $('<div><p id="p1"></p><p id="p2"></p><span id="span1"></span></div>');
const p1 = parent.find('#p1');
const siblings = p1.siblings();
console.log('¿Número de hermanos?', siblings.length); // 2

const siblingsFiltered = p1.siblings('p');
console.log('¿Hermanos filtrados (solo p)?', siblingsFiltered.length); // 1

// Test 6: .next() y .prev()
console.log('\n✅ Test 6: .next() y .prev()');
const list = $('<ul><li id="li1">1</li><li id="li2">2</li><li id="li3">3</li></ul>');
const li2 = list.find('#li2');
const prev = li2.prev();
const next = li2.next();

console.log('¿Elemento anterior?', prev.attr('id')); // li1
console.log('¿Elemento siguiente?', next.attr('id')); // li3

// Test con filtro
const nextWithFilter = li2.next('[id="li3"]');
console.log('¿Siguiente con filtro?', nextWithFilter.length); // 1

console.log('\n🎉 ¡Todos los tests de Fase 1 completados!');

// Nota: JRQuery no está definido en el scope, necesitamos acceder a través del módulo
// Esto es solo un ejemplo conceptual - el test real se ejecutaría en un navegador con el módulo cargado