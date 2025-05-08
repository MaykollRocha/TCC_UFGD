<?php

/**
 * Arquivo de configuração para a estrutura do menu da aplicação.
 * 
 * Este arquivo define os itens do menu e suas rotas correspondentes
 * para a aplicação. O menu é estruturado como um array associativo
 * onde as chaves representam os caminhos das rotas e os valores representam
 * os rótulos do menu. Arrays aninhados são usados para definir submenus.
 * 
 * Estrutura do Menu:
 * - '/'            : rota incial "Página Inicial".
 * - '/exemplo'     : Titulo da pagina.
 * - '`Nome sub`    : Projeot do subprojeto
 *   - '/Link para a rota'       : nome da rota.
 */
$menu = [
    '/'          => 'Página Inicial',
    '/karatsuba' => 'Karatsuba',
    '/toomcook3' => 'Toom Cook 3',
];

