document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("property-list");

  properties.forEach((property) => {
    const card = document.createElement("div");
    card.className = "property-card";

    card.innerHTML = `
      <img src="${property.image}" alt="${property.title}">
      <h4>${property.title}</h4>
      <p>${property.price}</p>
    `;

    container.appendChild(card);
  });
});
