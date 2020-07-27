// general funcs
function listener() {

    $('#searchBtn').click(search);
    $('#search').keyup(function() {
        var key = event.which;

        if (key == 13) {
            search();
        }
    });
}

// work funcs
function search() {

    var query = $('#search').val();

    $.ajax({

        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
            api_key: '1bbceadc26f3613e76c0387d834f799f',
            language: 'it',
            query: query
        },
        success: function (data) {
            printData(data);
        },
        error: function (err) {
            console.log('Errore', err);
        }
    });
}

function printData(data) {


    var total_results = data['total_results'];

    var template = $('#item-template').html();
    var compiled = Handlebars.compile(template);
    var target = $('.items-list');

    target.html();

    for (var i = 0; i < total_results; i++) {

        var item = {};

        item.title = data['results'][i]['title'];
        item.originalTitle = data['results'][i]['original_title'];
        item.originalLanguage = data['results'][i]['original_language'];
        item.vote = data['results'][i]['vote_count'];

        var itemHTML = compiled(item);
        target.append(itemHTML);
    }

}


function init() {

    listener();
}

$(document).ready(init);
