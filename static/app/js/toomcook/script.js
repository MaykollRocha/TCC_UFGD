$(function () {
    // Inicialização das variáveis
    const matricesArea = $('#matrices-area')[0]; // usada para acessar mais rapidamente o elemento
    const stepDescription = $('#step-description')[0]; // usada para acessar mais rapidamente o elemento
    
    let linhaAnterior = null; // Guarda as linhas destacadas anteriormente
    let steps = []; // Array para armazenar os passos do algoritmo
    let currentStep = 0; // Índice do passo atual

    // Variável para controlar o modo e o timer do modo auto
    let modo = 'manual';
    let autoTimer = null;
    
    // Variáveis de configuração do algoritmo
    let TIMEOUT = 1500; // Tempo de espera para o modo automático
    let define_W = false; // Definie se o algoritmo vai definir o W ou o usuario 
    let kx = 0; // Variável para o kx
    let ky = 0; // Variável para o ky


    $('#configuracao').on('click', function () {
        // Exibir modal de configuração

        $('#tempo').val(TIMEOUT);	
        if (define_W) {
            $('definir').prop('checked', true);
            $('#kx').val(kx).prop('disabled', false);
            $('#ky').val(ky).prop('disabled', false);;
        } else {
            $('#definir').prop('checked', false);
            $('#kx').val(kx).prop('disabled', true);
            $('#ky').val(ky).prop('disabled', true);
        }

        $('#modal-config').modal('show');
    });

    $('#definir').on('change', function () {
        if (this.checked) {
            $('#kx, #ky').prop('disabled', false);
        } else {
            $('#kx, #ky').prop('disabled', true);
        }
    });

    $('#atualizar').on('click', function () {
        define_W = $('#definir').prop('checked');
        kx = Number($('#kx').val());
        ky = Number($('#ky').val());
        TIMEOUT = $('#tempo').val();

        $('#modal-config').modal('hide');
    });

    /**
***********************************************************************************
            Confuirações dos botões e eventos de interação
***********************************************************************************
    */
    $('#pause').on('change', function () {
        modo = 'manual';
        if (this.checked) {
            modo = 'pause';
            $('#auto, #reinicie').prop('checked', false);
        }
    });

    $('#continue').on('click', function () {
        modo = 'manual';
        $('#pause , #reinicie, #auto').prop('checked', false);
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    $('#rollback').on('click', function () {
        modo = 'manual';
        $('#pause, #reinicie, #auto').prop('checked', false);
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    $('#reinicie').on('click', function () {
        modo = 'manual';
        currentStep = 0;
        showStep(currentStep);
        $('#pause, #reinicie, #auto').prop('checked', false);
    });

    $('#auto').on('change', function () {
        $('#pause, #reinicie').prop('checked', false);
        if (this.checked) {
            modo = 'auto';

            // Limpa qualquer timer anterior
            if (autoTimer) clearInterval(autoTimer);

            // Avança automaticamente a cada 2 segundos
            autoTimer = setInterval(function () {
                if (modo !== 'auto' || currentStep >= steps.length - 1) {
                    clearInterval(autoTimer);
                    return;
                }
                currentStep++;
                showStep(currentStep);
            }, TIMEOUT);
        } else {
            modo = 'manual';
            if (autoTimer) clearInterval(autoTimer);
        }
    });

    $('#buildBtn').on('click', function () {
        // Limpar passos anteriores
        steps = [];
        currentStep = 0;

        matricesArea.innerHTML = '';
        stepDescription.innerHTML = '';
        

        // Ler os inputs
        const x = $('#mult1').val();
        const y = $('#mult2').val();

        if (x && y && !isNaN(x) && !isNaN(y)) {
            $('#toomcook-form').addClass('was-validated');
            // Percorre o algoritmo para poder gerar os passos
            toom_cook_w(x, y);

            showStep(currentStep);
        } else {
            $('#toomcook-form').addClass('was-validated');
        }
    });

    /**
***********************************************************************************
            TOOM-COOK W Algorithm Implementation
***********************************************************************************
    */

    function inversa_matriz(matriz) {
        const tamanho = matriz.length;
        // Matriz identidade com Fraction
        let identidade = Array(tamanho).fill(null).map((_, i) =>
            Array(tamanho).fill(null).map((__, j) => new Fraction(i === j ? 1n : 0n))
        );

        // Cópia da matriz original convertendo números para Fraction
        let m = matriz.map((linha) => linha.map((x) => (x instanceof Fraction ? x : new Fraction(x))));

        for (let i = 0; i < tamanho; i++) {
            // Procurar pivô (não zero)
            let piv = m[i][i];
            if (piv.isZero()) {
                let trocou = false;
                for (let j = i + 1; j < tamanho; j++) {
                    if (!m[j][i].isZero()) {
                        [m[i], m[j]] = [m[j], m[i]];
                        [identidade[i], identidade[j]] = [identidade[j], identidade[i]];
                        piv = m[i][i];
                        trocou = true;
                        break;
                    }
                }
                if (!trocou) throw new Error("Matriz singular, não possui inversa.");
            }

            // Normalizar linha do pivô (dividir pela pivô)
            for (let k = 0; k < tamanho; k++) {
                m[i][k] = m[i][k].div(piv);
                identidade[i][k] = identidade[i][k].div(piv);
            }

            // Zerando coluna i nas outras linhas
            for (let j = 0; j < tamanho; j++) {
                if (j !== i) {
                    let fator = m[j][i];
                    for (let k = 0; k < tamanho; k++) {
                        m[j][k] = m[j][k].sub(fator.mul(m[i][k]));
                        identidade[j][k] = identidade[j][k].sub(fator.mul(identidade[i][k]));
                    }
                }
            }
        }
        return identidade;
    }

    // Função para split number, igual ao seu original
    function split_number(number, n_parts, i) {
        let base = BigInt(10) ** BigInt(i);
        let parts = [];
        let num = BigInt(number);
        for (let j = 0; j < n_parts; j++) {
            parts.push(num % base);
            num /= base;
        }
        return parts;
    }

    /**
     * Realiza a multiplicação de dois inteiros grandes usando o algoritmo Toom-Cook (variante Toom-3.5).
     * Esta função divide os números de entrada, avalia-os como polinômios, multiplica ponto a ponto,
     * interpola o resultado e recompõe o produto final. Também registra cada etapa para fins educacionais.
     *
     * @param {bigint} x - O primeiro inteiro grande a ser multiplicado.
     * @param {bigint} y - O segundo inteiro grande a ser multiplicado.
     * @returns {bigint} O produto de x e y como BigInt.
     */
    function toom_cook_w(x, y) {
        // Definir kx e ky
        if (!define_W) {
            kx = Math.min(Math.max(Math.floor(x.length / 10), 1), 3);
            ky = Math.min(Math.max(Math.floor(y.length / 10), 1), 3);

            steps.push({
                desc: "Definição dos dividendos para o expoente do \\( D_n\\) é o número de dígitos",
                text: ` \\(  k_x  \\gets \\min(\\max( \\lfloor D_x / 10 \\rfloor , 1), 3), k_y \\gets \\min(\\max( \\lfloor D_y / 10 \\rfloor , 1), 3)  \\) <br>
                        \\(  k_x  \\gets \\min(\\max( \\lfloor ${x.length} / 10 \\rfloor , 1), 3), k_y \\gets \\min(\\max( \\lfloor ${y.length} / 10 \\rfloor , 1), 3)  \\) <br>
                        \\(  k_x  \\gets \\min(\\max( ${Math.floor(x.length / 10)}  , 1), 3), k_y \\gets \\min(\\max( ${Math.floor(y.length / 10)} , 1), 3)  \\) <br>
                        \\(  k_x  \\gets \\min(${Math.max(Math.floor(y.length / 10), 1)}, 3), k_y \\gets \\min(${Math.max(Math.floor(y.length / 10), 1)}, 3)  \\) <br>
                        \\( k_x \\gets ${kx}, k_y \\gets ${ky} \\) `,
                highlightRows: ['linha0']
            });
        } else {
            steps.push({
                desc: "Definição dos dividendos foi feita pela configuração",
                text: ` \\( k_x \\gets ${kx}, k_y \\gets ${ky} \\) `,
                highlightRows: ['linha0']
            });
        }
        

        // 1.Divisão
        x = BigInt(x);
        y = BigInt(y);

        // Selecionar a Base
        const base_i = Math.max(
            Math.floor(Math.log10(Number(x)) / kx),
            Math.floor(Math.log10(Number(y)) / ky)
        ) + 1;

        steps.push({
            desc: "Definição do expentoente da base numérica",
            text: ` \\( i \\gets \\max(\\lfloor \\log_{10}(${x}) / ${kx} \\rfloor, \\lfloor \\log_{10}(${y}) / ${ky} \\rfloor) + 1 \\)
                    <br>\\( i \\gets \\max(\\lfloor ${Math.log10(Number(x))})/ ${kx} \\rfloor, \\lfloor (${Math.log10(Number(y))} / ${ky} \\rfloor) + 1 \\)
                    <br>\\( i \\gets \\max(\\lfloor ${Math.log10(Number(x)) / kx} \\rfloor , \\lfloor ${Math.log10(Number(y)) / ky} \\rfloor) + 1 \\)
                    <br>\\( i \\gets \\max( ${Math.floor(Math.log10(Number(x)) / kx)}  , ${Math.floor(Math.log10(Number(y)) / ky)} ) + 1 \\)
                    <br>\\( i \\gets ${Math.max(Math.floor(Math.log10(Number(x)) / kx), Math.floor(Math.log10(Number(y)) / ky))} + 1 \\)
                    <br>\\( i \\gets ${base_i} \\)`,
            highlightRows: ['linha1']
        });
        // Dividir os números
        let p_x = split_number(x, kx, base_i);
        let q_x = split_number(y, ky, base_i);

        let string_p = polyToString(p_x, 'x');
        let string_q = polyToString(q_x, 'x');

        steps.push({
            desc: "Dividindo os números em partes",
            text: `\\(${string_p}\\)<br>\\(${string_q.replace('p(x)', 'q(x)')} \\)`,
            matrices: {
                "\\( P(x) \\)": [p_x.map(v => new Fraction(v).toBigInt())],
                "\\( Q(x) \\)": [q_x.map(v => new Fraction(v).toBigInt())]
            },
            highlightRows: ['linha2', 'linha3']
        });

        // 2.Avaliação

        // Definir o grau do polinômio
        const d = kx + ky - 1;
        const max_k = Math.max(kx, ky);

        steps.push({
            desc: "Definindo o grau do polinômio final",
            text: ` \\(d \\gets ${kx} + ${ky} - 1 \\)
                    <br> \\(d \\gets  ${d} \\)`,
            highlightRows: ['linha4']
        });

        // Definição dos pontos de avaliação
        // 0, 1, -1, -2, inf
        const x_vals = [new Fraction(0n), new Fraction(1n), new Fraction(-1n), new Fraction(-2n), 'inf'].slice(0, d);

        steps.push({
            desc: "Definindo os valores de X",
            matrices: {
                "\\( X \\)": [x_vals.map(v => v instanceof Fraction ? v.toBigInt() : v)],
            },
            highlightRows: ['linha5']
        });
        // Criar matriz de avaliação
        let mat = x_vals.map((v) => {
            if (v === 'inf') {
                return Array(max_k - 1).fill(new Fraction(0n)).concat([new Fraction(1n)]);
            } else {
                let row = [];
                for (let ind = 0; ind < max_k; ind++) {
                    // v^ind (potência de Fração)
                    row.push(ind === 0 ? new Fraction(1n) : row[ind - 1].mul(v));
                }
                return row;
            }
        });
        steps.push({
            desc: "matriz de avaliação",
            matrices: {
                "\\( MatAval \\)": mat.map(row => row.map(val => val.toBigInt())),
            },
            highlightRows: ['linha6', 'linha7']
        });
        // Avaliação dos polinômios nos pontos x
        const p = mat.map((row) =>
            row.reduce((acc, val, col) => acc.add(val.mul(new Fraction(col < p_x.length ? p_x[col] : 0n))), new Fraction(0n))
        );
        console.log(p);

        const q = mat.map((row) =>
            row.reduce((acc, val, col) => acc.add(val.mul(new Fraction(col < q_x.length ? q_x[col] : 0n))), new Fraction(0n))
        );


        steps.push({
            desc: "Avaliação dos polinômios nos pontos x",
            matrices: {
                "\\( p_{result} \\)": [p.map(v => v.toBigInt())],
                "\\( q_{result} \\)": [q.map(v => v.toBigInt())],
            }
        });

        // 3. Multiplicação pontual
        let r_x = [];
        console.log(d);
        for (let i = 0; i < d; i++) {
            r_x[i] = new Fraction(p[i].toBigInt() * q[i].toBigInt());
        }
        steps.push({
            desc: "Multiplicação pontual",
            matrices: {
                "\\( r_{x} \\)": [r_x.map(v => v.toBigInt())],
            },
            highlightRows: ['linha8']
        });
        // 4. Interpolação

        // Matriz para interpolaçã£o
        let r_mat = x_vals.map((v) => {
            if (v === 'inf') {
                return Array(d - 1).fill(new Fraction(0n)).concat([new Fraction(1n)]);
            } else {
                let row = [];
                for (let ind = 0; ind < d; ind++) {
                    row.push(ind === 0 ? new Fraction(1n) : row[ind - 1].mul(v));
                }
                return row;
            }
        });

        steps.push({
            desc: " Matriz para interpolação",
            matrices: {
                "\\( Mat_{interpolação} \\)": r_mat.map(row => row.map(val => val.toBigInt())),
            },
            highlightRows: ['linha9']
        });

        // Inversão da matriz de interpolação
        let r_mat_inv = inversa_matriz(r_mat);
        steps.push({
            desc: "Inversa da Matriz para interpolação",
            matrices: {
                "\\( Mat_{interpolação}^{-1} \\)": r_mat_inv.map(row => row.map(val => Number(val.toNumber().toFixed(2)))),
            }
        });
        // Cálculo do vetor r (coeficientes)
        let r = r_mat_inv.map((row) =>
            row.reduce((acc, val, col) => acc.add(val.mul(r_x[col])), new Fraction(0n))
        );  

        
        let string_r = polyToString(r.map(v => v.toBigInt()), 'x');
        steps.push({
            desc: `Cálculo do vetor r (coeficientes)`,
            text: `\\( r(x) = ${string_r} \\)`,
            matrices: {
                "\\( r_{(d-1)..0} \\)": [r.map(v => v.toBigInt())],
            },
            highlightRows: ['linha10']
        });
        // 5. Recomposição
        let soma = new Fraction(0n);
        for (let ind = 0; ind < r.length; ind++) {
            soma = soma.add(r[ind].mul(new Fraction(BigInt(10) ** BigInt(base_i * ind))));
        }

        // Exibir cada termo da soma: r[ind] * 10^(base_i * ind)
        let termos = r.map((coef, ind) => `${coef.toBigInt() * (BigInt(10) ** BigInt(base_i * ind))}`);
        // Pega o maior termo da soma para definir o tamanho da string
        const maiorTermo = termos.reduce((a, b) => (BigInt(a) > BigInt(b) ? a : b));
        const underline = '-'.repeat(maiorTermo.toString().length);

        steps.push({
            desc: "Termos da recomposição",
            text: `<div style="text-align: right; margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0;">` +
            termos.map((t, i) => `\\(${t}\\)`).join('<br>') +
            `<br><hr style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;"><br>\\(${soma.toBigInt()}\\)<br>` +
            `</div>`,
            highlightRows: ['linha10']
        });
    
        steps.push({
            desc: "Recomposição",
            text: `\\( resultado \\gets ${soma.toBigInt()} \\) <br>`,
            highlightRows: ['linha10']
        });
    
        // Retorna inteiro (trunca parte decimal)
        return soma.toBigInt();
    }

    /**
***********************************************************************************
            Funções para manipulação de matrizes e destaques
***********************************************************************************
    */
    const highlightLine = (ids) => {
        // Remove highlight from previous lines
        if (linhaAnterior) {
            (Array.isArray(linhaAnterior) ? linhaAnterior : [linhaAnterior]).forEach(id => {
                $(`#${id}`).removeClass('highlight');
            });
        }
        // Add highlight to new lines
        if (ids) {
            (Array.isArray(ids) ? ids : [ids]).forEach(id => {
                $(`#${id}`).addClass('highlight');
            });
            linhaAnterior = ids;
        } else {
            linhaAnterior = null;
        }
    };

    function drawMatrix(matrix, name, highlightRows = []) {
        let html = `<table class="matrix"><caption>${name}</caption><tbody>`;
        matrix.forEach((row, rowIndex) => {
            const highlightClass = highlightRows.includes(rowIndex) ? 'highlight' : '';
            html += `<tr class="${highlightClass}">` + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
        html += '</tbody></table>';
        return html;
    }

    /**
     * Converte um array de coeficientes de polinômio em uma representação de string legível.
     *
     * @param {number[]} coeffs - Os coeficientes do polinômio, ordenados do menor para o maior grau.
     * @param {string} [varName='x'] - O nome da variável a ser usado na string do polinômio.
     * @returns {string} A representação em string do polinômio no formato "p(varName) = ...".
     */
    function polyToString(coeffs, varName = 'x') {
        // Inverter para maior expoente à esquerda
        const reversed = [...coeffs].reverse();
        return 'p(' + varName + ') = ' + reversed
            .map((v, i) => {
                const exp = reversed.length - i - 1;
                let coefStr = v.toString();
                if (coefStr === '0') return null;
                let term = '';
                if (coefStr === '1' && exp !== 0) {
                    term = '';
                } else if (coefStr === '-1' && exp !== 0) {
                    term = '-';
                } else {
                    term = coefStr;
                }
                if (exp === 0) return term;
                if (exp === 1) return term + varName;
                return term + varName + '^' + exp;
            })
            .filter(Boolean)
            .join(' + ')
            .replace(/\+\s\-/g, '- ');
    }


    /**
***********************************************************************************
            Função que exibe o passo do processo
***********************************************************************************
    */
    /**
     * Exibe o passo especificado do processo, atualizando a descrição, textos, matrizes e destaques na interface.
     * Utiliza jQuery para manipulação do DOM e atualização dinâmica dos elementos.
     *
     * @param {number} stepIndex - Índice do passo a ser exibido na sequência de etapas.
     *
     * Dependências globais:
     * - steps: Array contendo os objetos de cada passo, com possíveis propriedades:
     *   - desc: Descrição do passo (HTML).
     *   - text: Texto adicional (HTML).
     *   - matrices: Objeto ou array de matrizes a serem exibidas.
     *   - highlightRows: Array de índices de linhas a serem destacadas.
     * - stepDescription: Seletor ou elemento onde a descrição do passo será exibida.
     * - matricesArea: Seletor ou elemento onde as matrizes serão exibidas.
     * - drawMatrix: Função para renderizar uma matriz em HTML.
     * - highlightLine: Função para destacar linhas específicas.
     * - window.MathJax (opcional): Se disponível, atualiza fórmulas matemáticas renderizadas.
     */
    function showStep(stepIndex) {
        const step = steps[stepIndex];
        if (!step) return;

        // Usando jQuery para manipular o DOM
        $(stepDescription).html(step.desc);

        let $content = $('<div></div>');

        // Caso tenha texto
        if (step.text) {
            $content.append($('<div class="simple-text"></div>').html(step.text));
        }

        // Caso tenha matrizes
        if (step.matrices) {
            let $matricesDiv = $('<div style="flex-direction: column;"></div>');
            $.each(step.matrices, function (name, matrixObj) {
                let matrix, highlightRows = [];

                if ($.isArray(matrixObj)) {
                    matrix = matrixObj;
                } else {
                    matrix = matrixObj.matrix;
                    highlightRows = matrixObj.highlightRows || [];
                }

                // Inclui também highlightRows do step, se houver
                const combinedHighlightRows = [
                    ...highlightRows,
                    ...(step.highlightRows || [])
                ];

                $matricesDiv.append($(drawMatrix(matrix, name, combinedHighlightRows)));
            });
            $content.append($matricesDiv);
        }

        // Destacar linhas simuladas se necessário
        if (step.highlightRows) {
            highlightLine(step.highlightRows);
        }

        // Atualiza a área de matrizes usando jQuery
        $(matricesArea).empty().append($content);

        // Atualiza fórmulas matemáticas se MathJax estiver disponível
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }
});
