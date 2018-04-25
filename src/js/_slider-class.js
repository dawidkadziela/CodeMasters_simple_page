class Slider {
    constructor(selector, opts) {
        //defaultowe ustawienia
        const defaultOpts = {
            pause : 5000,
            auto : true,
            dots : false
        }

        //tutaj metgujemy to co przekaze w opts programista przy tworzeniu obiektu
        //oraz defaultowe dane. W wyniku dostajemy nowy obiekt
        //ktory ma rzeczy od programisty i całą resztę defaultowych
        //dzieki temu programista nie musi ustawiac wszystkich opcji
        // a tylko to co go interesuje
        this.options = Object.assign({}, defaultOpts, opts);

        this.selector = selector;
        this.currentSlide = 0;
        this.time = null;
        this.$btnPrev = null;
        this.$btnNext = null;
        this.$banner = $(this.selector);
        this.$slides = this.$banner.children();
        this.$dots = null;
        this.$slides.wrapAll('<div class="banner-slides"></div>')
        this.createButtons();
        if (this.options.dots) {
            this.createDots();
        }
        this.changeSlide(this.currentSlide);
    }

    changeSlide(nr) {
        this.$slides.removeClass('banner-slide-active');
        this.$slides.eq(nr).addClass('banner-slide-active');
        this.currentSlide = nr;

        if (this.options.auto) {
            clearTimeout(this.time);
            this.time = setTimeout(() => {
                this.nextSlide();
            }, this.options.pause);
        }

        if (this.options.dots) {
            this.$dots.eq(nr).addClass('banner-dot-active');
            this.$dots.eq(nr).siblings().removeClass('banner-dot-active');
        }
    }

    prevSlide() {
        this.currentSlide--;
        if (this.currentSlide < 0) {
            this.currentSlide = this.$slides.length - 1;
        }
        this.changeSlide(this.currentSlide);
    }

    nextSlide() {
        this.currentSlide++;
        if (this.currentSlide > this.$slides.length - 1) {
            this.currentSlide = 0;
        }
        this.changeSlide(this.currentSlide);
    }

    createButtons() {
        this.$btnPrev = $(`
            <button class="banner-prev">
                <i class="fas fa-chevron-left"></i>
            </button>
        `);
        this.$banner.append(this.$btnPrev);
        this.$btnPrev.on('click', () => {
            this.prevSlide();
        });

        this.$btnNext = $(`
            <button class="banner-next">
                <i class="fas fa-chevron-right"></i>
            </button>
        `);
        this.$banner.append(this.$btnNext);
        this.$btnNext.on('click', () => {
            this.nextSlide();
        });
    }

    createDots() {
        const $ul = $('<ul class="banner-dots"></ul>');
        this.$banner.append($ul);

        this.$slides.each((i) => {
            const $li = $('<li class="banner-dot"><span>'+(i+1)+'</span></li>');
            $ul.append($li);

            $li.on('click', (e) => {
                const index = $(e.target).index();
                this.changeSlide(index);
            });
        });

        this.$dots = $ul.children();
    }
}

export { Slider }