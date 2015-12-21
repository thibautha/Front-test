(function($w) {

//Variables

    var $burger = $('.burger'),
        $nav = $('nav'),
        $main = $('.main'),
        $slider = $('.main ul'),
        $slides = $slider.find('li'),
        $span1 = $('.burger span:nth-of-type(1)'),
        $span2 = $('.burger span:nth-of-type(2)'),
        $span3 = $('.burger span:nth-of-type(3)'),
        $toLeft = $('.slide-to-left'),
        $toRight = $('.slide-to-right'),
        $header = $('header'),
        $initSelect = $slider.find('.select'),
        sliderWidth = $slider.innerWidth(),
        navHeight = $nav.innerHeight(),
        headerHeight = $header.innerHeight(),
        windowHeight = $w.innerHeight(),
        slidesMax = ($slides.length)-1,
        currentSlide = 0,
        nextSlide = 0,
        isMoving = false,
        openMenu = false,
        easing = Power2.easeInOut;


//Ini
    currentSlide = parseInt($initSelect[0].dataset.index);
    TweenLite.set($slides,{ display: 'none'});
    TweenLite.set($initSelect,{ display: 'block' });
    mobileMenu();
    slideNav();
    adjustSlider();

//Listener

    $('nav li a').on('click', function(e) {
        index = parseInt(e.target.dataset.index);
        if ( index === currentSlide || isMoving ) return;
        isMoving = true;
        toSlide(index);
        if ( window.innerWidth <= 767 ) {
            collapseBurger();
        }
    })

    $burger.on('click', function() {
        collapseBurger();
    });

    $main.on('click', function() {
        if ( openMenu ){
            collapseBurger();
        }
    });

    $( window ).resize(function() {
        sliderWidth = $slider.innerWidth();
        headerHeight = $header.innerHeight();
        windowHeight = $w.innerHeight();
        navHeight = $nav.innerHeight();
        adjustSlider();
        mobileMenu();
        resizeCanvas();
    });

    $toLeft.on('click', function(e) {
        e.preventDefault();
        if ( currentSlide === 0 || isMoving ) return;
        nextSlide = calculNextSlide('previous');
        isMoving = true;
        toSlide(nextSlide);
    });

    $toRight.on('click', function(e) {
        e.preventDefault();
        if ( currentSlide === slidesMax || isMoving ) return;
        nextSlide = calculNextSlide('next');
        isMoving = true;
        toSlide(nextSlide);
    });

//Function

    function resizeCanvas() {
        canvas.width =( sliderWidth/3);
        if ( window.innerWidth <= 767 ) {
            canvas.height =  (windowHeight - headerHeight );
        }else{
            canvas.height =  (windowHeight - headerHeight - navHeight);
        }
    }

    function adjustSlider() {
        if ( window.innerWidth <= 767 ) {
            TweenLite.set($main,{height: (windowHeight - headerHeight )});
        }else{
            TweenLite.set($main,{height: (windowHeight - headerHeight - navHeight)});
        }
    }

    function toSlide(n) {
        var toAnim = $slides[n],
            m = (sliderWidth/3),
            k = -(sliderWidth/3);

        if ( n < currentSlide){
            moveSlide(m,k,toAnim);
        }else{
            moveSlide(k,m,toAnim);
        }
        currentSlide = n;
    }

    function moveSlide(m,k,t) {
        var slideSelect = $slider.find('.select');
        TweenLite.set(t,{ x : k, display:'block'});
        TweenLite.to($slider, 1,{ x : m, force3D: true, ease: easing, onComplete: function() {
            TweenLite.set(slideSelect,{x : m, display:'none'});
            TweenLite.set(t,{ x : 0});
            TweenLite.set($slider,{ x: 0});
            slideSelect.removeClass('select');
            $(t).addClass('select');
            slideNav();
            isMoving = false;
        }});

    }

    function slideNav() {
        if ( currentSlide === 0){
            switchNav($toLeft,-50,'none');
            switchNav($toRight,0,'block');
        }else if ( currentSlide === slidesMax) {
            switchNav($toLeft,0,'block');
            switchNav($toRight,50,'none');

        }else{
            switchNav($toLeft,0,'block');
            switchNav($toRight,0,'block');

        }
    }

    function switchNav(i,j,l) {
        TweenLite.to(i, 0.4 ,{ x: j, display: l, force3D: true, ease: easing});
    }

    function calculNextSlide(to) {
        if ( to === 'next') {
            return currentSlide+1;
        }else{
            return currentSlide-1;
        }
    }

    function collapseBurger() {
        if ( !openMenu ) {
            TweenLite.to($nav, 1 ,{ y: 0, force3D: true, ease: easing});
            animMobile();
            openMenu = true;
        }else{
            TweenLite.to($nav, 1 ,{ y: -navHeight, force3D: true, ease: easing});
            animMobile();
            openMenu = false;
        }
    };

    function mobileMenu() {
        if ( window.innerWidth <= 767 && !openMenu) {
            TweenLite.set($nav, { y: -navHeight});
        }else{
            TweenLite.set($nav, { y: 0});
        }
    }

    function animMobile() {
        if ( !openMenu ) {
            TweenLite.to($span1, .2,{y: 4, force3D: true});
            TweenLite.to(([$span3,$span2]), .2,{y: -4, force3D: true, onComplete: function() {
                TweenLite.to($span2, .2,{y: 0, force3D: true});
                TweenLite.to($span3, .2,{y: -8, force3D: true});
                TweenLite.set($span1,{ opacity:0, force3D: true});
                TweenLite.to($span2, .2,{ rotation:45, force3D: true});
                TweenLite.to($span3, .2,{ rotation:-45, force3D: true});
            }});

        }else{
            TweenLite.to($span2, .2,{ rotation:0, force3D: true});
            TweenLite.to($span3, .2,{ rotation:0, force3D: true});
            TweenLite.to($span2, .2,{y: -4, force3D: true});
            TweenLite.to($span3, .2,{y: -4, force3D: true, onComplete: function(){
                TweenLite.set($span1,{ opacity:1});
                TweenLite.to($span1, .2,{y: 0, force3D: true});
                TweenLite.to(([$span3,$span2]), .2,{y: 0, force3D: true});
            }});
        }
    }

    ////// Mail contact js from: http://blog.teamtreehouse.com/create-ajax-contact-form
    // Get the form.
    var form = $('#ajax-contact');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function(e) {
        // Stop the browser from submitting the form.
        e.preventDefault();

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
        .done(function(response) {
            // Make sure that the formMessages div has the 'success' class.
            $(formMessages).removeClass('error');
            $(formMessages).addClass('success');

            // Set the message text.
            $(formMessages).text(response);

            // Clear the form.
            $('#name').val('');
            $('#email').val('');
            $('#message').val('');
        })
        .fail(function(data) {
            // Make sure that the formMessages div has the 'error' class.
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');

            // Set the message text.
            if (data.responseText !== '') {
                $(formMessages).text(data.responseText);
            } else {
                $(formMessages).text('Oops! An error occured and your message could not be sent.');
            }
        });

    });
    //////Mail contact js

    //Canvas

    var canvas = document.getElementById("mon_canvas"),
        ctx = canvas.getContext("2d"),
        counter = 0,
        kiwi = new Image(),
        toRight = true;
    kiwi.addEventListener('load', eventKiwiLoaded , false);
    kiwi.src = "../img/kiwi.svg";

    function eventKiwiLoaded() {
        resizeCanvas();
        startUp();
    }

    function drawScreen() {
        // draw a background so we can see the Canvas edges
        ctx.fillStyle = "#aaaaaa";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(kiwi, 2*counter, (canvas.height/2),60,60);
        if ( toRight ){
            counter++;
            if (counter >((sliderWidth/6)-30)) {
               toRight = false;
            }
        }else{
            counter--;
            if (counter === 0) {
                toRight = true;
            }
        }
    }

    function startUp(){
    kiwiLoop();
    }

    function kiwiLoop() {
     window.setTimeout(kiwiLoop, 10);
     drawScreen();
    }

    ////Konami
    var kKeys = [];
    function Kpress(e){
        kKeys.push(e.keyCode);
        if (kKeys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0) {
            $(this).unbind('keydown', Kpress);
            console.log('Go Konami Go !');
            window.setTimeout(pedoGo, 1000);
        }
    }
    $(document).keydown(Kpress);

    var $helloPedo = $('.pedo'),
        $pedoSay = $('.pedo-say'),
        $firstLine = $('.first-line'),
        $secondLine = $('.second-line'),
        $bigPedo = $('.big-pedo'),
        $unicorn = $('.unicorn');

    function pedoGo() {
        TweenLite.set($pedoSay,{display:'block', opacity: 0});
        TweenLite.set($firstLine, {opacity:1});
        TweenLite.to($bigPedo, 1,{ y:-127, display: 'block', force3D: true, ease: easing});
        TweenLite.to($pedoSay, 1,{ y: -40, opacity:1, force3D: true, ease: easing});
        TweenLite.to($unicorn, 1,{ y:-250, display: 'block', delay:2, force3D: true, ease: easing});
        TweenLite.to($firstLine, 0.5,{opacity:0, delay :3, force3D: true, ease: easing, onComplete: function() {
            TweenLite.to($secondLine,0.5,{opacity:1, force3D: true, ease: easing, onComplete: function() {
                TweenLite.to($helloPedo, 2,{y: 270, force3D: true, ease: easing});
            }});
        }});
    }

    pedoGo();

})($(window));
