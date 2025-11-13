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
        if (Array.isArray(selector) || selector instanceof NodeList || (typeof HTMLCollection !== 'undefined' && selector instanceof HTMLCollection)) {
            return Array.from(selector);
        }
        
        // Si es un elemento del DOM
        if (selector instanceof Element) {
            return [selector];
        }
        
        // Soporte para Document y DocumentFragment
        if ((typeof Document !== 'undefined' && selector instanceof Document) || (typeof DocumentFragment !== 'undefined' && selector instanceof DocumentFragment)) {
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
        const tokens = String(className).trim().split(/\s+/).filter(Boolean);
        if (tokens.length === 0) return this;
        this.elements.forEach(element => {
            element.classList.add(...tokens);
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
        const tokens = String(className).trim().split(/\s+/).filter(Boolean);
        if (tokens.length === 0) return this;
        this.elements.forEach(element => {
            element.classList.remove(...tokens);
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
        const tokens = String(className).trim().split(/\s+/).filter(Boolean);
        if (tokens.length === 0) return this;
        this.elements.forEach(element => {
            tokens.forEach(t => element.classList.toggle(t));
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
                    const str = String(next);
                    if (str !== current) {
                        element.innerHTML = str;
                    }
                }
            });
        } else {
            this.elements.forEach(element => {
                if (element.innerHTML !== html) {
                    element.innerHTML = html;
                }
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
                    const str = String(next);
                    if (str !== current) {
                        element.textContent = str;
                    }
                }
            });
        } else {
            this.elements.forEach(element => {
                if (element.textContent !== text) {
                    element.textContent = text;
                }
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

        const isJRQuery = (val) => (val instanceof JRQuery) || (val && typeof val === 'object' && Array.isArray(val.elements));

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

        const isJRQuery = (val) => (val instanceof JRQuery) || (val && typeof val === 'object' && Array.isArray(val.elements));

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
        const isJRQuery = (val) => (val instanceof JRQuery) || (val && typeof val === 'object' && Array.isArray(val.elements));

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
        const isJRQuery = (val) => (val instanceof JRQuery) || (val && typeof val === 'object' && Array.isArray(val.elements));

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
            if (!el) return;
            if (typeof el.remove === 'function') {
                el.remove();
            } else if (el.parentNode) {
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
        const seen = new Set();
        this.elements.forEach(element => {
            element.querySelectorAll(selector).forEach(node => {
                if (!seen.has(node)) {
                    seen.add(node);
                    foundElements.push(node);
                }
            });
        });
        return new JRQuery(foundElements);
    }

    /**
     * Obtiene el elemento padre de cada elemento
     * @returns {JRQuery} Nueva instancia con los elementos padres
     */
    parent() {
        const parents = [];
        const seen = new Set();
        this.elements.forEach(element => {
            const p = element.parentElement;
            if (p && !seen.has(p)) {
                seen.add(p);
                parents.push(p);
            }
        });
        return new JRQuery(parents);
    }

    /**
     * Obtiene los elementos hijos de cada elemento
     * @returns {JRQuery} Nueva instancia con los elementos hijos
     */
    children() {
        const children = [];
        const seen = new Set();
        this.elements.forEach(element => {
            Array.from(element.children).forEach(child => {
                if (!seen.has(child)) {
                    seen.add(child);
                    children.push(child);
                }
            });
        });
        return new JRQuery(children);
    }

    /**
     * Muestra los elementos (display: block)
     * @returns {JRQuery} Instancia actual para chaining
     */
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
        return this;
    }

    /**
     * Oculta los elementos (display: none)
     * @returns {JRQuery} Instancia actual para chaining
     */
    hide() {
        this.elements.forEach(element => {
            const computed = window.getComputedStyle(element);
            if (computed.display !== 'none') {
                element.style.display = 'none';
            }
        });
        return this;
    }

    /**
     * Alterna la visibilidad de los elementos
     * @returns {JRQuery} Instancia actual para chaining
     */
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
        return this;
    }

    /**
     * Obtiene el primer elemento de la colección como nueva instancia JRQuery
     * @returns {JRQuery} Nueva instancia JRQuery con el primer elemento
     */
    first() {
        return new JRQuery(this.elements[0] || [], document);
    }

    /**
     * Obtiene el último elemento de la colección como nueva instancia JRQuery
     * @returns {JRQuery} Nueva instancia JRQuery con el último elemento
     */
    last() {
        return new JRQuery(this.elements[this.elements.length - 1] || [], document);
    }

    /**
     * Obtiene un elemento específico por índice como nueva instancia JRQuery
     * @param {number} index - Índice del elemento
     * @returns {JRQuery} Nueva instancia JRQuery con el elemento en el índice
     */
    eq(index) {
        return new JRQuery(this.elements[index] || [], document);
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

    /**
     * Verifica si al menos un elemento coincide con el selector o función
     * @param {string|Function|Element} selector - Selector CSS, función o elemento a verificar
     * @returns {boolean} true si algún elemento coincide, false en caso contrario
     */
    is(selector) {
        if (!selector || this.elements.length === 0) return false;
        
        // Si es una función, ejecutarla con cada elemento
        if (typeof selector === 'function') {
            return this.elements.some((el, index) => {
                return selector.call(el, index, el);
            });
        }
        
        // Si es un elemento del DOM
        if (selector instanceof Element) {
            return this.elements.includes(selector);
        }
        
        // Si es un selector CSS
        if (typeof selector === 'string') {
            const sel = selector.trim();
            return this.elements.some(el => el.matches && el.matches(sel));
        }
        
        return false;
    }

    /**
     * Obtiene los hermanos de los elementos (opcionalmente filtrados por selector)
     * @param {string} [selector] - Selector CSS opcional para filtrar hermanos
     * @returns {JRQuery} Nueva instancia con los hermanos
     */
    siblings(selector) {
        const siblings = [];
        const selectorTrimmed = selector ? selector.trim() : null;
        
        this.elements.forEach(element => {
            if (element.parentElement) {
                const parentChildren = Array.from(element.parentElement.children);
                parentChildren.forEach(child => {
                    if (child !== element && !siblings.includes(child)) {
                        if (!selectorTrimmed || (child.matches && child.matches(selectorTrimmed))) {
                            siblings.push(child);
                        }
                    }
                });
            }
        });
        
        return new JRQuery(siblings);
    }

    /**
     * Obtiene el siguiente hermano de cada elemento (opcionalmente filtrado por selector)
     * @param {string} [selector] - Selector CSS opcional para filtrar el siguiente elemento
     * @returns {JRQuery} Nueva instancia con los siguientes elementos
     */
    next(selector) {
        const nextElements = [];
        const selectorTrimmed = selector ? selector.trim() : null;
        
        this.elements.forEach(element => {
            let next = element.nextElementSibling;
            while (next) {
                if (!selectorTrimmed || (next.matches && next.matches(selectorTrimmed))) {
                    nextElements.push(next);
                    break;
                }
                next = next.nextElementSibling;
            }
        });
        
        return new JRQuery(nextElements);
    }

    /**
     * Obtiene el hermano anterior de cada elemento (opcionalmente filtrado por selector)
     * @param {string} [selector] - Selector CSS opcional para filtrar el elemento anterior
     * @returns {JRQuery} Nueva instancia con los elementos anteriores
     */
    prev(selector) {
        const prevElements = [];
        const selectorTrimmed = selector ? selector.trim() : null;
        
        this.elements.forEach(element => {
            let prev = element.previousElementSibling;
            while (prev) {
                if (!selectorTrimmed || (prev.matches && prev.matches(selectorTrimmed))) {
                    prevElements.push(prev);
                    break;
                }
                prev = prev.previousElementSibling;
            }
        });
        
        return new JRQuery(prevElements);
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
 * Realiza peticiones AJAX usando fetch API
 * @param {string|Object} url - URL del recurso o objeto de configuración
 * @param {Object} [options] - Opciones de configuración
 * @returns {Promise} Promesa que resuelve con la respuesta
 */
$.ajax = function(url, options = {}) {
    // Si el primer parámetro es un objeto, usarlo como configuración
    if (typeof url === 'object' && url !== null) {
        options = url;
        url = options.url;
    }
    
    if (!url) {
        throw new Error('URL is required for AJAX request');
    }
    
    // Configuración por defecto siguiendo jQuery
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: null,
        dataType: 'auto', // auto, json, text, html
        timeout: 0,
        ...options
    };
    
    // Procesar datos según el tipo
    if (config.data) {
        if (config.method === 'GET') {
            // Para GET, agregar datos a la URL
            const params = new URLSearchParams(config.data);
            url += (url.includes('?') ? '&' : '?') + params.toString();
        } else {
            // Para otros métodos, enviar en el body
            if (typeof config.data === 'object' && !(config.data instanceof FormData)) {
                config.body = JSON.stringify(config.data);
                config.headers['Content-Type'] = 'application/json';
            } else {
                config.body = config.data;
            }
        }
    }
    
    // Crear promesa con timeout si es necesario
    let fetchPromise = fetch(url, {
        method: config.method,
        headers: config.headers,
        body: config.body,
        ...config
    });
    
    // Aplicar timeout si está configurado
    if (config.timeout > 0) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), config.timeout);
        });
        fetchPromise = Promise.race([fetchPromise, timeoutPromise]);
    }
    
    // Añadir métodos .done() y .fail() para compatibilidad con jQuery
    const jqueryPromise = fetchPromise.then(response => {
        // Crear objeto xhr-like para compatibilidad
        const xhr = {
            status: response.status,
            statusText: response.statusText,
            responseText: null,
            responseJSON: null
        };
        
        // Determinar tipo de respuesta
        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        
        // Procesar según dataType esperado
        let dataPromise;
        if (config.dataType === 'json' || (config.dataType === 'auto' && isJson)) {
            dataPromise = response.json().then(data => {
                xhr.responseJSON = data;
                return data;
            });
        } else if (config.dataType === 'text') {
            dataPromise = response.text().then(data => {
                xhr.responseText = data;
                return data;
            });
        } else {
            // Por defecto, intentar texto
            dataPromise = response.text().then(data => {
                xhr.responseText = data;
                // Si es JSON válido, parsearlo
                if (isJson) {
                    try {
                        const jsonData = JSON.parse(data);
                        xhr.responseJSON = jsonData;
                        return jsonData;
                    } catch (e) {
                        return data;
                    }
                }
                return data;
            });
        }
        
        return dataPromise.then(data => {
            // Llamar callbacks según el estado
            if (response.ok) {
                if (config.success) {
                    config.success(data, response.statusText, xhr);
                }
                return data;
            } else {
                const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                error.response = response;
                if (config.error) {
                    config.error(xhr, response.statusText, error);
                }
                throw error;
            }
        });
    }).catch(error => {
        if (config.error && !error.message.includes('HTTP')) {
            // Error de red o timeout
            const xhr = { status: 0, statusText: 'error', responseText: null, responseJSON: null };
            config.error(xhr, 'error', error);
        }
        throw error;
    });
    
    // Función auxiliar para hacer que una promesa tenga métodos jQuery
    function makeJQueryPromise(promise) {
        // Si ya tiene los métodos, retornarla
        if (promise.done && promise.fail) return promise;
        
        // Agregar métodos .done() y .fail()
        promise.done = function(callback) {
            const newPromise = promise.then(callback);
            return makeJQueryPromise(newPromise);
        };
        
        promise.fail = function(callback) {
            const newPromise = promise.catch(callback);
            return makeJQueryPromise(newPromise);
        };
        
        return promise;
    }
    
    // Hacer que la promesa tenga métodos jQuery
    return makeJQueryPromise(jqueryPromise);
};

