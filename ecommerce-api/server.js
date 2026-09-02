require("dotenv").config({
    path: __dirname + "/.env"
});

const express = require("express");
const cors = require("cors");

const pool = require("./config/database");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


// MIDDLEWARES

app.use(cors());

app.use(express.json());


// RUTAS API

app.use(
    "/api/orders",
    orderRoutes
);


// RUTA PRINCIPAL / PRUEBA DE POSTGRESQL

app.get(
    "/",
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    "SELECT NOW()"
                );

            res.json({

                ok: true,

                time:
                    result.rows[0]

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                ok: false

            });

        }

    }
);


// SERVIDOR LOCAL

if (require.main === module) {

    const PORT =
        process.env.PORT || 4000;

    app.listen(
        PORT,
        () => {

            console.log(
                `Ecommerce API en puerto ${PORT}`
            );

        }
    );

}


// VERCEL

module.exports = app;