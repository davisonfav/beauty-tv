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

function imageIsLoaded(url){
    return new Promise(function(resolve, reject){
        var img = new Image();
        try {
            img.addEventListener('load', function() {
                resolve (true);
            }, false);
            img.addEventListener('error', function() {
                resolve (false);
            }, false);      
        }
        catch(error) {
            resolve (false);
        }
        img.src = url;
    });        
}

config.slides.forEach(function(slide, i) {
    let elemDiv = document.createElement("div");
    let elemImg = document.createElement("img");
    elemImg.src = 'images/' + slide.bgImage;

    // elemImg.style.width = '1px';
    // elemImg.style.height = '1px';
    elemImg.style.display = 'none';
    
    document.body.appendChild(elemImg);
    elemDiv.className = 'bg';
    elemDiv.id = 'slide' + i;
    // let img = new Image();
    // img.onload = function() {
    //     elemDiv.style.backgroundImage = 'url(' + this.src + ')';
    // }
    // img.src = 'images/' + slide.bgImage;
    // imageIsLoaded('images/' + slide.bgImage).then(function(value) {
    //     elemDiv.style.backgroundImage = 'url("images/' + slide.bgImage + '")';
    // });
    elemDiv.style.backgroundImage = 'url("images/' + slide.bgImage + '")';
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
}, 15000);