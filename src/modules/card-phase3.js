// Card 12: Recorrido y filtrado (.closest y .filter) en módulo ES6
import { $ } from '../jrquery.js';

$(document).ready(function() {
  // Delegación: al hacer click en .p3-label, resaltar el <li> más cercano
  $('#p3-container').on('click', '.p3-label', function(e) {
    const li = $(this).closest('li');
    if (li && li.exists()) {
      $(li).toggleClass('highlight');
      const idx = $(li).index();
      $('#p3-result').html('Closest LI: ' + $(li).text() + ' | index entre hermanos: ' + idx);
    }
  });

  // Activar clase 'active' en elementos pares
  $('#p3-activate-even').on('click', function() {
    $('#p3-list li').filter((i) => i % 2 === 0).addClass('active');
    $('#p3-filter-result').html('Marcados pares como active');
  });

  // Filtrar por selector '.active'
  $('#p3-filter-active').on('click', function() {
    const actives = $('#p3-list li').filter('.active');
    $('#p3-filter-result').html('Activos: ' + actives.elements.length);
  });

  // Filtrar por texto que contenga 'JRQuery'
  $('#p3-filter-text').on('click', function() {
    const matches = $('#p3-list li').filter((i, el) => el.textContent.includes('JRQuery'));
    matches.addClass('blue');
    $('#p3-filter-result').html('Items con "JRQuery": ' + matches.elements.length);
  });

  // Excluir no activos con .not()
  $('#p3-exclude-active').on('click', function() {
    const notActive = $('#p3-list li').not('.active');
    notActive.addClass('blue');
    $('#p3-filter-result').html('No activos (marcados en azul): ' + notActive.elements.length);
  });

  // Índice del primer LI entre sus hermanos
  $('#p3-index-first').on('click', function() {
    const idx = $('#p3-list li').index();
    $('#p3-result').html('Índice del primer LI entre sus hermanos: ' + idx);
  });

  // Índice del primer elemento que coincide con '.active' dentro de la colección
  $('#p3-index-active').on('click', function() {
    const idx = $('#p3-list li').index('.active');
    $('#p3-result').html('Índice del primer LI activo dentro de la colección: ' + idx);
  });

  // Resetear estados
  $('#p3-reset').on('click', function() {
    $('#p3-list li').removeClass('active').removeClass('blue').removeClass('highlight');
    $('#p3-result').html('');
    $('#p3-filter-result').html('');
  });
});