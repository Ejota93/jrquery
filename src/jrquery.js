/**
 * JRQuery - Librería JavaScript ligera para manipulación del DOM
 * Inspirada en jQuery, implementada con ES6 modules
 * @version 1.0.0
 * @author JRQuery Team
 */

/**
 * Clase principal JRQuery para manipulación del DOM
 * @class JRQuery
 */
// Registro básico de eventos por elemento para soportar off() sin namespaces
const JRQ_EVENTS = new WeakMap();

class JRQuery {
    /**
     * Constructor de JRQuery
     * @param {string|Element|NodeList|Array} selector - Selector CSS, elemento o colección
     * @param {Document|Element} [context=document] - Contexto para búsqueda de selectores
     */
    constructor(selector, context = document) {
        this.elements = this.parseSelector(selector, context);
        this.length = this.elements.length;
        return this;
    }

    /**
     * Parsea el selector y retorna elementos del DOM
     * @private
     * @param {string|Element|NodeList|Array} selector - Selector a parsear
     * @returns {Array<Element>} Array de elementos del DOM
     */
    parseSelector(selector, context = document) {
        if (!selector) return [];
        
        // Si ya es un array o NodeList, convertir a array
        if (Array.isArray(selector) || selector instanceof NodeList) {
            return Array.from(selector);
        }
        
        // Si es un elemento del DOM
        if (selector instanceof Element) {
            return [selector];
        }
        
        // Si es un string (selector CSS)
        if (typeof selector === 'string') {
            const cleaned = selector.trim();
            if (!cleaned) return [];
            // Usar querySelectorAll para soportar selectores complejos y contexto
            const scope = (context instanceof Element || context instanceof Document) ? context : document;
            return Array.from(scope.querySelectorAll(cleaned));
        }
        
        return [];
    }

    /**
     * Agrega una clase CSS a los elementos
     * @param {string} className - Nombre de la clase a agregar
     * @returns {JRQuery} Instancia actual para chaining
     */
    addClass(className) {
        if (!className) return this;
        
        this.elements.forEach(element => {
            element.classList.add(className);
        });
        
        return this;
    }

    /**
     * Remueve una clase CSS de los elementos
     * @param {string} className - Nombre de la clase a remover
     * @returns {JRQuery} Instancia actual para chaining
     */
    removeClass(className) {
        if (!className) return this;
        
        this.elements.forEach(element => {
            element.classList.remove(className);
        });
        
        return this;
    }

    /**
     * Alterna una clase CSS en los elementos
     * @param {string} className - Nombre de la clase a alternar
     * @returns {JRQuery} Instancia actual para chaining
     */
    toggleClass(className) {
        if (!className) return this;
        
        this.elements.forEach(element => {
            element.classList.toggle(className);
        });
        
        return this;
    }

    /**
     * Obtiene o establece el contenido HTML de los elementos
     * @param {string} [html] - HTML a establecer (opcional)
     * @returns {string|JRQuery} Contenido HTML o instancia actual
     */
    html(html) {
        // Getter
        if (html === undefined) {
            return this.elements[0]?.innerHTML || '';
        }
        
        // Setter: string o función callback
        if (typeof html === 'function') {
            this.elements.forEach((element, i) => {
                const current = element.innerHTML;
                const next = html.call(element, i, current);
                if (next !== undefined && next !== null) {
                    element.innerHTML = String(next);
                }
            });
        } else {
            this.elements.forEach(element => {
                element.innerHTML = html;
            });
        }
        
        return this;
    }

    /**
     * Obtiene o establece el texto de los elementos
     * @param {string} [text] - Texto a establecer (opcional)
     * @returns {string|JRQuery} Texto o instancia actual
     */
    text(text) {
        // Getter
        if (text === undefined) {
            return this.elements[0]?.textContent || '';
        }
        
        // Setter: string o función callback
        if (typeof text === 'function') {
            this.elements.forEach((element, i) => {
                const current = element.textContent;
                const next = text.call(element, i, current);
                if (next !== undefined && next !== null) {
                    element.textContent = String(next);
                }
            });
        } else {
            this.elements.forEach(element => {
                element.textContent = text;
            });
        }
        
        return this;
    }

