/**
 * Global
 */
var ktane = ktane || {};

$('h2').on('dblclick', function () {
    $(this).closest('section').toggleClass('collapsed');
}).attr('title', 'Double-click to expand/collapse');

/** Reset inputs */
ktane.resetInputs = function ($container) {
    $container.find('textarea').val('');
    $container.find('.selected').removeClass('selected');

    return $container.find('input').each(function () {
        if (this.type === 'text') {
            $(this).val('').trigger('keyup');
        } else if (this.type === 'checkbox') {
            this.checked = false;
        } else if (this.type === 'radio' && !this.value) {
            this.checked = true;
        }
    });
}

ktane.resetInputs($('body'));
$('.jsResetSection').on('click', function () {
    ktane.resetInputs($(this).closest('section')).filter('[type="text"]').first().focus();
});

(function () {
    /**
     * Wire sequence
     */
    var $instructions = $('#sequenceInstruction'),
        count = {
            red: 0,
            blue: 0,
            black: 0
        },
        occurrences = {
            red: ['C', 'B', 'A', 'AC', 'B', 'AC', 'ABC', 'AB', 'B'],
            blue: ['B', 'AC', 'B', 'A', 'B', 'BC', 'C', 'AC', 'A'],
            black: ['ABC', 'AC', 'B', 'AC', 'B', 'BC', 'AB', 'C', 'C']
        };

    $('#sequenceOptions button').on('click', function () {
        var colour = this.getAttribute('data-colour'),
                letter = this.getAttribute('data-letter'),
                $li = $('<li><button class="button ' + colour + '" data-colour="' + colour + '" data-letter="' + letter
                        + '">' + letter + '</button></li>');

        if (typeof occurrences[colour][count[colour]] !== 'undefined') {
            $li.append(occurrences[colour][count[colour]].indexOf(letter) === -1 ? 'Ignore' : 'Cut');
            count[colour]++;
            $instructions.append($li);
        }
    });

    $instructions.on('click', 'button', function () {
        var deleteIndex = $(this).parent().index();

        $instructions.children('li:eq(' + deleteIndex + '), li:gt(' + deleteIndex + ')').each(function () {
            var button = this.firstChild;
            count[button.getAttribute('data-colour')]--;
            $(this).remove();
        });
    });
})();

(function () {
    /**
     * Venn diagram
     */
    var instructions = {
                C: 'Cut',
                D: '<strong>Do not</strong> cut',
                S: 'If last digit of serial is even, cut',
                P: 'If parallel port, cut',
                B: 'If 2+ \ud83d\udd0b, cut'
            },
            conditions = { // Initialize
                false: {
                    false: {
                        false: {}, true: {}
                    },
                    true: {
                        false: {}, true: {}
                    }
                },
                true: {
                    false: {
                        false: {}, true: {}
                    },
                    true: {
                        false: {}, true: {}
                    }
                }
            },
            $checkboxes = $('#vennOptions input[type="checkbox"]'),
            $instruction = $('#sectionVenn .instruction');

    //         Red    Blue   Star   LED
    conditions[false][false][false][false] = 'C';
    conditions[false][false][false][true ] = 'D';
    conditions[false][false][true ][false] = 'C';
    conditions[false][false][true ][true ] = 'B';
    conditions[false][true ][false][false] = 'S';
    conditions[false][true ][false][true ] = 'P';
    conditions[false][true ][true ][false] = 'D';
    conditions[false][true ][true ][true ] = 'P';
    conditions[true ][false][false][false] = 'S';
    conditions[true ][false][false][true ] = 'B';
    conditions[true ][false][true ][false] = 'C';
    conditions[true ][false][true ][true ] = 'B';
    conditions[true ][true ][false][false] = 'S';
    conditions[true ][true ][false][true ] = 'S';
    conditions[true ][true ][true ][false] = 'P';
    conditions[true ][true ][true ][true ] = 'D';

    $checkboxes.on('change', function () {
        var checked = [];
        $checkboxes.each(function () {
            checked.push(this.checked);
        });

        $instruction.html(instructions[conditions[checked[0]][checked[1]][checked[2]][checked[3]]]);
    }).triggerHandler('change');
})();

(function () {
    /**
     * Alternate Venn diagram
     */
    var $doCut = $('#venn2DoCut'),
        $doNotCut = $('#venn2DoNotCut'),
        $checkboxes = $('#sectionVenn2 input[type="checkbox"]'),
        $serialEven = $('#venn2SerialEven'),
        $parallelExists = $('#venn2ParallelExists'),
        $multipleBatteries = $('#venn2MultipleBatteries');

    $checkboxes.on('change', function () {
        var $serialList,
            $parallelList,
            $batteryList;

        $doCut.empty();
        $doNotCut.empty();

        $serialList = $serialEven.prop('checked') ? $doCut : $doNotCut;
        $parallelList = $parallelExists.prop('checked') ? $doCut : $doNotCut;
        $batteryList = $multipleBatteries.prop('checked') ? $doCut : $doNotCut;

        addRow($doCut, [
            {},
            {star: true},
            {red: true, star: true}
        ]);
        addRow($doNotCut, [
            {light: true},
            {blue: true, star: true},
            {red: true, blue: true, star: true, light: true}
        ]);
        addRow($serialList, [
            {red: true},
            {blue: true},
            {red: true, blue: true},
            {red: true, blue: true, light: true}
        ]);
        addRow($parallelList, [
            {blue: true, light: true},
            {red: true, blue: true, star: true},
            {blue: true, star: true, light: true}
        ]);
        addRow($batteryList, [
            {red: true, light: true},
            {star: true, light: true},
            {red: true, star: true, light: true}
        ]);
    }).triggerHandler('change');

    function addRow($table, items) {
        $.each(items, function (i, item) {
            var $tr = $('<tr></tr>');
            $tr.append($('<td>' + (item.star ? '★' : '') + '</td>'));
            $tr.append($('<td' + (item.red ? ' class="red"' : '') + '></td>'));
            $tr.append($('<td' + (item.blue ? ' class="blue"' : '') + '></td>'));
            $tr.append($('<td>' + (item.light ? '💡' : '') + '</td>'));
            $table.append($tr);
        });
    }
})();

(function () {
    /**
     * Passwords
     * */
    var passwords = [
                'about', 'after', 'again', 'below', 'could',
                'every', 'first', 'found', 'great', 'house',
                'large', 'learn', 'never', 'other', 'place',
                'plant', 'point', 'right', 'small', 'sound',
                'spell', 'still', 'study', 'their', 'there',
                'these', 'thing', 'think', 'three', 'water',
                'where', 'which', 'world', 'would', 'write'
            ],
            $passwordContainer = $('#passwords'),
            $passwords = [],
            $row,
            $inputs = $('#passwordOptions > li > input');

    passwords.forEach(function (password, i) {
        var $cell;
        if (i % 5 === 0) {
            $row = $('<tr></tr>').appendTo($passwordContainer);
        }

        $cell = $('<td>' + password + '</td>').appendTo($row);
        $passwords.push($cell);
    });

    $inputs.on('keyup', function () {
        var pattern = '^',
                regex;
        this.value = this.value.replace(/[^a-z]/gi, '').toLowerCase();
        $inputs.each(function (i, input) {
            pattern += input.value ? '[' + input.value + ']' : '.';
        });
        pattern += '$';
        regex = new RegExp(pattern);

        $passwords.forEach(function ($password) {
            $password.toggleClass('inactive', !$password.text().match(regex));
        });
    });
})();
