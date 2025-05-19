const container = document.getElementById("properties");
const filterType = document.getElementById("filter-type");
const filterLocation = document.getElementById("filter-location");
const filterMinPrice = document.getElementById("filter-min-price");
const filterMaxPrice = document.getElementById("filter-max-price");
const filterBedrooms = document.getElementById("filter-bedrooms");
const filterBtn = document.getElementById("filter-btn");
const errorMsg = document.getElementById("filter-error");

function formatPrice(price) {
  return price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

function render(propertiesToRender) {
  container.innerHTML = "";
  if (propertiesToRender.length === 0) {
    container.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
    return;
  }
  propertiesToRender.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${formatPrice(p.price)}</p>
      <a href="#" class="btn-outline">Ver detalhes</a>
    `;
    container.appendChild(card);
  });
}

function validatePrices() {
  const minPrice = parseInt(filterMinPrice.value) || 0;
  const maxPriceVal = parseInt(filterMaxPrice.value);

  if (filterMaxPrice.value !== "" && maxPriceVal < minPrice) {
    errorMsg.style.display = "block";
    errorMsg.textContent = "O preço máximo não pode ser inferior ao preço mínimo.";
    return false;
  } else {
    errorMsg.style.display = "none";
    errorMsg.textContent = "";
    return true;
  }
}

function filterProperties() {
  if (!validatePrices()) return;

  const type = filterType.value.trim();
  const location = filterLocation.value.trim().toLowerCase();
  const minPrice = parseInt(filterMinPrice.value) || 0;
  const maxPrice = parseInt(filterMaxPrice.value) || Infinity;
  const bedrooms = parseInt(filterBedrooms.value);

  const filtered = properties.filter(p => {
    const matchesType = !type || p.type === type;
    const matchesLocation = !location || p.location.toLowerCase().includes(location);
    const matchesMinPrice = p.price >= minPrice;
    const matchesMaxPrice = p.price <= maxPrice;
    const matchesBedrooms = isNaN(bedrooms) || p.bedrooms === bedrooms;

    return matchesType && matchesLocation && matchesMinPrice && matchesMaxPrice && matchesBedrooms;
  });

  render(filtered);
}

// Eventos para validação em tempo real dos preços
filterMinPrice.addEventListener("input", validatePrices);
filterMaxPrice.addEventListener("input", validatePrices);

filterBtn.addEventListener("click", filterProperties);

// Renderizar todos inicialmente
render(properties);

