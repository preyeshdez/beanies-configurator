const productsGrid =
  document.getElementById(
    "productsGrid"
  );


updateCartCounter();

Object.values(PRODUCTS)
  .forEach(product => {

    const card =
      document.createElement("div");

    card.classList.add(
      "product-card"
    );

    card.dataset.slug =
      product.slug;

    card.dataset.name =
      product.name;

    card.dataset.price =
      product.price;

    card.innerHTML = `

      <img
        src="${product.preview}"
        alt="${product.name}"
      >

      <div class="product-info">

        <h2>
          ${product.name}
        </h2>

        <div class="product-price">

          $${product.price.toLocaleString("es-CL")}

        </div>

        <a
          href="product.html?model=${product.slug}"
          class="customize-button"
        >
          Personalizar
        </a>

      </div>

    `;

    productsGrid.appendChild(
      card
    );

  });

  function updateCartCounter() {

  const cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const totalItems =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const cartButton =
    document.getElementById(
      "cartButton"
    );

  if (cartButton) {

    cartButton.textContent =
      `Carrito (${totalItems})`;

  }

}