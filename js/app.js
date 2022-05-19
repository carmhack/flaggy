// Selectors
const flagTypeSelect = document.querySelector('#flag-type');
const flagOrientationSelect = document.querySelector('#flag-orientation');
const flagCoatSelect = document.querySelector('#flag-coat');
const flagBandsInput = document.querySelector('#flag-bands');
const showCoatCheckbox = document.querySelector('#show-coat');
const colorsContainer = document.querySelector('#colors');
const exportButton = document.querySelector('#export-btn');

const colors = {
    european: ['#009246', '#F1F2F1', '#CE2B37', '#0055A4', '#F77F00', '#002664', '#000000'],
    panafrican: ['#00843E', '#E31C23', '#FCD116'],
    panslavic: ['#ff0000', '#ffffff', '#0093dd', '#171796', '#f7db17'],
};

const images = [
    {
      name: 'lion-silver',
      text: 'Silver Lion',
      src: null,
    },
    {
      name: 'lion-gold',
      text: 'Gold Lion',
      src: null,
    },
    {
      name: 'unicorn',
      text: 'Unicorn',
      src: null,
    },
    {
      name: 'double-headed-eagle',
      text: 'Double Headed Eagle',
      src: null,
    },
    {
      name: 'dragon',
      text: 'Dragon',
      src: null,
    },
    {
      name: 'urss',
      text: 'URSS',
      src: null,
    },
    {
      name: 'vatican',
      text: 'Vatican',
      src: null,
    },
    {
      name: 'skull',
      text: 'Skull',
      src: null,
    },
    {
      name: 'palm',
      text: 'Palm',
      src: null,
    },
    {
      name: 'moro',
      text: 'Moro',
      src: null,
    },
    {
      name: 'leafs',
      text: 'Leafs',
      src: null,
    },
    {
      name: 'crown',
      text: 'Crown',
      src: null,
    },
];

const flagTypeOptions = [
    {
        label: 'Tricolor',
        value: 'Tricolor',
    },
    /*{
        label: 'Striped',
        value: 'Striped'
    }*/
];

const flagOrientationOptions = [
    {
        label: 'Vertical',
        value: 'Vertical',
    },
    {
        label: 'Horizontal',
        value: 'Horizontal',
    },
];

// Canvas options
let canvas;
const WIDTH = 600;
const HEIGHT = 300;

// Flag
const flag = {
    type: 'Tricolor',
    bands: 3,
    bandsColor: ['#009246', '#F1F2F1', '#CE2B37'],
    coatOfArms: '',
    orientation: 'Vertical',
    showCoatOfArms: true,
    currentImageIndex: 0,
}

generateFlagParams();

// Export Button
exportButton.addEventListener('click', function() {
    saveCanvas(canvas, 'flag', 'png');
});

function preload() {
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        image.src = loadImage(`images/${image.name}.png`);
    }
}

function setup() {
    canvas = createCanvas(600, 300);
    canvas.parent('container');
}

function draw() {
    background(200);
    drawFlag();
}

function drawFlag() {
    const { bands, bandsColor, orientation } = flag;
    const verticalBandWidth = WIDTH / bands;
    const horizontalBandHeight = HEIGHT / bands;
    const currentImage = getCurrentImage();

    for (let i = 0; i < bands; i += 1) {
        const color = bandsColor[i] ?? '#ccc';
        fill(color);
        noStroke();
        if (orientation === 'Vertical') {
            rect(verticalBandWidth * i, 0, verticalBandWidth, HEIGHT);
        } else if (orientation === 'Horizontal') {
            rect(0, horizontalBandHeight * i, WIDTH, horizontalBandHeight);
        }
        if (showCoatOfArms()) {
            const imgWidth = currentImage.width / 5;
            const imgHeight = currentImage.height / 5;
            
            image(
                currentImage,
                WIDTH / 2 - imgWidth / 2,
                HEIGHT / 2 - imgHeight / 2,
                imgWidth,
                imgHeight,
            );
        }
    }
}

function getCurrentImage() {
    return images[flag.currentImageIndex].src;
}

function showCoatOfArms() {
    return flag.showCoatOfArms;
}

function generateBandsColorInput() {
    // Bands Colors
    colorsContainer.innerHTML = "";
    for (let i = 0; i < flag.bands; i++) {
        const field = document.createElement('div');
        field.classList.add(['field', 'column', 'is-2']);
        const label = document.createElement('label');
        label.classList.add('label');
        label.innerText = `#${i+1} Band Color`;
        const control = document.createElement('div');
        control.classList.add('control');

        const colorPicker = document.createElement('input');
        colorPicker.classList.add('input');
        colorPicker.id = `${i}`;
        colorPicker.type="color";
        colorPicker.value = flag.bandsColor[i] ?? '#009246';
        colorPicker.addEventListener('input', function(event) {
            flag.bandsColor[this.id] = event.target.value;
        });
        control.append(colorPicker);

        field.append(label);
        field.append(control);
        colorsContainer.append(field);
    }
}

function generateTypeSelect() {
    // Flag Type Select
    flagTypeOptions.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.innerText = item.label;
        option.selected = flag.type === item.value;
        flagTypeSelect.append(option);
    });
}

function generateOrientationSelect() {
    // Flag Orientation Select
    flagOrientationOptions.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.innerText = item.label;
        option.selected = flag.orientation === item.value;
        flagOrientationSelect.append(option);
    });
    flagOrientationSelect.addEventListener('input', function(event) {
        flag.orientation = event.target.value;
    });
}

function generateCoatSelect() {
    // Flag Coat Select
    images.forEach((image, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = image.text;
        flagCoatSelect.append(option);
    });
    flagCoatSelect.addEventListener('input', function(event) {
        flag.currentImageIndex = event.target.value;
    });
}

function generateFlagParams() {
    // Show Coat of Arms Checkbox
    if (flag.showCoatOfArms) {
        showCoatCheckbox.checked = true;
    }

    showCoatCheckbox.addEventListener('change', function() {
        flag.showCoatOfArms = this.checked;
    })

    // Flag Bands Input
    flagBandsInput.value = flag.bands;
    flagBandsInput.addEventListener('input', function(event) {
        flag.bands = event.target.value;
        generateBandsColorInput();
    });

    generateTypeSelect();

    generateOrientationSelect();

    generateBandsColorInput();

    generateCoatSelect();
}
