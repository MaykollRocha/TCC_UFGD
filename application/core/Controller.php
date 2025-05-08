<?php

class Controller
{
    protected function render($path, $vars = [])
    {
        // Deixa as variáveis acessíveis na view
        extract($vars);

        require_once 'application/view/_templates/header.php';
        require_once "application/view/{$path}.php";
        require_once 'application/view/_templates/footer.php';
    }
}