    /**
     * Agrega contenido al final de cada elemento de la colección
     * @param {string|Element|Node|JRQuery} content - Contenido a agregar
     * @returns {JRQuery} Instancia actual para chaining
     */
    append(content) {
        if (content == null) return this;

        const isJRQuery = (val) => val && typeof val === 'object' && Array.isArray(val.elements);

        // String HTML
        if (typeof content === 'string') {
            this.elements.forEach(element => {
                element.insertAdjacentHTML('beforeend', content);
            });
            return this;
        }

        // JRQuery: agregar todos sus elementos
        if (isJRQuery(content)) {
            const nodes = content.elements;
            this.elements.forEach((target, idxTarget) => {
                nodes.forEach((node, idxNode) => {
                    // Clonar si hay múltiples destinos para no mover el mismo nodo
                    const toInsert = (idxTarget === 0) ? node : node.cloneNode(true);
                    target.appendChild(toInsert);
                });
            });
            return this;
        }

        // Node/Element
        if (content instanceof Node) {
            this.elements.forEach((target, idx) => {
                const toInsert = (idx === 0) ? content : content.cloneNode(true);
                target.appendChild(toInsert);
            });
            return this;
        }

        return this;
    }

    /**
     * Inserta contenido al inicio de cada elemento de la colección
     * @param {string|Element|Node|JRQuery} content - Contenido a insertar
     * @returns {JRQuery} Instancia actual para chaining
     */
    prepend(content) {
        if (content == null) return this;

        const isJRQuery = (val) => val && typeof val === 'object' && Array.isArray(val.elements);

        if (typeof content === 'string') {
            this.elements.forEach(element => {
                element.insertAdjacentHTML('afterbegin', content);
            });
            return this;
        }

        if (isJRQuery(content)) {
            const nodes = content.elements;
            this.elements.forEach((target, idxTarget) => {
                nodes.forEach((node, idxNode) => {
                    const toInsert = (idxTarget === 0) ? node : node.cloneNode(true);
                    if (typeof target.prepend === 'function') {
                        target.prepend(toInsert);
                    } else {
                        target.insertBefore(toInsert, target.firstChild);
                    }
                });
            });
            return this;
        }

        if (content instanceof Node) {
            this.elements.forEach((target, idx) => {
                const toInsert = (idx === 0) ? content : content.cloneNode(true);
                if (typeof target.prepend === 'function') {
                    target.prepend(toInsert);
                } else {
                    target.insertBefore(toInsert, target.firstChild);
                }
            });
            return this;
        }

        return this;
    }

    /**
     * Inserta contenido antes de cada elemento actual
     * @param {string|Element|Node|JRQuery} content - Contenido a insertar
     * @returns {JRQuery} Instancia actual para chaining
     */
    before(content) {
        if (content == null) return this;
        const isJRQuery = (val) => val && typeof val === 'object' && Array.isArray(val.elements);

        if (typeof content === 'string') {
            this.elements.forEach(element => {
                element.insertAdjacentHTML('beforebegin', content);
            });
            return this;
        }

        if (isJRQuery(content)) {
            const nodes = content.elements;
            this.elements.forEach((target, idxTarget) => {
                const parent = target.parentNode;
                if (!parent) return;
                nodes.forEach(node => {
                    const toInsert = (idxTarget === 0) ? node : node.cloneNode(true);
                    parent.insertBefore(toInsert, target);
                });
            });
            return this;
        }

        if (content instanceof Node) {
            this.elements.forEach((target, idx) => {
                const parent = target.parentNode;
                if (!parent) return;
                const toInsert = (idx === 0) ? content : content.cloneNode(true);
                parent.insertBefore(toInsert, target);
            });
            return this;
        }

        return this;
    }

