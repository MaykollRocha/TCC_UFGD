
(function ($) {
    $.fn.bootstrapTransfer = function (options) {
        var settings = $.extend({}, $.fn.bootstrapTransfer.defaults, options);
        var $this;

        /* #=============================================================================== */
        /* # Expose public functions */
        /* #=============================================================================== */
        this.populate = function (input) {
            $this.populate(input);
        };

        this.set_values = function (values) {
            $this.set_values(values);
        };

        this.get_values = function () {
            return $this.get_values();
        };

        this.clear = function () {
            $this.clear();
        }

        return this.each(function () {
            $this = $(this);

            /* #=============================================================================== */
            /* # Add widget markup */
            /* #=============================================================================== */
            $this.append($.fn.bootstrapTransfer.defaults.template);
            $this.addClass("bootstrap-transfer-container");

            /* #=============================================================================== */
            /* # Initialize internal variables */
            /* #=============================================================================== */
            $this.filter_input = $this.find('.filter-input');
            
            $this.remaining_select = $this.find('select.remaining');
            $this.target_select = $this.find('select.target');
            
            $this.add_btn = $this.find('.button-add');
            $this.remove_btn = $this.find('.button-remove');
            $this.choose_all_btn = $this.find('.button-chooseall');
            $this.clear_all_btn = $this.find('.button-clearall');

            $this.remaining_list = [];
            $this.target_list = [];
            $this.group_list = [];

            /* #=============================================================================== */
            /* # Apply settings */
            /* #=============================================================================== */

            /* target_name */
            if (settings.target_name != '') {
                $this.target_select.attr({ 'name': `${settings.target_name}[]`, 'id': settings.target_name });
            }

            /* remaining_name */
            if (settings.remaining_name != '') {
                $this.remaining_select.attr({ 'name': `${settings.remaining_name}[]`, 'id': settings.remaining_name });
            }

            /* #=============================================================================== */
            /* # Wire internal events */
            /* #=============================================================================== */
            $this.add_btn.click(function () {
                $this.move_elems($this.remaining_select.val(), false, true);
            });

            $this.remove_btn.click(function () {
                $this.move_elems($this.target_select.val(), true, false);
            });

            $this.choose_all_btn.click(function () {
                $this.move_all(false, true);
            });

            $this.clear_all_btn.click(function () {
                $this.move_all(true, false);
            });

            $this.remaining_select.on('dblclick', 'option', function () {
                $this.move_elems($this.remaining_select.val(), false, true);
            });

            $this.target_select.on('dblclick', 'option', function () {
                $this.move_elems($this.target_select.val(), true, false);
            });

            $this.filter_input.keyup(function () {
                $this.update_lists(true);
            });

            /* #=============================================================================== */
            /* # Implement public functions */
            /* #=============================================================================== */
            $this.populate = function (input) {
                $this.filter_input.val('');
                for (var i in input) {
                    var e = input[i];
                    $this.remaining_list.push([{ value: e.value, content: e.content, group: e.group }, true]);
                    $this.target_list.push([{ value: e.value, content: e.content, group: e.group }, false]);

                    if(e.group != undefined && !$this.group_list.includes(e.group)){
                        $this.group_list.push(e.group);
                    }
                }
                $this.update_lists(true);
            };

            $this.set_values = function (values) {
                if (typeof values === 'undefined' || values.length === 0) {
                    $this.move_all(true, false);
                } else {
                    for (var i in values) {
                        val = values[i];
                        for (var j in $this.remaining_list) {
                            var e = $this.remaining_list[j];
                            if (e[0].value == val) {
                                e[1] = false;
                                $this.target_list[j][1] = true;
                            }
                        }
                    }
                    $this.update_lists(false);
                }
            };

            $this.get_values = function () {
                $this.unselect_all_remaining($this.remaining_select);
                $this.select_all_target($this.target_select);
                return $this.get_internal($this.target_select);
            };

            $this.clear = function () {
                $this.remaining_list = [];
                $this.target_list = [];
                $this.group_list = [];
                $this.remaining_select.empty();
                $this.target_select.empty();
            };

            /* #=============================================================================== */
            /* # Implement private functions */
            /* #=============================================================================== */
            $this.get_internal = function (selector) {
                var res = [];
                selector.find('option').each(function () {
                    res.push($(this).val());
                });
                return res;
            };

            $this.unselect_all_remaining = function (selector) {
                selector.find('option').each(function () {
                    $(this).prop('selected', false);
                });
            };

            $this.select_all_target = function(selector) {
                selector.find('option').each(function () {
                    $(this).prop('selected', false);
                    $(this).prop('selected', true);
                });
            }

            $this.to_dict = function (list) {
                var res = {};
                for (var i in list)
                    res[list[i]] = true;
                return res;
            };

            $this.update_lists = function (force_hilite_off) {
                var old;
                if (!force_hilite_off) {
                    old = [
                        $this.to_dict($this.get_internal($this.remaining_select)),
                        $this.to_dict($this.get_internal($this.target_select))
                    ];
                }

                $this.remaining_select.empty();
                $this.target_select.empty();
                var lists = [$this.remaining_list, $this.target_list];
                var source = [$this.remaining_select, $this.target_select];

                if($this.group_list.length > 0){
                    $this.group_list.forEach(element => {
                        for (var i in lists) {
                            var htmlGroup = '';
                            var hasContent = false;

                            for (var j in lists[i]) {
                                var e = lists[i][j];
                                if (e[1] && e[0].group == element) {
                                    hasContent = true;
                                    var selected = '';
                                    if (!force_hilite_off && settings.hilite_selection && !old[i].hasOwnProperty(e[0].value)) {
                                        selected = 'selected="selected"';
                                    }
                                    htmlGroup += '<option style="background-color: transparent;" ' + selected + 'value=' + e[0].value + '>' + e[0].content + '</option>'
                                }
                            }
                            if(hasContent){
                                htmlGroup = `<optgroup label="${element}">` + htmlGroup + `</optgroup>`;
                                source[i].append(htmlGroup);
                            }
                        }
                    });
                } else {
                    for (var i in lists) {
                        for (var j in lists[i]) {
                            var e = lists[i][j];
                            if (e[1]) {
                                var selected = '';
                                if (!force_hilite_off && settings.hilite_selection && !old[i].hasOwnProperty(e[0].value)) {
                                    selected = 'selected="selected"';
                                }
                                source[i].append('<option style="background-color: transparent;" ' + selected + 'value=' + e[0].value + '>' + e[0].content + '</option>');
                            }
                        }
                    }
                }

                $this.remaining_select.find('option').each(function () {
                    var inner = $this.filter_input.val().toLowerCase();
                    var outer = $(this).html().toLowerCase();
                    if (outer.indexOf(inner) == -1) {
                        $(this).remove();
                    }
                });
            };

            $this.move_elems = function (values, remaining, target) {
                for (var i in values) {
                    val = values[i];
                        for (var j in $this.remaining_list) {
                        var e = $this.remaining_list[j];
                        if (e[0].value == val) {
                            e[1] = remaining;
                            $this.target_list[j][1] = target;
                        }
                    }
                }
                $this.update_lists(false);
            };

            $this.move_all = function (remaining, target) {
                for (var i in $this.remaining_list) {
                    $this.remaining_list[i][1] = remaining;
                    $this.target_list[i][1] = target;
                }
                $this.update_lists(false);
            };

            $this.data('bootstrapTransfer', $this);
            return $this;
        });
    };

    $.fn.bootstrapTransfer.defaults = {
        'template': `<div class="multi-select-transfer">
                        <div class="mst-filters">
                            <div class="mst-filters-left">
                                <input type="text" class="mst-filter-origin filter-input form-control">
                            </div>
                            <div class="mst-filters-right">
                            </div>
                        </div>
                        <div class="mst-selects">
                            <div class="mst-left">
                                <select multiple="multiple" name="remaining" class="filtered remaining mst-origin form-control">
                                </select>
                            </div>
                            <div class="mst-right">
                                <div class="mst-buttons">
                                    <button type="button" class="btn btn-default mst-select-add button-add">
                                        <i class="bi bi-chevron-right"></i>
                                    </button>
                                    <button type="button" class="btn btn-default mst-select-rem button-remove">
                                        <i class="bi bi-chevron-left"></i>
                                    </button>
                                    <button type="button" class="btn btn-default mst-select-add-all button-chooseall">
                                        <i class="bi bi-chevron-double-right"></i>
                                    </button>
                                    <button type="button" class="btn btn-default mst-select-rem-all button-clearall">
                                        <i class="bi bi-chevron-double-left"></i>
                                    </button>
                                </div>
                                <div class="mst-select-destiny">
                                    <select multiple="multiple" name="target" class="filtered target mst-destiny form-control">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>`,
        hilite_selection: true,
        remaining_name: '',
        target_name: ''
    };
})(jQuery);