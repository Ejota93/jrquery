/**
 * Card de demostración para Fase 1: Selección y recorrido
 * Este módulo demuestra el uso de métodos de selección y navegación del DOM
 * siguiendo estándares de calidad y patrones de diseño modular
 */

import { $ } from '../jrquery.js';

/**
 * Inicializa las demostraciones de Fase 1 cuando el DOM está listo
 */
$(document).ready(function() {
    console.log('🚀 Fase 1 - Selección y recorrido inicializada');
    
    // Demostración de .is() - Verificar coincidencias
    $('#btn-is-demo').on('click', function() {
        const items = $('.demo-item');
        const isActive = items.is('.active');
        const isFirstEven = items.first().is(function(index) {
            return index % 2 === 0;
        });
        
        console.log('¿Hay elementos activos?', isActive);
        console.log('¿El primer elemento es par?', isFirstEven);
        
        // Actualizar UI con resultados
        $('#is-result').text(`Activo: ${isActive}, Primer par: ${isFirstEven}`);
    });
    
    // Demostración de .siblings() - Navegación entre hermanos
    $('#btn-siblings-demo').on('click', function() {
        const activeItem = $('.demo-item.active').first();
        if (activeItem.length > 0) {
            const siblings = activeItem.siblings('.demo-item');
            console.log(`Encontrados ${siblings.length} hermanos`);
            
            // Resaltar hermanos temporalmente
            siblings.addClass('highlight');
            setTimeout(() => siblings.removeClass('highlight'), 1000);
            
            $('#siblings-result').text(`Hermanos encontrados: ${siblings.length}`);
        } else {
            $('#siblings-result').text('No hay elemento activo');
        }
    });
    
    // Demostración de .next() y .prev() - Navegación lineal
    $('#btn-next-prev-demo').on('click', function() {
        const current = $('.demo-item.active').first();
        if (current.length > 0) {
            const next = current.next('.demo-item');
            const prev = current.prev('.demo-item');
            
            console.log('Siguiente:', next.length > 0 ? 'encontrado' : 'no hay');
            console.log('Anterior:', prev.length > 0 ? 'encontrado' : 'no hay');
            
            // Mover clase activa
            current.removeClass('active');
            if (next.length > 0) {
                next.addClass('active');
                $('#next-prev-result').text('Movido al siguiente');
            } else if (prev.length > 0) {
                prev.addClass('active');
                $('#next-prev-result').text('Movido al anterior');
            } else {
                $('.demo-item').first().addClass('active');
                $('#next-prev-result').text('Vuelto al inicio');
            }
        }
    });
    
    // Demostración de encadenamiento con .first(), .last(), .eq()
    $('#btn-chaining-demo').on('click', function() {
        // Encadenamiento: primer elemento -> agregar clase -> obtener siguiente
        const result = $('.demo-item')
            .first()
            .addClass('chained')
            .next()
            .addClass('chained-sibling');
        
        console.log('Encadenamiento completado:', result.length > 0 ? 'éxito' : 'sin resultado');
        $('#chaining-result').text(`Elementos encadenados: ${result.length}`);
        
        // Limpiar después de 2 segundos
        setTimeout(() => {
            $('.demo-item').removeClass('chained chained-sibling');
        }, 2000);
    });
    
    // Demostración de filtrado con índices
    $('#btn-eq-demo').on('click', function() {
        const items = $('.demo-item');
        const middleIndex = Math.floor(items.length / 2);
        
        // Obtener elemento del medio y resaltar
        const middleItem = items.eq(middleIndex);
        middleItem.addClass('middle-highlight');
        
        console.log(`Elemento del medio (índice ${middleIndex}):`, middleItem.length > 0 ? 'encontrado' : 'no encontrado');
        
        $('#eq-result').text(`Elemento del medio resaltado (índice ${middleIndex})`);
        
        // Limpiar después de 1.5 segundos
        setTimeout(() => {
            middleItem.removeClass('middle-highlight');
        }, 1500);
    });
    
    // Inicializar estado activo en el primer elemento
    $('.demo-item').first().addClass('active');
    
    console.log('✅ Fase 1 - Demostraciones cargadas exitosamente');
});

/**
 * Función auxiliar para limpiar todas las clases de demostración
 */
function resetDemoStyles() {
    $('.demo-item').removeClass('active highlight chained chained-sibling middle-highlight');
    $('.demo-item').first().addClass('active');
}

// Exportar función para reinicio manual si es necesario
export { resetDemoStyles };