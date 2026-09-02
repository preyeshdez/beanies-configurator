const pool =
  require("../config/database");

exports.createOrder =
  async (req, res) => {

    const client =
      await pool.connect();

    try {

      const {
        customer,
        items,
        total
      } = req.body;

      await client.query("BEGIN");

      const orderResult =
        await client.query(

          `
          INSERT INTO orders (

            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            total

          )

          VALUES ($1,$2,$3,$4,$5)

          RETURNING id
          `,

          [
            customer.name,
            customer.email,
            customer.phone,
            customer.address,
            total
          ]

        );

      const orderId =
        orderResult.rows[0].id;

      for (const item of items) {

        await client.query(

          `
          INSERT INTO order_items (

            order_id,
            product_slug,
            product_name,
            preview_url,
            configuration_id,
            colors,
            size,
            quantity,
            unit_price,
            subtotal

          )

          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
          `,

          [
            orderId,
            item.productSlug,
            item.productName,
            item.previewUrl,
            item.configurationId,
            JSON.stringify(item.colors),
            item.size,
            item.quantity,
            item.unitPrice,
            item.subtotal
          ]

        );

      }

      await client.query("COMMIT");

      res.status(201).json({

        id: orderId,

        success: true

      });

    } catch (error) {

      await client.query(
        "ROLLBACK"
      );

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Error creando orden"

      });

    } finally {

      client.release();

    }

  };

exports.getOrderById =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const orderResult =
        await pool.query(

          `
          SELECT *
          FROM orders
          WHERE id = $1
          `,
          [id]

        );

      if (
        orderResult.rows.length === 0
      ) {

        return res.status(404).json({

          message:
            "Orden no encontrada"

        });

      }

      const itemsResult =
        await pool.query(

          `
          SELECT *
          FROM order_items
          WHERE order_id = $1
          `,
          [id]

        );

      res.json({

        ...orderResult.rows[0],

        items:
          itemsResult.rows

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Error obteniendo orden"

      });

    }

  };