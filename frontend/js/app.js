// =====================================
// CANVAS
// =====================================

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");


// =====================================
// ELEMENTOS HTML
// =====================================

const controls =
  document.getElementById("controls");

const sizeSelect =
  document.getElementById(
    "sizeSelect"
  );

const quantityInput =
  document.getElementById(
    "quantityInput"
  );

const addToCartButton =
  document.getElementById(
    "addToCartButton"
  );

const productTitle =
  document.getElementById("productTitle");


// =====================================
// MODELO DESDE URL
// =====================================

const params =
  new URLSearchParams(
    window.location.search
  );

const modelSlug =
  params.get("model") || "basic";

let currentModel = null;

// =====================================
// ESTADO
// =====================================

let colorState = {};
let availableColors = [];


// =====================================
// IMÁGENES
// =====================================

const images = {

  base: null,

  masks: {}

};

async function loadColors() {

  try {

    const response = await fetch(
      "http://localhost:3000/api/colors"
    );

    availableColors =
      await response.json();

  } catch (error) {

    console.error(
      "Error cargando colores",
      error
    );

  }

}

async function loadTemplate(slug) {

  try {

    const response = await fetch(
      `http://localhost:3000/api/templates/${slug}`
    );

    if (!response.ok) {

      throw new Error(
        "Template no encontrado"
      );

    }

    return await response.json();

  } catch (error) {

    console.error(error);

    return null;

  }

}

// =====================================
// INIT
// =====================================

start();

async function start() {

  await loadColors();

  currentModel =
    await loadTemplate(modelSlug);

  if (!currentModel) {

    alert(
      "No se pudo cargar el modelo"
    );

    return;
  }

  await init();

}

// =====================================
// INICIALIZAR MODELO
// =====================================

async function init() {

  // =====================================
  // TITULO PRODUCTO
  // =====================================

  if (productTitle) {

    productTitle.textContent =
      currentModel.name;

  }


  // =====================================
  // LIMPIAR CONTROLES
  // =====================================

  controls.innerHTML = "";


  // =====================================
  // RESET ESTADO
  // =====================================

  colorState = {};


  // =====================================
  // RESET IMAGENES
  // =====================================

  images.base = null;

  images.masks = {};


  // =====================================
  // CREAR CONTROLES
  // =====================================

  currentModel.zones.forEach(zone => {

    // estado inicial
    colorState[zone.id] = {

      zoneLabel: zone.label,

      value: "none",

      label: "Base sin color"

    };


    const wrapper =
      document.createElement("div");

    wrapper.classList.add("control-group");


    const label =
      document.createElement("label");

    label.textContent = zone.label;


    const select =
      document.createElement("select");


    // =====================================
    // OPCIONES COLOR
    // =====================================

    select.innerHTML = "";

    availableColors.forEach(color => {

      const option =
        document.createElement("option");

      option.value = color.hex;

      option.textContent = color.name;

      select.appendChild(option);

    });


    // =====================================
    // CAMBIO COLOR
    // =====================================

    select.addEventListener("change", e => {

      colorState[zone.id] = {

        zoneLabel: zone.label,

        value: e.target.value,

        label:
          e.target.options[
            e.target.selectedIndex
          ].text

      };

      render();

    });


    wrapper.appendChild(label);

    wrapper.appendChild(select);

    controls.appendChild(wrapper);

  });


  // =====================================
  // CARGAR BASE
  // =====================================

  images.base = new Image();

  images.base.crossOrigin = "anonymous";

  images.base.src =
    `http://localhost:3000${currentModel.baseImage}`;


  // =====================================
  // CARGAR MASKS
  // =====================================

  currentModel.zones.forEach(zone => {

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.src =
      `http://localhost:3000${zone.mask}`;

    images.masks[zone.id] = img;

  });


  // =====================================
  // ESPERAR CARGA
  // =====================================

  const promises = [

    load(images.base)

  ];

  Object.values(images.masks).forEach(img => {

    promises.push(load(img));

  });

  await Promise.all(promises);


  // =====================================
  // AJUSTAR CANVAS
  // =====================================

  canvas.width = images.base.width;

  canvas.height = images.base.height;


  // =====================================
  // RENDER INICIAL
  // =====================================

  render();

}


