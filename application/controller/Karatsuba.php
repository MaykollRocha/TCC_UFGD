<?php 
require_once 'application/core/Controller.php';

class Karatsuba extends Controller
{
    public function index()
    {
        $this->render('karatsuba/index');
    }

    public function calculadora()
    {
        $this->render('karatsuba/calculadora');
    }
}