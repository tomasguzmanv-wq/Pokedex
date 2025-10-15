//Enlace de la API con los primeros 150 Pokémon de la primera generación.
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=150";

//Elementos del DOM.
const container = document.getElementById("data-container");
const searchInput = document.getElementById("search");

//Obtiene los Pokémon desde la API.
async function obtenerPokemon() 
{
  try {
    //Consulta inicial a la API.
    const response = await fetch(API_URL);
    const data = await response.json();
    const lista = data.results;

    //Obtiene los detalles individuales de cada Pokémon.
    const pokemons = await Promise.all(
      lista.map(async p => {
        const res = await fetch(p.url);
        return res.json();
      })
    );

    //Muestra los Pokémon en pantalla.
    mostrarPokemon(pokemons);

    //Configura el filtrado en tiempo real.
    searchInput.addEventListener("input", () => filtrarPokemon(pokemons));
  
  //
  } catch (error) {
    console.error("Error al cargar los Pokémon:", error);
    container.innerHTML = "<p class='text-danger text-center'>Error al cargar los datos. Intenta nuevamente más tarde.</p>";
  }
}


//Muestra los Pokémon en tarjetas usando Bootstrap.
function mostrarPokemon(pokemons) 
{
  container.innerHTML = ""; 

  pokemons.forEach(p => {
    //Crea la tarjeta del Pokémon.
    const card = document.createElement("div");
    card.classList.add("card", "shadow-sm", "text-center", "m-2"); 

    //Obtiene los tipos del Pokémon.
    const tipos = p.types.map(t => t.type.name).join(", ");

    //Contenido de la tarjeta.
    card.innerHTML = `
      <img src="${p.sprites.front_default}" class="card-img-top mx-auto mt-3" alt="${p.name}" style="width:100px;">
      <div class="card-body">
        <h5 class="card-title text-capitalize">${p.name}</h5>
        <p class="card-text"><strong>ID:</strong> ${p.id}</p>
        <p class="card-text"><strong>Tipo:</strong> ${tipos}</p>
      </div>
    `;

    // Agrega la tarjeta al contenedor.
    container.appendChild(card);
  });
}


//Filtra Pokémon por nombre, tipo o ID.
function filtrarPokemon(pokemons) 
{
  const texto = searchInput.value.toLowerCase();

  const filtrados = pokemons.filter(p =>
    // Filtra por nombre.
    p.name.toLowerCase().includes(texto) ||        
    // Filtra por tipo. 
    p.types.some(t => t.type.name.includes(texto)) || 
    // Filtra por ID.
    p.id.toString().includes(texto)                   
  );
  
  mostrarPokemon(filtrados);
}


// Ejecuta la función principal.
obtenerPokemon();