    /**
     * Inserta contenido después de cada elemento actual
     * @param {string|Element|Node|JRQuery} content - Contenido a insertar
     * @returns {JRQuery} Instancia actual para chaining
     */
    after(content) {
        if (content == null) return this;
        const isJRQuery = (val) => val && typeof val === 'object' && Array.isArray(val.elements);

        if (typeof content === 'string') {
            this.elements.forEach(element => {
                element.insertAdjacentHTML('afterend', content);
            });
            return this;
        }

        if (isJRQuery(content)) {
            const nodes = content.elements;
            this.elements.forEach((target, idxTarget) => {
                const parent = target.parentNode;
                if (!parent) return;
                nodes.forEach(node => {
                    const toInsert = (idxTarget === 0) ? node : node.cloneNode(true);
                    parent.insertBefore(toInsert, target.nextSibling);
                });
            });
            return this;
        }

        if (content instanceof Node) {
            this.elements.forEach((target, idx) => {
                const parent = target.parentNode;
                if (!parent) return;
                const toInsert = (idx === 0) ? content : content.cloneNode(true);
                parent.insertBefore(toInsert, target.nextSibling);
            });
            return this;
        }

        return this;
    }

    /**
     * Remueve los elementos actuales del DOM
     * @returns {JRQuery} Instancia actual para chaining
     */
    remove() {
        this.elements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        return this;
    }

    /**
     * Vacía el contenido de los elementos actuales
     * @returns {JRQuery} Instancia actual para chaining
     */
    empty() {
        this.elements.forEach(el => {
            if (el) el.innerHTML = '';
        });
        return this;
    }

    /**
     * Clona los elementos actuales
     * @param {boolean} [deep=true] - Si se clonan los nodos hijos
     * @returns {JRQuery} Nueva instancia con los clones
     */
    clone(deep = true) {
        const clones = this.elements.map(el => el.cloneNode(!!deep));
        return new JRQuery(clones);
    }

    /**
     * Obtiene o establece el valor de un atributo
     * @param {string} name - Nombre del atributo
     * @param {string} [value] - Valor del atributo (opcional)
     * @returns {string|JRQuery} Valor del atributo o instancia actual
     */
    attr(name, value) {
        if (!name) return this;
        
        // Getter
        if (value === undefined) {
            return this.elements[0]?.getAttribute(name) || '';
        }
        
        // Setter
        this.elements.forEach(element => {
            element.setAttribute(name, value);
        });
        
        return this;
    }

    /**
     * Remueve un atributo de los elementos
     * @param {string} name - Nombre del atributo a remover
     * @returns {JRQuery} Instancia actual para chaining
     */
    removeAttr(name) {
        if (!name) return this;
        
        this.elements.forEach(element => {
            element.removeAttribute(name);
        });
        
        return this;
    }

    /**
     * Aplica estilos CSS a los elementos
     * @param {string|Object} property - Propiedad CSS o objeto de propiedades
     * @param {string} [value] - Valor CSS (si property es string)
     * @returns {JRQuery} Instancia actual para chaining
     */
    css(property, value) {
        if (!property) return this;
        
        // Si property es un objeto, aplicar múltiples estilos
        if (typeof property === 'object') {
            this.elements.forEach(element => {
                Object.assign(element.style, property);
            });
            return this;
        }
        
        // Si solo hay una propiedad
        if (typeof property === 'string' && value !== undefined) {
            this.elements.forEach(element => {
                element.style[property] = value;
            });
        }
        
        return this;
    }

    /**
     * Manejador de eventos
     * @param {string} eventType - Tipo de evento (click, mouseover, etc)
     * @param {Function} handler - Función manejadora del evento
     * @returns {JRQuery} Instancia actual para chaining
     */
    on(eventType, handler) {
        if (!eventType) return this;

        const eventList = String(eventType).trim().split(/\s+/).filter(Boolean);

        // Firma directa: on(eventType, handler)
        if (typeof handler === 'function') {
            const directHandler = handler;
            this.elements.forEach(element => {
                eventList.forEach(base => {
                    if (!base) return;

                    const wrapped = function(e) {
                        directHandler.call(this, e, e.detail);
                    };

                    element.addEventListener(base, wrapped);

                    let map = JRQ_EVENTS.get(element);
                    if (!map) { map = new Map(); JRQ_EVENTS.set(element, map); }
                    const list = map.get(base) || [];
                    list.push({ baseType: base, selector: null, originalHandler: directHandler, wrappedHandler: wrapped });
                    map.set(base, list);
                });
            });
            return this;
        }

        // Delegación: on(eventType, selector, handler)
        const selector = arguments[1];
        const delegatedHandler = arguments[2];
        if (typeof selector === 'string' && typeof delegatedHandler === 'function') {
            this.elements.forEach(element => {
                eventList.forEach(base => {
                    if (!base) return;

                    const wrapped = function(e) {
                        const match = e.target.closest(selector);
                        if (match && element.contains(match)) {
                            delegatedHandler.call(match, e, e.detail);
                        }
                    };

                    element.addEventListener(base, wrapped);

                    let map = JRQ_EVENTS.get(element);
                    if (!map) { map = new Map(); JRQ_EVENTS.set(element, map); }
                    const list = map.get(base) || [];
                    list.push({ baseType: base, selector, originalHandler: delegatedHandler, wrappedHandler: wrapped });
                    map.set(base, list);
                });
            });
        }

        return this;
    }

