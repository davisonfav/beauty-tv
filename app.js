var config = {
    "speed": 30,
    "slides": [
        {
            "type": "image",
            "bgImage": "avalie_google.png"
        },
        {
            "type": "image",
            "bgImage": "spa_pes.png"
        },
        {
            "type": "image",
            "bgImage": "alongamento_cilios.png"
        }
    ]
}

config.slides.forEach(function(slide, i) {
    let elemDiv = document.createElement("div");
    elemDiv.className = 'bg';
    elemDiv.id = 'slide' + i;
    let img = new Image();
    img.onload = function() {
        elemDiv.style.backgroundImage = 'url(' + this.src + ')';
    }
    img.src = 'images/' + slide.bgImage;
    elemDiv.style.display = 'none';
    document.body.appendChild(elemDiv);
});

let currentSlide = 0;
document.getElementById('slide0').style.display = 'block';

setInterval(f => {

    let nextSlide = currentSlide + 1;
    if (nextSlide >= config.slides.length)
        nextSlide = 0;

    document.getElementById('slide' + currentSlide).style.display = 'none';
    document.getElementById('slide' + nextSlide).style.display = 'block';

    currentSlide = nextSlide;
    console.log(currentSlide);
    console.log(nextSlide);
}, 5000);