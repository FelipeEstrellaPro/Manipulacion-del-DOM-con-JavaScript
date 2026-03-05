// ============================
// PARTE A — Leer y actualizar contenido/atributos
// ============================

// 1) Selección de elementos (herramientas DOM)
const titulo = document.querySelector("#titulo");
const nota = document.querySelector("#nota");
const texto = document.querySelector(".nota__texto");
const idInterno = document.querySelector("#idInterno");
const imgNota = document.querySelector("#imgNota");

const btnCambiarTitulo = document.querySelector("#btnCambiarTitulo");
const btnToggleDestacado = document.querySelector("#btnToggleDestacado");
const btnCambiarImagen = document.querySelector("#btnCambiarImagen");

// 2) Leer contenido y atributos
idInterno.textContent = nota.dataset.id; // lee data-id
console.log("Título actual:", titulo.textContent);
console.log("Clase actual nota:", nota.className);

// 3) Actualizar contenido
btnCambiarTitulo.addEventListener("click", () => {
    titulo.textContent = "Panel de Noticias (Actualizado)";
});

// 4) Actualizar características (clases/atributos/estilos)
btnToggleDestacado.addEventListener("click", () => {
    nota.classList.toggle("destacada");
});

// 5) Cambiar atributo src (ejemplo real)
btnCambiarImagen.addEventListener("click", () => {
    const nueva = "https://upload.wikimedia.org/wikipedia/commons/4/43/The_Earth_seen_from_Apollo_17_with_transparent_background.png";
    imgNota.setAttribute("src", nueva);
    texto.textContent = "La imagen y el texto fueron actualizados desde el DOM.";
});

// ============================
// PARTE B — Agregar y eliminar elementos del DOM
// ============================

const formAdd = document.querySelector("#formAdd");
const inpTitulo = document.querySelector("#inpTitulo");
const inpTag = document.querySelector("#inpTag");
const lista = document.querySelector("#lista");

// Crear elemento de lista (agregar nodos)
// PARTE C - Opción 3: Seguridad DOM — se usa createElement + textContent
// en lugar de innerHTML para evitar inyección XSS
function crearItem(titulo, tag) {
    const li = document.createElement("li");
    li.className = "item";

    // Contenedor de info
    const divInfo = document.createElement("div");

    const strong = document.createElement("strong");
    strong.className = "item__title";
    strong.textContent = titulo; // textContent evita XSS

    const divMeta = document.createElement("div");
    divMeta.className = "item__meta";

    const spanPill = document.createElement("span");
    spanPill.className = "pill";
    spanPill.textContent = tag; // textContent evita XSS

    const spanMuted = document.createElement("span");
    spanMuted.className = "muted";
    spanMuted.textContent = `Creado: ${new Date().toLocaleString()}`;

    divMeta.appendChild(spanPill);
    divMeta.appendChild(spanMuted);
    divInfo.appendChild(strong);
    divInfo.appendChild(divMeta);

    // Contenedor de acciones
    const divActions = document.createElement("div");
    divActions.className = "actions";

    const btnToggle = document.createElement("button");
    btnToggle.setAttribute("data-action", "toggle");
    btnToggle.textContent = "Destacar";

    const btnDelete = document.createElement("button");
    btnDelete.setAttribute("data-action", "delete");
    btnDelete.textContent = "Eliminar";

    divActions.appendChild(btnToggle);
    divActions.appendChild(btnDelete);

    li.appendChild(divInfo);
    li.appendChild(divActions);

    return li;
}

// Evento submit (agregar)
formAdd.addEventListener("submit", (e) => {
    e.preventDefault();

    const tituloVal = inpTitulo.value.trim();
    const tagVal = inpTag.value.trim();

    if (!tituloVal || !tagVal) return;

    const item = crearItem(tituloVal, tagVal);
    lista.prepend(item); // agrega al inicio

    // PARTE C - Opción 2: guardar en localStorage
    guardarLista();

    formAdd.reset();
    inpTitulo.focus();
});

// Delegación de eventos (eliminar y toggle sin agregar listeners por item)
lista.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const li = e.target.closest(".item");
    const action = btn.dataset.action;

    if (action === "delete") {
        li.remove(); // eliminar nodo
        guardarLista();
    }

    if (action === "toggle") {
        li.classList.toggle("destacada");
        guardarLista();
    }
});

// ============================
// PARTE C — Opción 1: Búsqueda local (filtrar lista por texto)
// ============================

const inpBuscar = document.querySelector("#inpBuscar");

inpBuscar.addEventListener("input", () => {
    const filtro = inpBuscar.value.toLowerCase().trim();
    const items = lista.querySelectorAll(".item");

    items.forEach((item) => {
        const tituloItem = item.querySelector(".item__title").textContent.toLowerCase();
        const tagItem = item.querySelector(".pill").textContent.toLowerCase();

        if (tituloItem.includes(filtro) || tagItem.includes(filtro)) {
            item.classList.remove("oculto");
        } else {
            item.classList.add("oculto");
        }
    });
});

// ============================
// PARTE C — Opción 2: Persistencia con LocalStorage
// ============================

function guardarLista() {
    const items = lista.querySelectorAll(".item");
    const datos = [];

    items.forEach((item) => {
        datos.push({
            titulo: item.querySelector(".item__title").textContent,
            tag: item.querySelector(".pill").textContent,
            fecha: item.querySelector(".muted").textContent,
            destacada: item.classList.contains("destacada"),
        });
    });

    localStorage.setItem("dom-lab-noticias", JSON.stringify(datos));
}

function cargarLista() {
    const guardado = localStorage.getItem("dom-lab-noticias");
    if (!guardado) return;

    const datos = JSON.parse(guardado);

    datos.forEach((d) => {
        const li = crearItem(d.titulo, d.tag);
        // Restaurar fecha original
        li.querySelector(".muted").textContent = d.fecha;
        if (d.destacada) li.classList.add("destacada");
        lista.appendChild(li);
    });
}

// Cargar noticias guardadas al iniciar
cargarLista();
