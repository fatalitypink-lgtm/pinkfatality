/* ==========================================================================
   1. DADOS DOS PRODUTOS
   ========================================================================== */

const products = [
  {
    id: 1,
    image: "img/produtos/IMG_1811.PNG",
    images: ["img/produtos/IMG_1811.PNG"], // adicione mais caminhos aqui para variações (cores, ângulos etc.)
    variants: [
      { label: "Padrão", color: "#141114", image: "img/produtos/IMG_1811.PNG" }
      // adicione mais variações aqui, ex: { label: "Rosa", color: "#ec1e79", image: "img/....png" }
    ],
    name: "Spray de gengibre: Untouchable - 50g",
    desc: "Um spray de gengibre compacto, seguro e de fácil uso, com alcance de até 2,5 metros e trava contra acionamento acidental.",
    price: 99.90,
    old: 110.90,
    inst: "3x de R$36,33"
  
  },
  {
    id: 2,
    image: "img/kubotan.jpg.jpeg",
    images: ["img/kubotan.jpg.jpeg"], // adicione mais caminhos aqui para variações (cores, ângulos etc.)
    variants: [
      { label: "Padrão", color: "#141114", image: "img/kubotan.jpg.jpeg" }
      // adicione mais variações aqui, ex: { label: "Rosa", color: "#ec1e79", image: "img/....png" }
    ],
    name: "Kubotan",
    desc: "Leve e compacto, com apenas 40g e 14cm, possui argola para chaveiro, facilitando o transporte em bolsas, mochilas ou junto às chaves.",
    price: 22.90,
    old: 30.00,
    inst: "2x de R$12,95"
  },
  {
    id: 3,
    image: "img/produtos/IMG_1817.PNG",
    images: ["img/produtos/IMG_1817.PNG"], // adicione mais caminhos aqui para variações (cores, ângulos etc.)
    variants: [
      { label: "Padrão", color: "#141114", image: "img/produtos/IMG_1817.PNG" }
      // adicione mais variações aqui, ex: { label: "Rosa", color: "#ec1e79", image: "img/....png" }
    ],
    name: "Lanterna tática",
    desc: "Resistente à água e quedas, com 10.000 lúmens, bateria recarregável via USB-C e cinco modos de iluminação.",
    price: 59.90,
    old: 75.90,
    inst: "3x de R$23,33"
  },
  {
    id: 4,
    image: "img/IMG_1795.JPG.jpeg",
    images: ["img/IMG_1795.JPG.jpeg"], // adicione mais caminhos aqui para variações (cores, ângulos etc.)
    variants: [
      { label: "Padrão", color: "#141114", image: "img/IMG_1795.JPG.jpeg" }
      // adicione mais variações aqui, ex: { label: "Rosa", color: "#ec1e79", image: "img/....png" }
    ],
    name: "Alarme pessoal",
    desc: "Alarme sonoro compacto para emergências, disponível em preto e rosa — fácil de levar no chaveiro ou na bolsa.",
    price: 44.90,
    old: 55.90,
    inst: "2x de R$24,95"
  },
  {
    id: 5,
    image: "img/kit.jpg.jpeg",
    images: ["img/kit.jpg.jpeg"], // adicione mais caminhos aqui para variações (cores, ângulos etc.)
    variants: [
      { label: "Padrão", color: "#141114", image: "img/kit.jpg.jpeg" }
      // adicione mais variações aqui, ex: { label: "Rosa", color: "#ec1e79", image: "img/....png" }
    ],
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
      <div class="img"><img src="${product.image}" alt="${product.name}"></div>
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
document.querySelectorAll(".navicons a, .logo-area").forEach(link => {
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
  // Usa o array "images" do produto (uma foto por variação). Se não existir, cai no "image" único.
  const gallery = product.images && product.images.length ? product.images : [product.image];

  const thumbnails = gallery
    .map((src, index) => `
      <div class="thumb${index === 0 ? " active" : ""}" onclick="selectProductImage(this, '${src}')">
        <img src="${src}" alt="${product.name} - variação ${index + 1}">
      </div>
    `)
    .join("");

  return `
    <div>
      <div class="imgbox"><img id="main-product-img" src="${gallery[0]}" alt="${product.name}"></div>
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
        <div class="swatch-row">${variantSwatchesHTML(product)}</div>
      </div>
    </div>
  `;
}

/** Aumenta ou diminui a quantidade no seletor da página de produto */
function stepQuantity(delta) {
  const input = document.getElementById("qty");
  input.value = Math.max(1, Number(input.value) + delta);
}

/** Monta as bolinhas de variação (cor) do produto, cada uma clicável */
function variantSwatchesHTML(product) {
  if (!product.variants || !product.variants.length) return "";

  return product.variants
    .map((variant, index) => `
      <button
        type="button"
        class="swatch${index === 0 ? " active" : ""}"
        style="background:${variant.color}"
        title="${variant.label}"
        onclick="selectVariant(this, '${variant.image}')"
      ></button>
    `)
    .join("");
}

/** Troca a foto grande do produto pela da variação clicada, e marca ela como ativa */
function selectVariant(swatchEl, src) {
  document.getElementById("main-product-img").src = src;
  document.querySelectorAll(".swatch-row .swatch").forEach(swatch => swatch.classList.remove("active"));
  swatchEl.classList.add("active");
}

function openProduct(id) {
  const product = products.find(p => p.id === id);
  document.getElementById("product-detail").innerHTML = productDetailHTML(product);
  showView("view-product");
}

/** Troca a foto grande do produto pela da miniatura clicada, e marca ela como ativa */
function selectProductImage(thumbEl, src) {
  document.getElementById("main-product-img").src = src;
  document.querySelectorAll(".thumbs .thumb").forEach(thumb => thumb.classList.remove("active"));
  thumbEl.classList.add("active");
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
      <div class="cimg"><img src="${item.image}" alt="${item.name}"></div>
      <div class="cinfo">
        <div class="cinfo-text">
          <div class="cname">${item.name}</div>
          <div class="old">${formatMoney(item.old)}</div>
          <div class="cprice">
            <b>${formatMoney(item.price)}</b>
            <span class="off">-${discountPercent(item)}%</span>
          </div>
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
  document.getElementById("checkoutbtn").textContent =
    `Finalizar compra (${String(totalCount).padStart(2, "0")})`;
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
(function () {
  const KEY = 'pf_favoritos';

  const carregar = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };
  const salvar = (lista) => {
    try { localStorage.setItem(KEY, JSON.stringify(lista)); } catch {}
  };

  let favoritos = carregar();

  const nomeDoCard = (card) =>
    (card.querySelector('.name')?.textContent || '').trim();

  // coloca o botão de coração em cada card que ainda não tem
  function adicionarBotoes() {
    document.querySelectorAll('.card .img').forEach((img) => {
      if (img.querySelector('.fav')) return;

      const nome = nomeDoCard(img.closest('.card'));
      if (!nome) return;

      const ativo = favoritos.includes(nome);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fav' + (ativo ? ' on' : '');
      btn.setAttribute('aria-label', 'Favoritar ' + nome);
      btn.setAttribute('aria-pressed', ativo);
      img.appendChild(btn);
    });
  }

  // clique no coração: marca ou desmarca, sem abrir o produto
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav');
    if (!btn) return;

    e.stopPropagation();
    e.preventDefault();

    const nome = nomeDoCard(btn.closest('.card'));
    const ativo = !favoritos.includes(nome);

    favoritos = ativo
      ? [...favoritos, nome]
      : favoritos.filter((n) => n !== nome);
    salvar(favoritos);

    // atualiza todos os cards do mesmo produto (início e página de produtos)
    document.querySelectorAll('.card').forEach((card) => {
      if (nomeDoCard(card) !== nome) return;
      const b = card.querySelector('.fav');
      if (!b) return;
      b.classList.toggle('on', ativo);
      b.setAttribute('aria-pressed', ativo);
    });
  }, true);

  // roda sempre que o seu código criar novos cards
  new MutationObserver(adicionarBotoes).observe(document.body, {
    childList: true,
    subtree: true,
  });
  adicionarBotoes();
})();
const SUG_PER_PAGE = 3;
let sugList = [];
let sugPage = 0;

function openAddedModal(product) {
  document.getElementById("added-top").innerHTML = `
    <div class="aimg">
      <img src="${product.image}" alt="${product.name}">
      <span class="check">✓</span>
    </div>
    <div>
      <h3>ADICIONADO AO CARRINHO!</h3>
      <div class="aname">${product.name}</div>
      <div class="aold">${formatMoney(product.old)}</div>
      <div class="aprice">${formatMoney(product.price)}
        <span class="aoff">-${String(discountPercent(product)).replace(".", ",")}%</span>
      </div>
      <div class="ainst">Ou ${product.inst}</div>
    </div>
  `;

  // sugestões: produtos que ainda não estão no carrinho
  sugList = products.filter(p => !cart.some(i => i.id === p.id));
  sugPage = 0;
  renderSuggestions();

  document.getElementById("added-modal").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function renderSuggestions() {
  const body = document.getElementById("added-body");
  body.style.display = sugList.length ? "block" : "none";

  const pages = Math.ceil(sugList.length / SUG_PER_PAGE);
  const slice = sugList.slice(sugPage * SUG_PER_PAGE, (sugPage + 1) * SUG_PER_PAGE);

  document.getElementById("added-carousel").innerHTML = slice.map(p => `
    <div class="sug" onclick="addToCart(${p.id})">
      <span class="sbadge">-${String(discountPercent(p)).replace(".", ",")}%</span>
      <div class="simg"><img src="${p.image}" alt="${p.name}"></div>
      <div class="sname">${p.name.split(":")[0]}</div>
      <div class="sold">${formatMoney(p.old)}</div>
      <div class="sprice">${formatMoney(p.price)}</div>
      <button class="splus" type="button" aria-label="Adicionar">+</button>
    </div>
  `).join("");

  document.getElementById("added-dots").innerHTML =
    Array.from({ length: pages }, (_, i) => `<span class="${i === sugPage ? "on" : ""}"></span>`).join("");
}

function stepSuggestions(delta) {
  const pages = Math.ceil(sugList.length / SUG_PER_PAGE);
  if (!pages) return;
  sugPage = (sugPage + delta + pages) % pages;   // volta ao início/fim
  renderSuggestions();
}

function closeAddedModal() {
  document.getElementById("added-modal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

document.getElementById("added-prev").addEventListener("click", () => stepSuggestions(-1));
document.getElementById("added-next").addEventListener("click", () => stepSuggestions(1));
document.getElementById("added-close").addEventListener("click", closeAddedModal);
document.getElementById("added-continue").addEventListener("click", closeAddedModal);
document.getElementById("added-gocart").addEventListener("click", () => {
  closeAddedModal();
  openDrawer("cart-drawer");
});
function addToCart(id, quantity = 1) {
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ ...product, qty: quantity });
  }

  renderCart();
  openAddedModal(product);   // era openDrawer("cart-drawer")
}
function closeAllDrawers() {
  document.querySelectorAll(".drawer").forEach(drawer => drawer.classList.remove("open"));
  document.getElementById("added-modal").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}
const homeGrid = document.getElementById("home-grid");
const STEP = 244; // largura do card (220) + espaço (24)

document.getElementById("dest-next").addEventListener("click", () => {
  const noFim = homeGrid.scrollLeft + homeGrid.clientWidth >= homeGrid.scrollWidth - 4;
  if (noFim) homeGrid.scrollTo({ left: 0, behavior: "smooth" });
  else homeGrid.scrollBy({ left: STEP, behavior: "smooth" });
});

document.getElementById("dest-prev").addEventListener("click", () => {
  const noInicio = homeGrid.scrollLeft <= 4;
  if (noInicio) homeGrid.scrollTo({ left: homeGrid.scrollWidth, behavior: "smooth" });
  else homeGrid.scrollBy({ left: -STEP, behavior: "smooth" });
});
function cartItemHTML(item) {
  const off = String(discountPercent(item)).replace(".", ",");
  return `
    <div class="citem">
      <div class="cimg"><img src="${item.image}" alt="${item.name}"></div>
      <div class="cinfo">
        <div class="cname">${item.name}</div>
        <div class="crow">
          <div class="cinfo-text">
            <div class="old">${formatMoney(item.old)}</div>
            <div class="cprice">
              <b>${formatMoney(item.price)}</b>
              <span class="off">-${off}%</span>
            </div>
            <div class="cinst">Ou ${item.inst}</div>
          </div>
          <div class="cqty">
            <button onclick="changeCartQuantity(${item.id}, 1)">+</button>
            ${String(item.qty).padStart(2, "0")}
            <button onclick="changeCartQuantity(${item.id}, -1)">−</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/** "Ou 3x de R$36,33" para o total. Só mostra se todos os itens têm o mesmo nº de parcelas */
function cartInstallments(items) {
  const parsed = items.map(item => {
    const m = item.inst.match(/(\d+)x de R\$([\d.,]+)/);
    if (!m) return null;
    return { n: Number(m[1]), v: parseFloat(m[2].replace(".", "").replace(",", ".")) * item.qty };
  });

  if (!parsed.length || parsed.some(p => !p || p.n !== parsed[0].n)) return "";

  const sum = parsed.reduce((s, p) => s + p.v, 0);
  return `Ou ${parsed[0].n}x de ${formatMoney(sum)}`;
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
  document.getElementById("cart-inst").textContent = cartInstallments(cart);
  document.getElementById("checkoutbtn").textContent =
    `Finalizar compra (${String(totalCount).padStart(2, "0")})`;
}