    /**
     * Remueve manejadores de eventos
     * @param {string} eventType - Tipo de evento
     * @param {Function} handler - Función manejadora a remover
     * @returns {JRQuery} Instancia actual para chaining
     */
    off(eventType, handler) {
        const types = eventType ? String(eventType).trim().split(/\s+/).filter(Boolean) : null;

        this.elements.forEach(element => {
            const map = JRQ_EVENTS.get(element);
            if (!map) return;

            const removeFromList = (list, baseKey) => {
                const keep = [];
                list.forEach(rec => {
                    const matchHandler = handler ? rec.originalHandler === handler : true;
                    if (matchHandler) {
                        element.removeEventListener(rec.baseType, rec.wrappedHandler);
                    } else {
                        keep.push(rec);
                    }
                });
                if (keep.length > 0) {
                    map.set(baseKey, keep);
                } else {
                    map.delete(baseKey);
                }
            };

            if (types && types.length > 0) {
                types.forEach(base => {
                    const list = map.get(base);
                    if (list && list.length) removeFromList(list, base);
                });
            } else {
                // Sin tipo: remover todos
                Array.from(map.keys()).forEach(base => {
                    const list = map.get(base);
                    if (list && list.length) removeFromList(list, base);
                });
            }

            if (map.size === 0) {
                JRQ_EVENTS.delete(element);
            }
        });

        return this;
    }

    /**
     * Dispara eventos personalizados en los elementos actuales
     * @param {string} eventType - Tipo de evento (puede incluir namespaces, se usa el base)
     * @param {*} [data] - Datos que estarán en e.detail
     * @returns {JRQuery} Instancia para chaining
     */
    trigger(eventType, data) {
        if (!eventType) return this;
        const type = String(eventType).trim();
        this.elements.forEach(element => {
            const evt = new CustomEvent(type, { bubbles: true, cancelable: true, detail: data });
            element.dispatchEvent(evt);
        });
        return this;
    }

    /**
     * Verifica si el primer elemento tiene una clase
     * @param {string} className - Clase a verificar
     * @returns {boolean} true si la clase está presente
     */
    hasClass(className) {
        if (!className || this.isEmpty()) return false;
        return this.elements[0].classList.contains(className);
    }

    /**
     * Obtiene o establece el valor en inputs/select/textarea
     * @param {string} [value] - Valor a establecer
     * @returns {string|JRQuery} Valor o instancia para chaining
     */
    val(value) {
        if (value === undefined) {
            const el = this.elements[0];
            if (!el) return '';
            if (el.tagName === 'SELECT') {
                return el.value;
            }
            return el.value ?? '';
        }
        this.elements.forEach(el => {
            if ('value' in el) el.value = value;
        });
        return this;
    }

    /**
     * Obtiene o establece propiedades del DOM (checked, disabled, etc.)
     * @param {string} name - Nombre de la propiedad
     * @param {*} [value] - Valor de la propiedad
     * @returns {*|JRQuery} Valor o instancia para chaining
     */
    prop(name, value) {
        if (!name) return this;
        if (value === undefined) {
            const el = this.elements[0];
            return el ? el[name] : undefined;
        }
        this.elements.forEach(el => { el[name] = value; });
        return this;
    }

    /**
     * Obtiene o establece data-attributes usando dataset
     * @param {string} key - Clave de datos (acepta "mi-clave" o "miClave")
     * @param {*} [value] - Valor a establecer
     * @returns {*|JRQuery} Valor o instancia para chaining
     */
    data(key, value) {
        if (!key) return this;
        const toCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const k = toCamel(key);
        if (value === undefined) {
            const el = this.elements[0];
            return el ? el.dataset[k] : undefined;
        }
        this.elements.forEach(el => { el.dataset[k] = value; });
        return this;
    }

