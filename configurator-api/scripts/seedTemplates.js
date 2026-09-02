require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/database");

const Template = require("../models/template");

async function seedTemplates() {

  try {

    await connectDB();

    await Template.deleteMany({});

    await Template.insertMany([

      // BASIC

      {
        name: "Basic",
        slug: "basic",
        category: "beanie",

        baseImage:
          "/assets/models/basic/base.png",

        zones: [
          {
            id: "color",
            label: "Color",
            mask:
              "/assets/models/basic/mask.png"
          }
        ]
      },

      // ORIGINAL

      {
        name: "Original",
        slug: "original",
        category: "beanie",

        baseImage:
          "/assets/models/original/base.png",

        zones: [

          {
            id: "pompon",
            label: "Pompon",
            mask:
              "/assets/models/original/mask-pompon.png"
          },

          {
            id: "color",
            label: "Color",
            mask:
              "/assets/models/original/mask-bottom.png"
          }

        ]
      },

      // MITIMOTA

      {
        name: "Mitimota",
        slug: "mitimota",
        category: "beanie",

        baseImage:
          "/assets/models/mitimota/base.png",

        zones: [

          {
            id: "top",
            label: "Superior",
            mask:
              "/assets/models/mitimota/mask-top.png"
          },

          {
            id: "bottom",
            label: "Inferior",
            mask:
              "/assets/models/mitimota/mask-bottom.png"
          }

        ]
      },

      // DOBLEZ

      {
        name: "Doblez",
        slug: "doblez",
        category: "beanie",

        baseImage:
          "/assets/models/doblez/base.png",

        zones: [

          {
            id: "top",
            label: "Superior",
            mask:
              "/assets/models/doblez/mask-top.png"
          },

          {
            id: "bottom",
            label: "Inferior",
            mask:
              "/assets/models/doblez/mask-bottom.png"
          }

        ]
      },

      // RAYADO

      {
        name: "Rayado",
        slug: "rayado",
        category: "beanie",

        baseImage:
          "/assets/models/rayado/base.png",

        zones: [

          {
            id: "top",
            label: "Superior",
            mask:
              "/assets/models/rayado/mask-top.png"
          },

          {
            id: "mid",
            label: "Raya",
            mask:
              "/assets/models/rayado/mask-mid.png"
          },

          {
            id: "bottom",
            label: "Inferior",
            mask:
              "/assets/models/rayado/mask-bottom.png"
          }

        ]
      },

      // TRIPLETE

      {
        name: "Triplete",
        slug: "triplete",
        category: "beanie",

        baseImage:
          "/assets/models/triplete/base.png",

        zones: [

          {
            id: "top",
            label: "Superior",
            mask:
              "/assets/models/triplete/mask-top.png"
          },

          {
            id: "mid",
            label: "Medio",
            mask:
              "/assets/models/triplete/mask-mid.png"
          },

          {
            id: "bottom",
            label: "Inferior",
            mask:
              "/assets/models/triplete/mask-bottom.png"
          }

        ]
      }

    ]);

    console.log(
      "Templates cargados correctamente"
    );

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

}

seedTemplates();