<?php
namespace App\Services;
use App\Repositories\ProductosRepository;
class ProductosServices {
    private ProductosRepository $repository;
    /**
     * Constructor de la clase
     */
    public function __construct() {
        $this->repository = new ProductosRepository();

    }
    /**
     * Verifica si un producto con el mismo nombre y marca ya existe en la base de datos.
     *
     * @param string $nombre El nombre del producto a verificar.
     * @param string $marca La marca del producto a verificar.
     * @return bool Devuelve true si el producto ya existe, false en caso contrario.
     */
    public function noRepeat(string $nombre, string $marca): bool
    {
        try {
            return $this->repository->existsDuplicate($nombre, $marca, 0);
        } catch (\Throwable $error) {

            throw new \RuntimeException(
                "Error al verificar duplicados",
                0,
                $error
            );
        }
    }
    /**
     * Obtiene todos los productos de la base de datos.
     *
     * @return array|false Devuelve un array de productos o false en caso de error.
     */
    public function getAll() {
        try {
            return $this->repository->getAll();
        }catch (\throwable $error) {
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
      * @param int $id El ID del producto a obtener.
      * @return object|false Devuelve el producto o false en caso de error.
      */
    public function getById(int $id) {
        try{
            return $this->repository->getById($id);
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
     * @param array $data Los datos del producto a crear.
     * @return int|false Devuelve el ID del nuevo producto o false en caso de error.
     */
    public function create(array $data) {
        try{
            return $this->repository->create($data);
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
     * @param int $id El ID del producto a actualizar.
     * @param array $data Los nuevos datos del producto.
     * @return bool Devuelve true si el producto se actualizó correctamente, false en caso contrario.
     */
    public function update(int $id, array $data)
    {
        try {
            $current = $this->repository->getById($id);
        
            if (empty($current)) {
                return false;
            }
            $newData = [

                'nombre' => $data['nombre'] ?? $current->nombre,

                'marca' => $data['marca'] ?? $current->marca,

                'precio_costo' =>
                    $data['precio_costo'] ?? $current->precio_costo,

                'precio_venta' =>
                    $data['precio_venta'] ?? $current->precio_venta,

                'stock' =>
                    $data['stock'] ?? $current->stock
            ];
            $newData['nombre'] = strtolower(
                trim($newData['nombre'])
            );

            $newData['marca'] = strtolower(
                trim($newData['marca'])
            );

            if (
                !is_numeric($newData['precio_costo']) ||
                !is_numeric($newData['precio_venta']) ||
                !is_numeric($newData['stock'])
            ) {
                return [
                    'error' => 'Campos numéricos inválidos'
                ];
            }
            if (
                $newData['precio_costo'] < 0 ||
                $newData['precio_venta'] < 0 ||
                $newData['stock'] < 0
            ) {
                return [
                    'error' => 'No se permiten valores negativos'
                ];
            }
            if (
                $newData['precio_costo'] >
                $newData['precio_venta']
            ) {
                return [
                    'error' =>
                    'El costo no puede ser mayor al precio de venta'
                ];
            }
            if (
                $this->repository->existsDuplicate(
                    $newData['nombre'],
                    $newData['marca'],
                    $id
                )
            ) {

                return [
                    'error' =>
                    'El producto ya existe'
                ];
            }
            return $this->repository->update($id, $newData);
        } catch (\Throwable $error) {
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
     * @param int $id El ID del producto a eliminar.
     * @return bool Devuelve true si el producto se eliminó correctamente, false en caso contrario.
     */
     public function delete(int $id) {
        try{
            return $this->repository->delete($id);
        }catch(\throwable $error){
            throw new \RuntimeException(
                "Error al eliminar el registro",
                0,
                $error
            );
        }
     }
 }