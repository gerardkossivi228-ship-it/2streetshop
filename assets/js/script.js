// 2 STREET — chargement dynamique du catalogue
// Ces fichiers JSON sont modifiés directement par le CMS (/admin).
// Ajouter, modifier ou supprimer un produit dans le CMS met à jour
// automatiquement ce que cette fonction affiche, sans toucher au code.

const WHATSAPP_NUMBER = "22891554571"; // sans le +, sans espaces

const CATALOG_SOURCES = {
  fashion: { file: "content/products/fashion.json", grid: "grid-fashion" },
  watches: { file: "content/products/watches.json", grid: "grid-watches" },
  phones:  { file: "content/products/phones.json",  grid: "grid-phones"  },
};

function formatPrice(price) {
  return Number(price || 0).toLocaleString("fr-FR") + " FCFA";
}

function productCard(product, categoryLabel) {
  const image = product.image || "";
  const whatsappText = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par : ${product.title} (${formatPrice(product.price)})`
  );

  return `
    <div class="product-card">
      <img src="${image}" alt="${product.title || ""}" loading="lazy" onerror="this.style.opacity=0.3">
      <div class="product-body">
        <span class="product-tag">${categoryLabel}</span>
        <span class="product-name">${product.title || "Produit"}</span>
        <span class="product-price">${formatPrice(product.price)}</span>
        <a class="btn-whatsapp" target="_blank"
           href="https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}">
          Commander sur WhatsApp
        </a>
      </div>
    </div>
  `;
}

async function loadCategory(key, { file, grid }, label) {
  const container = document.getElementById(grid);
  if (!container) return;

  try {
    const res = await fetch(`${file}?t=${Date.now()}`); // évite le cache
    if (!res.ok) throw new Error("Fichier introuvable");
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    if (items.length === 0) {
      container.innerHTML = `<div class="empty-state">Aucun produit pour l'instant dans ${label}.</div>`;
      return;
    }

    container.innerHTML = items.map(p => productCard(p, label)).join("");
  } catch (err) {
    container.innerHTML = `<div class="empty-state">Impossible de charger les produits (${err.message}).</div>`;
    console.error(`Erreur de chargement pour ${key}:`, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategory("fashion", CATALOG_SOURCES.fashion, "Fashion");
  loadCategory("watches", CATALOG_SOURCES.watches, "Watches");
  loadCategory("phones", CATALOG_SOURCES.phones, "Apple / Phones");
});
