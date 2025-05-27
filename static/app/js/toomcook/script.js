$(function () {
    const matricesArea = document.getElementById('matrices-area');
    const stepDescription = document.getElementById('step-description');
    let linhaAnterior = null;

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

    let steps = [];

    let currentStep = 0;

    function drawMatrix(matrix, name, highlightRows = []) {
        let html = `<table class="matrix"><caption>${name}</caption><tbody>`;
        matrix.forEach((row, rowIndex) => {
            const highlightClass = highlightRows.includes(rowIndex) ? 'highlight' : '';
            html += `<tr class="${highlightClass}">` + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
        html += '</tbody></table>';
        return html;
    }


    function showStep(stepIndex) {
        const step = steps[stepIndex];
        if (!step) return;

        stepDescription.innerHTML = step.desc;

        let contentHtml = '';

        // Verifica se há matrizes
        if (step.matrices) {
            for (const [name, matrixObj] of Object.entries(step.matrices)) {
                let matrix, highlightRows = [];

                if (Array.isArray(matrixObj)) {
                    matrix = matrixObj;
                } else {
                    matrix = matrixObj.matrix;
                    highlightRows = matrixObj.highlightRows || [];
                }

                // 🔥 Inclui também highlightRows do step, se houver
                const combinedHighlightRows = [
                    ...highlightRows,
                    ...(step.highlightRows || [])
                ];

                contentHtml += drawMatrix(matrix, name, combinedHighlightRows);
            }
        }

        // 🔥 Caso não tenha matriz, mas queira destacar linhas avulsas
        if (step.text) {
            contentHtml += `<div class="simple-text">${step.text}</div>`;
        }

        // 🔥 Se não tiver matriz, mas quiser destacar linha "simulada"
        if (step.highlightRows) {
            highlightLine(step.highlightRows);
        }

        matricesArea.innerHTML = contentHtml;

        if (window.MathJax) {
            MathJax.typesetPromise();
        }
}




    $('#continue').on('click', function () {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    $('#reinicie').on('click', function () {
        currentStep = 0;
        showStep(currentStep);
    });

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

     // Montar string polinomial p(x) e q(x)
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

    // Função principal Toom-Cook W adaptada
    function toom_cook_w(x, y) {
        // Definir kx e ky
        const kx = Math.min(Math.max(Math.ceil(x.length / 10), 1), 3);
        const ky = Math.min(Math.max(Math.ceil(y.length / 10), 1), 3);

        steps.push({
            desc: "Definição das bases kx e ky",
            text: ` \\(  k_x  \\gets \\min(\\max( \\lceil ${x.length} / 10 \\rceil , 1), 3), k_y \\gets \\min(\\max( \\lceil ${y.length} / 10 \\rceil , 1), 3)  \\) <br>
                    \\(  k_x  \\gets \\min(\\max( ${Math.ceil(x.length / 10)}  , 1), 3), k_y \\gets \\min(\\max( ${Math.ceil(y.length / 10)} , 1), 3)  \\) <br>
                    \\(  k_x  \\gets \\min(${Math.max(Math.ceil(y.length / 10), 1)}, 3), k_y \\gets \\min(${Math.max(Math.ceil(y.length / 10), 1)}, 3)  \\) <br>
                    \\( k_x \\gets ${kx}, k_y \\gets ${ky} \\) `,
            highlightRows: ['linha0']
        });

        // 1.Divisão
        x = BigInt(x);
        y = BigInt(y);

        // Selecionar a Base
        const base_i = Math.max(
            Math.floor(Math.log10(Number(x)) / kx),
            Math.floor(Math.log10(Number(y)) / ky)
        ) + 1;

        steps.push({
            desc: "Definição do expente i da base",
            text: ` \\( i \\gets \\max(\\lfloor \\log_{10}(${x}) / ${kx} \\rfloor, \\lfloor \\log_{10}(${y}) / ${ky} \\rfloor) + 1 \\)
                    <br>\\( i \\gets \\max(\\lfloor ${Math.log10(Number(x))})/ ${kx} \\rfloor, \\lfloor (${Math.log10(Number(y)) } / ${ky} \\rfloor) + 1 \\)
                    <br>\\( i \\gets \\max(\\lfloor ${Math.log10(Number(x)) / kx} \\rfloor , \\lfloor ${Math.log10(Number(y)) / ky} \\rfloor) + 1 \\)
                    <br>\\( i \\gets \\max( ${ Math.floor(Math.log10(Number(x)) / kx) }  , ${ Math.floor(Math.log10(Number(y)) / ky) } ) + 1 \\)
                    <br>\\( i \\gets ${Math.max( Math.floor(Math.log10(Number(x)) / kx)  , Math.floor(Math.log10(Number(y)) / ky) )} + 1 \\)
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
            desc: "Definindo os valores de d",
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

        // Matriz para interpolação
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

        steps.push({
            desc: "Cálculo do vetor r (coeficientes)", 
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
        steps.push({
            desc: "Recomposição", 
            matrices: {
                "\\( Resultado \\)": [[soma.toBigInt()]],
            },
            highlightRows: ['linha10']
        });
        // Retorna inteiro (trunca parte decimal)
        return soma.toBigInt();
    }

    $('#buildBtn').on('click', function() {
        // Limpar passos anteriores
        steps = [];
        currentStep = 0;
        matricesArea.innerHTML = '';
        stepDescription.innerHTML = '';
        if ($('#mult1').val() || $('#mult2').val()) {


        // Ler os inputs
        const x = $('#mult1').val();
        const y = $('#mult2').val();
        const kx = Math.min(Math.max(Math.ceil(x.length / 10),1),3);
        const ky = Math.min(Math.max(Math.ceil(y.length / 10),1),3);
        // Executar o algoritmo
        const resultado = toom_cook_w(x, y, kx, ky);

        // Mostrar o primeiro passo
        showStep(currentStep);
        } else {
            $('#toomcook-form').addClass('was-validated');
        }
        
    });

});
