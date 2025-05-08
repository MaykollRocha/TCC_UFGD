
/**
 * Url que aponta para pasta do educar
 */
const BASE_URL = `${window.location.protocol}//${window.location.hostname}/educar/educar`;

moment.locale('pt-br');

$('document').ready(function () {
    (() => {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    })();

    /*
     * Remove a classe que mostra erro no formulario ao fechar janela
     * tanto no cancelar quanto no botão fechar
     */
    $('button[data-bs-dismiss]').on('click', function () {
        $(this).parent('.modal-footer').parent('.modal-content').find('.modal-body form').removeClass('was-validated');
    });


    $('body').on('focus', 'input[type=time]', function (e) {
        if ($(this).val() === '') {
            $(this).val('00:00');
        }
    });

    $('.number').on('input', function () {
        let inputValue = $(this).val();
        let sanitizedValue = inputValue.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

        if (inputValue !== sanitizedValue) {
            // Se houver caracteres não numéricos, atualize o valor do campo
            $(this).val(sanitizedValue);
        }
    });

    $('.positivenumber').on('input', function () {
        let inputValue = $(this).val();
        let sanitizedValue = inputValue.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos

        if (inputValue !== sanitizedValue) {
            // Se houver caracteres não numéricos, atualize o valor do campo
            $(this).val(sanitizedValue);
        }
    });

    $('.trim-input').on('focusout', function () {
        $(this).val($(this).val().trim());
    });

    $('.floatnumber').on('input', function () {
        let inputValue = $(this).val();
        let sanitizedValue = inputValue.replace(/[^0-9,.]|[.,](?=.*[,.])/g, ''); // Remove caracteres não numéricos

        sanitizedValue = sanitizedValue.replace(/,/g, '.'); // Substitui vírgula por ponto

        if (inputValue !== sanitizedValue) {
            // Se houver caracteres não numéricos, atualize o valor do campo
            $(this).val(sanitizedValue);
        }
    });

    $('.uppercase').on('input', function () {
        this.value = this.value.toUpperCase();
    });

    /*Itera sobre todas datatables ativas e visiveis e ajusta as colunas dela.*/
    $('button[data-bs-toggle="tab"]').each(function () {
        $(this).on('shown.bs.tab', function () {
            // Itera sobre todas as DataTables ativas
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });
    });

    /*
     * Muda a classe dos buttons dialog
     */
    var oldcr = $.ui.dialog.prototype._create;

    $.ui.dialog.prototype._create = function () {
        oldcr.apply(this, arguments);

        $('.ui-dialog-buttonset button').addClass('btn btn-primary');
        $(".ui-dialog-buttonset button:contains('Cancelar')").removeClass('btn-primary').addClass('btn-danger');
        $('.ui-dialog-titlebar-close').addClass('btn btn-secondary');

        $(".ui-dialog-buttonset button:contains('Cancelar')").empty().html('<i class="bi bi-x-lg"></i> Cancelar');
        $(".ui-dialog-buttonset button:contains('Gravar')").empty().html('<i class="bi bi-floppy"></i> Gravar');
        $(".ui-dialog-buttonset button:contains('Imprimir')").empty().html('<i class="bi bi-printer"></i> Imprimir');
        $(".ui-dialog-buttonset button:contains('Remover')").empty().html('<i class="bi bi-trash"></i> Remover');
    }
});

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function capitalizeFirstLetterEachWord(text) {
    var textArray = text.split(' ');

    var textCapitalized = '';
    textArray.forEach(function (word) {
        textCapitalized += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
    })
    return textCapitalized.trim();
}

function removeElementsNotIn(mainArray, intersectionArray) {
    return mainArray.filter(function (item) {
        return intersectionArray.indexOf(item) < 0;
    });
}

function generateSelect(selector, data, value, text) {
    $(selector).empty();
    $(selector).append('<option></option>');

    for (let index in data) {
        var option = `<option value="${data[index][value]}">${data[index][text]}</option>`;
        $(selector).append(option);
    };
}

