const cartItems =
  document.getElementById(
    "cartItems"
  );

const cartSummary =
  document.getElementById(
    "cartSummary"
  );

const cart =
  JSON.parse(
    localStorage.getItem("cart")
  ) || [];

if (cart.length === 0) {

  cartItems.innerHTML = `
    <tr>
      <td colspan="7">
        Tu carrito está vacío
      </td>
    </tr>
  `;

} else {

  let total = 0;

  cart.forEach((item, index) => {

    const product =
      PRODUCTS[
      item.productSlug
      ];

    const price =
      product.price;

    const subtotal =
      price * item.quantity;

    total += subtotal;

    const row =
      document.createElement("tr");

    row.innerHTML = `

      <td>

        <img
          class="cart-preview"
          src="http://localhost:3000${item.previewUrl}"
          alt="${item.productName}"
        >

      </td>

      <td>

        ${item.productName}

      </td>

      <td>

        ${item.size}

      </td>

      <td>

        ${item.quantity}

      </td>

      <td>

        $${price.toLocaleString("es-CL")}

      </td>

      <td>

        $${subtotal.toLocaleString("es-CL")}

      </td>

      <td>

        <button
          class="remove-button"
          data-index="${index}"
        >
          Eliminar
        </button>

      </td>

    `;

    cartItems.appendChild(
      row
    );

  });

  cartSummary.innerHTML = `

  <div class="cart-row">

    <span>Total:</span>

    <span>

      $${total.toLocaleString("es-CL")}

    </span>

  </div>

  <button id="checkoutButton">
    Continuar compra
  </button>

`;

  document
    .getElementById(
      "checkoutButton"
    )
    .addEventListener(
      "click",
      () => {

        window.location.href =
          "checkout.html";

      }
    );

}

document.addEventListener(
  "click",
  event => {

    if (
      event.target.classList.contains(
        "remove-button"
      )
    ) {

      const index =
        Number(
          event.target.dataset.index
        );

      cart.splice(
        index,
        1
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      location.reload();

    }

  }
);

