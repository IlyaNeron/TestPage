$('.form-opener').click(function () {
    $('.search-lightbox').addClass('lightbox-active');
    $('body').addClass('scroll-none')
});

$('.close_lightbox').click(function () {
    $('.search-lightbox').removeClass('lightbox-active');
    $('body').removeClass('scroll-none')
});
