/**
 * Global
 */
var ktane = ktane || {};

$('h2').on('dblclick', function () {
    $(this).closest('section').toggleClass('collapsed');
}).attr('title', 'Double-click to expand/collapse');

ktane.resetInputs = function ($container) {
    $container.find('textarea').val('');

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
     * Wires
     */
    var count = {
        red: 0,
        yellow: 0,
        blue: 0,
        white: 0,
        black: 0
    },
        $wireList = $('#wireList');

    $('#wireOptions button').on('click', function () {
        var colour = this.getAttribute('data-colour'),
            letter = this.getAttribute('data-letter'),
            $li = $('<li><button class="button' + colour.charAt(0).toUpperCase() + colour.substring(1)
                        + '" data-colour="' + colour + '" data-letter="' + letter + '"></button></li>');

        $wireList.append($li);
        count[colour]++;
        checkWireToCut();
    });

    $wireList.on('click', 'button', function () {
        var deleteIndex = $(this).parent().index();

        $wireList.children('li:eq(' + deleteIndex + '), li:gt(' + deleteIndex + ')').each(function () {
            var button = this.firstChild;
            count[button.getAttribute('data-colour')]--;
            $(this).remove();
        });

        checkWireToCut();
    });

    function checkWireToCut() {
        var lastColour = $wireList.children(':last-child').children().first().data('colour'),
            oddPossible;
        $wireList.find('.wireToCut').removeClass('wireToCut odd even');

        switch ($wireList.children().length) {
            case 3:
                oddPossible = false;

                if (!count['red']) {
                    addWireToCut(2);
                } else if (lastColour === 'white') {
                    addWireToCut();
                } else if (count['blue'] > 1) {
                    $wireList.find('[data-colour="blue"]').last().parent().addClass('wireToCut');
                } else {
                    addWireToCut();
                }
                break;
            case 4:
                oddPossible = count['red'] > 1;
                if (oddPossible) {
                    $wireList.find('[data-colour="red"]').parent().last().addClass('wireToCut odd');
                }

                if (lastColour === 'yellow' && !count['red'] || count['blue'] === 1) {
                    addWireToCut(1);
                } else if (count['yellow'] > 1) {
                    addWireToCut();
                } else {
                    addWireToCut(2);
                }
                break;
            case 5:
                oddPossible = lastColour === 'black';
                if (oddPossible) {
                    addWireToCut(4, 'odd');
                }

                if (count['red'] === 1 && count['yellow'] > 1) {
                    addWireToCut(1);
                } else if (!count['black']) {
                    addWireToCut(2);
                } else {
                    addWireToCut(1);
                }
                break;
            case 6:
                oddPossible = !count['yellow'];
                if (oddPossible) {
                    addWireToCut(3, 'odd');
                }

                if (count['yellow'] === 1 && count['white'] > 1) {
                    addWireToCut(4);
                } else if (!count['red']) {
                    addWireToCut();
                } else {
                    addWireToCut(4);
                }
                break;
            default:
                break;
        }

        function addWireToCut(child, className) {
            if (typeof className === 'undefined') {
                className = 'even';
            }
            $wireList.children(isNaN(child) ? ':last-child' : ':nth-child(' + child + ')')
                    .addClass('wireToCut' + (className !== 'even' || oddPossible ? ' ' + className : ''));
        }
    }
})();

(function () {
    /**
     * Button
     */
    var $section = $('#sectionButton'),
            $instruction = $('#buttonInstruction'),
            instruction;

    $section.find('input').on('click', function () {
        var colour = $('input[name="buttonColour"]:checked').val(),
                text = $('input[name="buttonText"]:checked').val();

        if (text === 'Detonate') {
            instruction = 'If there is more than 1 battery, press and release; otherwise, hold the button.'
        } else if (colour === 'white') {
            instruction = 'If there is a lit indicator with label CAR, hold the button. Otherwise, if there are more than 2 batteries and a lit indicator with label FRK, press and release the button. If neither apply, hold the button.'
        } else if (colour === 'blue' && text === 'Abort'
                || colour === 'yellow') {
            instruction = 'Hold the button.';
        } else if (colour === 'red' && text === 'Hold') {
            instruction = 'Press and release the button.';
        } else {
            instruction = 'If there are more than 2 batteries and a lit indicator with label FRK, press and release the button; otherwise, hold the button.';
        }

        $instruction.html(instruction);
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
                $li = $('<li><button class="button' + colour.charAt(0).toUpperCase() + colour.substring(1)
                        + '" data-colour="' + colour + '" data-letter="' + letter + '">' + letter + '</button></li>');

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
                C: 'Cut the wire',
                D: '<strong>Do not</strong> cut the wire',
                S: 'If the last digit of the serial number is even, cut the wire',
                P: 'If the bomb has a parallel port, cut the wire',
                B: 'If the bomb has two or more batteries, cut the wire'
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
            $checkboxes = $('#vennOptions > li > input'),
            $instruction = $('#vennInstruction');

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
    });
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
            $password.toggleClass("inactive", !$password.text().match(regex));
        });
    });
})();