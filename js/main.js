const URL = "../db/movies.json";
let peliculas = [];

function obtenerPeliculas() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            peliculas = data;
            cargarPeliculas();
            observadorPeliculas.observe(observador);
        })
}

const contenedorPeliculas = document.getElementById("container-movies");
const observador = document.getElementById("observador");
let contadorPeliculas = 0;
const cantidadPeliculas = 12;

function cargarPeliculas() {
    let sumaCargue = contadorPeliculas + cantidadPeliculas;
    const slicePeliculas = peliculas.slice(contadorPeliculas, sumaCargue);
    listaPeliculas(slicePeliculas);

    contadorPeliculas += 12;

    if (contadorPeliculas >= peliculas.length) {
        observadorPeliculas.unobserve(observador);
    }
}

const formatoCategorias = {
    "sagrada": "🕯️ Sagrada",
    "maldita": "🔥 Maldita",
    "condenada": "💀 Condenada",
    "olvidada": "🌑 Olvidada",
    "sepultada": "⚰️ Sepultada"
};

function listaPeliculas(copiaPeliculas) {
    copiaPeliculas.forEach(pelicula => {
        const card = document.createElement("div");
        const categoriaFormateada = formatoCategorias[pelicula.categoria] || pelicula.categoria;
        card.className = "col-12 col-md-6 col-lg-3 cardTop d-flex";

        const listaGeneros = pelicula.genero.join(", ");
        const generosOrdenados = listaGeneros.charAt(0).toUpperCase() + listaGeneros.slice(1);

        card.innerHTML = `<article class="p-2 rounded-2 h-100">
                                <div class="imgMovie position-relative">
                                    <img src="${pelicula.img}" alt="${pelicula.alt}" draggable="false" class="rounded-1">
                                    <span class="position-absolute fw-semibold py-1 px-2 rounded-1">${categoriaFormateada}</span>
                                </div>

                                <div class="infoTop pt-1 pb-2 px-2">
                                    <h3 class="fs-1 lh-1 my-1">${pelicula.nombre} <span class="fs-5 align-middle">(${pelicula.año})</span></h3>
                                    <p class="genre fw-light fst-italic">${generosOrdenados}</p>
                                    <p class="rateMovie d-flex align-items-center fs-4 fw-bold mt-1 mb-2"><img src="../assets/icons/starRate.svg" alt="Icono de estrella amarilla" class="fs-5 me-1">${pelicula.calificacion}<span class="fs-6 fw-light">/10</span></p>
                                    <p>${pelicula.descripcion}<strong>${pelicula.tagline}</strong></p>
                                </div>
                          </article>`
        contenedorPeliculas.appendChild(card);
    })
}

const ordenarFiltro = document.getElementById("ordenar-movie");
const subgeneroFiltro = document.getElementById("subgenero-movie");
const categoriaFiltro = document.getElementById("categoria-movie");

function filtros() {
    const ordenar = ordenarFiltro.value;
    const subgenero = subgeneroFiltro.value;
    const categoria = categoriaFiltro.value;
    
    contenedorPeliculas.innerHTML = "";
    let peliculasFiltradas = peliculas.slice();

    // Ordenar por
    if (ordenar === "peor-calificacion") {
        peliculasFiltradas = peliculasFiltradas.sort((a, b) => a.calificacion - b.calificacion);
    } else if (ordenar === "mejor-calificacion") {
        peliculasFiltradas = peliculasFiltradas.sort((a, b) => b.calificacion - a.calificacion);
    } else if (ordenar === "año-antiguas") {
        peliculasFiltradas = peliculasFiltradas.sort((a, b) => a.año - b.año);
    } else if (ordenar === "año-nuevas") {
        peliculasFiltradas = peliculasFiltradas.sort((a, b) => b.año - a.año);
    }

    // Subgénero
    if (subgenero !== "all") {
        peliculasFiltradas = peliculasFiltradas.filter(pelicula => pelicula.genero.includes(subgenero));
    }

    // Observador
    if (ordenar === "") {
        contenedorPeliculas.innerHTML = "";
        contadorPeliculas = 0;
        cargarPeliculas();
        observadorPeliculas.observe(observador);
    }

    observadorPeliculas.unobserve(observador);
    listaPeliculas(peliculasFiltradas);
}

ordenarFiltro.addEventListener('change', filtros);
subgeneroFiltro.addEventListener('change', filtros);
// categoriaFiltro.addEventListener('change', filtros);

const observadorPeliculas = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            cargarPeliculas();
        }
    })
});

obtenerPeliculas();