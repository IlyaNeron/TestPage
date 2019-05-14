function carouselInfo() {
    let carousel_info = new Swiper('.pictures-slider', {
        loop: true,
        effect: 'fade',
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
}

carouselInfo();