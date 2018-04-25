require('../index.html'); //zeby webpack przeladowywal html -  nic innego nie robi
require('../scss/style.scss'); //zeby sie style kompilowaly webpackiem
//powyższego nie ruszaj
//-------------------------------------

import { Slider } from './_slider-class';
import { initMap } from './_main-map';
import { pageHeader } from './_page-header';
import { mainContactForm } from './_main-contact-form-jquery';

//wyjatkowa sytuacja
//google map w adresie wskazuje na funkcje initMap
//zeby nasza funkcja map byla widoczna dla google map,
//musimy ja dodac do globalnego scope czyli window....
//domyslnie wszystko w tych plikach jest niewidoczne na zewnatrz
window.initMap = initMap;

$(function() {

    const slider = new Slider('#banner', {
        pause: 5000
    });

    pageHeader();
    mainContactForm();

})
