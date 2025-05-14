<link rel="stylesheet" href="/static/app/css/toomcook/styles.css">

<div class="row gy-4">
    <div class="col-12" id="inputs">
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
            </div>
        </form>
    </div>

    <div class="col-md-8 bg-primary text-white p-3 d-flex align-items-center justify-content-center" id="quadrado-container">
        <div id="tree-container">
            <svg id="lines"></svg>
            <div id="tree"></div>
        </div>
    </div>

    <div class="col-md-4 bg-secondary text-white p-3 d-flex align-items-center justify-content-center">
        <table class="table-bordered text-white w-90">
            <thead>
                <tr>
                    <th class="text-start">
                        <span>\(\textbf{TOOM-COOK-3}(X, Y, n)\)</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr id="linha1">
                    <td class="text-start">
                        <span>\(\text{se } n \leq 2 \text{ devolva } X \cdot Y\)</span>
                    </td>
                </tr>
                <tr id="linha2">
                    <td class="text-start">
                        <span>\(i \gets \max(\lfloor \log_{10}(X) / 3 \rfloor, \lfloor \log_{10}(Y) / 3 \rfloor) + 1\)</span>
                    </td>
                </tr>
                <tr id="linha3">
                    <td class="text-start">
                        <span>\(B = 10^i\)</span>
                    </td>
                </tr>
                <tr id="linha4">
                    <td class="text-start">
                        <span>\(A_2, A_1, A_0 \gets \text{divida } X \text{ em três partes de tamanho } i\)</span>
                    </td>
                </tr>
                <tr id="linha5">
                    <td class="text-start">
                        <span>\(B_2, B_1, B_0 \gets \text{divida } Y \text{ em três partes de tamanho } i\)</span>
                    </td>
                </tr>
                <tr id="linha6">
                    <td class="text-start">
                        <span>\(P_0 = A_0, \quad Q_0 = B_0\)</span>
                    </td>
                </tr>
                <tr id="linha7">
                    <td class="text-start">
                        <span>\(P_1 = A_0 + A_1 + A_2, \quad Q_1 = B_0 + B_1 + B_2\)</span>
                    </td>
                </tr>
                <tr id="linha8">
                    <td class="text-start">
                        <span>\(P_{-1} = A_0 - A_1 + A_2, \quad Q_{-1} = B_0 - B_1 + B_2\)</span>
                    </td>
                </tr>
                <tr id="linha9">
                    <td class="text-start">
                        <span>\(P_{-2} = A_0 - 2A_1 + 4A_2, \quad Q_{-2} = B_0 - 2B_1 + 4B_2\)</span>
                    </td>
                </tr>
                <tr id="linha10">
                    <td class="text-start">
                        <span>\(P_\infty = A_2, \quad Q_\infty = B_2\)</span>
                    </td>
                </tr>
                <tr id="linha11">
                    <td class="text-start">
                        <span>\(R_0 = \text{TOOM-COOK-3}(P_0, Q_0, i)\)</span>
                    </td>
                </tr>
                <tr id="linha12">
                    <td class="text-start">
                        <span>\(R_1 = \text{TOOM-COOK-3}(P_1, Q_1, i)\)</span>
                    </td>
                </tr>
                <tr id="linha13">
                    <td class="text-start">
                        <span>\(R_{-1} = \text{TOOM-COOK-3}(P_{-1}, Q_{-1}, i)\)</span>
                    </td>
                </tr>
                <tr id="linha14">
                    <td class="text-start">
                        <span>\(R_{-2} = \text{TOOM-COOK-3}(P_{-2}, Q_{-2}, i)\)</span>
                    </td>
                </tr>
                <tr id="linha15">
                    <td class="text-start">
                        <span>\(R_\infty = \text{TOOM-COOK-3}(P_\infty, Q_\infty, i)\)</span>
                    </td>
                </tr>
                <tr id="linha16">
                    <td class="text-start">
                        <span>\(\text{Interpola os } R_i \text{ para obter os coeficientes } a_0, a_1, a_2, a_3, a_4\)</span>
                    </td>
                </tr>
                <tr id="linha17">
                    <td class="text-start">
                        <span>\(R = a_0 + a_1 \cdot B + a_2 \cdot B^2 + a_3 \cdot B^3 + a_4 \cdot B^4\)</span>
                    </td>
                </tr>
                <tr id="linha18">
                    <td class="text-start">
                        <span>\(\text{devolva } R\)</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</div>

<script src="/static/app/js/toomcook/script.js"></script>