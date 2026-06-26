<?php
namespace App\Controllers;
use App\Services\ProductosServices;

class ProductosControllers extends BaseController
{
    private ProductosServices $services;
    /**
     * Constructor de la clase
     */
    public function __construct(){
        $this->services= new ProductosServices();
    }
    /**
     * Método para manejar las solicitudes OPTIONS
     */
    public function options(){
        return $this->response->setStatusCode(200);
    }
    public function getAll()
    {
        try {
            $data = $this->services->getAll();
            return $this->response->setJSON($data);
        } catch (\Throwable $error) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'error' => $error->getMessage()
                ]);
        }
    }
    /**
     * Método para obtener un producto por su ID
     *
     * @param int $id El ID del producto a obtener
     * @return \CodeIgniter\HTTP\Response La respuesta HTTP con el producto o un mensaje de error
     */
    public function getbyId(int $id)
    {
        try {
            $data = $this->services->getById($id);
            return $this->response->setJSON($data);
        } catch (\Throwable $error) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'error' => $error->getMessage()
                ]);
        }
    }
    /**
     * Método para crear un nuevo producto
     *
     * @return \CodeIgniter\HTTP\Response La respuesta HTTP con el producto creado o un mensaje de error
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);

            if (!$data) {
                $data = $this->request->getPost();
            }

            if (!isset($data['nombre'], $data['marca'], $data['precio_costo'], $data['precio_venta'], $data['stock'])) {
                return $this->response->setStatusCode(400)
                    ->setJSON(['error' => 'Faltan datos requeridos']);
            }
            $data['nombre'] = strtolower(trim($data['nombre']));
            $data['marca']  = strtolower(trim($data['marca']));

            if (!is_numeric($data['precio_costo']) || !is_numeric($data['precio_venta']) || !is_numeric($data['stock'])) {
                return $this->response->setStatusCode(400)
                    ->setJSON(['error' => 'Campos numéricos inválidos']);
            }
            if ($data['precio_costo'] < 0 || $data['precio_venta'] < 0 || $data['stock'] < 0) {
                return $this->response->setStatusCode(400)
                    ->setJSON(['error' => 'No se permiten valores negativos']);
            }

            if ($data['precio_costo'] > $data['precio_venta']) {
                return $this->response->setStatusCode(400)
                    ->setJSON(['error' => 'Costo no puede ser mayor que venta']);
            }
            if ($this->services->noRepeat($data['nombre'], $data['marca'])) {
                return $this->response->setStatusCode(400)
                    ->setJSON(['error' => 'El producto ya existe']);
            }

            $result = $this->services->create($data);

            return $this->response->setJSON($result);

        } catch (\Throwable $error) {
            return $this->response->setStatusCode(500)
                ->setJSON(['error' => $error->getMessage()]);
        }
    }
    /**
     * Método para actualizar un producto existente
     *
     * @param int $id El ID del producto a actualizar
     * @return \CodeIgniter\HTTP\Response La respuesta HTTP con el producto actualizado o un mensaje de error
     */
    public function update(int $id)
    {
        try {

            $data = $this->request->getJSON(true);

            if (!$data) {
                $data = $this->request->getPost();
            }

            if (empty($data)) {
                return $this->response->setStatusCode(400)
                    ->setJSON([
                        'error' => 'No hay datos para actualizar'
                    ]);
            }

            $result = $this->services->update($id, $data);

            if ($result === false) {
                return $this->response->setStatusCode(404)
                    ->setJSON([
                        'error' => 'Producto no encontrado'
                    ]);
            }

            if (isset($result['error'])) {
                return $this->response->setStatusCode(400)
                    ->setJSON($result);
            }

            return $this->response->setJSON([
                'message' => 'Producto actualizado correctamente'
            ]);

        } catch (\Throwable $error) {

            return $this->response->setStatusCode(500)
                ->setJSON([
                    'error' => $error->getMessage()
                ]);
        }
    }
    /**
     * Método para eliminar un producto
     *
     * @param int $id El ID del producto a eliminar
     * @return \CodeIgniter\HTTP\Response La respuesta HTTP con el resultado de la operación o un mensaje de error
     */
    public function delete(int $id)
    {
        try {
            $result = $this->services->delete($id);
            return $this->response->setJSON($result);
        } catch (\Throwable $error) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'error' => $error->getMessage()
                ]);
        }
    }
}
