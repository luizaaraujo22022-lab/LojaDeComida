const products = [
  {
    id: 1,
    name: "Feijoada Completa",
    category: "principais",
    desc: "Feijoada artesanal com pertences nobres. Acompanha arroz, couve refogada no alho, farofa caseira e torresmo estalando.",
    price: 38.00,
    img: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Strogonoff de Frango",
    category: "principais",
    desc: "Cremoso peito de frango em cubos com molho especial de cogumelos, arroz soltinho e batata palha crocante.",
    price: 29.90,
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Escondidinho de Carne Seca",
    category: "principais",
    desc: "Purê aveludado de macaxeira com carne seca desfiada e bem temperada, gratinado com queijo coalho.",
    price: 32.00,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Moqueca Baiana de Peixe",
    category: "principais",
    desc: "Postas de peixe fresco cozidas no leite de coco, azeite de dendê e pimentões. Acompanha pirão e arroz.",
    price: 45.00,
    img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    name: "Pudim de Leite Tradicional",
    category: "sobremesas",
    desc: "Receita clássica de família, ultra cremoso, sem furinhos e com calda abundante de caramelo dourado.",
    price: 12.00,
    img: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    name: "Cartola Pernambucana",
    category: "sobremesas",
    desc: "Banana frita no manteiga de garrafa, queijo manteiga assado, polvilhado com açúcar e canela.",
    price: 15.00,
    img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    name: "Suco Natural de Laranja (500ml)",
    category: "bebidas",
    desc: "Suco 100% natural da fruta, espremido na hora, sem adição de água nem conservantes.",
    price: 8.00,
    img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    name: "Guaraná Antarctica (350ml)",
    category: "bebidas",
    desc: "Lata trincando de gelada.",
    price: 6.00,
    img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
  }
];

let cart = [];
let currentCategory = 'todos';

function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCart();

  const paySelect = document.getElementById('pay-method');
  paySelect.addEventListener('change', (e) => {
    const trocoGroup = document.getElementById('troco-group');
    if (e.target.value === 'Dinheiro') {
      trocoGroup.style.display = 'block';
    } else {
      trocoGroup.style.display = 'none';
    }
  });
});

function renderProducts() {
  const container = document.getElementById('products-grid');
  const filtered = currentCategory === 'todos' 
    ? products 
    : products.filter(p => p.category === currentCategory);

  container.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="card-img-wrapper">
        <img src="${product.img}" alt="${product.name}" class="product-img" loading="lazy">
      </div>
      <div class="card-content">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="card-footer">
          <span class="product-price">${formatCurrency(product.price)}</span>
          <button class="btn-add" onclick="addToCart(${product.id})">+ Adicionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${cat}'`));
  });
  renderProducts();
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    const prod = products.find(p => p.id === id);
    cart.push({ ...prod, qty: 1 });
  }
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCart();
}

function updateCart() {
  const cartContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('subtotal-price');
  const totalEl = document.getElementById('total-price');

  const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
  const totalAmount = getCartTotal();

  cartCount.innerText = `${totalQty} ${totalQty === 1 ? 'item' : 'itens'}`;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-state">
        <p>Seu carrinho está vazio.</p>
        <small style="color: #999;">Escolha um prato delicioso do cardápio!</small>
      </div>
    `;
    subtotalEl.innerText = "R$ 0,00";
    totalEl.innerText = "R$ 0,00";
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-unit-price">${formatCurrency(item.price)} un</span>
      </div>
      <div class="qty-control">
        <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
        <span class="qty-val">${item.qty}</span>
        <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <span class="cart-item-total">${formatCurrency(item.price * item.qty)}</span>
    </div>
  `).join('');

  subtotalEl.innerText = formatCurrency(totalAmount);
  totalEl.innerText = formatCurrency(totalAmount);
}

function checkout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio! Selecione ao menos um prato antes de finalizar.");
    return;
  }

  const name = document.getElementById('cust-name').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const payment = document.getElementById('pay-method').value;
  const troco = document.getElementById('cust-troco').value.trim();

  if (!name || !address) {
    alert("Por favor, preencha seu Nome e Endereço para entrega.");
    return;
  }

  let text = `*PEDIDO - MARIA NA COZINHA* 🍳\n`;
  text += `------------------------------------\n`;
  text += `👤 *Cliente:* ${name}\n`;
  text += `📍 *Endereço:* ${address}\n`;
  text += `💳 *Pagamento:* ${payment}\n`;
  if (payment === 'Dinheiro' && troco) {
    text += `💵 *Troco para:* ${troco}\n`;
  }
  text += `------------------------------------\n\n`;
  text += `📋 *ITENS DO PEDIDO:*\n`;

  cart.forEach(item => {
    text += `• ${item.qty}x ${item.name} — ${formatCurrency(item.price * item.qty)}\n`;
  });

  text += `\n💰 *TOTAL:* ${formatCurrency(getCartTotal())}\n`;
  text += `------------------------------------\n`;
  text += `Aguardando confirmação do pedido!`;

  const phone = "5581984893163";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  window.open(url, '_blank');
}