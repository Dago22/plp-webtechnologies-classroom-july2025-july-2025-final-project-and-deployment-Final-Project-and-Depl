
/* Simple product data and cart logic for demo purposes */
const products = [
  { id: 1, title: "Classic Tee", price: 24.99, img: "product1.jpg" },
  { id: 2, title: "Denim Jacket", price: 89.00, img: "product2.jpg" },
  { id: 3, title: "Linen Shirt", price: 39.50, img: "product3.jpg" },
  { id: 4, title: "Chino Pants", price: 49.99, img: "product4.jpg" },
  { id: 5, title: "Summer Dress", price: 59.00, img:"product5.jpg" },
  { id: 6, title: "Hooded Sweat", price: 69.99, img: "product6.jpg" }
];

function $(sel){return document.querySelector(sel)}
function $all(sel){return document.querySelectorAll(sel)}

const cart = [];

function renderProducts(targetId, list){
  const container = document.getElementById(targetId);
  if(!container) return;
  container.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="meta">
        <h4>${p.title}</h4>
        <p class="price">$${p.price.toFixed(2)}</p>
        <div class="actions">
          <button class="btn add" data-id="${p.id}">Add to cart</button>
          <a href="products.html" class="btn" style="background:#eee;color:#111;border:0">View</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  // attach listeners
  container.querySelectorAll('.add').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = Number(e.target.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(id){
  const prod = products.find(p=>p.id===id);
  if(!prod) return;
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({...prod, qty:1});
  updateCartUI();
  alert(`${prod.title} added to cart`);
}

function updateCartUI(){
  const countEls = document.querySelectorAll('#cartCount, #cartCount2, #cartCount3, #cartCount4');
  const totalCount = cart.reduce((s,i)=>s+i.qty,0);
  countEls.forEach(el=>{ if(el) el.textContent = totalCount; });
  // update modal items
  const items = document.getElementById('cartItems') || document.getElementById('cartItems2');
  const totalEl = document.getElementById('cartTotal') || document.getElementById('cartTotal2');
  if(items){
    items.innerHTML = cart.map(it=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee"><span>${it.title} x ${it.qty}</span><strong>$${(it.price*it.qty).toFixed(2)}</strong></div>`).join('');
  }
  if(totalEl){
    const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);
    totalEl.textContent = total.toFixed(2);
  }
}

function setupCartButtons(){
  ['#cartBtn','#cartBtn2','#cartBtn3','#cartBtn4'].forEach(id=>{
    const btn = document.querySelector(id);
    if(btn) btn.addEventListener('click', ()=>{
      const modal = document.getElementById('cartModal') || document.getElementById('cartModal2');
      if(modal) modal.setAttribute('aria-hidden','false');
    });
  });
  ['#closeCart','#closeCart2'].forEach(id=>{
    const btn = document.querySelector(id);
    if(btn) btn.addEventListener('click', ()=>{
      document.querySelectorAll('.modal').forEach(m=>m.setAttribute('aria-hidden','true'));
    });
  });
  ['#checkoutBtn','#checkoutBtn2'].forEach(id=>{
    const btn = document.querySelector(id);
    if(btn) btn.addEventListener('click', ()=>{
      if(cart.length===0){ alert('Cart is empty'); return; }
      alert('Checkout demo — Thank you for your purchase!');
      cart.length = 0;
      updateCartUI();
      document.querySelectorAll('.modal').forEach(m=>m.setAttribute('aria-hidden','true'));
    });
  });
}

function handleContact(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();
  if(!name||!email||!msg){ alert('Please fill all fields'); return; }
  alert('Thanks, ' + name + '! Message received. (Demo)');
  e.target.reset();
}

// search & sort for products page
function setupProductsPage(){
  const grid = document.getElementById('productGrid');
  if(grid){
    renderProducts('productGrid', products);
    const search = document.getElementById('search');
    const sort = document.getElementById('sort');
    search && search.addEventListener('input', (e)=>{
      const q = e.target.value.toLowerCase();
      renderProducts('productGrid', products.filter(p=>p.title.toLowerCase().includes(q)));
    });
    sort && sort.addEventListener('change', (e)=>{
      let list = [...products];
      if(e.target.value==='price-asc') list.sort((a,b)=>a.price-b.price);
      if(e.target.value==='price-desc') list.sort((a,b)=>b.price-a.price);
      renderProducts('productGrid', list);
    });
  }
  const feat = document.getElementById('featuredGrid');
  if(feat){
    renderProducts('featuredGrid', products.slice(0,3));
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  setupProductsPage();
  setupCartButtons();
  updateCartUI();
  window.handleContact = handleContact;
});
