<link rel="stylesheet" href="static/app/css/karatsuba/calculadora.css">


<div class="row g-3 justify-content-center">
    <div class="col-10" id="inputs">
        <form class="row g-1 needs-validation justify-content-center" id="karatsuba-form" novalidate>
            <div class="col-md-4">
                <label class="form-label" for="mult1">Número 1</label>
                <input type="number" class="form-control" id="mult1" name="mult1" placeholder="Digite o número 1">
                <div class="invalid-feedback">
                    Por favor, digite um número válido.
                </div>
            </div>
            <div class="col-md-4">
                <label class="form-label" for="mult2">Número 2</label>
                <input type="number" class="form-control" id="mult2" name="mult2" placeholder="Digite o número 2">
                <div class="invalid-feedback">
                    Por favor, digite um número válido.
                </div>
            </div>

            <div class="col-4 text-center d-flex align-items-end d-grid gap-2">
                <button type="button" class="btn btn-success" id="rodar">Rodar</button>

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

    <div class="col-9 bg-primary text-white p-3 d-flex align-items-center justify-content-center" id="quadrado-container">
        <div id="karatsuba-visual" class="w-100">
            <div id="etapas-container" class="karatsuba-cards p-3"></div>
        </div>
    </div>

    <div class="col-3 bg-secondary text-white p-1 d-flex align-items-center justify-content-center">
        <table class="table-bordered text-white">
            <thead>
                <tr>
                    <th class="text-start">
                        <span>\(\textbf{KARATSUBA}(X, Y, n)\)</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr id="linha1">
                    <td class="text-start">
                        <span>\(\text{se } n \leq 3 \text{ devolva } X \cdot Y\)</span>
                    </td>
                </tr>
                <tr id="linha2">
                    <td class="text-start">
                        <span>\(q \gets \lfloor n/2 \rfloor\)</span>
                    </td>
                </tr>
                <tr id="linha3">
                    <td class="text-start">
                        <span>\(A \gets X[q+1..n], \quad B \gets X[1..q]\)</span>
                    </td>
                </tr>
                <tr id="linha4">
                    <td class="text-start">
                        <span>\(C \gets Y[q+1..n], \quad D \gets Y[1..q]\)</span>
                    </td>
                </tr>
                <tr id="linha5">
                    <td class="text-start">
                        <span>\(E \gets \text{KARATSUBA}(A, C, \lfloor n/2 \rfloor)\)</span>
                    </td>
                </tr>
                <tr id="linha6">
                    <td class="text-start">
                        <span>\(F \gets \text{KARATSUBA}(B, D, \lfloor n/2 \rfloor)\)</span>
                    </td>
                </tr>
                <tr id="linha7">
                    <td class="text-start">
                        <span>\(G \gets \text{KARATSUBA}(A+B, C+D, \lfloor n/2 \rfloor + 1)\)</span>
                    </td>
                </tr>
                <tr id="linha8">
                    <td class="text-start">
                        <span>\(H \gets G - F - E\)</span>
                    </td>
                </tr>
                <tr id="linha9">
                    <td class="text-start">
                        <span>\(R \gets E \times 10^{2\lfloor n/2 \rfloor} + H \times 10^{\lfloor n/2 \rfloor} + F\)</span>
                    </td>
                </tr>
                <tr id="linha10">
                    <td class="text-start">
                        <span>\(\text{devolva } R\)</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</div>


<!-- Custom Script -->
<script src="static/app/js/karatsuba/calculadora.js"></script>