<?php
namespace App\Repositories;
use Config\Database;
class ProductosRepository {

    /**
     * Obtiene todos los productos de la base de datos.
     *
     * @return array|false Devuelve un array de productos o false en caso de error.
     */
    public function getAll() {
        try {
            $db = Database::connect();
            $query = $db->query("SELECT * FROM productos");
            return $query->getResult();
        } catch (\Throwable $error) {
            throw new \RuntimeException(
                "Error al obtener todos los registros",
                0,
                $error
            );
        }
    }

     /**
      * Obtiene un producto por su ID.
      *
      * @param int $id
      * @return object|false
      */
    public function getById(int $id) {
         try{
            $db= Database::connect();
            $query= $db->query("SELECT*FROM productos WHERE id=?", [$id]);
            return $query-> getRow();
         }catch(\throwable $error){
            throw new \RuntimeException(
                "Error al obtener el registro",
                0,
                $error
            );
         }
     }

     /**
      * Crea un nuevo producto en la base de datos.
      *
      * @param array $data
      * @return int|false Devuelve el ID del nuevo producto o false en caso de error.
      */
    public function create(array $data) {
         try{
            $db= Database::connect();
            $query= $db->query("INSERT INTO productos ( nombre, marca, precio_costo, precio_venta, stock) VALUES (?, ?, ?, ?, ?)", [$data['nombre'], $data['marca'], $data['precio_costo'], $data['precio_venta'], $data['stock']]);
            return $db->insertID();
         }catch(\throwable $error){
            throw new \RuntimeException(
                "Error al crear el registro",
                0,
                $error
            );
         }
     }

     /**
      * Actualiza un producto existente en la base de datos.
      *
      * @param int $id
      * @param array $data
      * @return bool Devuelve true si la actualización fue exitosa, false en caso de error.
      */
    public function update(int $id, array $data) {
        try {
            $db = Database::connect();
            $db->query(
                "UPDATE productos SET 
                nombre=?,
                marca=?,
                precio_costo=?,
                precio_venta=?,
                stock=?
                WHERE id=?",
                [
                    $data['nombre'],
                    $data['marca'],
                    $data['precio_costo'],
                    $data['precio_venta'],
                    $data['stock'],
                    $id
                ]
            );
            return true;
        } catch(\Throwable $error){

            throw new \RuntimeException(
                "Error al actualizar el registro",
                0,
                $error
            );
        }
    }

     /**
      * Elimina un producto de la base de datos.
      *
      * @param int $id
      * @return bool Devuelve true si la eliminación fue exitosa, false en caso de error.
      */
     public function delete(int $id) {
         try{
            $db= Database::connect();
            $query= $db->query("DELETE FROM productos WHERE id=?", [$id]);
            return true;
         }catch(\throwable $error){
            throw new \RuntimeException(
                "Error al eliminar el registro",
                0,
                $error
            );
         }
     }

     /**
      * Verifica si un producto ya existe en la base de datos.
      *
      * @param string $nombre
      * @param string $marca
      * @return bool
      */
    public function noRepeat(string $nombre, string $marca): bool
    {
        try {
            $db = Database::connect();

            $query = $db->query(
                "SELECT 1 
                FROM productos 
                WHERE nombre = ? AND marca = ? 
                LIMIT 1",
                [$nombre, $marca]
            );

            return $query->getRow() !== null;

        } catch (\Throwable $error) {
            throw new \RuntimeException(
                "Error al verificar duplicados",
                0,
                $error
            );
        }
    }

    /**
      * Verifica si un producto duplicado existe en la base de datos.
      *
      * @param string $nombre
      * @param string $marca
      * @param int $id
      * @return bool
      */
    public function existsDuplicate(string $nombre,string $marca,int $id): bool {
        try {
            $db = Database::connect();
            $query = $db->query(
                "SELECT 1 
                FROM productos
                WHERE nombre=?
                AND marca=?
                AND id != ?
                LIMIT 1",

                [
                    $nombre,
                    $marca,
                    $id
                ]
            );
            return $query->getRow() !== null;
        }catch (\Throwable $error) {
            throw new \RuntimeException(
                "Error al verificar duplicados",
                0,
                $error
            );
        }
    }
}