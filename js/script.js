// general funcs
function listener() {

    $('#searchBtn').click(search);
    $('#search').keyup(function() {
        var key = event.which;

        if (key == 13) search();
    });
}

// work funcs
function search() {

    var query = $('#search').val();

    if (query) {

        moviesApi(query);
        tvSeriesApi(query);
    }
}

function moviesApi(query) {

    $.ajax({

        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
            api_key: '1bbceadc26f3613e76c0387d834f799f',
            language: 'it',
            query: query
        },
        success: function (data) {
            printData(data, 'movie');
        },
        error: function (err) {
            console.log('Errore', err);
        }
    });
}

function tvSeriesApi(query) {

    $.ajax({

        url: 'https://api.themoviedb.org/3/search/tv',
        method: 'GET',
        data: {
            api_key: '1bbceadc26f3613e76c0387d834f799f',
            language: 'it',
            query: query
        },
        success: function (data) {
            printData(data, 'tv-series');
        },
        error: function (err) {
            console.log('Errore', err);
        }
    });
}

function printData(data, target) {

    var total_results = data['total_results'];

    var template = $('#item-template').html();
    var compiled = Handlebars.compile(template);
    var target = $(`.${target}-list`);
    var items = data['results'];

    target.html('');

    items.length > 0 ? target.prev('.list-title').show() : target.prev('.list-title').hide();

    if (total_results > 20) total_results = 20;

    for (var i = 0; i < total_results; i++) {

        var item = items[i];

        var stelle = Math.ceil(item.vote_average / 2);
        item.star = '';

        for (var j = 0; j < stelle; j++) {
            item.star += '<i class="fas fa-star"></i>';
        }

        for (var j = 0; j < (5 - stelle); j++) {
            item.star += '<i class="far fa-star"></i>';
        }

        var itemHTML = compiled(item);
        target.append(itemHTML);
    }
}


function init() {

    listener();
}

$(document).ready(init);
