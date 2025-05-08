<?php

require_once 'application/core/Controller.php';

class Toomcook3 extends Controller
{
    public function index()
    {
        $this->render('toomcook3/index');
    }
}