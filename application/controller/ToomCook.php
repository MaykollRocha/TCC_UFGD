<?php
require_once 'application/core/Controller.php';

class ToomCook extends Controller
{
    public function index()
    {
        $this->render('toomcook/index');
    }
}
