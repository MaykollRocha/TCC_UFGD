<?php

class ControllerCreator
{
    private $folder;
    private $name;
    private $basePath;

    public function __construct($folder, $name)
    {
        $this->folder = strtolower($folder);
        $this->name = ucfirst(string: $name);
        $this->basePath = __DIR__ ;
    }

    public function createStructure()
    {
        
        // Caminhos
        $controllerPath = "{$this->basePath}/application/controller/{$this->name}.php";
        $viewDir = "{$this->basePath}/application/view/{$this->folder}";
        $viewPath = "{$viewDir}/index.php";
        $cssDir = "{$this->basePath}/static/app/css/{$this->folder}";
        $cssPath = "{$cssDir}/styles.css";
        $jsDir = "{$this->basePath}/static/app/js/{$this->folder}";
        $jsPath = "{$jsDir}/script.js";

        // Criar diretórios
        $this->createDir(dirname($controllerPath));
        $this->createDir($viewDir);
        $this->createDir($cssDir);
        $this->createDir($jsDir);

        // Conteúdos
        $controllerContent = <<<PHP
<?php

require_once 'application/core/Controller.php';

class {$this->name} extends Controller
{
    public function index()
    {
        \$this->render('{$this->folder}/index');
    }
}
PHP;

        $viewContent = <<<HTML
<link rel="stylesheet" href="/static/app/css/{$this->folder}/styles.css">
<script src="/static/app/js/{$this->folder}/script.js"></script>

<h1>Bem-vindo ao {$this->name}</h1>
HTML;

        $cssContent = "/* Estilos para {$this->name} */";
        $jsContent = "$(function() { console.log('{$this->name} carregado'); });";

        // Criar arquivos
        file_put_contents($controllerPath, $controllerContent);
        echo "Controller criado: $controllerPath\n";

        file_put_contents($viewPath, $viewContent);
        echo "View criada: $viewPath\n";

        file_put_contents($cssPath, $cssContent);
        echo "CSS criado: $cssPath\n";

        file_put_contents($jsPath, $jsContent);
        echo "JS criado: $jsPath\n";

        echo "Criação concluída com sucesso!\n";
    }

    private function createDir($path)
    {
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
            echo "Diretório criado: $path\n";
        }
    }
}
