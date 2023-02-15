$(document).ready(() => {
    console.log('index.js connected');
    let today = new Date();
    let date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    $('.today-date').text(date);

    $('#index-page-article-heading-edit-button').on('click', function() {
        $('.edit-article-heading-item').toggleClass('hidden');
        $('.edit-article-heading-form').toggleClass('hidden');
    });

    $('#index-page-article-text-edit-button').on('click', function() {
        $('.edit-article-text-item').toggleClass('hidden');
        $('.edit-article-text-form').toggleClass('hidden');
    });

    $('#index-page-feature-edit-button').on('click', function() {
        $('.edit-feature-item').toggleClass('hidden');
        $('.edit-feature-form').toggleClass('hidden');
    });

    $('#article-page-edit-button').on('click', function() {
        $('.edit-article-page-item').toggleClass('hidden');
        $('.edit-article-page-form').toggleClass('hidden');
    });

    $('#persona-page-edit-button').on('click', function() {
        $('.edit-persona-page-item').toggleClass('hidden');
        $('.edit-persona-page-form').toggleClass('hidden');
    });

   
   /* $('#article-image-titlepage').css('opacity', '0.4');
    $('#article-author-img-titlepage').css('opacity', '0.4');*/

    $('.bullet-page-edit-button').on('click', function(event) {
        let id = event.target.id;
        console.log(id);
        $(`#bullet-${id}`).toggleClass('hidden');
        $(`#edit-bullet-form-${id}`).toggleClass('hidden');
    });
   
    $(window).on('scroll', function() {
        if($(this).scrollTop() > 20) {
            $('.scroll-to-top').css('display', 'block');
            
        }  else {
            $('.scroll-to-top').css('display', 'none');
        };
    });
    


    $('.persona-additional-information').on('click', function(event) {
        let id = event.target.id;
        let additionalInfoId = `persona-additional-info-${id}`;
        $(`#${additionalInfoId}`).toggleClass('hidden');
    });

    $('.close-additional-info-button').on('click', function(event) {
        let id = event.target.id;
        let additionalInfoId = `persona-${id}`;
        $(`#${additionalInfoId}`).toggleClass('hidden');
    });


    $('.admin-menu .item').tab();


    $('.back-to-previous-page').on('click', function() {
        window.history.back();
    });
    
    $('.back-to-top').on('click', function(e) {
        e.preventDefault();
        $(window).animate({scrollTop:0}, '300');
        $('html, body').animate({scrollTop:0}, '300');
        /*$('#article-image-titlepage').css('opacity', '1');
        $('#article-author-img-titlepage').css('opacity', '1');
        $('.already-read').css('color', '#252627');
        $('.continued-from-front-page').css('display', 'none');*/
    });

   /* $('#article').bind('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            console.log('scrolling up');
            $('#article-image-titlepage').css('opacity', '1');
            $('#article-author-img-titlepage').css('opacity', '1');
            $('.already-read').css('color', '#252627');
            $('.continued-from-front-page').css('display', 'none');
        } else {
            console.log('scrolling down');
        };       
    });*/




    //always last
   /* $('.already-read').on('click', function() {
        $('#article-image-titlepage').css('opacity', '1');
        $('#article-author-img-titlepage').css('opacity', '1');
        $('.already-read').css('color', '#252627');
        $('.continued-from-front-page').css('color', '#b7b4b4');
    });

    $('html, body').animate({
        scrollTop: $('#scroll-here').offset().top - 100
    }, 2000);*/





});

