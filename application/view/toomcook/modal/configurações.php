<div class="modal fade" id="modal-config" data-bs-backdrop="static" data-bs-focus="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    Configurações no código
                </h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <div class="container-fluid">
                    <div class="col-12">
                        <label for="tempo" class="form-label"> Tempo de TimeOut</label>
                        <input type="number" class="form-control positivenumber" id="tempo" value="1000" min="500" max="3000" />
                    </div>

                    <div class="col-12 mt-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="definir">
                            <label class="form-check-label" for="definir">Definir \( K_x \) e \( K_y \)</label>
                        </div>
                    </div>

                    <div class="col-12">
                        <label for="kx" class="form-label"> \( K_x \)</label>
                        <input type="number" class="form-control positivenumber" id="kx" value="2" min="1" max="2" />
                    </div>

                    <div class="col-12">
                        <label for="ky" class="form-label"> \( K_y \)</label>
                        <input type="number" class="form-control positivenumber" id="ky" value="2" min="1" max="2" />
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal"> 
                    <i class="bi bi-x"></i>
                    Cancelar
                </button>
                
                <button type="button" class="btn btn-primary" id="atualizar">
                    <i class="bi bi-floppy"></i>
                    Gravar
                </button>
            </div>
        </div>
    </div>
</div>
