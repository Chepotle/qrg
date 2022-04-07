'use strict'

const screenWidth = window.screen.width;
const smallSize = document.querySelector('#small');
const mediumSize = document.querySelector('#medium');
const bigSize = document.querySelector('#big');

let scale = '&size=200x200';
let damage = '&ecc=H';
let data = '';

if (screenWidth < 576) {
    scale = '&size=100x100';
    smallSize.setAttribute('data-scale', '&size=100x100');
    mediumSize.setAttribute('data-scale', '&size=200x200');
    bigSize.setAttribute('data-scale', '&size=300x300');
}

const dropBtns = document.querySelectorAll('.fields__btn');
const dropLists = document.querySelectorAll('.fields__drop');
const types = document.querySelectorAll('.fields__type');
const fields = document.querySelectorAll('.fields__field');
const fieldWifi = document.querySelector('.fields__wifi');
const inputs = document.querySelectorAll('.qr-data');


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
        if (e.target.tagName == "LI") {
            inputs.forEach(i => i.value = '');
            data = '';
            type.textContent = e.target.textContent;
            let option = e.target.getAttribute('data-option');
            let field = document.querySelector(`[data-field='${option}']`);
            fieldsContainer.forEach(i => i.style.display = 'none');
            field.style.display = 'block';
        }
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
const damageLabels = document.querySelectorAll('[data-damage]');

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
    if (!optionsPanel.classList.contains('options__panel_open')) {
        optionsPanel.classList.add('options__panel_open');
        optionsText.textContent = 'Закрыть опции';
    } else {
        optionsText.textContent = 'Открыть опции';
        optionsPanel.classList.remove('options__panel_open');
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

modal.addEventListener('click', function (e) {
    if (e.target != document.querySelector('.modal__qr') && e.target != qrPlace) {
        this.style.display = 'none'
    }
})

for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];

    input.addEventListener('input', function (e) {
        let type = e.target.closest('.fields__field').getAttribute('data-qr');
        let val = e.target.value;

        if (val) {
            switch (type) {
                case 'tel': data = 'data=' + `tel:${val}`;
                    break;
                case 'email': data = 'data=' + `mailto:${val}`;
                    break;
                case 'text': data = 'data=' + val;
                    break;
                case 'url': data = 'data=' + val;
                    break;
                case 'wifi':
                    let encryption = e.target.closest('.fields__field').querySelector('[name="encryption"]').value;
                    let wifiName = e.target.closest('.fields__field').querySelector('[name="wifiName"]').value;
                    let wifiPass = e.target.closest('.fields__field').querySelector('[name="password"]');

                    if (wifiPass == null) {
                        data = 'data=' + `WIFI:T:${encryption};S:${wifiName};;`;
                    } else {
                        data = 'data=' + `WIFI:T:${encryption};S:${wifiName};P:${wifiPass.value};;`;
                    }
                    break;
            }
        } else {
            data = '';
        }
    })
}

scaleOptions.addEventListener('click', function () {
    scale = document.querySelector('[data-scale].radio_cheked').getAttribute('data-scale');
})

damageOptions.addEventListener('click', function () {
    damage = document.querySelector('[data-damage].radio_cheked').getAttribute('data-damage');
})

let qrPlace = document.querySelector('.modal__qr img');
let url = 'https://api.qrserver.com/v1/create-qr-code/?'



submit.addEventListener('click', function () {

    if (data) {
        let color = '&color=' + huebQR.color.replace(/#/, '');
        let bgColor = '&bgcolor=' + huebBG.color.replace(/#/, '');

        async function getQR() {
            const response = await fetch(url + data + scale + color + bgColor + damage + '&qzone=1');
            const dataQR = await response.blob();
            qrPlace.src = URL.createObjectURL(dataQR);
        }
        modal.style.display = 'flex';
        getQR();
    }
});





