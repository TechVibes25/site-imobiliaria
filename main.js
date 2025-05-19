const container = document.getElementById("properties");
const filterType = document.getElementById("filter-type");
const filterLocation = document.getElementById("filter-location");
const filterMinPrice = document.getElementById("filter-min-price");
const filterMaxPrice = document.getElementById("filter-max-price");
const filterBedrooms = document.getElementById("filter-bedrooms");
const filterArea = document.getElementById("filter-area");
const filterBtn = document.getElementById("filter-btn");
const errorMsg = document.getElementById("filter-error");

// Alterna visibilidade dos filtros de quartos e área conforme tipo selecionado
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

// Formata preço para estilo europeu com símbolo €
function formatPrice(price) {
  return price.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

// Renderiza os imóveis no container
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
      <p>${formatPrice(property.price)}</p>
      <a href="#" class="btn-outline">Ver detalhes</a>
    `;
    container.appendChild(card);
  });
}

// Validação do preço mínimo e máximo
function validatePriceRange() {
  const min = parseInt(filterMinPrice.value) || 0;
  const max = parseInt(filterMaxPrice.value);
  if (filterMaxPrice.value !== "" && max < min) {
    errorMsg.style.display = "block";
    errorMsg.textContent = "O preço máximo não pode ser inferior ao preço mínimo.";
    return false;
  }
  errorMsg.style.display = "none";
  errorMsg.textContent = "";
  return true;
}

// Aplica filtros e atualiza a lista mostrada
function applyFilters() {
  if (!validatePriceRange()) return;

  const type = filterType.value.trim();
  const location = filterLocation.value.trim().toLowerCase();
  const minPrice = parseInt(filterMinPrice.value) || 0;
  const maxPrice = parseInt(filterMaxPrice.value) || Infinity;
  const bedrooms = parseInt(filterBedrooms.value);
  const area = parseInt(filterArea.value) || 0;

  const filtered = properties.filter((p) => {
    const matchType = !type || p.type === type;
    const matchLocation = !location || p.location.toLowerCase().includes(location);
    const matchPrice = p.price >= minPrice && p.price <= maxPrice;

    let matchBedroomsOrArea = true;
    if (type === "Terreno" || type === "Loja") {
      matchBedroomsOrArea = !area || (p.area && p.area >= area);
    } else {
      matchBedroomsOrArea = isNaN(bedrooms) || p.bedrooms === bedrooms;
    }

    return matchType && matchLocation && matchPrice && matchBedroomsOrArea;
  });

  renderProperties(filtered);
}

// Eventos
filterType.addEventListener("change", toggleBedroomsOrArea);
filterMinPrice.addEventListener("input", validatePriceRange);
filterMaxPrice.addEventListener("input", validatePriceRange);
filterBtn.addEventListener("click", applyFilters);

// Inicialização
toggleBedroomsOrArea(); // Ajusta visibilidade conforme tipo inicial
renderProperties(properties); // Renderiza lista completa ao carregar
