<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">


    <!-- CSS -->
    <link rel="stylesheet" href="/static/css/bootstrap.min.css">
    <link rel="stylesheet" href="/static/css/bootstrap-icons.min.css">
    <link rel="stylesheet" href="/static/css/bootstrap-select.min.css">
    <link rel="stylesheet" href="/static/css/sweetalert2.min.css">
    <link rel="stylesheet" href="/static/css/jquery-ui.min.css">
    <link rel="stylesheet" href="/static/css/jquery.toast.min.css">
    <link rel="stylesheet" href="/static/css/leaflet.css">
    <link rel="stylesheet" href="/static/css/richtext.min.css">
    <link rel="stylesheet" href="/static/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="/static/css/custom.css">

    <!-- JS -->
    <script src="/static/js/jquery-3.7.1.min.js"></script>
    <script src="/static/js/jquery-ui.min.js"></script>
    <script src="/static/js/jquery.mask.min.js"></script>
    <script src="/static/js/jquery.richtext.min.js"></script>
    <script src="/static/js/jquery.toast.min.js"></script>
    <script src="/static/js/bootstrap.bundle.min.js"></script>
    <script src="/static/js/bootstrap-select.min.js"></script>
    <script src="/static/js/sweetalert2.min.js"></script>
    <script src="/static/js/leaflet.js"></script>
    <script src="/static/js/fontawesome-all.min.js"></script>
    <script src="/static/js/popper.min.js"></script>
    <script src="/static/js/chart-3.3.2.min.js"></script>
    <script src="/static/js/chartjs-plugin-datalabels-2.2.0.min.js"></script>
    <script src="static/js/es5/tex-chtml-full.js" id="MathJax-script" async></script>


    <link rel="stylesheet" type="text/css" href="static/css/leaflet.css">
    <script type="text/javascript" src="static/js/leaflet.js"></script>

    <!-- CSS Personalizado -->
    <style>
        :root {
            --cor-triangulo-frente: #ea2;
            /* amarelo claro */
            --cor-triangulo-fundo: #222;
            /* preto ou quase preto */
            --cor-destaque: #ffc107;
            /* opcional: destaque para bordas, hover, etc */
        }

        body {
            padding-top: 80px;
            /* Ajuste conforme a altura da sua navbar */
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            /* Faz o body ocupar toda a altura da tela */
        }

        /* O conteúdo principal deve ocupar o espaço restante sem ultrapassar o footer */
        main {
            flex-grow: 1;
        }

        /* O rodapé deve ficar fixo no fundo */
        footer {
            background-color: #343a40;
            color: white;
            text-align: center;
            padding: 15px 0;
            position: relative;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>

<body>

    <!-- Navbar fixa no topo -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                Nome Projeto
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu"
                aria-controls="navbarMenu" aria-expanded="false" aria-label="Alternar navega��o">
                <span class="navbar-toggler-icon"></span>
            </button>
            <?php
            include_once __DIR__ . '/../../config/menu.php'; // caminho relativo para o arquivo de menu
            ?>

            <div class="collapse navbar-collapse justify-content-center" id="navbarMenu">
                <ul class="navbar-nav">
                    <?php foreach ($menu as $url => $nome) { ?>
                        <?php if (is_array($nome)) { ?>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown<?= $url ?>" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <?= $url ?>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown<?= $url ?>">
                                    <?php foreach ($nome as $Url => $Nome) { ?>
                                        <li><a class="dropdown-item" href="<?= $Url ?>"><?= $Nome ?></a></li>
                                    <?php }; ?>
                                </ul>
                            </li>
                        <?php } else { ?>
                            <li class="nav-item">
                                <a class="nav-link" href="<?= $url ?>"><?= $nome ?></a>
                            </li>
                        <?php }; ?>
                    <?php }; ?>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Conte do principal -->
    <main class="container-fluid">
