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

/** Navigation */
$('section').each(function () {
    var $section = $(this),
        id = $section.attr('id'),
        $a = $('<a href="#' + id + '">' + $(this).find('h2').first().text() + '</a>').on('click', function () {
            $section.removeClass('collapsed');
        });

    id && $('#navList').append($('<li></li>').append($a));
});

(function () {
    /**
     * Keypads
     */
    var columns = [
        ['balloon', 'at', 'upsidedowny', 'squigglyn', 'squidknife', 'hookn', 'leftc'],
        ['euro', 'balloon', 'leftc', 'cursive', 'hollowstar', 'hookn', 'questionmark'],
        ['copyright', 'pumpkin', 'cursive', 'doublek', 'meltedthree', 'upsidedowny', 'hollowstar'],
        ['six', 'paragraph', 'bt', 'squidknife', 'doublek', 'questionmark', 'smileyface'],
        ['pitchfork', 'smileyface', 'bt', 'rightc', 'paragraph', 'dragon', 'filledstar'],
        ['six', 'euro', 'tracks', 'ae', 'pitchfork', 'nwithhat', 'omega']
    ],
        $section = $('#sectionKeypads'),
        $imageLists = {}; // name -> $('<img />')[]

    $.each(columns, function (i, column) {
        var $column = $('<ul data-count="0"></ul>');
        $section.append($column);

        $.each(column, function (i, name) {
            var $img = $('<img data-name="' + name + '" src="keypads/' + name + '.png" width="64" height="64" />');
            $column.append($('<li></li>').append($img));

            name in $imageLists
                ? $imageLists[name].push($img)
                : $imageLists[name] = [$img];
        });
    });

    $section.on('click', 'img', function () {
        var $img = $(this),
            name = $img.data('name'),
            endState = !$img.hasClass('selected'),
            offset = endState ? 1 : -1;

        $.each($imageLists[name], function (i, $img) {
            var $column = $img.parent().parent();
            $img.toggleClass('selected', endState);
            $column.attr('data-count', parseInt($column.attr('data-count'), 10) + offset);
        });
    });

    $section.find('.jsResetSection').on('click', function () {
        // Also need to reset the indices after removing .selected
        $section.find('ul').attr('data-count', 0);
    });
})();

(function () {
    /**
     * Simon
     */
    var $checkbox = $('#simonVowel'),
        $strikeButtons = $('#sectionSimon input[name="simonStrikes"]'),
        $arrows = [],
        mappings = [ // (hasVowel, strikes) -> list of visible arrows by ID
            // No vowel
            [
                ['RB', 'BY', 'YR'],
                ['GY', 'YG'],
                ['RY', 'BG', 'GB', 'YR']
            ],
            // Vowel
            [
                ['RB', 'BR', 'GY', 'YG'],
                ['RY', 'BG', 'GB', 'YR'],
                ['RG', 'BR', 'GY', 'YB']
            ]
        ];

    $('#simonBoard').find('.arrow').each(function (i, arrow) {
        $arrows[arrow.id.replace(/^.*(?=..$)/, '')] = $(arrow);
    });

    $('#sectionSimon input').on('change', function () {
        var hasVowel = +$checkbox.prop('checked'),
            strikes = $strikeButtons.filter(':checked').val();

        for (var id in $arrows) {
            $arrows[id].removeClass('active');
        }

        $.each(mappings[hasVowel][strikes], function (i, id) {
            $arrows[id].addClass('active');
        });
    }).first().trigger('change');
})();

