const properties = [
  {
    title: "Moradia T3 - Lisboa",
    price: 350000,
    priceFormatted: "€350.000",
    image: "https://images.unsplash.com/photo-1501183638714-4e89b6b8d0f2?auto=format&fit=crop&w=600&q=80",
    type: "Moradia",
    location: "Lisboa",
    bedrooms: 3,
    area: 180
  },
  {
    title: "Apartamento T2 - Porto",
    price: 220000,
    priceFormatted: "€220.000",
    image: "https://images.unsplash.com/photo-1560448204-6c53296c6d0f?auto=format&fit=crop&w=600&q=80",
    type: "Apartamento",
    location: "Porto",
    bedrooms: 2,
    area: 90
  },
  {
    title: "Terreno Rústico - Setúbal",
    price: 75000,
    priceFormatted: "€75.000",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    type: "Terreno",
    location: "Setúbal",
    bedrooms: 0,
    area: 3500
  },
  {
    title: "Loja Comercial - Braga",
    price: 150000,
    priceFormatted: "€150.000",
    image: "https://images.unsplash.com/photo-1556740767-8f96f7921e85?auto=format&fit=crop&w=600&q=80",
    type: "Loja",
    location: "Braga",
    bedrooms: 0,
    area: 120
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("properties");
  const searchInput = document.getElementById("search");
  const filterType = document.getElementById("type");
  const filterLocation = document.getElementById("location");
  const filterMinPrice = document.getElementById("minPrice");
  const filterMaxPrice = document.getElementById("maxPrice");
  const filterBedrooms = document.getElementById("bedrooms");
  const filterArea = document.getElementById("area");
  const errorMessage = document.getElementById("error-message");
  const filterBtn = document.getElementById("filterBtn");

  function render(propertiesToRender) {
    container.innerHTML = "";
    if (propertiesToRender.length === 0) {
      container.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
      return;
    }
    propertiesToRender.forEach(p => {
      container.innerHTML += `
        <div class="card">
          <img src="${p.image}" alt="${p.title}" />
          <h3>${p.title}</h3>
          <p>${p.priceFormatted}</p>
          <a href="#" class="btn-outline">Ver detalhes</a>
        </div>
      `;
    });
  }

  // Mostra/oculta campo quartos ou área conforme tipo selecionado
  function toggleBedroomsArea() {
    if (filterType.value === "Terreno" || filterType.value === "Loja") {
      filterBedrooms.style.display = "none";
      filterArea.style.display = "inline-block";
    } else {
      filterBedrooms.style.display = "inline-block";
      filterArea.style.display = "none";
    }
  }

  toggleBedroomsArea();

  filterType.addEventListener("change", () => {
    toggleBedroomsArea();
  });

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.add("active");
  }

  function hideError() {
    errorMessage.textContent = "";
    errorMessage.classList.remove("active");
  }

  function validatePrices(min, max) {
    if (min !== "" && max !== "" && Number(max) < Number(min)) {
      showError("Preço máximo deve ser maior ou igual ao preço mínimo.");
      return false;
    }
    hideError();
    return true;
  }

  filterBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const searchTerm = searchInput.value.toLowerCase();
    const typeValue = filterType.value;
    const locationValue = filterLocation.value.toLowerCase();
    const minPriceValue = filterMinPrice.value;
    const maxPriceValue = filterMaxPrice.value;
    const bedroomsValue = filterBedrooms.value;
    const areaValue = filterArea.value;

    if (!validatePrices(minPriceValue, maxPriceValue)) {
      return;
    }

    let filtered = properties.filter(p => {
      // Pesquisa por texto (título)
      if (!p.title.toLowerCase().includes(searchTerm)) return false;

      // Tipo
      if (typeValue !== "Todos" && p.type !== typeValue) return false;

      // Localização
      if (locationValue !== "" && !p.location.toLowerCase().includes(locationValue)) return false;

      // Preço mínimo
      if (minPriceValue !== "" && p.price < Number(minPriceValue)) return false;

      // Preço máximo
      if (maxPriceValue !== "" && p.price > Number(maxPriceValue)) return false;

      // Quartos ou Área
      if (typeValue === "Terreno" || typeValue === "Loja") {
        if (areaValue !== "" && p.area < Number(areaValue)) return false;
      } else {
        if (bedroomsValue !== "" && p.bedrooms < Number(bedroomsValue)) return false;
      }

      return true;
    });

    render(filtered);
  });

  // Renderiza todos no load
  render(properties);
});

