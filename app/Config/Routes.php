<?php
use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->get('/', 'Home::index');
$routes->options('productos', 'ProductosControllers::options');
$routes->options('productos/(:num)', 'ProductosControllers::options');
$routes->get('productos', 'ProductosControllers::getAll');
$routes->get('productos/(:num)', 'ProductosControllers::getById/$1');
$routes->post('productos', 'ProductosControllers::create');
$routes->patch('productos/(:num)', 'ProductosControllers::update/$1');
$routes->delete('productos/(:num)', 'ProductosControllers::delete/$1');