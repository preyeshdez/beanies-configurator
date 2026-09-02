// =====================================
// ELEMENTOS
// =====================================

const checkoutItems =
  document.getElementById(
    "checkoutItems"
  );

const checkoutTotal =
  document.getElementById(
    "checkoutTotal"
  );

const checkoutForm =
  document.getElementById(
    "checkoutForm"
  );

const customerName =
  document.getElementById(
    "customerName"
  );

const customerEmail =
  document.getElementById(
    "customerEmail"
  );

const customerPhone =
  document.getElementById(
    "customerPhone"
  );

const customerAddress =
  document.getElementById(
    "customerAddress"
  );


// =====================================
// CARRITO
// =====================================

const cart =
  JSON.parse(
    localStorage.getItem("cart")
  ) || [];


// =====================================
// CARRITO VACIO
// =====================================

if (cart.length === 0) {

  window.location.href =
    "cart.html";

}


// =====================================
// RESUMEN
// =====================================

let total = 0;

cart.forEach(item => {

  const product =
    PRODUCTS[
    item.productSlug
    ];

  if (!product) {

    return;

  }

  const subtotal =
    product.price *
    item.quantity;

  total += subtotal;


  const div =
    document.createElement("div");

  div.classList.add(
    "checkout-item"
  );

  div.innerHTML = `

    <img
      class="checkout-preview"
      src="http://localhost:3000${item.previewUrl}"
      alt="${item.productName}"
    >

    <div>

      <strong>

        ${item.productName}

      </strong>

      <br>

      Talla:
      ${item.size}

      <br>

      Cantidad:
      ${item.quantity}

      <br>

      Subtotal:

      $${subtotal.toLocaleString(
    "es-CL"
  )}

    </div>

  `;

  checkoutItems.appendChild(
    div
  );

});


// =====================================
// TOTAL
// =====================================

checkoutTotal.innerHTML = `

  <div class="checkout-total">

    Total:

    $${total.toLocaleString(
  "es-CL"
)}

  </div>

`;


// =====================================
// FORMULARIO
// =====================================

checkoutForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    try {

      const customer = {

        name:
          customerName.value,

        email:
          customerEmail.value,

        phone:
          customerPhone.value,

        address:
          customerAddress.value

      };


      // =====================
      // ITEMS ORDEN
      // =====================

      const items =
        cart.map(item => {

          const product =
            PRODUCTS[
            item.productSlug
            ];

          return {

            productSlug:
              item.productSlug,

            productName:
              item.productName,

            previewUrl:
              item.previewUrl,

            configurationId:
              item.configurationId,

            colors:
              item.colors,

            size:
              item.size,

            quantity:
              item.quantity,

            unitPrice:
              product.price,

            subtotal:
              product.price *
              item.quantity

          };

        });

      // =====================
      // ENVIAR ORDEN
      // =====================

      const response =
        await fetch(
          "http://localhost:4000/api/orders",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              customer,

              items,

              total

            })

          }
        );

      const order =
        await response.json();


      // =====================
      // LIMPIAR CARRITO
      // =====================

      localStorage.removeItem(
        "cart"
      );

      localStorage.removeItem(
        "checkoutCustomer"
      );


      // =====================
      // IR A SUCCESS
      // =====================

      window.location.href =
        `order.html?id=${order.id}`;

    } catch (error) {

      console.error(error);

      alert(
        "Error creando la orden"
      );

    }

  }
);