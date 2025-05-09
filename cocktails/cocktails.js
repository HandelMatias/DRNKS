document.addEventListener('DOMContentLoaded', () => {
  const container      = document.getElementById("cocktail-container");
  const getBtn         = document.getElementById("get-cocktails");
  const cocktailMessage= document.getElementById("cocktail-message");

  if (!container || !getBtn || !cocktailMessage) {
    console.error("Elementos del DOM faltantes");
    return;
  }

  async function fetchRandomCocktail() {
    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.drinks[0];
  }

  getBtn.addEventListener("click", async () => {
    container.innerHTML = "";
    cocktailMessage.textContent = "Cargando cocteles…";
    getBtn.disabled = true;

    try {
      // Obtener 6 cocteles aleatorios en paralelo
      const promises = Array.from({length: 8}, () => fetchRandomCocktail());
      const drinks = await Promise.all(promises);

      drinks.forEach(drink => {
        const name     = drink.strDrink;
        const image    = drink.strDrinkThumb;
        const category = drink.strCategory;
        const alcoholic= drink.strAlcoholic;
        const glass    = drink.strGlass;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${image}" alt="Imagen de ${name}" />
          <h3>${name}</h3>
          <p><strong>Categoría:</strong> ${category}</p>
          <p><strong>Tipo:</strong> ${alcoholic}</p>
          <p><strong>Vaso:</strong> ${glass}</p>
        `;
        container.appendChild(card);
      });

      cocktailMessage.textContent = "¡Listo!";
    } catch (err) {
      console.error("Error cargando cocteles:", err);
      cocktailMessage.textContent = `Error: ${err.message}`;
    } finally {
      getBtn.disabled = false;
    }
  });
});