// =====================================
// HELPER CARGA
// =====================================

function load(img) {

  return new Promise(resolve => {

    img.onload = resolve;

  });

}


// =====================================
// RENDER
// =====================================

function render() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // =====================================
  // BASE
  // =====================================

  ctx.drawImage(
    images.base,
    0,
    0
  );


  // =====================================
  // ZONAS
  // =====================================

  currentModel.zones.forEach(zone => {

    const color =
      colorState[zone.id];


    if (color.value !== "none") {

      applyColor(
        images.masks[zone.id],
        color.value
      );

    }

  });

}


// =====================================
// APLICAR COLOR
// =====================================

function applyColor(mask, color) {

  // =====================================
  // BLANCO
  // =====================================

  if (color === "#ffffff") {

    ctx.globalCompositeOperation =
      "screen";

    ctx.globalAlpha = 1;

    ctx.filter =
      "brightness(5) contrast(0.5)";

    ctx.drawImage(mask, 0, 0);

    ctx.filter = "none";

    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation =
      "source-over";

    return;
  }


  // =====================================
  // COLORES NORMALES
  // =====================================

  const temp =
    document.createElement("canvas");

  const tctx =
    temp.getContext("2d");

  temp.width = canvas.width;

  temp.height = canvas.height;


  // textura
  tctx.drawImage(mask, 0, 0);


  // usar alpha mask
  tctx.globalCompositeOperation =
    "source-in";


  // color
  tctx.fillStyle = color;

  tctx.fillRect(
    0,
    0,
    temp.width,
    temp.height
  );


  // dibujar color
  ctx.drawImage(temp, 0, 0);


  // reaplicar textura
  ctx.globalCompositeOperation =
    "multiply";

  ctx.globalAlpha = 1;

  ctx.drawImage(mask, 0, 0);


  // reset
  ctx.globalAlpha = 1;

  ctx.globalCompositeOperation =
    "source-over";

}

function getColorValues() {

  const result = {};

  Object.keys(colorState).forEach(zoneId => {

    result[zoneId] = {

      zoneLabel:
        colorState[zoneId].zoneLabel,

      name:
        colorState[zoneId].label,

      hex:
        colorState[zoneId].value

    };

  });

  return result;

}

// =====================================
// BOTON COMPRAR
// =====================================

addToCartButton.addEventListener(
  "click",
  async () => {

    try {

      const previewImage =
        canvas.toDataURL("image/webp");

      const response =
        await fetch(
          "http://localhost:3000/api/configurations",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              templateSlug:
                currentModel.slug,

              colors:
                getColorValues(),

              previewImage

            })

          }
        );

      const configuration =
        await response.json();


      // =====================
      // CARRITO ACTUAL
      // =====================

      const cart =
        JSON.parse(
          localStorage.getItem(
            "cart"
          )
        ) || [];


      // =====================
      // NUEVO ITEM
      // =====================

      const product =
        PRODUCTS[
        currentModel.slug
        ];

      const cartItem = {

        productSlug:
          currentModel.slug,

        productName:
          currentModel.name,

        colors:
          getColorValues(),

        price:
          product.price,

        configurationId:
          configuration._id,

        previewUrl:
          configuration.previewUrl,

        size:
          sizeSelect.value,

        quantity:
          Number(
            quantityInput.value
          )

      };


      // =====================
      // AGREGAR
      // =====================

      const existingItem =
        cart.find(item =>

          item.productSlug ===
          cartItem.productSlug

          &&

          item.configurationId ===
          cartItem.configurationId

          &&

          item.size ===
          cartItem.size

        );

      if (existingItem) {

        existingItem.quantity +=
          cartItem.quantity;

      } else {

        cart.push(cartItem);

      }

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      // =====================
      // IR AL CARRITO
      // =====================

      window.location.href =
        "cart.html";

    } catch (error) {

      console.error(error);

    }

  }
);