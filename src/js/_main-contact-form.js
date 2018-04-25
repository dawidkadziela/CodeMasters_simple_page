function mainContactForm() {
    const form = document.querySelector('#mainForm');
    const inputs = form.querySelectorAll('input, textarea');

    //robie petle po przyciskach i podpinam im event input
    //dzieki temu podczas wpisywania od razu widac czy wpisalem cos zle czy nie
    //bo na bierzaco dodawana jest klasa z bledem
    [...inputs].forEach(function(inp) {
        inp.addEventListener('input', function() {
            if (!this.checkValidity()) {
                this.classList.add('form-controll-error');
            } else {
                this.classList.remove('form-controll-error');
            }
        })
    })

    //musze wylaczyc walidacje html ktora bazuje na required i pattern kolejnych pol
    form.setAttribute('novalidate', 'novalidate');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');

        //spradzam czy pola sa bledne
        let formHasError = false;
        [...inputs].forEach(function(inp) {
            if (!inp.checkValidity()) {
                inp.classList.add('form-controll-error');
                formHasError = true;
            } else {
                inp.classList.remove('form-controll-error');
            }
        });

        //jak nie sa to robie wysylke
        if (!formHasError) {
            btn.classList.add('loading');
            btn.disabled = true;

            //wersja z wykorzystaniem XMLHttPRequest
            //spokojnie mozna by tutaj uzyc $.ajax, done() i fail()
            const xhr = new XMLHttpRequest();

            //xmlhttprequest dziala w 3 krokach
            //1. open(metoda, adres, asynchroniczonc)
            //2. podpiecie eventow load, error i ewentualnie abort
            //3. send(dane)

            //atrybuty do wysylki biore bezposrednio z formularza
            //post , adres_wysylki, czy_asynchronicznie
            xhr.open(form.getAttribute('method'), form.getAttribute('action'), true);

            xhr.addEventListener('load', function(e) {
                //wysylka trwa w kilku stanach
                //najwazniejszy to 4, co oznacza ze sie zakonczylo
                //trzeba tez sprawdzic status 200 co oznacza ze wszystko poszlo ok
                //statusy moga byc inne np 404, 301 itp
                if (xhr.readyState === 4 && xhr.status === 200) {

                    //skrypt na serwerze tez sprawdza czy dane sa dobrze wyslane
                    //bo mogla by byc sytuacja ze ktos nam wysle dane z innej strony, albo cos spreparuje

                    //z serwera dostajemy zwrotke (skrypt jest tak napisany by takie cos zwracal):
                    //{status : "ok"} - wszystko ok
                    //{errors : ["name", "email", "message"]} - errors zawiera tablice blednie wypelnionych pol

                    //xhr.response to to samo co res ---> .done(function(res) {})

                    //otwrzymane dane musze zamienic na json
                    const response = JSON.parse(xhr.response);

                    //i potem normalnie spradzam zwrotke i na nia reaguje jakos
                    if (response.status === "ok") {
                        if (form.querySelector('.form-message') !== null) {
                            form.querySelector('.form-message').remove()
                        }

                        const div = document.createElement('div');
                        div.innerText = 'Wysłano wiadomość';
                        div.classList.add('form-message');
                        form.querySelector('.form-row-last').appendChild(div);
                    }

                    if (response.errors) {
                        //tablica errors zawiera nazwy blednie wypelnionych pol
                        //pobieram je i daje im klasy error
                        response.errors.forEach(el => {
                            form.querySelector(`input[name="${el}"]`).classList.add('form-controll-error');
                        });
                    }
                }
                btn.classList.remove('loading');
                btn.disabled = false;
            });

            xhr.addEventListener('error', function(e) {
                btn.classList.remove('loading');
                btn.disabled = false;

                if (form.querySelector('.form-message') !== null) {
                    form.querySelector('.form-message').remove()
                }

                const div = document.createElement('div');
                div.innerText = 'Wystąpił błąd podczas wysyłania wiadomości';
                div.classList.add('form-message');
                form.querySelector('.form-row-last').appendChild(div);
            });


            //jezeli ponizej nie korzystal bym z formData ale z JSON.strigfity
            //https://stackoverflow.com/questions/6418220/javascript-send-json-object-with-ajax
            //to musialbym dodatkowo wyslac taki naglowek
            //przy formData nie musze tego robic
            //ajax.setRequestHeader("Content-Type", "application/json");

            //po zakonczeniu wysylania i zwrotce spradzam status polaczenia i
            //jezeli jest on 200 (czyli ok), to pokazuje wiadomosc

            //tworze dane do wysylki
            const data = new FormData();
            [...inputs].forEach(function(inp) {
                console.log(inp.name, inp.value)
                data.append(inp.name, inp.value);
            })

            //wysylam
            xhr.send(data);

            //jak widzisz sporo pisania
            //w jquery zamknelibysmy sie w kilku linijkach :)
        }
    });
}

export {
    mainContactForm
}