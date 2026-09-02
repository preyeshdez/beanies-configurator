require("dotenv").config();

const connectDB =
  require("../config/database");

const Color =
  require("../models/Color");

async function seedColors() {

  try {

    await connectDB();

    await Color.deleteMany({});

    await Color.insertMany([

      {
        name: "Base Gris",
        hex: "none"
      },

      {
        name: "Blanco",
        hex: "#ffffff"
      },

      {
        name: "Negro",
        hex: "#363636"
      },

      {
        name: "Rojo",
        hex: "#ff0000"
      },

      {
        name: "Azul",
        hex: "#0000ff"
      },

      {
        name: "Verde",
        hex: "#00aa00"
      },

      {
        name: "Amarillo",
        hex: "#fbff00"
      },

      {
        name: "Naranjo",
        hex: "#ff7a00"
      },

      {
        name: "Morado",
        hex: "#7b2cff"
      },

      {
        name: "Turquesa",
        hex: "#00cfc8"
      }

    ]);

    console.log(
      "Colores cargados correctamente"
    );

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

}

seedColors();