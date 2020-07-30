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

        $('main').addClass('opacity');
        $('.modal-container').fadeIn(500);

    });

    // Close modals
    $('.modal-container').click(function (event) {

        if (!$(event.target).closest(".modal").length) {
            $('.modal-container').fadeOut(500);
            $('main').removeClass('opacity');
        }
    })
}

function filterClickListener() {

    $(document).on('change', '#genres', function () {

        var id = $(this).val();
        var type = $(this).attr('data-type');
        var items = $(`.${type}-list .item`);

        items.each(function () {

            var genres = $(this).attr('data-genres');

            $(this).hide();

            if (genres.includes(id)) {
                $(this).show();
            }
        });
    });
}

// work funcs
function search() {

    var query = $('#search').val();

    if (query) {

        $('main').html('');

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

function getGenre(type) {

    $.ajax({

        url: `https://api.themoviedb.org/3/genre/${type}/list`,
        method: 'GET',
        data: {
            api_key: '1bbceadc26f3613e76c0387d834f799f',
            language: 'it'
        },
        success: function (data) {
            printGenres(data['genres'], type);
        },
        error: function (err) {
            console.log('Errore', err);
        }
    });
}

function addContainer(type) {

    var template = $('#container-template').html();
    var compiled = Handlebars.compile(template);
    var target = $('main');

    var items = {
        type: type,
        title: type
    }

    switch (type) {
        case 'movie':
            items.title = 'Film';
        break;
        case 'tv':
            items.title = 'Serie TV';
            break;
        default:
    }

    var containerHTML = compiled(items);
    target.append(containerHTML);
}

function printItems(data, type) {

    addContainer(type);

    var total_results = data['total_results'];
    var template = $('#item-template').html();
    var compiled = Handlebars.compile(template);
    var target = $(`.${type}-list`);
    var items = data['results'];

    target.html('');

    $(`.${type}`).addClass('hidden');

    if (items.length > 0) {

        $(`.${type}`).removeClass('hidden');

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

    getGenre(type);
    addScrollListener(type);
}

function printInfo(data, target) {

    var items = data[target];
    var template = $(`#${target}-template`).html();
    var compiled = Handlebars.compile(template);
    var target = $(`.${target}-list`);

    target.html('');

    for (var i = 0; i < items.length && i < 5; i++) {

        var item = items[i];

        console.log(item);

        var itemHTML = compiled(item);

        target.append(itemHTML);
    }
}

function printGenres(data, type) {

    var target = $(`.${type} .genres select`);

    for (var i = 0; i < data.length; i++) {

        target.append(`<option value="${data[i]['id']}">${data[i]['name']}</option>`);
    }
    filterClickListener();
}

function addScrollListener(type) {

    var target = $(`.${type} .arrow`);

    $(target).click(function () {
        // console.log(target.width());
        // target.animate({
        //     scrollLeft: `+=${target.width()}`
        // }, 'fast');

        var btn = $(this);
        var direction = $(this).attr('data-type');
        scroll(btn, type, direction);

    });
}

function scroll(btn, type, direction) {

    var target = $(`.${type}-list`);
    var containerW = $(`.${type}-list`).width();
    var itemW = ($(`.${type}-list .item`).outerWidth(true));
    var visibleItems = Math.floor(containerW / itemW);
    var scroll = visibleItems * itemW;

    if (direction == 'left') {
        var c = '-=';
        scroll = containerW - (containerW - scroll);
    } else {
        var c = '+=';
    }

    console.log(scroll, containerW);

    target.animate({

        scrollLeft: `${c + scroll}`
    }, 'slow', function () {

        if (target.scrollLeft() == 0) {
            $(`.${type} .left`).hide();
        } else {
            $(`.${type} .left`).show();
        }

        if (target.scrollLeft() >= target.prop('scrollLeftMax')) {
            $(`.${type} .right`).hide();
        } else {
            $(`.${type} .right`).show();
        }
    });

}

function init() {

    searchListener();
    clickItemsListener();
}

$(document).ready(init);
