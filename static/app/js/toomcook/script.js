const matricesArea = document.getElementById('matrices-area');
const stepDescription = document.getElementById('step-description');

const steps = [
];

let currentStep = 0;

function drawMatrix(matrix, name) {
  let html = `<table class="matrix"><caption>${name}</caption><tbody>`;
  matrix.forEach(row => {
    html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function showStep(stepIndex) {
  const step = steps[stepIndex];
  if (!step) return;

  stepDescription.textContent = step.desc;

  let matricesHtml = '';
  for (const [name, matrix] of Object.entries(step.matrices)) {
    matricesHtml += drawMatrix(matrix, name);
  }
  matricesArea.innerHTML = matricesHtml;
}

document.getElementById('continue').onclick = () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
};

document.getElementById('reinicie').onclick = () => {
  currentStep = 0;
  showStep(currentStep);
};


$(function () {

    class Fraction {
        constructor(numerator, denominator = 1n) {
            this.numerator = BigInt(numerator);
            this.denominator = BigInt(denominator);
            this.reduce();
        }

        reduce() {
            const gcd = (a, b) => (b === 0n ? a : gcd(b, a % b));
            let g = gcd(this.numerator < 0n ? -this.numerator : this.numerator, this.denominator);
            this.numerator /= g;
            this.denominator /= g;
            if (this.denominator < 0n) {
                this.numerator = -this.numerator;
                this.denominator = -this.denominator;
            }
        }

        add(other) {
            return new Fraction(
                this.numerator * other.denominator + other.numerator * this.denominator,
                this.denominator * other.denominator
            );
        }

        sub(other) {
            return new Fraction(
                this.numerator * other.denominator - other.numerator * this.denominator,
                this.denominator * other.denominator
            );
        }

        mul(other) {
            return new Fraction(
                this.numerator * other.numerator,
                this.denominator * other.denominator
            );
        }

        div(other) {
            if (other.numerator === 0n) throw new Error("Divisão por zero.");
            return new Fraction(
                this.numerator * other.denominator,
                this.denominator * other.numerator
            );
        }

        equals(other) {
            return this.numerator === other.numerator && this.denominator === other.denominator;
        }

        isZero() {
            return this.numerator === 0n;
        }

        toBigInt() {
            // Trunca a parte decimal
            return this.numerator / this.denominator;
        }

        toNumber() {
            return Number(this.numerator) / Number(this.denominator);
        }

        static fromNumber(num, precision = 1e9) {
            // Converte um n�mero JS float em Fraction aproximado
            let denominator = BigInt(precision);
            let numerator = BigInt(Math.round(num * precision));
            return new Fraction(numerator, denominator);
        }
    }

    function adicionarPasso(descricao, matrizes = {}) {
        const stepHtml = $('<div class="step"></div>');
        stepHtml.append(`<p class="step-description">${descricao}</p>`);

        for (const [nome, matriz] of Object.entries(matrizes)) {
            const tabela = $(drawMatrix(matriz, nome));
            stepHtml.append(tabela);
        }

        $('#matrices-area').append(stepHtml);
    }   


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

    // Função principal Toom-Cook W adaptada
    function toom_cook_w(x, y, kx, ky) {
        // 1.Divisão
        x = BigInt(x);
        y = BigInt(y);

        // Selecionar a Base
        const base_i = Math.max(
            Math.floor(Math.log10(Number(x)) / kx),
            Math.floor(Math.log10(Number(y)) / ky)
        ) + 1;

        console.log(`Base de divisão: ${base_i}`);
        
        // Dividir os números
        let p_x = split_number(x, kx, base_i);
        let q_x = split_number(y, ky, base_i);
        
        adicionarPasso("Dividindo os números em partes", {
            "\\( P(x) \\)": [p_x.map(v => new Fraction(v).toBigInt())],
            "\\( Q(x) \\)": [q_x.map(v => new Fraction(v).toBigInt())]
        });
        
        // 2.Avaliação

        // Definir o grau do polinômio
        const d = kx + ky - 1;
        const max_k = Math.max(kx, ky);

        // Definição dos pontos de avaliação
        // 0, 1, -1, -2, inf
        const x_vals = [new Fraction(0n), new Fraction(1n), new Fraction(-1n), new Fraction(-2n), 'inf'].slice(0, d);
        
        adicionarPasso("Dividindo os números em partes", {
            "\\( X \\)": [x_vals.map(v => v instanceof Fraction ? v.toBigInt() : v)],
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

        // Avaliação dos polinômios nos pontos x
        const p = mat.map((row) =>
            row.reduce((acc, val, col) => acc.add(val.mul(new Fraction(col < p_x.length ? p_x[col] : 0n))), new Fraction(0n))
        );
        const q = mat.map((row) =>
            row.reduce((acc, val, col) => acc.add(val.mul(new Fraction(col < q_x.length ? q_x[col] : 0n))), new Fraction(0n))
        );

        // 3. Multiplicação pontual
        let r_x = [];
        for (let i = 0; i < d; i++) {
            r_x[i] = new Fraction(p[i].toBigInt() * q[i].toBigInt());
        }

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

        // Inversão da matriz de interpolação
        let r_mat_inv = inversa_matriz(r_mat);

        // Cálculo do vetor r (coeficientes)
        let r = r_mat_inv.map((row) =>
            row.reduce((acc, val, col) => acc.add(val.mul(r_x[col])), new Fraction(0n))
        );

        // 5. Recomposição
        let soma = new Fraction(0n);
        for (let ind = 0; ind < r.length; ind++) {
            soma = soma.add(r[ind].mul(new Fraction(BigInt(10) ** BigInt(base_i * ind))));
        }

        // Retorna inteiro (trunca parte decimal)
        return soma.toBigInt();
    }

    let resultado = toom_cook_w(
        "123123123423",
        "56453221",	
        3,
        2
    );

    console.log(resultado.toString());
});