(function ($) {
    function setDatepickerPos(input, inst) {
        var rect = input.getBoundingClientRect();
        setTimeout(function () {
            var scrollTop = $("body").scrollTop();
            inst.dpDiv.css({ top: rect.top + input.offsetHeight + scrollTop });
        }, 0);
    }

    $.fn.e2DatePicker = function (options) {
        var defaults = {//Procedimento do jQuery Ui que cria uma caixa de data.
            showOn: "focus",
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            nextText: 'Próximo',
            prevText: 'Anterior',
            beforeShow: function (input, inst) {
                setDatepickerPos(input, inst)
            }
        };

        /*
         * Verifica se foi passado objetos
         */
        if (typeof options == 'object') {
            for (var option in options) {
                defaults[option] = options[option];
            }
        }

        $(this).datepicker(defaults);

        $(this).mask('99/99/9999');

        $(this).on('change', function () {
            const date = moment($(this).val(), 'DD/MM/YYYY');

            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

            if (($(this).val() != '' && date.isValid() == false) || ($(this).val() != '' && dateRegex.test($(this).val()) == false)) {
                swalEducarAlert.fire(
                    'Atenção!',
                    'Informe uma data válida.',
                    'warning'
                );

                $(this).val('');
            }
        });
    };

    $.fn.e2TinyMce = function (options) {
        let defaults = {
            height: 300,
            menubar: false,
            plugins: [
                'lists', 'link', 'wordcount'
            ],
            toolbar: 'undo redo | bold italic underline strikethrough superscript subscript link |' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent',
            language: 'pt_BR',
            contextmenu: false,
            resize: false,
        }

        /*
         * Verifica se foi passado objetos
         */
        if (typeof options == 'object') {
            for (const option in options) {
                defaults[option] = options[option];
            }
        }

        $(this).tinymce(defaults);
    };

    $.fn.e2PostPopup = function (link) {
        $(this).on('submit', function () {
            $(this).attr('method', 'POST');
            $(this).attr('action', link);

            $(this).attr('target', 'destino');
            return true;
        });
    };

    $.fn.e2AutoComplete = function (url, options) {
        const selector = `#${$(this).attr('id')}`;

        const colunas = typeof options.colunas == 'object' ? options.colunas : null;
        if (typeof options.colunas == 'object') {
            delete options.colunas;
        }

        const inputSet = typeof options.inputSet == 'object' ? options.inputSet : null;
        if (typeof options.inputSet == 'object') {
            delete options.inputSet;
        }

        const dados = typeof options.dados == 'object' ? options.dados : null;
        if (typeof options.dados == 'object') {
            delete options.dados;
        }

        if (typeof options.btnLimpar == 'string') {
            $(options.btnLimpar).on('click', function () {
                $(selector).val('').prop({ disabled: false, readonly: false });

                for (let i in inputSet) {
                    $(i).val('');
                }
            });
            delete options.btnLimpar;
        }

        var defaults = {
            minLength: 3,
            delay: 750,
            source: function (request, response) {
                if (typeof dados == 'object') {
                    for (let i in dados) {
                        request[i] = dados[i];
                    }
                }

                $.ajax({
                    url: url,
                    data: request,
                    dataType: 'json',
                    type: 'post',
                    success: function (data) {
                        response(data);
                    }
                });
            },
            select: function (event, ui) {
                if (typeof inputSet == 'object') {
                    for (let i in inputSet) {
                        if ($(i).hasClass('campo-data')) {
                            $(i).val(moment(ui.item[inputSet[i]]).format('DD/MM/YYYY'));

                        } else {
                            $(i).val(ui.item[inputSet[i]]);
                        }
                    }
                }

                $(this).prop({ disabled: true });
            }
        };

        /*
         * Verifica se foi passado objetos
         */
        if (typeof options == 'object') {
            for (var option in options) {
                defaults[option] = options[option];
            }
        }

        $(this)
            .autocomplete(defaults)
            .data("ui-autocomplete")
            ._renderItem = function (ul, item) {
                var cls = 'ui-menu-item';

                var $li = $("<li/>")
                    .data("item.data", item)
                    .addClass(cls);

                $li.append(`<b class="autocomplete-label">${item.label}</b><br/>`);

                for (let i in colunas) {
                    $li.append(`<b>${colunas[i]}:</b> ${typeof item[i] == 'undefined' ? 'Não Informado' : item[i]}<br/>`);
                }

                $li.appendTo(ul);

                return $li;
            };
    };

    /**
     * Função para ativar o loading em um botão
     * @param isLoading - Ativar ou desativar o loading
     * @param text - Texto a ser exibido ao ativar o loading
     * @returns {*}
     */
    $.fn.toggleLoading = function(isLoading, text = 'Loading...') {
        return this.each(function() {
            var $button = $(this);

            if (isLoading) {
                // Salva o conteúdo original do botão
                $button.data('original-content', $button.html());

                // Adiciona o spinner de loading e desabilita o botão
                $button.html(`
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>${text}</span>
                `).prop('disabled', true);
            } else {
                // Restaura o conteúdo original e reabilita o botão
                $button.html($button.data('original-content')).prop('disabled', false);
            }
        });
    };

    $.fn.toggleLoadingInput = function (isLoading) {
        return this.each(function () {
            const $input = $(this);
            const $inputGroup = $input.closest('.input-group');

            if (isLoading) {
                // Adiciona a classe de loading e desabilita o input
                if ($inputGroup.length) {
                    // Trabalha com input-group
                    $inputGroup.addClass('input-loading');
                } else {
                    // Caso não seja um input-group
                    if (!$input.parent().hasClass('input-loading')) {
                        $input.wrap('<div class="input-loading"></div>');
                    }
                }
                $input.prop('disabled', true);
            } else {
                // Remove a classe de loading e habilita o input
                if ($inputGroup.length) {
                    $inputGroup.removeClass('input-loading');
                } else {
                    if ($input.parent().hasClass('input-loading')) {
                        $input.unwrap();
                    }
                }
                $input.prop('disabled', false);
            }
        });
    };

    $.fn.toggleValidationState = function (state = '', message = '', timeout = 2000) {
        return this.each(function () {
            const $input = $(this);

            // Remove estados anteriores
            $input.removeClass('is-valid is-invalid');

            if (state === 'success') {
                // Aplica o estado de sucesso
                $input.addClass('is-valid');
                if (message) {
                    $input.next('.valid-feedback').remove();
                    $input.after(`<div class="valid-feedback">${message}</div>`);
                }
            } else if (state === 'error') {
                // Aplica o estado de erro
                $input.addClass('is-invalid');
                if (message) {
                    $input.next('.invalid-feedback').remove();
                    $input.after(`<div class="invalid-feedback">${message}</div>`);
                }
            }

            if (timeout != null) {
                setTimeout(function () {
                    $input.removeClass('is-valid is-invalid');
                }, timeout);
            }
        });
    };
})(jQuery);

const swalEducarDelete = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-danger me-2',
        cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
});

const swalEducarConfirm = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-default btn-outline-dark me-2',
        cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
});

const swalEducarEdit = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary me-2',
        cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
});

const swalEducarAlert = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
});

const swalEducarMerenda = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
});

const swalEducarLoading = Swal.mixin({
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
});


const diffDate = function (data1, data2) {
    const exp = new RegExp('^[0-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9]$');

    if ((typeof data1 == 'undefined') || (typeof data2 == 'undefined') || (!exp.test(data1)) || (!exp.test(data2))) {
        return 0;
    }

    data1 = data1.split('-');
    data2 = data2.split('-');

    data1 = new Date(data1[0], parseInt(data1[1]) - 1, data1[2]);
    data2 = new Date(data2[0], parseInt(data2[1]) - 1, data2[2]);

    data1.setUTCHours(0);
    data2.setUTCHours(0);

    if (data1 < data2) {
        return 1;
    }

    if (data1 > data2) {
        return -1;
    }

    return 0;
}