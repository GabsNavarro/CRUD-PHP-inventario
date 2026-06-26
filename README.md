# CRUD-PHP-inventario
PHP CODEIGNITER

# Pasos a seguir:
Todos estos pasos se realizan en la terminal Bash, en caso de no tenerlo se debe instalar el Git bash en el siguiente link:
https://git-scm.com/install/

## Front
1- npm i
2- en caso de ser necesario -> npm audit fix --force
### Correr el proyecto:
Para correrlo se debe ejecutar el siguiente comando:
- npm run dev

## Backend
1- composer install
### Correr el proyecto:
Para correrlo se debe ejecutar el siguiente comando:
- php spark serve

## BD
En este caso se utilizo MySQL para realizar la bd, se puede hacer en cualquier otra bd que admita SQL.
EL archivo que contiene la BD esta ubicado en el Backend app\Database\productos.sql, solamente se importa y listo, o si es mas comodo solamente se copea y pega en un query lo siguiente:

CREATE TABLE `productos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `marca` VARCHAR(100) NOT NULL,
  `precio_costo` DECIMAL(10,2) NOT NULL,
  `precio_venta` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
