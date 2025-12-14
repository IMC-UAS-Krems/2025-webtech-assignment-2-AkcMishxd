//PRODUCTS DATA 
const products = [
  {
    id: 1,
    name: "Family Food Box",
    price: 25,
    description: "Dry food, oil, rice and canned vegetables.",
    image: "img/food-box.jpg",
  },
  {
    id: 2,
    name: "Fresh Fruit Pack",
    price: 15,
    description: "Seasonal fruits for one family.",
    image: "img/letöltés.jpg",
  },
  {
    id: 3,
    name: "Winter Clothes Set",
    price: 40,
    description: "Jacket, hat, scarf and gloves.",
    image: "img/winter-clothes.jpeg",
  },
  {
    id: 4,
    name: "School Starter Kit",
    price: 30,
    description: "Backpack with notebooks and pens.",
    image: "img/school-kit.jpg",
  },
  {
    id: 5,
    name: "Baby Care Package",
    price: 28,
    description: "Diapers, wipes and baby cream.",
    image: "img/baby-care.jpg",
  },
  {
    id: 6,
    name: "Hygiene Kit",
    price: 18,
    description: "Soap, shampoo, toothpaste and more.",
    image: "img/hygiene-kit.jpg",
  },
  {
    id: 7,
    name: "Warm Blanket",
    price: 20,
    description: "Thick fleece blanket.",
    image: "img/blanket.jpg",
  },
  {
    id: 8,
    name: "Emergency Medicine Pack",
    price: 35,
    description: "Basic medicines and first-aid items.",
    image: "img/medicine-pack.jpeg",
  },
  {
    id: 9,
    name: "Gift Voucher for Kids",
    price: 10,
    description: "Small toy or book of choice.",
    image: "img/kids-gift.jpg",
  },
  {
    id: 10,
    name: "Monthly Support Donation",
    price: 50,
    description: "General donation to our relief fund.",
    image: "img/monthly-donation.jpg",
  },
];

//STATE & CONSTANTS 
let cart = [];

const DISCOUNT_RATE = 0.1;
const TAX_RATE = 0.2;

//HELPERS 
function formatMoney(value) {
  return value.toFixed(2);
}

function findCartItem(id) {
  return cart.find((item) => item.id === id);
}

function calculateTotals() {
  let subtotal = 0;
  let quantityTotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    quantityTotal += item.quantity;
  });

  const discount = quantityTotal >= 3 ? subtotal * DISCOUNT_RATE : 0;
  const taxable = subtotal - discount;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax;

  return { subtotal, discount, tax, total, quantityTotal };
}

