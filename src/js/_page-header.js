// ------------------------------
// wersja vanilla JS
// ------------------------------
// function pageHeader() {
//     const header = document.querySelector('.page-header');
//     window.addEventListener('scroll', function(e) {
//         if (this.pageYOffset >= 100) {
//             header.classList.add('sticky');
//         } else {
//             header.classList.remove('sticky');
//         }
//     })
// }

// export {
//     pageHeader
// }



// ------------------------------
// wersja jQuery
// ------------------------------
function pageHeader() {
    const $header = $('.page-header');
    $(window).on('scroll', function(e) {
        if (this.pageYOffset >= 100) {
            $header.addClass('sticky');
        } else {
            $header.removeClass('sticky');
        }
    })

    //po kliku na link w menu przewijamy do sekcji
    //na ktora wskazuje dany link
    $('.page-nav a').on('click', function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        const $target = $(href) //$('#ourCourses')
        console.log(href, $target)
        $('html, body').animate({
            scrollTop : $target.offset().top
        }, 1000)
    })
}

export {
    pageHeader
}