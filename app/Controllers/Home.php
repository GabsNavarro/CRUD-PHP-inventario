<?php

namespace App\Controllers;

use Config\Database;

class Home extends BaseController
{
    public function index()
    {
        $db = \Config\Database::connect();

        try {
            $db->query("SELECT 1");

            echo "BD CONECTADA";
        } catch (\Throwable $e) {
            echo "ERROR BD: " . $e->getMessage();
        }
    }
}
