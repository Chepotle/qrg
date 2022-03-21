'use strict'

const dropBtns = document.querySelectorAll('.fields__btn');
const dropLists = document.querySelectorAll('.fields__drop');
const types = document.querySelectorAll('.fields__type');
const fields = document.querySelectorAll('.fields__field');
const fieldWifi = document.querySelector('.fields__wifi');



for (let i = 0; i < dropBtns.length; i++) {
    let btn = dropBtns[i];
    let list = dropLists[i];
    let type = types[i];

    btn.addEventListener('click', function (e) {
        if (!btn.classList.contains('btn-open')) {
            dropBtns.forEach(i => i.classList.remove('btn-open'));
            dropLists.forEach(i => i.style.display = 'none');
            btn.classList.add('btn-open');
            list.style.display = 'block';
        } else {
            list.style.display = 'none';
            btn.classList.remove('btn-open');
        }
    });

    list.addEventListener('click', function (e) {
        let parent = e.target.closest('.fields');
        let fieldsContainer = Array.from(parent.children).filter(function (i) {
            if (i.classList.contains('fields__field')) {
                return true
            } return false
        });
        type.textContent = e.target.textContent;
        let option = e.target.getAttribute('data-option');
        let field = document.querySelector(`[data-field='${option}']`);
        fieldsContainer.forEach(i => i.style.display = 'none');
        field.style.display = 'block';
    })
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.fields__btn')) {
        dropLists.forEach(i => i.style.display = 'none');
        dropBtns.forEach(i => i.classList.remove('btn-open'));
    }
});


// QR options


const scaleLabels = document.querySelectorAll('[data-scale]');
// const scaleRadios = document.querySelectorAll('[data-scale] .radio__point');
const damageLabels = document.querySelectorAll('[data-damage]');
// const damageRadios = document.querySelectorAll('[data-damage] .radio__point');

const optionsBtn = document.querySelector('.options__btn');
const optionsText = document.querySelector('.options__text');
const optionsPanel = document.querySelector('.options__panel');


for (let i = 0; i < scaleLabels.length; i++) {
    let scaleLabel = scaleLabels[i];
    scaleLabel.addEventListener('click', function (e) {
        if (!scaleLabel.classList.contains('radio_cheked')) {
            scaleLabels.forEach(i => i.classList.remove('radio_cheked'));
            scaleLabel.classList.add('radio_cheked');
        }
    });
}

for (let i = 0; i < damageLabels.length; i++) {
    let damageLabel = damageLabels[i];
    damageLabel.addEventListener('click', function (e) {
        if (!damageLabel.classList.contains('radio_cheked')) {
            damageLabels.forEach(i => i.classList.remove('radio_cheked'));
            damageLabel.classList.add('radio_cheked');
        }
    });
}

optionsBtn.addEventListener('click', function (e) {
    if (optionsText.textContent == 'Открыть опции') {
        optionsPanel.style.display = 'flex';
        optionsText.textContent = 'Закрыть опции';
    } else {
        optionsText.textContent = 'Открыть опции'
        optionsPanel.style.display = 'none';
    }
})


// color-picker

const colorFront = document.getElementById('color-input_1');
const colorBack = document.getElementById('color-input_2');

let huebQR = new Huebee(colorFront, {
    setBGColor: true,
    saturations: 1,
    notation: 'hex',
    hues: 22,
    shades: 7,
});

let huebBG = new Huebee(colorBack, {
    setBGColor: true,
    saturations: 1,
    notation: 'hex',
    hues: 22,
    shades: 7,
});

// QR

const submit = document.querySelector('.create');
const scaleOptions = document.querySelector('.options__scale');
const damageOptions = document.querySelector('.options__damage');
const modal = document.querySelector('.modal');
let scale = 200;
let damage = 'H';
let data = '';


const inputs = document.querySelectorAll('.fields__field > input, .fields__field > textarea');

for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];

    input.addEventListener('input', function (e) {
        let type = e.target.closest('.fields__field').getAttribute('data-qr');
        let val = e.target.value;

        switch (type) {
            case 'tel': data = `tel:${val}`;
                break;
            case 'email': data = `mailto:${val}`;
                break;
            case 'text': data = `${val}`;
                break;
            case 'url': data = `https://${val}`;
                break;
            case 'wifi':
                let encryption = e.target.closest('.fields__field').querySelector('[name="encryption"]').value;
                let wifiName = e.target.closest('.fields__field').querySelector('[name="wifiName"]').value;
                let wifiPass = e.target.closest('.fields__field').querySelector('[name="password"]');

                if (wifiPass == null) {
                    data = `WIFI:T:${encryption};S:${wifiName};;`;
                } else {
                    data = `WIFI:T:${encryption};S:${wifiName};P:${wifiPass.value};;`;
                }
                break;
        }
    })
}

scaleOptions.addEventListener('click', function () {
    scale = document.querySelector('[data-scale].radio_cheked').getAttribute('data-scale');
})

damageOptions.addEventListener('click', function () {
    damage = document.querySelector('[data-damage].radio_cheked').getAttribute('data-damage');
})


submit.addEventListener('click', function () {
    if (data) {
        modal.style.display = 'flex'

        let qr = new QRious({
            element: document.querySelector('canvas')
        });

        qr.background = huebBG.color;
        qr.foreground = huebQR.color;
        qr.level = damage;
        // qr.padding = 20;
        qr.size = scale;
        qr.value = data;
    }
});





