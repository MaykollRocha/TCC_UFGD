$(function () {
    /**
     * function splitNumber(number, nParts, i) {
    let base = Math.pow(10, i);
    let parts = [];
    for (let j = 0; j < nParts - 1; j++) {
        parts.push(number % base);
        number = Math.floor(number / base);
    }
    parts.push(number);
    return parts.reverse();
}

function toomCook3(x, y) {
    let i = Math.max(Math.floor(Math.log10(x) / 3), Math.floor(Math.log10(y) / 3)) + 1;
    console.log(`i: ${i}`);
    
    // Dividir os números em 3 partes
    const nParts = 3;
    let X = splitNumber(x, nParts, i);
    let Y = splitNumber(y, nParts, i);
    
    console.log(`X: ${X}`);
    console.log(`Y: ${Y}`);
    
    // Avaliar os pontos
    let p0 = X[2];
    let p1 = X[2] + X[1] + X[0];
    let p_1 = X[2] - X[1] + X[0];
    let p_2 = X[2] - X[1] * 2 + 4 * X[0];
    let pInf = X[0];

    let q0 = Y[2];
    let q1 = Y[2] + Y[1] + Y[0];
    let q_1 = Y[2] - Y[1] + Y[0];
    let q_2 = Y[2] - Y[1] * 2 + 4 * Y[0];
    let qInf = Y[0];
    
    console.log(`p0: ${p0}, p1: ${p1}, p_1: ${p_1}, p_2: ${p_2}, pInf: ${pInf}`);
    console.log(`q0: ${q0}, q1: ${q1}, q_1: ${q_1}, q_2: ${q_2}, qInf: ${qInf}`);
    
    // Multiplicar os pontos
    let r0 = p0 * q0;
    let r1 = p1 * q1;
    let r_1 = p_1 * q_1;
    let r_2 = p_2 * q_2;
    let rInf = pInf * qInf;
    
    console.log(`r0: ${r0}, r1: ${r1}, r_1: ${r_1}, r_2: ${r_2}, rInf: ${rInf}`);
    
    // Interpolação
    let a0 = r0;
    let a4 = rInf;
    let a3 = (r_2 - r1) / 3;
    let a1 = (r1 - r_1) / 2;
    let a2 = r_1 - r0;
    
    a3 = ((a2 - a3) / 2) + 2 * rInf;
    a2 = a2 + a1 - a4;
    a1 = a1 - a3;
    
    console.log(`a0: ${a0}, a1: ${a1}, a2: ${a2}, a3: ${a3}, a4: ${a4}`);
    
    // Recombinação
    let base = Math.pow(10, i);
    console.log(`base: ${base}`);

    let result = BigInt(a4) * BigInt(Math.pow(base, 4)) + 
                 BigInt(a3) * BigInt(Math.pow(base, 3)) + 
                 BigInt(a2) * BigInt(Math.pow(base, 2)) + 
                 BigInt(a1) * BigInt(base) + 
                 BigInt(a0);
    
    return result.toString();
}
     */
    const DELAY = 300;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let nodeId = 0;

    const newNodeElement = async (label, parentId = null) => {
        const element = $(
            `<div class="node-wrapper">
          <div class="node" ${parentId ? `data-parent-id="${parentId}"` : ''}>
            <div class="box">
              <div class="top">${label}</div>
              <div class="middle"></div>
              <div class="bottom"></div>
            </div>
          </div>
        </div>`
        );
        await sleep(DELAY);
        return element;
    };

    const drawLines = async () => {
        const $svg = $("#lines");
        $svg.html("");

        const parentChildPairs = $(".node[data-parent-id]");
        for (const child of parentChildPairs) {
            const $child = $(child);
            const parentId = $child.attr("data-parent-id");
            const $parent = $(`#${parentId}`);
            if (!$parent.length) continue;

            const svgRect = $svg[0].getBoundingClientRect();
            const parentRect = $parent[0].getBoundingClientRect();
            const childRect = $child[0].getBoundingClientRect();

            $svg.attr("width", svgRect.width);
            $svg.attr("height", svgRect.height);

            const x1 = parentRect.left + parentRect.width / 2 - svgRect.left;
            const y1 = parentRect.bottom - svgRect.top;
            const x2 = childRect.left + childRect.width / 2 - svgRect.left;
            const y2 = childRect.top - svgRect.top;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $(line).attr({ x1, y1, x2, y2, stroke: "black", "stroke-width": "1.5" });
            $svg.append(line);
            await sleep(DELAY);
        }
    };

    function splitNumber(number, nParts, i) {
        let base = Math.pow(10, i);
        let parts = [];
        for (let j = 0; j < nParts - 1; j++) {
            parts.push(number % base);
            number = Math.floor(number / base);
        }
        parts.push(number);
        return parts.reverse();
    }

    const toomCook3Visual = async (x, y, $container, parent = null) => {
        const myId = "node-" + (nodeId++);
        const $node = await newNodeElement(`ToomCook3(${x}, ${y})`, parent ? parent.attr("id") : null);
        $node.find(".node").attr("id", myId);

        if (x.toString().length <= 2 || y.toString().length <= 2) {
            $node.find(".middle").text(`Caso Base: ${x} × ${y}`);
            $node.find(".bottom").text(`${x * y}`);
            $container.append($node);
            await sleep(DELAY);
            return x * y;
        }

        // Calcula i
        let i = Math.max(Math.floor(Math.log10(x) / 3), Math.floor(Math.log10(y) / 3)) + 1;

        $node.find(".middle").append(`<br>i = ${i}`);

        // Base B = 10^i
        const B = Math.pow(10, i);
        $node.find(".middle").append(`<br>B = ${B}`);

        // Dividir os números em 3 partes
        const nParts = 3;
        let X = splitNumber(x, nParts, i);
        let Y = splitNumber(y, nParts, i);

        $node.find(".middle").append(`<br>p(x) = ${X[0]}x² + ${X[1]}x + ${X[2]}`);
        $node.find(".middle").append(`<br>q(x) = ${Y[0]}x² + ${Y[1]}x + ${Y[2]}`);

        const $wrapper = $("<div>").append($node);
        $container.append($wrapper);
        await sleep(DELAY);

        const $childrenDiv = $('<div class="children"></div>');
        $wrapper.append($childrenDiv);
        await sleep(DELAY);

        // Avaliar os pontos
        let p0 = X[2];
        let p1 = X[2] + X[1] + X[0];
        let p_1 = X[2] - X[1] + X[0];
        let p_2 = X[2] - X[1] * 2 + 4 * X[0];
        let pInf = X[0];

        let q0 = Y[2];
        let q1 = Y[2] + Y[1] + Y[0];
        let q_1 = Y[2] - Y[1] + Y[0];
        let q_2 = Y[2] - Y[1] * 2 + 4 * Y[0];
        let qInf = Y[0];

        // Multiplicar os pontos
        let r0 = await toomCook3Visual(p0, q0, $childrenDiv, $node.find(".node"));
        $node.find(".middle").append(`<br>r(0) = p(0)Xq(0) = ${p0} × ${p0} = ${r0}`);
        let r1 = await toomCook3Visual(p1, q1, $childrenDiv, $node.find(".node"));
        $node.find(".middle").append(`<br>r(1) = p(1)Xq(1) = ${p1} × ${p1} = ${r1}`);
        let r_1 = await toomCook3Visual(p_1, q_1, $childrenDiv, $node.find(".node"));
        $node.find(".middle").append(`<br>r(-1) = p(-1)Xq(-1) = ${p_1} × ${p_1} = ${r_1}`);
        let r_2 = await toomCook3Visual(p_2, q_2, $childrenDiv, $node.find(".node"));
        $node.find(".middle").append(`<br>r(-2) = p(-2)Xq(-2) = ${p_2} × ${p_2} = ${r_2}`);
        let rInf = await toomCook3Visual(pInf, qInf, $childrenDiv, $node.find(".node"));
        $node.find(".middle").append(`<br>r(Inf) = p(Inf)Xq(Inf) = ${pInf} × ${pInf} = ${rInf}`);


        // Interpolação
        let a0 = r0;
        let a4 = rInf;
        let a3 = (r_2 - r1) / 3;
        let a1 = (r1 - r_1) / 2;
        let a2 = r_1 - r0;

        a3 = ((a2 - a3) / 2) + 2 * rInf;
        a2 = a2 + a1 - a4;
        a1 = a1 - a3;

        $node.find(".middle").append(`<br> a0 = ${a0}, a1 = ${a1}, a2 = ${a2}, a3 = ${a3}, a4 = ${a4}`);
        $node.find(".middle").append(`<br> r(x) = ${a4}x + ${a3}x³ + ${a2}x² + ${a1}x + ${a0} `);


        // Recombinação
        let base = Math.pow(10, i);
        console.log(`base: ${base}`);

        let result = BigInt(a4) * BigInt(Math.pow(base, 4)) +
            BigInt(a3) * BigInt(Math.pow(base, 3)) +
            BigInt(a2) * BigInt(Math.pow(base, 2)) +
            BigInt(a1) * BigInt(base) +
            BigInt(a0);
        $node.find(".bottom").text(`${result}`);
        await sleep(DELAY);

        return result;
    };



    const buildToomTree = async () => {
        const xInput = $("#mult1").val();
        const yInput = $("#mult2").val();
        if ($('#toomcook-form').hasClass('was-validated') &&  (xInput) && (yInput)) {
            console.log(`xInput: ${xInput}`);
            console.log(`yInput: ${yInput}`);
            $('#toomcook-form').removeClass('was-validated');

            const x = BigInt(xInput);
            const y = BigInt(yInput);
            const $tree = $("#tree");
            const $lines = $("#lines");

            $tree.html("");
            $lines.html("");
            nodeId = 0;

            await sleep(DELAY);
            await toomCook3Visual(x, y, $tree);
            await sleep(DELAY);
            await drawLines();

        } else {
            $('#toomcook-form').addClass('was-validated');
        }

    };

    $("#buildBtn").on("click", buildToomTree);
    $("#xInput, #yInput").on("input", drawLines);
    const observer = new ResizeObserver(() => drawLines());
    observer.observe(document.getElementById("tree"));
});