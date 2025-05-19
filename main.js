const container = document.getElementById("properties");
const filterType = document.getElementById("filter-type");
const filterLocation = document.getElementById("filter-location");
const filterMinPrice = document.getElementById("filter-min-price");
const filterMaxPrice = document.getElementById("filter-max-price");
const filterBedrooms = document.getElementById("filter-bedrooms");
const filterArea = document.getElementById("filter-area");
const filterBtn = document.getElementById("filter-btn");
const errorMsg = document.getElementById("filter-error");

// Função para alternar filtro quartos ou área
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

// Função para formatar preço em número (remove € e pontos)
function parsePrice(priceStr) {
  if (!priceStr) return null;
  return Number(priceStr.replace(/[^\d]/g, ""));
}

// Validação em tempo real dos valores mínimos e máximos
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

// Renderizar imóveis na página
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

// Função para filtrar imóveis com base nos critérios
function filterProperties() {
  if (!validateFilter()) return;

  const type = filterType.value.toLowerCase();
  const location = filterLocation.value.toLowerCase();
  const minPrice = Number(filterMinPrice.value);
  const maxPrice = Number(filterMaxPrice.value);
  const bedrooms = Number(filterBedrooms.value);
  const area = Number(filterArea.value);

  const filtered = properties.filter((p) => {
    // Filtrar tipo
    if (type && !p.title.toLowerCase().includes(type)) return false;

    // Filtrar localização
    if (location && !p.title.toLowerCase().includes(location)) return false;

    // Preço - converter € para número
    const priceNum = parsePrice(p.price);
    if (!priceNum) return false;

    if (minPrice && priceNum < minPrice) return false;
    if (maxPrice && priceNum > maxPrice) return false;

    // Quartos / Área
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

filterMinPrice.addEventListener("input", () => {
  validatePrices();
});

filterMaxPrice.addEventListener("input", () => {
  validatePrices();
});

filterLocation.addEventListener("input", () => {
  filterProperties();
});

filterBedrooms.addEventListener("input", () => {
  filterProperties();
});

filterArea.addEventListener("input", () => {
  filterProperties();
});

filterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (validateFilter()) {
    filterProperties();
  }
});

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  toggleBedroomsOrArea();
  renderProperties(properties);
});

