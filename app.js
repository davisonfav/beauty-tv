var config = getConfig();
var news = null;
getNews();

function initSlides() {
    config.slides.forEach(function(slide, i) {
        let elemDiv = document.createElement("div");
        let elemImg = document.createElement("img");
        elemImg.src = 'images/' + slide.bgImage;
        elemImg.style.display = 'none';
        
        document.body.appendChild(elemImg);
        elemDiv.className = 'bg';
        elemDiv.id = 'slide' + i;

        elemDiv.style.backgroundImage = 'url("images/' + slide.bgImage + '")';
        elemDiv.style.display = 'none';

        if (slide.type == 'news') {

            if (!news) {
                console.log(news.news);
                return;
            }

            let randomNew = news.news[randomNumber()];

            //se tipo de slide é noticia, inclui o conteudo/imagem da noticia tambem
            let elemDivText = document.createElement("div");
            elemDivText.className = 'newsText';
            
            let elemTitle = document.createElement("p");
            elemTitle.className = 'newsTitle';
            // elemTitle.textContent = 'Rússia continuará ofensiva na Ucrânia até alcançar seus objetivos';
            elemTitle.textContent = randomNew.title;

            let elemDescription = document.createElement("p");
            elemDescription.className = 'newsDescription';
            // elemDescription.textContent = 'Anuncio foi feito pelo ministro da Defesa, Serguei Shoigu, em uma entrevista coletiva; objetivo é desmilitarizar a Ucrânia';
            elemDescription.textContent = randomNew.description;

            let elemSource = document.createElement("p");
            elemSource.className = 'newsSource';
            elemSource.innerHTML = '<strong>Fonte:</strong> ' + randomNew.source.name;

            //imagem
            let elemDivImage = document.createElement("div");
            elemDivImage.className = 'newsImage';

            let elemImage = new Image();
            elemImage.onload = function(){
                var adjustedDimensions = calculateAspectRatioFit(this.width, this.height, 510, 275);
                this.width = adjustedDimensions.width;
                this.height = adjustedDimensions.height;
            };
            elemImage.src = randomNew.image;
            elemDivImage.appendChild(elemImage);

            elemDivText.appendChild(elemTitle);
            elemDivText.appendChild(elemDescription);
            elemDivText.appendChild(elemSource);
            elemDiv.appendChild(elemDivText);
            elemDiv.appendChild(elemDivImage);
        }

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
    }, config.speed * 1000);
}

function randomNumber() {
    return Math.floor(Math.random() * (10 - 0)) + 0;
}

 function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
 }

 function newsExpired(timestamp) {
     return 60 <= Math.round(Math.abs(new Date().getTime() - timestamp) / (1000 * 60));
 }

 function getNews() {

    if (!news || newsExpired(news.timestamp)) {
        fetch('https://gnews.io/api/v4/top-headlines?token=c6763eb88c52c398a1e42fd6e590d651&country=BR&lang=pt&max=10')
        .then(response => response.json())
        .then(result => {
            news = {
                "timestamp": new Date().getTime(),
                "news": result.articles
            };
            initSlides();
        });
    }
 }

function getConfig() {
    return {
        "speed": 10,
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
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "alongamento_cilios.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "bioseguranca.png"
            },
            {
                "type": "image",
                "bgImage": "fibra_vidro.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "base_fortalecedora.png"
            },
            {
                "type": "image",
                "bgImage": "brow_lamination.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "promocoes.png"
            },
            {
                "type": "image",
                "bgImage": "drenagem_linfatica.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "site.png"
            },
            {
                "type": "image",
                "bgImage": "design_sobrancelha.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "giftvoucher.png"
            },
            {
                "type": "image",
                "bgImage": "depilacao_cera.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "esmaltacao_gel.png"
            },
            {
                "type": "image",
                "bgImage": "lash_lifting.png"
            }
        ]
    };
}
