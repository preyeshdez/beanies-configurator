const params =
    new URLSearchParams(
        window.location.search
    );

const orderId =
    params.get("id");

const orderNumber =
    document.getElementById(
        "orderNumber"
    );

const orderInfo =
    document.getElementById(
        "orderInfo"
    );

loadOrder();

async function loadOrder() {

    try {

        const response =
            await fetch(
                `http://localhost:4000/api/orders/${orderId}`
            );

        if (!response.ok) {

            throw new Error(
                "Orden no encontrada"
            );

        }

        const order =
            await response.json();

        orderNumber.textContent =
            `#${order.id}`;

        renderOrder(order);

    } catch (error) {

        console.error(error);

        orderInfo.innerHTML = `

      <p>

        No fue posible cargar
        la orden.

      </p>

    `;

    }

}

function renderOrder(order) {

    let itemsHtml = "";

    order.items.forEach(item => {

        const colors =
            item.colors || {};

        const colorsHtml =
            Object.entries(colors)
                .map(([zone, color]) => `

                <div>

                    <strong>

                    ${color.zoneLabel || zone}

                    </strong>:

                    ${color.name}

                </div>

                `)
                .join("");

        itemsHtml += `

      <div class="checkout-item">

        <img
          class="checkout-preview"
          src="http://localhost:3000${item.preview_url}"
          alt="${item.product_name}"
        >

        <div>

          <strong>

            ${item.product_name}

          </strong>

          <br>

          Talla:
          ${item.size}

          <br>

          Cantidad:
          ${item.quantity}

          <br>

          Subtotal:

          $${Number(
            item.subtotal
        ).toLocaleString(
            "es-CL"
        )}

          <br><br>

          <strong>
            Configuración
          </strong>

          ${colorsHtml}

        </div>

      </div>

    `;

    });

    orderInfo.innerHTML = `

    <h3>

      Datos del comprador

    </h3>

    <p>

      ${order.customer_name}

      <br>

      ${order.customer_email}

      <br>

      ${order.customer_phone}

      <br>

      ${order.customer_address}

    </p>

    <h3>

      Productos

    </h3>

    ${itemsHtml}

    <div class="checkout-total">

      Total:

      $${Number(
        order.total
    ).toLocaleString(
        "es-CL"
    )}

    </div>

  `;

}