/**
 * Realiza petición GET
 * @param {string} url - URL del recurso
 * @param {Object} [data] - Datos a enviar
 * @param {Function} [success] - Función de éxito
 * @param {string} [dataType] - Tipo de datos esperado
 * @returns {Promise} Promesa que resuelve con la respuesta
 */
$.get = function(url, data, success, dataType) {
    // Manejar sobrecarga de argumentos
    if (typeof data === 'function') {
        dataType = success;
        success = data;
        data = undefined;
    }
    
    return $.ajax({
        url: url,
        method: 'GET',
        data: data,
        success: success,
        dataType: dataType
    });
};

/**
 * Realiza petición POST
 * @param {string} url - URL del recurso
 * @param {Object} [data] - Datos a enviar
 * @param {Function} [success] - Función de éxito
 * @param {string} [dataType] - Tipo de datos esperado
 * @returns {Promise} Promesa que resuelve con la respuesta
 */
$.post = function(url, data, success, dataType) {
    // Manejar sobrecarga de argumentos
    if (typeof data === 'function') {
        dataType = success;
        success = data;
        data = undefined;
    }
    
    return $.ajax({
        url: url,
        method: 'POST',
        data: data,
        success: success,
        dataType: dataType
    });
};

/**
 * Realiza petición GET esperando JSON
 * @param {string} url - URL del recurso
 * @param {Object} [data] - Datos a enviar
 * @param {Function} [success] - Función de éxito
 * @returns {Promise} Promesa que resuelve con el JSON
 */
$.getJSON = function(url, data, success) {
    // Manejar sobrecarga de argumentos
    if (typeof data === 'function') {
        success = data;
        data = undefined;
    }
    
    return $.ajax({
        url: url,
        method: 'GET',
        data: data,
        dataType: 'json',
        success: success
    });
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

/**
 * Carga contenido AJAX en los elementos
 * @param {string} url - URL del recurso a cargar
 * @param {Function} [callback] - Función callback opcional
 * @returns {JRQuery} Instancia actual para chaining
 */
JRQuery.prototype.load = function(url, callback) {
    if (!url) return this;
    
    const self = this;
    
    this.elements.forEach(element => {
        $.ajax({
            url: url,
            success: function(data) {
                element.innerHTML = data;
                if (typeof callback === 'function') {
                    callback.call(element, data);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading content:', error);
                element.innerHTML = '<p>Error al cargar el contenido</p>';
            }
        }).catch(error => {
            console.error('Error en .load():', error);
            element.innerHTML = '<p>Error al cargar el contenido</p>';
        });
    });
    
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
