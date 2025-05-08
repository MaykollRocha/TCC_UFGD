$(function () {
	const DELAY = 300;
	const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	let nodeId = 0;

	const newNodeElement = async (label, parentId = null) => {
		const element = $(`
        <div class="node-wrapper">
          <div class="node" ${parentId ? `data-parent-id="${parentId}"` : ''}>
            <div class="box">
              <div class="top">${label}</div>
              <div class="middle"></div>
              <div class="bottom"></div>
            </div>
          </div>
        </div>
      `);
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

	const toomCook3Visual = async (x, y, $container, parent = null) => {
		const myId = "node-" + (nodeId++);
		const $node = await newNodeElement(`T(${x}, ${y})`, parent ? parent.attr("id") : null);
		$node.find(".node").attr("id", myId);

		if (x.toString().length <= 2 || y.toString().length <= 2) {
			$node.find(".middle").text(`Caso Base: ${x} × ${y}`);
			$node.find(".bottom").text(`${x * y}`);
			$container.append($node);
			await sleep(DELAY);
			return x * y;
		}
		console.log(Math.log10(x), Math.floor(Math.log10(x)),Math.floor(Math.log10(x)) / 3, Math.floor(Math.floor(Math.log10(x)) / 3));
		// Determina o valor de i e a base B = 10^i
		const i = Math.max(
			Math.floor(Math.floor(Math.log10(x)) / 3),
			Math.floor(Math.floor(Math.log10(y)) / 3)
		) + 1;

		const B = Math.pow(10, i);

		// Função de split baseada em base B
		const splitBaseB = (num, B) => {
			const parts = [];
			while (num > 0) {
				parts.unshift(num % B);
				num = Math.floor(num / B);
			}
			while (parts.length < 3) parts.unshift(0); // garante 3 partes
			return parts.slice(-3);
		};
		// Splits
		const [a2, a1, a0] = splitBaseB(x, B);
		const [b2, b1, b0] = splitBaseB(y, B);
		
		
		const $wrapper = $("<div>").append($node);
		$container.append($wrapper);
		await sleep(DELAY);

		const $childrenDiv = $('<div class="children"></div>');
		$wrapper.append($childrenDiv);
		await sleep(DELAY);

		$node.find(".middle").html(`a2=${a2}, a1=${a1}, a0=${a0}<br>b2=${b2}, b1=${b1}, b0=${b0}`);

		const points = [0, 1, -1, 2, Infinity];
		const p = [];
		// Cria os Evaluation
		points.forEach(async (val) => {
			let u, v;
			if (val === Infinity) {
				u = a2;
				v = b2;
			} else {
				u = a2 * val * val + a1 * val + a0;
				v = b2 * val * val + b1 * val + b0;
			}
			$node.find(".middle").append(`<br>p${points.indexOf(val)}=${val}`);
			$node.find(".middle").append(`<br>p(x)= ${a2}*x^${val * val} +  ${a1}*x^${val} + ${a0}<br> q(x)= ${b2}*x^${val * val} +  ${b1}*x^${val} + ${b0}`);
			const res = await toomCook3Visual(u, v, $childrenDiv, $node.find(".node"));
			$node.find(".middle").append(`<br>r(x)= ${a2}*x^${val * val} +  ${a1}*x^${val} + ${a0}<br> q(x)= ${b2}*x^${val * val} +  ${b1}*x^${val} + ${b0}`);
			p.push(res);
			$node.find(".middle").append(`<br>p${points.indexOf(val)}=${res}`);
		});
		

		const [r0, r1, r_1, r2, rInf] = p;

		const w0 = r0;
		const w4 = rInf;
		const w1 = (r1 - r_1) / 2;
		const w2 = r_1 - w0 - w4;
		const w3 = (r2 - r1 - 8 * w4 + 8 * w0) / 6;

		const result = Math.round(
			w0 + w1 * B + w2 * B * B + w3 * B * B * B + w4 * B * B * B * B
		);
		$node.find(".bottom").text(`${result}`);
		await sleep(DELAY);

		return result;
	};


	const buildToomTree = async () => {
		const x = parseInt($("#mult1").val());
		const y = parseInt($("#mult2").val());
		const $tree = $("#tree");
		const $lines = $("#lines");

		$tree.html("");
		$lines.html("");
		nodeId = 0;

		if (isNaN(x) || isNaN(y)) {
			alert("Por favor, insira dois números inteiros válidos.");
			return;
		}

		await sleep(DELAY);
		await toomCook3Visual(x, y, $tree);
		await sleep(DELAY);
		await drawLines();
	};

	$("#buildBtn").on("click", buildToomTree);
	$("#xInput, #yInput").on("input", drawLines);
	const observer = new ResizeObserver(() => drawLines());
	observer.observe(document.getElementById("tree"));
});