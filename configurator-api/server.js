require("dotenv").config();

const express = require("express");
const cors = require("cors");
const templateRoutes = require("./routes/templateRoutes");
const colorRoutes = require("./routes/colorRoutes");
const connectDB = require("./config/database");
const path = require("path");

const configurationRoutes =
  require(
    "./routes/configurationRoutes"
  );

const app = express();

connectDB();

app.use(cors());

app.use(
  express.json({
    limit: "20mb"
  })
);

app.get("/", (req, res) => {

  res.json({
    message: "Configurator API"
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Configurator API en puerto ${PORT}`
  );

});

app.use(
  "/api/templates",
  templateRoutes
);

app.use(
  "/api/colors",
  colorRoutes
);

app.use(
  "/assets",
  express.static(
    path.join(__dirname, "assets")
  )
);

app.use(
  "/previews",
  express.static(
    path.join(
      __dirname,
      "previews"
    )
  )
);

app.use(
  "/api/configurations",
  configurationRoutes
);