/* ==========================================================================
   1. DADOS DOS PRODUTOS
   ========================================================================== */

const products = [
  {
    id: 1,
     icon: "🗝️",
    name: "Spray de gengibre: Untouchable - 50g",
    desc: "Um spray de gengibre compacto, seguro e de fácil uso, com alcance de até 2,5 metros e trava contra acionamento acidental.",
    price: 99.90,
    old: 110.90,
    inst: "3x de R$36,33"
  
  },
  {
    id: 2,
    icon: "🗝️",
    name: "Kubotan",
    desc: "Leve e compacto, com apenas 40g e 14cm, possui argola para chaveiro, facilitando o transporte em bolsas, mochilas ou junto às chaves.",
    price: 22.90,
    old: 30.00,
    inst: "2x de R$12,95"
  },
  {
    id: 3,
    icon: "🔦",
    name: "Lanterna tática",
    desc: "Resistente à água e quedas, com 10.000 lúmens, bateria recarregável via USB-C e cinco modos de iluminação.",
    price: 59.90,
    old: 75.90,
    inst: "3x de R$23,33"
  },
  {
    id: 4,
    icon: "🚨",
    name: "Alarme pessoal",
    desc: "Alarme sonoro compacto para emergências, disponível em preto e rosa — fácil de levar no chaveiro ou na bolsa.",
    price: 44.90,
    old: 55.90,
    inst: "2x de R$24,95"
  },
  {
    id: 5,
    icon: "🎁",
    name: "Kit promocional",
    desc: "Kit com spray de gengibre, kubotan e alarme pessoal — proteção completa com desconto especial.",
    price: 139.90,
    old: 179.90,
    inst: "3x de R$46,63"
  }
];

// Carrinho de compras (fica em memória; some se a página for recarregada)
let cart = [];


/* ==========================================================================
   2. FUNÇÕES AUXILIARES
   ========================================================================== */

/** Formata um número como moeda brasileira: 99.9 -> "R$99,90" */
function formatMoney(value) {
  return "R$" + value.toFixed(2).replace(".", ",");
}

/** Calcula o percentual de desconto entre o preço antigo e o atual */
function discountPercent(product) {
  const raw = (1 - product.price / product.old) * 100;
  return Math.round(raw * 100) / 100;
}


/* ==========================================================================
   3. RENDERIZAÇÃO DE PRODUTOS (cards da grade)
   ========================================================================== */

function productCardHTML(product) {
  return `
    <div class="card" onclick="openProduct(${product.id})">
      <div class="img">${product.icon}</div>
      <div class="info">
        <div class="name">${product.name}</div>
        <div class="desc">${product.desc}</div>
        <div class="old">${formatMoney(product.old)}</div>
        <div class="price">
          ${formatMoney(product.price)}
          <span class="off">-${discountPercent(product)}%</span>
        </div>
        <div class="inst">Ou ${product.inst}</div>
      </div>
      <button class="addbtn" onclick="event.stopPropagation(); addToCart(${product.id})">
        Adicionar ao carrinho
      </button>
    </div>
  `;
}

function renderProductGrid(list, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = list.length
    ? list.map(productCardHTML).join("")
    : '<p style="padding:24px">Nenhum produto encontrado.</p>';
}

// Preenche a Home e a página de Produtos assim que o site carrega
renderProductGrid(products, "home-grid");
renderProductGrid(products, "products-grid");


/* ==========================================================================
   4. NAVEGAÇÃO ENTRE PÁGINAS (views)
   ========================================================================== */

function showView(viewId) {
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");

  document.querySelectorAll(".navicons a").forEach(link => {
    link.classList.toggle("active", link.dataset.view === viewId);
  });

  window.scrollTo(0, 0);
}

// Clique nos ícones "Início" / "Produtos" do menu
document.querySelectorAll(".navicons a").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showView(link.dataset.view);
  });
});


/* ==========================================================================
   5. BUSCA DE PRODUTOS
   ========================================================================== */

document.getElementById("searchform").addEventListener("submit", event => {
  event.preventDefault();

  const term = document.getElementById("searchbox").value.toLowerCase().trim();
  const filtered = term
    ? products.filter(p => p.name.toLowerCase().includes(term))
    : products;

  renderProductGrid(filtered, "products-grid");

  const title = document.getElementById("ptitle");
  title.textContent = term
    ? `TOTAL DE ${filtered.length} PRODUTOS PARA "${term.toUpperCase()}"`
    : `TOTAL DE ${filtered.length} PRODUTOS`;

  showView("view-products");
});


