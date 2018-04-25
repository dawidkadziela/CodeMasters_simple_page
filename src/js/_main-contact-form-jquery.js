function mainContactForm() {
    const $form = $('#mainForm');
    const $inputs = $form.find('input:text, textarea');

    $inputs.on('input', function() {
        if (!this.checkValidity()) { //jsowa metoda - dlatego tutaj nie ma $(this)
            $(this).addClass('form-controll-error');
        } else {
            $(this).removeClass('form-controll-error');
        }
    })


    //musze wylaczyc walidacje html ktora bazuje na required i pattern kolejnych pol
    $form.attr('novalidate', true);
    $form.on('submit', function(e) {
        e.preventDefault();
        const $btn = $form.find('button:submit');

        //spradzam czy pola sa bledne
        let formHasError = false;
        $inputs.on('input', function() {
            if (!this.checkValidity()) { //jsowa metoda - dlatego tutaj nie ma $(this)
                $(this).addClass('form-controll-error');
                formHasError = true;
            } else {
                $(this).removeClass('form-controll-error');
            }
        })

        //jak nie sa to robie wysylke
        if (!formHasError) {
            $btn.addClass('loading');
            $btn.prop('disabled', true);

            $.ajax({
                url : $form.attr('action'),
                method : $form.attr('method'),
                dataType : 'json',
                data : $form.serialize() //jquery pozwala caly formularz zamienic na obiekt - dzieki temu nie trzeba tego robic recznie
            }).done(response => {
                //skrypt na serwerze tez sprawdza czy dane sa dobrze wyslane
                //bo mogla by byc sytuacja ze ktos nam wysle dane z innej strony, albo cos spreparuje

                //z serwera dostajemy zwrotke (skrypt jest tak napisany by takie cos zwracal):
                //{status : "ok"} - wszystko ok
                //{errors : ["name", "email", "message"]} - errors zawiera tablice blednie wypelnionych pol

                //xhr.response to to samo co res ---> .done(function(res) {})
                if (response.status === "ok") {
                    if (!$form.find('.form-message').length) {
                        $form.find('.form-message').remove()
                    }

                    const $div = $('<div class="form-message">Wysłano wiadomość</div>');
                    $form.find('.form-row-last').append($div);
                }

                if (response.errors) {
                    //tablica errors zawiera nazwy blednie wypelnionych pol
                    //pobieram je i daje im klasy error
                    response.errors.forEach(el => {
                        $form.find(`input[name="${el}"]`).addClass('form-controll-error');
                    });
                }
            }).fail(() => {
                if (!$form.find('.form-message').length) {
                    $form.find('.form-message').remove()
                }

                const $div = $('<div class="form-message">Wystąpił błąd w wysyłaniu wiadomości</div>');
                $form.find('.form-row-last').append($div);
            }).always(() => {
                $btn.removeClass('loading');
                $btn.prop('disabled', false);
            })

        }
    });
}

export {
    mainContactForm
}