require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const templateRoutes = require("./routes/templateRoutes");
const colorRoutes = require("./routes/colorRoutes");
const configurationRoutes = require("./routes/configurationRoutes");

const connectDB = require("./config/database");

const app = express();


// BASE DE DATOS

connectDB();


// MIDDLEWARES

app.use(cors());

app.use(
  express.json({
    limit: "20mb"
  })
);


// RUTA PRINCIPAL

app.get("/", (req, res) => {

  res.json({
    message: "Configurator API"
  });

});


// RUTAS API

app.use(
  "/api/templates",
  templateRoutes
);

app.use(
  "/api/colors",
  colorRoutes
);

app.use(
  "/api/configurations",
  configurationRoutes
);


// ARCHIVOS ESTÁTICOS

app.use(
  "/assets",
  express.static(
    path.join(__dirname, "public", "assets")
  )
);

app.use(
  "/previews",
  express.static(
    path.join(__dirname, "previews")
  )
);


// SERVIDOR LOCAL

if (require.main === module) {

  const PORT =
    process.env.PORT || 3000;

  app.listen(PORT, () => {

    console.log(
      `Configurator API en puerto ${PORT}`
    );

  });

}


// VERCEL

module.exports = app;