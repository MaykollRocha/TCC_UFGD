<?php

if (php_sapi_name() === 'cli') {
    // Linha de comando
    if (isset($argv[1]) && $argv[1] === 'make') {
        require_once 'ControllerCreator.php';

        if (isset($argv[2], $argv[3])) {
            $folder = $argv[2];
            $name = $argv[3];

            $creator = new ControllerCreator($folder, $name);
            $creator->createStructure();
        } else {
            echo "Uso correto: php index.php make <pasta> <Nome>\n";
        }
        exit;
    } else {
        echo "Comando não reconhecido.\n";
        exit;
    }
}

// Web normal
// Pega a URL da requisição
$request = $_SERVER['REQUEST_URI'];
$request = parse_url($request, PHP_URL_PATH);

// Remove barra inicial e final
$request = trim($request, '/');

// Se vazio, assume 'home'
$route = $request === '' ? 'home' : $request;

// Caminho completo para o controller
$controllerPath = 'application/controller/' . ucfirst($route) . '.php';

// Verifica se o controller existe
if (file_exists($controllerPath)) {
    require_once $controllerPath;

    // Cria a instância do controller
    $controllerName = ucfirst($route);
    $controller = new $controllerName();

    // Chama o método index() por padrão
    if (method_exists($controller, 'index')) {
        $controller->index();
    } else {
        echo "Método index() não encontrado no controller $controllerName.";
    }
} else {
    http_response_code(404);
    echo "Página não encontrada: $route";
}
