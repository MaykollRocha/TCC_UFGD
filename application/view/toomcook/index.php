<link rel="stylesheet" href="/static/app/css/toomcook/styles.css">

<div class="row g-3 justify-content-center">
    <div class="row mb-3 col-10" id="inputs">
        <form class="row g-3 needs-validation justify-content-center" id="toomcook-form" novalidate>
            <div class="col-md-4">
                <label class="form-label required" for="mult1">Número 1</label>
                <input type="number" class="form-control" id="mult1" name="mult1" required>
                <div class="invalid-feedback">
                    Por favor, digite um número válido.
                </div>
            </div>
            <div class="col-md-4">
                <label class="form-label required" for="mult2">Número 2</label>
                <input type="number" class="form-control" id="mult2" name="mult2" required>
                <div class="invalid-feedback">
                    Por favor, digite um número válido.
                </div>
            </div>

            <div class="col-4 text-center d-flex align-items-end d-grid gap-2">
                <button type="button" class="btn btn-success" id="buildBtn">Rodar</button>

                <div class="btn-group" role="group" aria-label="Controle">
                    <button type="button" class="btn btn-success" id="continue">
                        <i class="bi bi-caret-right-fill"></i>
                    </button>

                    <button type="button" class="btn btn-danger" id="rollback">
                        <i class="bi bi-caret-left-fill" ></i>
                    </button>

                    <input type="radio" class="btn-check" name="options" id="pause" autocomplete="off">
                    <label class="btn btn-secondary" for="pause">
                        <i class="bi bi-pause"></i>
                    </label>

                    <input type="radio" class="btn-check" name="options" id="auto" autocomplete="off">
                    <label class="btn btn-secondary" for="auto">
                        <i class="bi bi-chevron-double-right"></i>
                    </label>

                    <input type="radio" class="btn-check" name="options" id="reinicie" autocomplete="off">
                    <label class="btn btn-secondary" for="reinicie">
                        <i class="bi bi-arrow-clockwise"></i>
                    </label>

                </div>

                <button type="button" class="btn btn-dark rounded-circle d-flex align-items-center justify-content-center" id="configuracao" style="width: 48px; height: 48px;">
                    <i class="bi bi-gear" style="font-size: 1.5rem;"></i>
                </button>
            </div>
        </form>
    </div>
    <div class="row">  
    <div class="col-md-8 bg-primary text-white p-3 d-flex align-items-center justify-content-center flex-column">
        <div id="matrices-area">
            <!-- As matrizes desenhadas aqui -->
        </div>

        <div id="step-description" >
            <!-- Texto explicando o passo atual -->
        </div>
    </div>

    <div class="col-4 bg-secondary text-white p-1 d-flex align-items-center justify-content-center">
        <table class="table-bordered text-white">
            <thead>
                <tr>
                    <th class="text-start">
                        <span>\(\textbf{TOOM-COOK-W}(X, Y)\)</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr id="linha0">
                    <td class="text-start">
                        <span>\(k_x,k_y \gets \min(\max(\lfloor D_x / 10 \rfloor, 1), 3 ), \min(\max(\lfloor D_y / 10 \rfloor, 1), 3 )\)</span>
                    </td>
                </tr>
                <tr id="linha1">
                    <td class="text-start">
                        <span>\(i \gets \max(\lfloor \log_{10}(X) / kx \rfloor, \lfloor \log_{10}(Y) / ky \rfloor) + 1\)</span>
                    </td>
                </tr>
                <tr id="linha2">
                    <td class="text-start">
                        <span>\(A_{Kx - 1}, ..., A_0 \gets \text{divida } X \text{ em kx partes de tamanho } i\)</span>
                    </td>
                </tr>
                <tr id="linha3">
                    <td class="text-start">
                        <span>\(B_{Ky - 1}, ... , B_0 \gets \text{divida } Y \text{ em ky partes de tamanho } i\)</span>
                    </td>
                </tr>
                <tr id="linha4">
                    <td class="text-start">
                        <span>\(d \gets kx + ky - 1 \)</span>
                    </td>
                </tr>
                <tr id="linha5">
                    <td class="text-start">
                        <span>\(X \gets [\text{d pontos de avaliação}]   \)</span>
                    </td>
                </tr>
                <tr id="linha6">
                    <td class="text-start">
                        <span>\(P_x \gets [\text{Avaliação dos polinômios nos pontos x}] \)</span>
                    </td>
                </tr>
                <tr id="linha7">
                    <td class="text-start">
                        <span>\(Q_x \gets [\text{Avaliação dos polinômios nos pontos x}] \)</span>
                    </td>
                </tr>
                <tr id="linha8">
                    <td class="text-start">
                        <span>\(R_{x} \gets P_x \times Q_x [\text{Para todos os pontos de x}] \)</span>
                    </td>
                </tr>
                <tr id="linha9">
                    <td class="text-start">
                        <span>\(r_{d-1}, ... , r_0 \gets \text{Vandermonde matrix} \times R_x \)</span>
                    </td>
                </tr>
                <tr id="linha10">
                    <td class="text-start">
                        <span>\(Resultado \gets r_{d-1} \times x_{d-1} \times 10^{(d-1) \times i} +  ... + r_0*x_0 \times 10^{(0) \times i}  \)</span>
                    </td>
                </tr>
                <tr id="linha11">
                    <td class="text-start">
                        <span>\(\text{devolva } Resultado\)</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
</div>

<?php
include_once __DIR__ . '\modal\configurações.php';
?>

<script src="/static/app/js/toomcook/Fraction.js"></script>
<script src="/static/app/js/toomcook/script.js"></script>