    /**
     * Obtiene estilos computados o establece estilos
     * @param {string|Object} property - Propiedad o mapa de propiedades
     * @param {string} [value] - Valor (si property es string)
     * @returns {string|JRQuery} Valor de estilo o instancia
     */
    css(property, value) {
        if (!property) return this;
        // Getter de una propiedad
        if (typeof property === 'string' && value === undefined) {
            const el = this.elements[0];
            if (!el) return '';
            const styles = window.getComputedStyle(el);
            return styles.getPropertyValue(property) || el.style[property] || '';
        }
        // Setter múltiple
        if (typeof property === 'object') {
            this.elements.forEach(element => {
                Object.assign(element.style, property);
            });
            return this;
        }
        // Setter simple
        if (typeof property === 'string' && value !== undefined) {
            this.elements.forEach(element => {
                element.style[property] = value;
            });
        }
        return this;
    }

    /**
     * Ejecuta una función para cada elemento
     * @param {Function} callback - Función a ejecutar para cada elemento
     * @returns {JRQuery} Instancia actual para chaining
     */
    each(callback) {
        if (typeof callback !== 'function') return this;
        
        this.elements.forEach((element, index) => {
            callback.call(element, index, element);
        });
        
        return this;
    }

    /**
     * Mapea los elementos a un nuevo array
     * @param {Function} callback - Función de mapeo
     * @returns {Array} Array con los resultados del mapeo
     */
    map(callback) {
        if (typeof callback !== 'function') return [];
        
        return this.elements.map((element, index) => {
            return callback.call(element, index, element);
        });
    }

    /**
     * Encuentra elementos descendientes que coincidan con el selector
     * @param {string} selector - Selector CSS
     * @returns {JRQuery} Nueva instancia con los elementos encontrados
     */
    find(selector) {
        if (!selector) return new JRQuery([]);
        
        const foundElements = [];
        this.elements.forEach(element => {
            const matches = element.querySelectorAll(selector);
            foundElements.push(...Array.from(matches));
        });
        
        return new JRQuery(foundElements);
    }

    /**
     * Obtiene el elemento padre de cada elemento
     * @returns {JRQuery} Nueva instancia con los elementos padres
     */
    parent() {
        const parents = this.elements
            .map(element => element.parentElement)
            .filter(parent => parent !== null);
        
        return new JRQuery(parents);
    }

    /**
     * Obtiene los elementos hijos de cada elemento
     * @returns {JRQuery} Nueva instancia con los elementos hijos
     */
    children() {
        const children = [];
        this.elements.forEach(element => {
            children.push(...Array.from(element.children));
        });
        
        return new JRQuery(children);
    }

    /**
     * Muestra los elementos (display: block)
     * @returns {JRQuery} Instancia actual para chaining
     */
    show() {
        this.elements.forEach(element => {
            element.style.display = 'block';
        });
        
        return this;
    }

    /**
     * Oculta los elementos (display: none)
     * @returns {JRQuery} Instancia actual para chaining
     */
    hide() {
        this.elements.forEach(element => {
            element.style.display = 'none';
        });
        
        return this;
    }

