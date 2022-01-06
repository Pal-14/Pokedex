let allPokemon = [];
let tableauFin = [];

const searchInput = document.querySelector(".recherche-poke input");
const listePoke = document.querySelector(".liste-poke");
const chargement = document.querySelector('.loader');


const types = {
  grass: "#78c850",
  ground: "#E2BF65",
  dragon: "#6F35FC",
  fire: "#F58271",
  electric: "#F7D02C",
  fairy: "#D685AD",
  poison: "#966DA3",
  bug: "#B3F594",
  water: "#6390F0",
  normal: "#D9D5D8",
  psychic: "#F95587",
  flying: "#A98FF3",
  fighting: "#C25956",
  rock: "#B6A136",
  ghost: "#735797",
  ice: "#96D9D6",
};

// Appel à l 'API pour recuperer les infos des pokémons
function fetchPokemonBase() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((reponse) => reponse.json())
    .then((allPoke) => {
      //   console.log(allPoke);
      allPoke.results.forEach((pokemon) => {
        fetchPokemonComplet(pokemon);
      });
    });
}
fetchPokemonBase();

// On récupère l'objet pokémon complet avec les Photos Noms dans tte les Langues Etc...
function fetchPokemonComplet(pokemon) {
  let objPokemonFull = {};
  let url = pokemon.url;
  let nameP = pokemon.name;

  fetch(url)
    .then((reponse) => reponse.json())
    .then((pokeData) => {
      // console.log(pokeData);

      objPokemonFull.pic = pokeData.sprites.front_default;
      objPokemonFull.type = pokeData.types[0].type.name;
      objPokemonFull.id = pokeData.id;

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then((reponse) => reponse.json())
        .then((pokeData) => {
          // console.log(pokeData);

          objPokemonFull.name = pokeData.names[4].name;
          allPokemon.push(objPokemonFull);

          if (allPokemon.length === 151) {
            // console.log(allPokemon);

            tableauFin = allPokemon
              .sort((a, b) => {
                return a.id - b.id;
              })
              .slice(0, 21);
            // console.log(tableauFin);

            createCard(tableauFin);
            chargement.style.display = "none";
          }
        });
    });
}



//Création des cartes

function createCard(arr) {
  for (let i = 0; i < arr.length; i++) {
    const carte = document.createElement("li");
    let couleur = types[arr[i].type];
    carte.style.background = couleur;
    const txtCarte = document.createElement("h5");
    txtCarte.innerText = arr[i].name;
    const idCarte = document.createElement("p");
    idCarte.innerText = `N° ${arr[i].id}`;
    const imgCarte = document.createElement("img");
    imgCarte.src = arr[i].pic;

    carte.appendChild(imgCarte);
    carte.appendChild(txtCarte);
    carte.appendChild(idCarte);

    listePoke.appendChild(carte);
  }
}

// Scroll infini

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight - 20) {
    AddPoke(6);
  }
});

// index de base les 21 premiers pokémon que j'affiche
let index = 21;

// Fonction pour rajouter au scroll 6 nouveaux pokémons
function AddPoke(nb) {
  if (index > 151) {
    return;
  }
  // Je rajoute au tableau les 6 nouveaux index 21 + nb(6)
  const arrToAdd = allPokemon.slice(index, index + nb);
  createCard(arrToAdd);
  // pour ajouter correctement le + 6 à chaque fois
  index += nb;
}

// Recherche

searchInput.addEventListener("keyup", recherche);

function recherche() {
  if (index < 150) {
    AddPoke(130);
  }

  let filter, allLi, titleValue, allTitles;
  filter = searchInput.value.toUpperCase();
  allLi = document.querySelectorAll('li');
  allTitles = document.querySelectorAll('li > h5');
  

  for (i = 0; i < allLi.length; i++) {

    titleValue = allTitles[i].innerText;

    if (titleValue.toUpperCase().indexOf(filter) > -1) {
      allLi[i].style.display = "flex";
    } else {
      allLi[i].style.display = "none";
    }
  }
}

// Animation Input

searchInput.addEventListener("input", function (e) {
  if (e.target.value !== "") {
    e.target.parentNode.classList.add("active-input");
  } else if (e.target.value === "") {
    e.target.parentNode.classList.remove("active-input");
  }
});