(function () {
    /**
     * Who's on First
     */
    var TL = 'top-left',
        TR = 'top-right',
        ML = 'middle-left',
        MR = 'middle-right',
        BL = 'bottom-left',
        BR = 'bottom-right',
        displays = {
            '\u00a0': BL,
            'BLANK': MR,
            'C': TR,
            'CEE': BR,
            'DISPLAY': BR,
            'FIRST': TR,
            'HOLD ON': BR,
            'LEAD': BR,
            'LED': ML,
            'LEED': BL,
            'NO': BR,
            'NOTHING': ML,
            'OKAY': TR,
            'READ': MR,
            'RED': MR,
            'REED': BL,
            'SAYS': BR,
            'SEE': BR,
            'U': TL,
            'UR': TL,
            'THEIR': MR,
            'THERE': BR,
            'THEY ARE': ML,
            'THEY\'RE': BL,
            'YES': ML,
            'YOU': MR,
            'YOU ARE': BR,
            'YOUR': MR,
            'YOU\'RE': MR
        },
        sequence = {
            'BLANK': 'WAIT, RIGHT, OKAY, MIDDLE, BLANK',
            'DONE': 'SURE, UH HUH, NEXT, WHAT?, YOUR, UR, YOU\'RE, HOLD, LIKE, YOU, U, YOU ARE, UH UH, DONE',
            'FIRST': 'LEFT, OKAY, YES, MIDDLE, NO, RIGHT, NOTHING, UHHH, WAIT, READY, BLANK, WHAT, PRESS, FIRST',
            'HOLD': 'YOU ARE, U, DONE, UH UH, YOU, UR, SURE, WHAT?, YOU\'RE, NEXT, HOLD',
            'LEFT': 'RIGHT, LEFT',
            'LIKE': 'YOU\'RE, NEXT, U, UR, HOLD, DONE, UH UH, WHAT?, UH HUH, YOU, LIKE',
            'MIDDLE': 'BLANK, READY, OKAY, WHAT, NOTHING, PRESS, NO, WAIT, LEFT, MIDDLE',
            'NEXT': 'WHAT?, UH HUH, UH UH, YOUR, HOLD, SURE, NEXT',
            'NO': 'BLANK, UHHH, WAIT, FIRST, WHAT, READY, RIGHT, YES, NOTHING, LEFT, PRESS, OKAY, NO',
            'NOTHING': 'UHHH, RIGHT, OKAY, MIDDLE, YES, BLANK, NO, PRESS, LEFT, WHAT, WAIT, FIRST, NOTHING',
            'OKAY': 'MIDDLE, NO, FIRST, YES, UHHH, NOTHING, WAIT, OKAY',
            'PRESS': 'RIGHT, MIDDLE, YES, READY, PRESS',
            'READY': 'YES, OKAY, WHAT, MIDDLE, LEFT, PRESS, RIGHT, BLANK, READY',
            'RIGHT': 'YES, NOTHING, READY, PRESS, NO, WAIT, WHAT, RIGHT',
            'SURE': 'YOU ARE, DONE, LIKE, YOU\'RE, YOU, HOLD, UH HUH, UR, SURE',
            'U': 'UH HUH, SURE, NEXT, WHAT?, YOU\'RE, UR, UH UH, DONE, U',
            'UH HUH': 'UH HUH',
            'UH UH': 'UR, U, YOU ARE, YOU\'RE, NEXT, UH UH',
            'UHHH': 'READY, NOTHING, LEFT, WHAT, OKAY, YES, RIGHT, NO, PRESS, BLANK, UHHH',
            'UR': 'DONE, U, UR',
            'WAIT': 'UHHH, NO, BLANK, OKAY, YES, LEFT, FIRST, PRESS, WHAT, WAIT',
            'WHAT': 'UHHH, WHAT',
            'WHAT?': 'YOU, HOLD, YOU\'RE, YOUR, U, DONE, UH UH, LIKE, YOU ARE, UH HUH, UR, NEXT, WHAT?',
            'YES': 'OKAY, RIGHT, UHHH, MIDDLE, FIRST, WHAT, PRESS, READY, NOTHING, YES',
            'YOU ARE': 'YOUR, NEXT, LIKE, UH HUH, WHAT?, DONE, UH UH, HOLD, YOU, U, YOU\'RE, SURE, UR',
            'YOU': 'SURE, YOU ARE, YOUR, YOU\'RE, NEXT, UH HUH, UR, HOLD, WHAT?, YOU',
            'YOU\'RE': 'YOU, YOU\'RE',
            'YOUR': 'UH UH, YOU ARE, UH HUH, YOUR'
        },
        $list = $('#wofList'),
        $table = $('#wofTable'),
        $displays = {},
        $rows = {};

    $.each(displays, function (word, location) {
        var $dt = $('<dt>' + word + '</dt>');
        $list.append($dt)
            .append($('<dd>' + location + '</dd>'));
        $displays[word] = $dt;
    });

    $.each(sequence, function (word, sequence) {
        var $row = $('<tr></tr>')
            .append('<th>"' + word + '":</th>')
            .append('<td>' + sequence + '</td>');
        $table.append($row);
        $rows[word] = $row;
    });

    $('#wofInput').on('keyup', function () {
        var value = this.value.replace(/^ +|[^a-z ']$/i, '').toUpperCase();
        this.value = value;

        $.each($displays, function (word, $dt) {
            $dt.removeClass('inactive');
        });
        $.each($rows, function (word, $row) {
            $row.removeClass('inactive');
        });

        if (!value) {
            return;
        }

        $.each($displays, function (word, $dt) {
            word.indexOf(value) !== 0 && $dt.addClass('inactive');
        });

        $.each($rows, function (word, $row) {
            word.indexOf(value) !== 0 && $row.addClass('inactive');
        });
    });
})();

(function () {
    /**
     * Memory
     */
    var inputRegex = /^[1-4]$/,
        $s = {}, // Cache jQuery objects for speed and convenience
        answerData;

    for (var i = 1; i <= 5; i++) {
        $s[i] = {
            d: $('#stage_' + i + '_display'),
            p: $('#stage_' + i + '_pos'),
            l: $('#stage_' + i + '_label')
        };

        if (i < 5) {
            $s[i].p.add($s[i].l).on('keyup', {j: i + 1}, function (e) {
                if (inputRegex.test(this.value)) {
                    $s[e.data.j].d.focus();
                }
            });
        }
    }

    $('#sectionMemory input').on('focus', function () {
        this.select();
    });

    answerData = { // {stage -> {display -> [element, value]} }
        1: {
            1: ['p', 2],
            2: ['p', 2],
            3: ['p', 3],
            4: ['p', 4]
        },
        2: {
            1: ['l', 4],
            2: ['p', $s[1].p],
            3: ['p', 1],
            4: ['p', $s[1].p]
        },
        3: {
            1: ['l', $s[2].l],
            2: ['l', $s[1].l],
            3: ['p', 3],
            4: ['l', 4]
        },
        4: {
            1: ['p', $s[1].p],
            2: ['p', 1],
            3: ['p', $s[2].p],
            4: ['p', $s[2].p]
        },
        5: {
            1: ['l', $s[1].l],
            2: ['l', $s[2].l],
            3: ['l', $s[4].l],
            4: ['l', $s[3].l]
        }
    };

    $('#sectionMemory input[id$="_display"]').on('keyup', function () {
        if (!inputRegex.test(this.value)) {
            return;
        }

        var index = parseInt(this.getAttribute('data-index'), 10),
            data = answerData[index][this.value],
            element = $s[index][data[0]],
            value = data[1];

        if (typeof value === 'object') {
            value = value.val() || value.attr('id').replace(/(\d).+$/, '$1');
        }

        element.val(value);
        $s[index][data[0] === 'p' ? 'l' : 'p'].focus();
    });
})();

(function () {
    /**
     * Morse
     */
    var freqs = {
        shell: '3.505',
        halls: '3.515',
        slick: '3.522',
        trick: '3.532',
        boxes: '3.535',
        leaks: '3.542',
        strobe: '3.545',
        bistro: '3.552',
        flick: '3.555',
        bombs: '3.565',
        'break': '3.572',
        brick: '3.575',
        steak: '3.582',
        sting: '3.592',
        vector: '3.595',
        beats: '3.600'
    },
        codes = {
            '.-':   'a',
            '-...': 'b',
            '-.-.': 'c',
            '.':    'e',
            '..-.': 'f',
            '--.':  'g',
            '....': 'h',
            '..':   'i',
            '-.-':  'k',
            '.-..': 'l',
            '--':   'm',
            '-.':   'n',
            '---':  'o',
            '.-.':  'r',
            '...':  's',
            '-':    't',
            '...-': 'v',
            '-..-': 'x'
        },
        codeRegex = new RegExp(' *(' + Object.keys(codes).join('|').replace(/\./g, '\\.') + ')(?![\.-]) *', 'g'),
        $rows = {},
        $table = $('#morseTable');

    for (var word in freqs) {
        var $row = $('<tr><td>' + word + '</td><td>' + freqs[word] + '</td></tr>');
        $table.append($row);
        $rows[word + word] = $row; // Concat to handle the wrap around
    }

    $('#morseInput').on('keyup', function () {
        var lines = this.value.split('\n'),
            regexes = [];

        lines.forEach(function (line) {
            if (!line) return;

            // JS has no negative lookbehind; gotta do the replacement twice
            regexes.push(new RegExp(
                line.replace(codeRegex, codeRegexCallback)
                    .replace(codeRegex, codeRegexCallback)
            ));
        });
        console.log(regexes);

        for (var word in $rows) {
            var matchAll = true;
            $.each(regexes, function (i, regex) {
                if (!regex.test(word)) {
                    matchAll = false;
                    return false;
                }
            });

            $rows[word].toggleClass('inactive', !matchAll);
        }
    });

    function codeRegexCallback(match, code) {
        return codes[code];
    }
})();

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