    /**
     * Alterna la visibilidad de los elementos
     * @returns {JRQuery} Instancia actual para chaining
     */
    toggle() {
        this.elements.forEach(element => {
            if (element.style.display === 'none') {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
        
        return this;
    }

    /**
     * Obtiene el primer elemento de la colección
     * @returns {Element|null} Primer elemento o null
     */
    first() {
        return this.elements[0] || null;
    }

    /**
     * Obtiene el último elemento de la colección
     * @returns {Element|null} Último elemento o null
     */
    last() {
        return this.elements[this.elements.length - 1] || null;
    }

    /**
     * Obtiene un elemento específico por índice
     * @param {number} index - Índice del elemento
     * @returns {Element|null} Elemento en el índice o null
     */
    eq(index) {
        return this.elements[index] || null;
    }

    /**
     * Verifica si la colección está vacía
     * @returns {boolean} true si no hay elementos
     */
    isEmpty() {
        return this.elements.length === 0;
    }

    /**
     * Verifica si la colección contiene elementos
     * @returns {boolean} true si hay elementos
     */
    exists() {
        return this.elements.length > 0;
    }

    /**
     * Devuelve el ancestro más cercano que coincide con el selector
     * @param {string} selector - Selector CSS
     * @returns {JRQuery} Nueva instancia con los elementos coincidentes
     */
    closest(selector) {
        if (!selector) return new JRQuery([]);
        const results = [];
        this.elements.forEach(el => {
            const match = el.closest(selector);
            if (match) results.push(match);
        });
        // Eliminar duplicados
        const unique = Array.from(new Set(results));
        return new JRQuery(unique);
    }

    /**
     * Filtra la colección por selector o función
     * @param {string|Function} predicate - Selector CSS o función (index, element)
     * @returns {JRQuery} Nueva instancia con los elementos filtrados
     */
    filter(predicate) {
        if (!predicate) return new JRQuery([]);
        if (typeof predicate === 'string') {
            const sel = predicate.trim();
            const matched = this.elements.filter(el => el.matches && el.matches(sel));
            return new JRQuery(matched);
        }
        if (typeof predicate === 'function') {
            const matched = this.elements.filter((el, i) => {
                return !!predicate.call(el, i, el);
            });
            return new JRQuery(matched);
        }
        return new JRQuery([]);
    }

    /**
     * Excluye elementos que coincidan con un selector, función o colección
     * @param {string|Function|Element|NodeList|Array|JRQuery} predicate
     * @returns {JRQuery} Nueva instancia con los elementos no coincidentes
     */
    not(predicate) {
        if (!predicate) return new JRQuery(this.elements.slice());
        if (typeof predicate === 'string') {
            const sel = predicate.trim();
            const filtered = this.elements.filter(el => !(el.matches && el.matches(sel)));
            return new JRQuery(filtered);
        }
        if (typeof predicate === 'function') {
            const filtered = this.elements.filter((el, i) => {
                return !predicate.call(el, i, el);
            });
            return new JRQuery(filtered);
        }
        // Elemento(s) para excluir
        let exclude = [];
        if (predicate instanceof JRQuery) {
            exclude = predicate.elements;
        } else if (predicate instanceof Element || (typeof Node !== 'undefined' && predicate instanceof Node)) {
            exclude = [predicate];
        } else if (predicate instanceof NodeList || Array.isArray(predicate)) {
            exclude = Array.from(predicate);
        }
        const excludeSet = new Set(exclude);
        const filtered = this.elements.filter(el => !excludeSet.has(el));
        return new JRQuery(filtered);
    }

    /**
     * Obtiene el índice
     * - Sin argumento: índice del primer elemento entre sus hermanos
     * - Con selector: índice del primer elemento de la colección que coincide
     * - Con elemento/JRQuery: índice de ese elemento dentro de la colección
     * @param {string|Element|JRQuery} [needle]
     * @returns {number} índice o -1 si no existe
     */
    index(needle) {
        const first = this.elements[0];
        if (typeof needle === 'undefined') {
            if (!first || !first.parentElement) return -1;
            const siblings = Array.from(first.parentElement.children);
            return siblings.indexOf(first);
        }
        if (typeof needle === 'string') {
            const sel = needle.trim();
            for (let i = 0; i < this.elements.length; i++) {
                const el = this.elements[i];
                if (el.matches && el.matches(sel)) return i;
            }
            return -1;
        }
        const target = needle instanceof JRQuery ? needle.elements[0] : needle;
        return this.elements.indexOf(target);
    }
}

/**
 * Función principal para crear instancias JRQuery
 * @param {string|Element|NodeList|Array} selector - Selector CSS, elemento o colección
 * @returns {JRQuery} Nueva instancia de JRQuery
 */
function $(selector, context) {
    // Atajo: $(fn) => DOM ready
    if (typeof selector === 'function') {
        $.ready(selector);
        return new JRQuery(document);
    }
    return new JRQuery(selector, context);
}

/**
 * Método ready para JRQuery - ejecuta función cuando el DOM está listo
 * @param {Function} callback - Función a ejecutar cuando el DOM esté listo
 * @returns {JRQuery} Retorna this para encadenamiento
 */
$.ready = function(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
    return $;
};

/**
 * Itera sobre arrays u objetos
 * @param {Array|Object} obj - Array u objeto a iterar
 * @param {Function} callback - Función a ejecutar para cada elemento
 */
$.each = function(obj, callback) {
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => callback.call(item, index, item));
    } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => callback.call(obj[key], key, obj[key]));
    }
    return obj;
};

