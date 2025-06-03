$(function () {
    let restart = false;
    let modo = 'pause';
    let linhaAnterior = null;

    const $etapasContainer = $('#etapas-container');
    const $cardsContainer = $('.karatsuba-cards');

    const scrollToBottom = () =>
        $cardsContainer.stop().animate({ scrollTop: $cardsContainer[0].scrollHeight }, 400);

    const highlightLine = (id) => {
        if (linhaAnterior) $(`#${linhaAnterior}`).removeClass('highlight');
        if (id) {
            $(`#${id}`).addClass('highlight');
            linhaAnterior = id;
        } else {
            linhaAnterior = null;
        }
    };

    const delay = (ms) => new Promise(async (resolve) => {
        let elapsed = 0;
        while (elapsed < ms) {
            if (restart) return resolve();
            if (modo === 'pause') {
                while (modo === 'pause') {
                    await new Promise(r => setTimeout(r, 100));
                    if (restart) return resolve();
                }
            }
            await new Promise(r => setTimeout(r, 50));
            elapsed += 50;
            if (modo === 'manual') {
                modo = 'pause';
                break;
            }
        }
        resolve();
    });

    const createCard = (x, y, n, detalhes = []) => {
        const card = $(`
            <div class="card">
                <div class="card-header"><span>\\(\\textbf{KARATSUBA}(${x}, ${y}, ${n})\\)</span></div>
                <div class="detalhes"></div>
                <div class="resultado"></div>
            </div>
        `);
        const $detalhes = card.find('.detalhes');
        detalhes.forEach(d => $detalhes.append(`<div>\\(${d}\\)</div>`));

        $('#cardsContainer').append(card);
        MathJax.typesetPromise([card[0]]);
        card.css({ backgroundColor: '#ffffcc' }).delay(100).queue(function (next) {
            $(this).css({ backgroundColor: '', transition: 'background-color 1s ease' });
            next();
        });
        scrollToBottom();
        return card;
    };

    const adicionarEtapa = async ($container, classe, latex, delayTime = 400) => {
        const $div = $(`<div class="${classe}">\\(${latex}\\)</div>`);
        $container.append($div);
        await MathJax.typesetPromise([$div[0]]);
        scrollToBottom();
        await delay(delayTime);
        return $div;
    };

    async function karatsuba(x, y, n = null, nivel = '0', parent = $etapasContainer) {
        if (restart) return;
    
        if (n === null) n = Math.max(x.toString().length, y.toString().length);
    
        if (n <= 3) {
            highlightLine('linha1');
            await delay(200);
            const result = x * y;
            highlightLine('linha2');
    
            const card = createCard(x, y, n, [`${x} \\times ${y}`]);
            card.find('.resultado').html(`\\(Resultado = ${result}\\)`);
            await MathJax.typesetPromise([card.find('.resultado')[0]]);
            parent.append(card);
            scrollToBottom();
            await delay(500);
            return result;
        }
    
        const card = createCard(x, y, n);
        const $detalhes = card.find('.detalhes');
        const $resultado = card.find('.resultado');
        parent.append(card);
    
        highlightLine('linha1');
        await delay(200);
    
        const q = Math.ceil(n / 2);
        highlightLine('linha2');
        const $q = await adicionarEtapa($detalhes, `q_${nivel}`, `q = \\lfloor ${n}/2 \\rfloor`);
        $q.html(`\\(q = ${q}\\)`); 
        await MathJax.typesetPromise([$q[0]]); await delay(400);
    
        const xStr = x.toString().padStart(n, '0');
        const yStr = y.toString().padStart(n, '0');
        const A = parseInt(xStr.slice(0, n - q)) || 0;
        const B = parseInt(xStr.slice(n - q)) || 0;
        const C = parseInt(yStr.slice(0, n - q)) || 0;
        const D = parseInt(yStr.slice(n - q)) || 0;
    
        highlightLine('linha3');
        const $ab = await adicionarEtapa($detalhes, `ab_${nivel}`, `A \\gets X[${q+1}..${xStr.length}], \\quad B \\gets X[1..${q}]`);
        $ab.html(`\\(A \\gets ${A}, \\quad B \\gets ${B}\\)`);
        await MathJax.typesetPromise([$ab[0]]); await delay(400);
    
        highlightLine('linha4');
        const $cd = await adicionarEtapa($detalhes, `cd_${nivel}`, `C \\gets Y[${q+1}..${yStr.length}], \\quad D \\gets Y[1..${q}]`);
        $cd.html(`\\(C \\gets ${C}, \\quad D \\gets ${D}\\)`);
        await MathJax.typesetPromise([$cd[0]]); await delay(400);
    
        highlightLine('linha6');
        const $E = await adicionarEtapa($detalhes, `E_${nivel}`, `E \\gets \\text{Karatsuba}(${A}, ${C}, ${Math.floor(n / 2)})`, 500);
        const E = await karatsuba(A, C, Math.floor(n / 2), nivel + '1', $detalhes);
        $E.html(`\\(E \\gets ${E}\\)`); await MathJax.typesetPromise([$E[0]]); await delay(400);
        if (restart) return;
    
        highlightLine('linha7');
        const $F = await adicionarEtapa($detalhes, `F_${nivel}`, `F \\gets \\text{Karatsuba}(${B}, ${D}, ${Math.ceil(n / 2)})`, 500);
        const F = await karatsuba(B, D, Math.ceil(n / 2), nivel + '1', $detalhes);
        $F.html(`\\(F \\gets ${F}\\)`); await MathJax.typesetPromise([$F[0]]); await delay(400);
        if (restart) return;
    
        highlightLine('linha8');
        const $G = await adicionarEtapa($detalhes, `G_${nivel}`, `G \\gets \\text{Karatsuba}(${A + B}, ${C + D}, ${Math.max((A + B).toString().length, (C + D).toString().length)})`, 500);
        const G = await karatsuba(A + B, C + D, Math.max((A + B).toString().length, (C + D).toString().length), nivel + '1', $detalhes);
        $G.html(`\\(G \\gets ${G}\\)`); await MathJax.typesetPromise([$G[0]]); await delay(400);
        if (restart) return;
    
        const H = G - E - F;
        const parte1 = E * Math.pow(10, 2 * q);
        const parte2 = H * Math.pow(10, q);
        const parte3 = F;
        const result = parte1 + parte2 + parte3;
        
        highlightLine('linha8');
        const $H = await adicionarEtapa($detalhes, `H_${nivel}`, `H \\gets G - E - F`, 500);
        $H.html(`\\(H \\gets ${H}\\)`); await MathJax.typesetPromise([$H[0]]); await delay(400);
    
        highlightLine('linha9');
        const $R = await adicionarEtapa($detalhes, `H_${nivel}`, `R \\gets (${E} \\times 10^{${2 * q}}) + (${H} \\times 10^{${q}}) + ${F}`, 500);
        $R.html(`\\(R \\gets ${parte1} + ${parte2} + ${parte3}\\)`); await MathJax.typesetPromise([$R[0]]); await delay(400);

        highlightLine('linha10');
        $resultado.html(`\\(Resultado = ${result}\\)`);
        await MathJax.typesetPromise([$resultado[0]]);
        scrollToBottom();
        await delay(400);
    
        return result;
    }

    // Botões e controle
    $('#rodar').on('click', async function (e) {
        e.preventDefault();
        $('#pause, #auto, #reinicie').prop('checked', false);
        restart = false;
        modo = 'pause';

        const num1 = parseInt($('#mult1').val());
        const num2 = parseInt($('#mult2').val());
        $etapasContainer.empty();

        if (isNaN(num1) || isNaN(num2)) {
            alert("Digite dois números válidos.");
            return;
        }

        await karatsuba(num1, num2);
    });

    $('#continue').on('click', () => {
        modo = 'manual';
        $('#pause, #auto, #reinicie').prop('checked', false);
    });

    $('#pause').on('change', function () {
        if (this.checked) {
            modo = 'pause';
            $('#auto, #reinicie').prop('checked', false);
        }
    });

    $('#auto').on('change', function () {
        if (this.checked) {
            modo = 'auto';
            $('#pause, #reinicie').prop('checked', false);
        }
    });

    $('#reinicie').on('change', function () {
        if (this.checked) {
            restart = true;
            $etapasContainer.empty();
            $('#pause, #auto').prop('checked', false);
        }
    });
});
