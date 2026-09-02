# Pompon Beanies Configurator

Prototipo de aplicación web para la **personalización visual de productos en un entorno ecommerce**. El sistema permite seleccionar distintos modelos de beanies, modificar los colores de sus zonas configurables y visualizar el resultado en tiempo real antes de incorporarlo a un carrito de compras.

El proyecto incorpora además un ecommerce de demostración que permite validar el flujo completo desde la personalización del producto hasta la generación y almacenamiento de una orden de compra.

## Arquitectura del proyecto

La aplicación se encuentra dividida en tres componentes principales:

* **Frontend:** HTML5, CSS3 y JavaScript.
* **Configurator API:** Node.js, Express y MongoDB Atlas.
* **Ecommerce API:** Node.js, Express y PostgreSQL mediante Neon.

Esta separación permite mantener independiente la lógica del configurador respecto del ecommerce, facilitando una futura integración con plataformas externas como WooCommerce.

### Estructura general

```text
Beanies/
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── shop.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   └── order.html
│
├── configurator-api/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── previews/
│   └── server.js
│
├── ecommerce-api/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── .env.example
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto se requiere:

* Node.js 22 o superior.
* npm.
* Un navegador web moderno.
* Visual Studio Code.
* Extensión **Live Server** para Visual Studio Code.
* Acceso a una base de datos MongoDB Atlas.
* Acceso a una base de datos PostgreSQL en Neon.

## Instalación

### 1. Obtener el proyecto

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

También es posible descargar el proyecto desde GitHub y descomprimirlo en una carpeta local.

Luego ingresar a la carpeta raíz del proyecto.

### 2. Instalar dependencias

Desde la carpeta raíz ejecutar:

```bash
npm install
```

Este comando instalará las dependencias definidas en `package.json`.

## Variables de entorno

Por seguridad, las credenciales de acceso a las bases de datos no se encuentran almacenadas en el repositorio.

El proyecto incluye archivos `.env.example` que indican las variables necesarias.

### Configurator API

Crear un archivo `.env` en la raíz del proyecto utilizando como referencia:

```text
.env.example
```

Configurar:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/configurator_db
```

### Ecommerce API

Crear:

```text
ecommerce-api/.env
```

utilizando como referencia:

```text
ecommerce-api/.env.example
```

Configurar:

```env
DATABASE_URL=postgresql://usuario:password@host/database?sslmode=require
```

Las credenciales reales no deben incorporarse al repositorio.

## Datos iniciales del configurador

El proyecto dispone de scripts para cargar los modelos y colores iniciales en MongoDB.

Desde la raíz del proyecto ejecutar:

```bash
npm run seed:colors
```

y posteriormente:

```bash
npm run seed:templates
```

Estos scripts registran los datos necesarios para utilizar el configurador.

> Los scripts de inicialización deben ejecutarse solamente cuando sea necesario poblar una base de datos nueva.

## Ejecución

### 1. Iniciar los servicios backend

Desde la carpeta raíz ejecutar:

```bash
npm run dev
```

El comando utiliza `concurrently` para iniciar simultáneamente los dos servicios:

| Servicio         | Puerto |
| ---------------- | -----: |
| Configurator API |   3000 |
| Ecommerce API    |   4000 |

El Configurator API administra los modelos, colores y configuraciones personalizadas.

El Ecommerce API administra la creación, almacenamiento y recuperación de las órdenes de compra.

### 2. Iniciar el frontend

Abrir el proyecto con Visual Studio Code y ejecutar mediante **Live Server** el archivo:

```text
frontend/shop.html
```

La dirección exacta dependerá de la configuración de Live Server. En la configuración utilizada durante el desarrollo se ejecuta mediante el puerto:

```text
5501
```

## Flujo de funcionamiento

1. El usuario ingresa al catálogo de productos.
2. Selecciona un modelo de beanie.
3. El Configurator API obtiene desde MongoDB la información correspondiente al modelo y los colores disponibles.
4. El usuario selecciona los colores de las diferentes zonas configurables.
5. Canvas API genera la representación visual del producto en tiempo real.
6. Al agregar el producto al carrito se genera una previsualización de la configuración.
7. La configuración es registrada en MongoDB y asociada a un identificador único.
8. El producto personalizado se incorpora al carrito almacenado localmente en el navegador.
9. El usuario revisa el carrito y completa sus datos en el checkout.
10. El Ecommerce API registra la orden y sus productos en PostgreSQL.
11. El sistema recupera la orden almacenada y presenta su detalle al usuario.

## Funcionalidades principales

* Catálogo dinámico de modelos.
* Configuración de colores por zonas.
* Previsualización en tiempo real mediante HTML Canvas.
* Conservación de textura durante la aplicación de colores.
* Generación de previews de las configuraciones.
* Identificación de configuraciones mediante hash.
* Prevención de configuraciones duplicadas.
* Selección de talla y cantidad.
* Carrito de compras mediante `localStorage`.
* Consolidación de productos con configuraciones idénticas.
* Cálculo automático de subtotales y total.
* Formulario de checkout.
* Persistencia de órdenes de compra.
* Recuperación y visualización del detalle de una orden.

## Tecnologías utilizadas

### Frontend

* HTML5.
* CSS3.
* JavaScript.
* Canvas API.
* LocalStorage API.

### Backend

* Node.js.
* Express.js.

### Bases de datos

* MongoDB Atlas.
* PostgreSQL mediante Neon.

### Librerías principales

* Mongoose.
* pg.
* dotenv.
* cors.
* concurrently.
* nodemon.

## Persistencia de datos

El proyecto utiliza dos tecnologías de base de datos con responsabilidades diferentes.

### MongoDB Atlas

MongoDB es utilizado por el módulo de configuración para almacenar:

* Modelos configurables.
* Colores disponibles.
* Configuraciones personalizadas.
* Identificador hash de cada configuración.
* Referencia a la previsualización generada.

Las imágenes de previsualización se generan en formato WebP y se almacenan como archivos en el servidor del configurador. MongoDB mantiene la referencia correspondiente mediante la URL de cada preview.

### PostgreSQL / Neon

PostgreSQL es utilizado por el módulo ecommerce para almacenar las órdenes de compra.

La información se distribuye principalmente entre:

* `orders`: información del comprador, total de la orden y fecha de creación.
* `order_items`: productos asociados a la orden, configuración, colores, talla, cantidad, precio unitario, subtotal y referencia a la previsualización.

De esta forma, cada orden conserva la información necesaria para reconstruir posteriormente el detalle de la compra realizada.

## Consideraciones del prototipo

El ecommerce implementado tiene como objetivo demostrar y validar técnicamente la integración del configurador dentro de un flujo de compra.

Los productos disponibles en la demostración se encuentran definidos en el frontend, mientras que el carrito utiliza almacenamiento local del navegador. La persistencia permanente se aplica a las configuraciones personalizadas y a las órdenes generadas.

La arquitectura mantiene separado el configurador del ecommerce para facilitar una futura integración con una plataforma de comercio electrónico externa.

## Proyección

La arquitectura desarrollada permite considerar futuras ampliaciones como:

* Integración con WooCommerce.
* Almacenamiento de previews en servicios de almacenamiento en la nube.
* Administración dinámica del catálogo de productos.
* Incorporación del configurador en tiendas ecommerce existentes.
* Despliegue de las APIs en servicios de hosting.
* Sustitución del ecommerce de demostración por una plataforma comercial real.

## Autor

**Pablo Reyes Hernández**

Proyecto desarrollado para la asignatura **Proyecto de Título - IACC**.

2026.
