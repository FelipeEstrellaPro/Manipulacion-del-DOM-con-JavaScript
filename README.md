# Documento de Investigación — Práctica DOM con JavaScript

**Alumno:** Felipe  
**Fecha:** 5 de Marzo de 2026  

---

## 0) ¿Qué es el DOM y por qué se manipula con JavaScript?

El DOM (Document Object Model) es una representación en forma de árbol de la estructura de un documento HTML/XML que el navegador construye al cargar una página. Cada elemento, atributo y texto se convierte en un **nodo** dentro de este árbol. JavaScript es el lenguaje que permite interactuar con el DOM para **leer, modificar, agregar o eliminar** elementos de forma dinámica, sin necesidad de recargar la página. Esto es fundamental para crear interfaces interactivas y aplicaciones web modernas (SPAs, formularios dinámicos, etc.).

---

## Parte A — Investigación guiada

### 1. Diferencia entre `textContent` e `innerHTML`

| Característica | `textContent` | `innerHTML` |
|---|---|---|
| **Devuelve** | Solo el texto plano del nodo y sus descendientes | El HTML completo (etiquetas incluidas) como cadena |
| **Asignar** | Inserta texto plano; las etiquetas se muestran literalmente | Interpreta y renderiza las etiquetas HTML |
| **Seguridad** | **Seguro** — no ejecuta código | **Riesgo de XSS** — puede ejecutar scripts inyectados |
| **Rendimiento** | Más rápido (no necesita parsear HTML) | Más lento (el navegador parsea el HTML) |

**Ejemplo:**
```javascript
element.textContent = "<b>Hola</b>"; // Muestra literalmente "<b>Hola</b>"
element.innerHTML  = "<b>Hola</b>"; // Muestra "Hola" en negrita
```

**Fuente:** [MDN textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) · [MDN innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

---

### 2. ¿Qué hace `classList.toggle()`?

`classList.toggle("nombreClase")` **agrega** la clase al elemento si no la tiene, o la **elimina** si ya la tiene. Devuelve `true` si la clase quedó presente, `false` si fue removida. Opcionalmente acepta un segundo parámetro booleano para forzar agregar (`true`) o quitar (`false`).

```javascript
nota.classList.toggle("destacada");
// Si tenía "destacada" → la quita
// Si no la tenía → la agrega
```

**Fuente:** [MDN classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

---

### 3. ¿Qué es `dataset` y para qué sirve?

`dataset` es una propiedad de solo lectura que da acceso a todos los **atributos `data-*`** de un elemento HTML como un objeto `DOMStringMap`. Sirve para almacenar datos personalizados directamente en el HTML sin afectar la presentación ni la semántica.

```html
<article data-id="A-1001" data-category="tech">...</article>
```
```javascript
const id = nota.dataset.id;          // "A-1001"
const cat = nota.dataset.category;   // "tech"
```

Los nombres se convierten de `kebab-case` a `camelCase` (ej. `data-user-name` → `dataset.userName`).

**Fuente:** [MDN dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)

---

## Parte B — Investigación guiada

### 1. Diferencia entre `append`, `prepend` y `appendChild`

| Método | Acepta | Posición | Devuelve |
|---|---|---|---|
| `append()` | Nodos **y** strings | Al **final** del padre | `undefined` |
| `prepend()` | Nodos **y** strings | Al **inicio** del padre | `undefined` |
| `appendChild()` | Solo **nodos** | Al **final** del padre | El nodo insertado |

`append` y `prepend` son más modernos (API más nueva) y permiten insertar múltiples elementos y texto de una sola vez. `appendChild` es el método clásico que solo acepta un nodo DOM a la vez.

```javascript
lista.prepend(nuevoItem);          // Agrega al inicio
lista.append(nuevoItem);           // Agrega al final
lista.appendChild(nuevoItem);      // Agrega al final (clásico)
lista.append("Texto", otroNodo);   // Múltiples elementos
```

**Fuente:** [MDN append](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) · [MDN appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)

---

### 2. ¿Qué es "delegación de eventos" y por qué mejora rendimiento?

La **delegación de eventos** consiste en registrar un **único** event listener en un elemento padre en lugar de uno por cada hijo. Funciona aprovechando el **event bubbling**: cuando un evento ocurre en un hijo, "burbujea" hacia arriba por el DOM hasta llegar al padre.

**Ventajas de rendimiento:**
- **Menos listeners en memoria** — en vez de N listeners (uno por item), solo hay 1.
- **Funciona con elementos dinámicos** — los items creados después de registrar el listener también son capturados.
- **Menos código** — se usa `e.target.closest()` para identificar qué hijo fue clickeado.

```javascript
// En vez de agregar un listener a CADA botón:
lista.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const li = e.target.closest(".item");
  // ...manejar acción
});
```

**Fuente:** [MDN Event bubbling and capture](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)

---

## Parte C — Mini reto: Explicación (5–8 líneas)

En este proyecto se implementaron las **tres opciones** del mini reto:

1. **Búsqueda local (Opción 1):** Se agregó un campo de búsqueda que escucha el evento `input` y filtra los items de la lista comparando el texto del título y la etiqueta con el valor ingresado. Los items que no coinciden reciben la clase CSS `oculto` que los oculta con `display: none`.

2. **Persistencia con LocalStorage (Opción 2):** Cada vez que se agrega, elimina o destaca un item, se serializa la lista completa a JSON y se guarda en `localStorage`. Al cargar la página, la función `cargarLista()` recupera los datos y reconstruye los nodos del DOM.

3. **Seguridad DOM (Opción 3):** Se reemplazó el uso de `innerHTML` en la función `crearItem()` por creación explícita de nodos con `document.createElement()` y asignación de texto con `textContent`. Esto previene ataques XSS ya que `textContent` no interpreta HTML ni ejecuta scripts.

---

## Enlaces consultados

- [DOM Standard (WHATWG)](https://dom.spec.whatwg.org/)
- [MDN DOM Guide](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [MDN textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [MDN innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
- [MDN dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)
- [MDN append](https://developer.mozilla.org/en-US/docs/Web/API/Element/append)
- [MDN appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
- [MDN Event bubbling](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN input event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
