<?php

require_once 'application/core/Controller.php';

class Home extends Controller
{
    public function index()
    {
        $this->render('home/index');
    }
}