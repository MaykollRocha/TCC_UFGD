<?php 
require_once 'application/core/Controller.php';

class KaratsubaCaminhoCalculadora extends Controller
{
    public function index()
    {
        $this->render('karatsuba/calculadora');
    }
}