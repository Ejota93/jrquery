// Card 11: Manipulación del DOM (Fase 2) en módulo ES6
import { $ } from '../jrquery.js';

$(document).ready(function() {
  // Delegación para togglear selección en ítems
  $('#fase2-container').on('click', 'li', function() {
    $(this).toggleClass('highlight');
  });

  // Append un nuevo ítem
  $('#btn-append').on('click', function() {
    const count = $('#fase2-list li').length + 1;
    $('#fase2-list').append('<li class="item">Append ' + count + '</li>');
  });

  // Prepend un nuevo ítem
  $('#btn-prepend').on('click', function() {
    const count = $('#fase2-list li').length + 1;
    $('#fase2-list').prepend('<li class="item">Prepend ' + count + '</li>');
  });

  // Insertar antes del título
  $('#btn-before').on('click', function() {
    $('#fase2-title').before('<hr class="line-before">');
  });

  // Insertar después del título
  $('#btn-after').on('click', function() {
    $('#fase2-title').after('<hr class="line-after">');
  });

  // Vaciar la lista
  $('#btn-empty').on('click', function() {
    $('#fase2-list').empty();
  });

  // Clonar lista en el contenedor destino
  $('#btn-clone').on('click', function() {
    const clone = $('#fase2-list').clone(true);
    $('#fase2-clone-target').empty().append(clone);
  });

  // .text(fn): transformar texto de cada item
  $('#btn-text-fn').on('click', function() {
    $('#fase2-list li').text(function(i, actual) {
      return (i + 1) + ': ' + String(actual).toUpperCase();
    });
  });

  // .html(fn): envolver contenido en un span con índice
  $('#btn-html-fn').on('click', function() {
    $('#fase2-list li').html(function(i, actual) {
      return '<span class="index">' + (i + 1) + '</span> ' + actual;
    });
  });
});