/* ==========================================================================
   6. PÁGINA DE DETALHE DO PRODUTO
   ========================================================================== */

function productDetailHTML(product) {
  const thumbnails = Array(4).fill(`<div>${product.icon}</div>`).join("");

  return `
    <div>
      <div class="imgbox">${product.icon}</div>
      <div class="thumbs">${thumbnails}</div>
    </div>
    <div class="pinfo">
      <h2>${product.name.split(":")[0].toUpperCase()}</h2>
      <span class="badge">SÓ NA PINKFATALITY</span>
      <p class="desc">${product.desc}</p>
      <div class="old">${formatMoney(product.old)}</div>
      <div class="price">
        ${formatMoney(product.price)}
        <span class="off">-${discountPercent(product)}%</span>
      </div>
      <div>Ou ${product.inst}</div>
      <div class="qtybox">
        <button onclick="stepQuantity(-1)">−</button>
        <input id="qty" value="1" readonly>
        <button onclick="stepQuantity(1)">+</button>
        <button class="cta" onclick="addToCart(${product.id}, Number(qty.value))">
          Adicionar ao carrinho
        </button>
      </div>
      <div class="variacoes">
        <h4>VARIAÇÕES:</h4>
        <div class="swatch"></div>
      </div>
    </div>
  `;
}

/** Aumenta ou diminui a quantidade no seletor da página de produto */
function stepQuantity(delta) {
  const input = document.getElementById("qty");
  input.value = Math.max(1, Number(input.value) + delta);
}

function openProduct(id) {
  const product = products.find(p => p.id === id);
  document.getElementById("product-detail").innerHTML = productDetailHTML(product);
  showView("view-product");
}


/* ==========================================================================
   7. CARRINHO DE COMPRAS
   ========================================================================== */

function addToCart(id, quantity = 1) {
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ ...product, qty: quantity });
  }

  renderCart();
  openDrawer("cart-drawer");
}

function changeCartQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  renderCart();
}

function cartItemHTML(item) {
  return `
    <div class="citem">
      <div class="cimg">${item.icon}</div>
      <div class="cinfo">
        <div>${item.name}</div>
        <div class="old" style="opacity:.7">${formatMoney(item.old)}</div>
        <div>
          <b>${formatMoney(item.price)}</b>
          <span class="off">-${discountPercent(item)}%</span>
        </div>
        <div class="cqty">
          <button onclick="changeCartQuantity(${item.id}, 1)">+</button>
          ${String(item.qty).padStart(2, "0")}
          <button onclick="changeCartQuantity(${item.id}, -1)">−</button>
        </div>
      </div>
    </div>
  `;
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items");
  itemsContainer.innerHTML = cart.length
    ? cart.map(cartItemHTML).join("")
    : '<p style="padding:24px">Seu carrinho está vazio.</p>';

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  document.getElementById("cart-count").textContent = String(totalCount).padStart(2, "0");
  document.getElementById("cart-total").textContent = formatMoney(totalPrice);
}

document.getElementById("checkoutbtn").addEventListener("click", () => {
  alert("Compra finalizada! (demonstração)");
});


/* ==========================================================================
   8. PAINÉIS LATERAIS (carrinho / login) E OVERLAY
   ========================================================================== */

function openDrawer(drawerId) {
  document.getElementById(drawerId).classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeAllDrawers() {
  document.querySelectorAll(".drawer").forEach(drawer => drawer.classList.remove("open"));
  document.getElementById("overlay").classList.remove("show");
}

document.getElementById("cartbtn").addEventListener("click", () => openDrawer("cart-drawer"));
document.getElementById("profilebtn").addEventListener("click", () => openDrawer("profile-drawer"));

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", closeAllDrawers);
});

document.getElementById("overlay").addEventListener("click", closeAllDrawers);

// Link "Criar sua conta" dentro do painel de login -> abre a página de cadastro
document.getElementById("gotosignup").addEventListener("click", event => {
  event.preventDefault();
  closeAllDrawers();
  showView("view-signup");
});


/* ==========================================================================
   9. FORMULÁRIO DE CADASTRO
   ========================================================================== */

document.getElementById("signupform").addEventListener("submit", event => {
  event.preventDefault();
  alert("Cadastro enviado! (demonstração)");
});
