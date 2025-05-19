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
        <!-- <div id="tree-container">
            <svg id="lines"></svg>
            <div id="tree"></div>
        </div> -->
        <div id="toom-visual" class="w-100">
            <div id="etapas-container" class="toom-cards p-3">
                <div class="d-flex flex-row gap-3 justify-content-center">
                    <!-- Coluna X -->
                    <table class="table table-bordered align-middle text-center">
                        <thead>
                            <tr>
                                <th>X</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>0</th>
                            </tr>
                            <tr>
                                <th>1</th>
                            </tr>
                            <tr>
                                <th>-1</th>
                            </tr>
                            <tr>
                                <th>-2</th>
                            </tr>
                            <tr>
                                <th>inf</th>
                            </tr>
                        </tbody>
                    </table>

                    <!-- p(x) = ax² + bx + c -->
                    <table class="table table-bordered align-middle text-center">
                        <thead>
                            <tr>
                                <th colspan="3">p(x) = ax² + bx + c</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="p0c"></th>
                                <th id="p0b"></th>
                                <th id="p0a"></th>
                            </tr>
                            <tr>
                                <th id="p1c"></th>
                                <th id="p1b"></th>
                                <th id="p1a"></th>
                            </tr>
                            <tr>
                                <th id="p_1c"></th>
                                <th id="p_1b"></th>
                                <th id="p_1a"></th>
                            </tr>
                            <tr>
                                <th id="p_2c"></th>
                                <th id="p_2b"></th>
                                <th id="p_2a"></th>
                            </tr>
                            <tr>
                                <th id="pinfc"></th>
                                <th id="pinfb"></th>
                                <th id="pinfa"></th>
                            </tr>
                        </tbody>
                    </table>

                    <!-- q(x) = ax² + bx + c -->
                    <table class="table table-bordered align-middle text-center">
                        <thead>
                            <tr>
                                <th colspan="3">q(x) = ax² + bx + c</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="q0c"></th>
                                <th id="q0b"></th>
                                <th id="q0a"></th>
                            </tr>
                            <tr>
                                <th id="q1c"></th>
                                <th id="q1b"></th>
                                <th id="q1a"></th>
                            </tr>
                            <tr>
                                <th id="q_1c"></th>
                                <th id="q_1b"></th>
                                <th id="q_1a"></th>
                            </tr>
                            <tr>
                                <th id="q_2c"></th>
                                <th id="q_2b"></th>
                                <th id="q_2a"></th>
                            </tr>
                            <tr>
                                <th id="qinfc"></th>
                                <th id="qinfb"></th>
                                <th id="qinfa"></th>
                            </tr>
                        </tbody>
                    </table>

                    <!-- r(x) = resultado da multiplicação -->
                    <table class="table table-bordered align-middle text-center">
                        <thead>
                            <tr>
                                <th colspan="5">r(x) = resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="r0"></th>
                            </tr>
                            <tr>
                                <th id="r1"></th>
                            </tr>
                            <tr>
                                <th id="r_1"></th>
                            </tr>
                            <tr>
                                <th id="r_2"></th>
                            </tr>
                            <tr>
                                <th id="r_inf"></th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p style="color:black">Interpolação</p>
                <div class="d-flex flex-row gap-3 justify-content-center">

                    <!-- Coluna r(X) -->
                    <table class="table table-bordered align-middle text-center">
                        <thead>
                            <tr>
                                <th>r(X)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="r0"></th>
                            </tr>
                            <tr>
                                <th id="r1"></th>
                            </tr>
                            <tr>
                                <th id="r_1"></th>
                            </tr>
                            <tr>
                                <th id="r_2"></th>
                            </tr>
                            <tr>
                                <th id="r_inf"></th>
                            </tr>
                        </tbody>
                    </table>

                    <!-- p(x) = ax² + bx + c (agora com coeficientes para polinômios interpolados de grau 4) -->
                    <table class="table table-bordered align-middle text-center">
                        <thead>
                            <tr>
                                <th colspan="5">p(x) = ax⁴ + bx³ + cx² + dx + e</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="p0e"></th>
                                <th id="p0d"></th>
                                <th id="p0c"></th>
                                <th id="p0b"></th>
                                <th id="p0a"></th>
                            </tr>
                            <tr>
                                <th id="p1e"></th>
                                <th id="p1d"></th>
                                <th id="p1c"></th>
                                <th id="p1b"></th>
                                <th id="p1a"></th>
                            </tr>
                            <tr>
                                <th id="p_1e"></th>
                                <th id="p_1d"></th>
                                <th id="p_1c"></th>
                                <th id="p_1b"></th>
                                <th id="p_1a"></th>
                            </tr>
                            <tr>
                                <th id="p_2e"></th>
                                <th id="p_2d"></th>
                                <th id="p_2c"></th>
                                <th id="p_2b"></th>
                                <th id="p_2a"></th>
                            </tr>
                            <tr>
                                <th id="pinfe"></th>
                                <th id="pinfd"></th>
                                <th id="pinfc"></th>
                                <th id="pinfb"></th>
                                <th id="pinfa"></th>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Vetor de coeficientes finais rn -->
                    <table class="table table-bordered align-middle text-center">
                        <thead>
                            <tr>
                                <th>rn</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="rn0"></th>
                            </tr>
                            <tr>
                                <th id="rn1"></th>
                            </tr>
                            <tr>
                                <th id="rn2"></th>
                            </tr>
                            <tr>
                                <th id="rn3"></th>
                            </tr>
                            <tr>
                                <th id="rn4"></th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p style="color: black;">Polinômio produto</p>
                <p>r(x) = r0 + r1 x + r2 x² + r3 x³ + r4 x⁴</p>

                <p style="color: black;">Recomposição x = base</p>
                <p>r(x) = r0 + r1 x + r2 x² + r3 x³ + r4 x⁴</p>
            </div>
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