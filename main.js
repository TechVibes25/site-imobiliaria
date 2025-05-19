const container = document.getElementById("properties");
const filterType = document.getElementById("filter-type");
const filterLocation = document.getElementById("filter-location");
const filterMinPrice = document.getElementById("filter-min-price");
const filterMaxPrice = document.getElementById("filter-max-price");
const filterBedrooms = document.getElementById("filter-bedrooms");
const filterArea = document.getElementById("filter-area");
const filterBtn = document.getElementById("filter-btn");
const errorMsg = document.getElementById("filter-error");

// Alterna filtro quartos ou área conforme tipo selecionado
function toggleBedroomsOrArea() {
  const selectedType = filterType.value;
  if (selectedType === "Terreno" || selectedType === "Loja") {
    filterBedrooms.style.display = "none";
    filterBedrooms.value = "";
    filterArea.style.display = "inline-block";
  } else {
    filterArea.style.display = "none";
    filterArea.value = "";
    filterBedrooms.style.display = "inline-block";
  }
}

// Converte preço € para número (ex: "€350.000" -> 350000)
function parsePrice(priceStr) {
  if (!priceStr) return null;
  return Number(priceStr.replace(/[^\d]/g, ""));
}

// Validação imediata do preço mínimo e máximo
function validatePrices() {
  const min = Number(filterMinPrice.value);
  const max = Number(filterMaxPrice.value);

  if (min && max && max < min) {
    errorMsg.textContent = "O preço máximo não pode ser inferior ao preço mínimo.";
    return false;
  }
  errorMsg.textContent = "";
  return true;
}

// Validação geral antes do filtro
function validateFilter() {
  return validatePrices();
}

// Renderiza lista de imóveis
function renderProperties(list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
    return;
  }
  list.forEach((property) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${property.image}" alt="${property.title}" />
      <h3>${property.title}</h3>
      <p>${property.price}</p>
      <a href="#" class="btn-outline">Ver detalhes</a>
    `;
    container.appendChild(card);
  });
}

// Filtra imóveis conforme critérios selecionados
function filterProperties() {
  if (!validateFilter()) return;

  const type = filterType.value.toLowerCase();
  const location = filterLocation.value.toLowerCase();
  const minPrice = Number(filterMinPrice.value);
  const maxPrice = Number(filterMaxPrice.value);
  const bedrooms = Number(filterBedrooms.value);
  const area = Number(filterArea.value);

  const filtered = properties.filter((p) => {
    if (type && !p.title.toLowerCase().includes(type)) return false;
    if (location && !p.title.toLowerCase().includes(location)) return false;

    const priceNum = parsePrice(p.price);
    if (!priceNum) return false;
    if (minPrice && priceNum < minPrice) return false;
    if (maxPrice && priceNum > maxPrice) return false;

    if (type === "terreno" || type === "loja") {
      if (area && p.area && p.area < area) return false;
    } else {
      if (bedrooms && p.bedrooms && p.bedrooms < bedrooms) return false;
    }

    return true;
  });

  renderProperties(filtered);
}

// Eventos
filterType.addEventListener("change", () => {
  toggleBedroomsOrArea();
  filterProperties();
});
filterLocation.addEventListener("input", filterProperties);
filterMinPrice.addEventListener("input", () => {
  validatePrices();
  filterProperties();
});
filterMaxPrice.addEventListener("input", () => {
  validatePrices();
  filterProperties();
});
filterBedrooms.addEventListener("input", filterProperties);
filterArea.addEventListener("input", filterProperties);

filterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (validateFilter()) {
    filterProperties();
  }
});

// Inicializa
document.addEventListener("DOMContentLoaded", () => {
  toggleBedroomsOrArea();
  renderProperties(properties);
});