/**
 * Transforma un array usando una función
 * @param {Array} array - Array a transformar
 * @param {Function} callback - Función de transformación
 * @returns {Array} Nuevo array transformado
 */
$.map = function(array, callback) {
    if (!Array.isArray(array)) return [];
    return array.map((item, index) => callback.call(item, item, index));
};

/**
 * Extiende objetos mezclando sus propiedades
 * @param {Object} target - Objeto destino
 * @param {...Object} sources - Objetos fuente
 * @returns {Object} Objeto extendido
 */
$.extend = function(target, ...sources) {
    let deep = false;
    if (typeof target === 'boolean') {
        deep = target;
        target = sources.shift();
    }
    if (target == null) return target;
    const isPlainObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);

    sources.forEach(source => {
        if (!source || typeof source !== 'object') return;
        Object.keys(source).forEach(key => {
            const val = source[key];
            if (deep) {
                if (Array.isArray(val)) {
                    target[key] = val.map(v => (isPlainObject(v) || Array.isArray(v)) ? $.extend(true, Array.isArray(v) ? [] : {}, v) : v);
                } else if (isPlainObject(val)) {
                    const base = isPlainObject(target[key]) ? target[key] : {};
                    target[key] = $.extend(true, base, val);
                } else {
                    target[key] = val;
                }
            } else {
                target[key] = val;
            }
        });
    });
    return target;
};

/**
 * Detecta el tipo de dato de un valor
 * @param {*} obj - Valor a analizar
 * @returns {string} Tipo de dato
 */
$.type = function(obj) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (Array.isArray(obj)) return 'array';
    if (obj instanceof Date) return 'date';
    if (obj instanceof RegExp) return 'regexp';
    if (typeof obj === 'object') return 'object';
    return typeof obj;
};

/**
 * Verifica si un valor es un array
 * @param {*} obj - Valor a verificar
 * @returns {boolean} true si es array
 */
$.isArray = function(obj) {
    return Array.isArray(obj);
};

/**
 * Verifica si un valor es una función
 * @param {*} obj - Valor a verificar
 * @returns {boolean} true si es función
 */
$.isFunction = function(obj) {
    return typeof obj === 'function';
};

/**
 * Verifica si un valor es un objeto plano
 * @param {*} obj - Valor a verificar
 * @returns {boolean} true si es objeto plano
 */
$.isObject = function(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

/**
 * Elimina espacios en blanco al inicio y final de un string
 * @param {string} str - String a procesar
 * @returns {string} String sin espacios
 */
$.trim = function(str) {
    return str == null ? '' : String(str).replace(/^\s+|\s+$/g, '');
};

/**
 * Parsea una cadena JSON de forma segura
 * @param {string} str - Cadena JSON a parsear
 * @returns {*} Objeto parseado o null si hay error
 */
$.parseJSON = function(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
};

/**
 * Convierte un objeto a cadena JSON
 * @param {*} obj - Objeto a convertir
 * @returns {string} Cadena JSON
 */
$.toJSON = function(obj) {
    return JSON.stringify(obj);
};

/**
 * Método ready para instancias JRQuery
 * @param {Function} callback - Función a ejecutar cuando el DOM esté listo
 * @returns {JRQuery} Retorna this para encadenamiento
 */
JRQuery.prototype.ready = function(callback) {
    $.ready(callback);
    return this;
};

// Exportar como módulo ES6
export { JRQuery, $ };
export default $;

// Exponer API de extensión tipo jQuery
// Permite: $.fn.miPlugin = function() { ... }
export const fn = JRQuery.prototype;
$.fn = JRQuery.prototype;

// Azúcar: búsqueda directa con contexto
$.find = function(selector, context = document) {
    return $(selector, context);
};
