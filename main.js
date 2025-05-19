document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("properties");
  const tipo = document.getElementById("tipo");
  const localizacao = document.getElementById("localizacao");
  const precoMin = document.getElementById("precoMin");
  const precoMax = document.getElementById("precoMax");
  const quartos = document.getElementById("quartos");
  const metros = document.getElementById("metros");
  const filterBtn = document.getElementById("filterBtn");
  const errorMessage = document.getElementById("error-message");

  // Alterna visibilidade de quartos / m²
  tipo.addEventListener("change", () => {
    const val = tipo.value;
    if(val === "Terreno" || val === "Loja") {
      quartos.style.display = "none";
      metros.style.display = "inline-block";
      quartos.value = "";
    } else {
      metros.style.display = "none";
      quartos.style.display = "inline-block";
      metros.value = "";
    }
    errorMessage.classList.remove("active");
    errorMessage.textContent = "";
  });

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
        <p>${p.priceStr}</p>
        <a href="#" class="btn-outline">Ver detalhes</a>
      `;
      container.appendChild(card);
    });
  }

  function validateInputs() {
    errorMessage.classList.remove("active");
    errorMessage.textContent = "";

    const min = precoMin.value ? Number(precoMin.value) : null;
    const max = precoMax.value ? Number(precoMax.value) : null;

    if(min !== null && max !== null && max < min) {
      errorMessage.textContent = "Preço máximo deve ser maior ou igual ao preço mínimo.";
      errorMessage.classList.add("active");
      return false;
    }
    return true;
  }

  filterBtn.addEventListener("click", () => {
    if (!validateInputs()) return;

    const tipoVal = tipo.value.toLowerCase();
    const localVal = localizacao.value.trim().toLowerCase();
    const minPrice = precoMin.value ? Number(precoMin.value) : null;
    const maxPrice = precoMax.value ? Number(precoMax.value) : null;
    const quartosVal = quartos.style.display !== "none" && quartos.value ? Number(quartos.value) : null;
    const metrosVal = metros.style.display !== "none" && metros.value ? Number(metros.value) : null;

    let filtered = properties.filter(p => {
      // Tipo
      if(tipoVal && p.type.toLowerCase() !== tipoVal) return false;

      // Localização - permite filtro parcial
      if(localVal && !p.location.toLowerCase().includes(localVal)) return false;

      // Preço
      if(minPrice !== null && p.price < minPrice) return false;
      if(maxPrice !== null && p.price > maxPrice) return false;

      // Quartos ou metros
      if(quartosVal !== null && p.bedrooms !== quartosVal) return false;
      if(metrosVal !== null && p.area < metrosVal) return false;

      return true;
    });

    render(filtered);
  });

  // Validação em tempo real para o preço
  precoMin.addEventListener("input", () => {
    validateInputs();
  });
  precoMax.addEventListener("input", () => {
    validateInputs();
  });

  // Render inicial com todos imóveis
  render(properties);
});


