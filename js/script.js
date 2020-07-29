// general funcs
function searchListener() {

    $('#searchBtn').click(search);
    $('#search').keyup(function() {
        var key = event.which;
        if (key == 13) search();
    });
}

function clickItemsListener() {

    // Click items
    $(document).on('click', '.item-info', function () {

        var id = $(this).attr('data-id');
        var type = $(this).attr('data-type');

        getInfo(id, type, 'cast', '/credits');
        getInfo(id, type, 'genres');

        $('.container').addClass('opacity');
        $('.modal-container').fadeIn(500);

    });

    // Close modals
    $('.modal-container').click(function (event) {

        if (!$(event.target).closest(".modal").length) {
            $('.modal-container').fadeOut(500);
            $('.container').removeClass('opacity');
        }
    })
}

// work funcs
function search() {

    var query = $('#search').val();

    if (query) {

        getItems(query, 'movie');
        getItems(query, 'tv');
    }
}

function getItems(query, type) {

    $.ajax({

        url: `https://api.themoviedb.org/3/search/${type}`,
        method: 'GET',
        data: {
            api_key: '1bbceadc26f3613e76c0387d834f799f',
            language: 'it',
            query: query
        },
        success: function (data) {
            printItems(data, type);
        },
        error: function (err) {
            console.log('Errore', err);
        }
    });
}

function getInfo(id, type, target, extraPath) {

    $.ajax({

        url: `https://api.themoviedb.org/3/${type}/${id}${extraPath}`,
        method: 'GET',
        data: {
            api_key: '1bbceadc26f3613e76c0387d834f799f',
        },
        success: function (data) {
            printInfo(data, target);
        },
        error: function (err) {
            console.log('Errore', err);
        }
    });
}

function printItems(data, type) {

    var total_results = data['total_results'];
    var template = $('#item-template').html();
    var compiled = Handlebars.compile(template);
    var target = $(`.${type}-list`);
    var items = data['results'];

    target.html('');

    items.length > 0 ? target.prev('.list-title').show() : target.prev('.list-title').hide();

    if (total_results > 20) total_results = 20;

    for (var i = 0; i < total_results; i++) {

        var item = items[i];

        item.type = type;

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


function printInfo(data, target) {

    var items = data[target];
    var template = $(`#${target}-template`).html();
    var compiled = Handlebars.compile(template);
    var target = $(`.${target}-list`);

    target.html('');

    for (var i = 0; i < items.length && i < 5; i++) {

        var item = items[i];

        var itemHTML = compiled(item);

        target.append(itemHTML);
    }
}

function init() {

    searchListener();
    clickItemsListener();
}

$(document).ready(init);