//RENDERING 
function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  //product injection
  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card h-100 product-card">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body d-flex flex-column">
          <h3 class="h6 card-title">${product.name}</h3>
          <p class="card-text small text-muted mb-2">
            ${product.description}
          </p>
          <p class="product-price mb-3">
            <span class="fw-semibold">${formatMoney(product.price)} €</span>
            <span class="badge bg-success ms-2">Charity item</span>
          </p>
          <button
            class="btn btn-primary mt-auto"
            type="button"
            data-product-id="${product.id}">
            Add to cart
          </button>
        </div>
      </div>
    `;

    list.appendChild(col);
  });

  list.querySelectorAll("button[data-product-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-product-id"));
      addToCart(id);
    });
  });
}

function renderCart() {
  const tbody = document.getElementById("cart-items");
  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4 text-muted">
          Your cart is empty. Add some items from the gallery above.
        </td>
      </tr>
    `;
  } else {
    cart.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td class="text-center">
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-secondary" data-action="decrease" data-id="${item.id
        }">-</button>
            <span class="btn btn-light disabled">${item.quantity}</span>
            <button class="btn btn-outline-secondary" data-action="increase" data-id="${item.id
        }">+</button>
          </div>
        </td>
        <td class="text-end">${formatMoney(item.price)}</td>
        <td class="text-end">${formatMoney(item.price * item.quantity)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" data-action="remove" data-id="${item.id
        }">
            &times;
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  const totals = calculateTotals();
  document.getElementById("cart-subtotal").textContent = formatMoney(totals.subtotal);
  document.getElementById("cart-discount").textContent = formatMoney(totals.discount);
  document.getElementById("cart-tax").textContent = formatMoney(totals.tax);
  document.getElementById("cart-total").textContent = formatMoney(totals.total);

  document.getElementById("cart-count-badge").textContent = totals.quantityTotal;
  document.getElementById("cart-count-badge-nav").textContent = totals.quantityTotal;

  const checkoutBtn = document.getElementById("btn-checkout");
  checkoutBtn.disabled = cart.length === 0;

  tbody.querySelectorAll("button[data-action]").forEach((btn) => {
    const action = btn.getAttribute("data-action");
    const id = Number(btn.getAttribute("data-id"));

    btn.addEventListener("click", () => {
      if (action === "increase") changeQuantity(id, 1);
      if (action === "decrease") changeQuantity(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  });
}

//CART OPERATIONS 
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let item = findCartItem(productId);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }
  renderCart();
  showCartAlert("Item added to cart.", "success");
}

function changeQuantity(id, delta) {
  const item = findCartItem(id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

//ALERTS 
function showCartAlert(message, type = "info") {
  const placeholder = document.getElementById("cart-alert-placeholder");
  placeholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

//CHECKOUT / CONFIRMATION 
function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    event.stopPropagation();
  }
  //validation
  const phoneInput = document.getElementById("inputPhone");
  const zipInput = document.getElementById("inputZip");

  const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(phoneInput.value.trim())) {
    phoneInput.classList.add("is-invalid");
  } else {
    phoneInput.classList.remove("is-invalid");
    phoneInput.classList.add("is-valid");
  }

  const zipRegex = /^\d{1,6}$/;
  if (!zipRegex.test(zipInput.value.trim())) {
    zipInput.classList.add("is-invalid");
  } else {
    zipInput.classList.remove("is-invalid");
    zipInput.classList.add("is-valid");
  }

  form.classList.add("was-validated");

  if (
    !form.checkValidity() ||
    phoneInput.classList.contains("is-invalid") ||
    zipInput.classList.contains("is-invalid")
  ) {
    return;
  }

  showConfirmation();
}

function showConfirmation() {
  const totals = calculateTotals();

  const name = document.getElementById("inputName").value.trim();
  const email = document.getElementById("inputEmail").value.trim();
  const phone = document.getElementById("inputPhone").value.trim();
  const address = document.getElementById("inputAddress").value.trim();
  const city = document.getElementById("inputCity").value.trim();
  const country = document.getElementById("inputCountry").value;
  const notes = document.getElementById("inputNotes").value.trim();
  const zip = document.getElementById("inputZip").value.trim();

  document.getElementById("confirm-email").textContent = email;
  document.getElementById("confirm-buyer").innerHTML = `
    <strong>${name}</strong><br />
    ${address}<br />
    ${zip} ${city}, ${country}<br />
    Phone: ${phone}${notes ? "<br />Notes: " + notes : ""}
  `;

  const tbody = document.getElementById("confirm-items");
  tbody.innerHTML = "";
  cart.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-end">${formatMoney(item.price)}</td>
      <td class="text-end">${formatMoney(item.price * item.quantity)}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("confirm-subtotal").textContent = formatMoney(
    totals.subtotal
  );
  document.getElementById("confirm-discount").textContent = formatMoney(
    totals.discount
  );
  document.getElementById("confirm-tax").textContent = formatMoney(totals.tax);
  document.getElementById("confirm-total").textContent = formatMoney(
    totals.total
  );

  const checkoutModalEl = document.getElementById("checkoutModal");
  const confirmModalEl = document.getElementById("confirmModal");

  const checkoutModal = bootstrap.Modal.getInstance(checkoutModalEl);
  const confirmModal = bootstrap.Modal.getOrCreateInstance(confirmModalEl);

  checkoutModal.hide();
  confirmModal.show();

  clearCart();
}

//INIT 
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  document.getElementById("btn-clear-cart").addEventListener("click", () => clearCart());

  document.getElementById("btn-checkout").addEventListener("click", () => {
    if (cart.length === 0) {
      showCartAlert("Your cart is empty.", "warning");
      return;
    }

    const cartModalEl = document.getElementById("cartModal");
    const checkoutModalEl = document.getElementById("checkoutModal");

    const cartModal = bootstrap.Modal.getInstance(cartModalEl);
    const checkoutModal = bootstrap.Modal.getOrCreateInstance(checkoutModalEl);

    cartModal.hide();
    checkoutModal.show();
  });

  document.getElementById("btn-back-to-cart").addEventListener("click", () => {
    const cartModalEl = document.getElementById("cartModal");
    const checkoutModalEl = document.getElementById("checkoutModal");

    const cartModal = bootstrap.Modal.getOrCreateInstance(cartModalEl);
    const checkoutModal = bootstrap.Modal.getInstance(checkoutModalEl);

    checkoutModal.hide();
    cartModal.show();
  });

  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", handleCheckoutSubmit);
});