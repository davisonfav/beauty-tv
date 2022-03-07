var IBGE_CITY_CODE = '3509502';

var config = getConfig();
var news = null;
var weather = null;
getData();

function initSlides() {

    document.body.innerHTML = "";
    let slideCount = 0;

    config.slides.forEach(function(slide) {
        let elemDiv = document.createElement("div");
        let elemImg = document.createElement("img");
        elemImg.src = 'images/' + slide.bgImage;
        elemImg.style.display = 'none';
        
        document.body.appendChild(elemImg);
        elemDiv.className = 'bg';
        elemDiv.id = 'slide' + slideCount;

        elemDiv.style.backgroundImage = 'url("images/' + slide.bgImage + '")';
        elemDiv.style.display = 'none';

        if (slide.type == 'news') {

            if (!news) {
                return;
            }

            let randomNew = news.news[randomNumber()];

            //se tipo de slide é noticia, inclui o conteudo/imagem da noticia tambem
            let elemDivText = document.createElement("div");
            elemDivText.className = 'newsText';
            
            let elemTitle = document.createElement("p");
            elemTitle.className = 'newsTitle';
            elemTitle.textContent = randomNew.title;

            let elemDescription = document.createElement("p");
            elemDescription.className = 'newsDescription';
            elemDescription.textContent = randomNew.description;

            let elemContent = document.createElement("p");
            elemContent.className = 'newsContent';
            elemContent.textContent = randomNew.content ? randomNew.content.substring(0, randomNew.content.indexOf('[')) : "";

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
            elemDivText.appendChild(elemContent);
            elemDivText.appendChild(elemSource);
            elemDiv.appendChild(elemDivText);
            elemDiv.appendChild(elemDivImage);
        }

        if (slide.type == 'weather') {

            if (!weather) {
                return;
            }

            let dateToday = new Date().toLocaleDateString("pt-BR");
            let periodToday = new Date().getHours() <= 15 ? 'tarde' : 'noite';
            var weatherToday = weather['weather'][IBGE_CITY_CODE][dateToday][periodToday];

            //se tipo de slide é clima, inclui o conteudo/imagem tambem
            let elemImage = new Image();
            elemImage.src = weatherToday.icone;
            elemImage.className = 'weatherImage';
            elemDiv.appendChild(elemImage);

            let elemWeatherTodayMinMax = document.createElement("span");
            elemWeatherTodayMinMax.className = 'weatherTodayMinMax';
            elemWeatherTodayMinMax.textContent = 'MIN ' + weatherToday.temp_min + '° - MAX ' + weatherToday.temp_max + '°';
            elemDiv.appendChild(elemWeatherTodayMinMax);

            let elemWeatherTodayDescription = document.createElement("span");
            elemWeatherTodayDescription.className = 'weatherTodayDescription';
            elemWeatherTodayDescription.textContent = weatherToday.resumo + weatherToday.resumo + weatherToday.resumo;
            elemDiv.appendChild(elemWeatherTodayDescription);
        }

        slideCount++;
        document.body.appendChild(elemDiv);
    });

    let currentSlide = 0;
    document.getElementById('slide0').style.display = 'block';

    var intervalId = setInterval(f => {

        let nextSlide = currentSlide + 1;
        if (nextSlide >= slideCount) {
            clearInterval(intervalId);
            getData();
        }
        else {
            document.getElementById('slide' + currentSlide).style.display = 'none';
            document.getElementById('slide' + nextSlide).style.display = 'block';
            currentSlide = nextSlide;
        }
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
     return 120 <= Math.round(Math.abs(new Date().getTime() - timestamp) / (1000 * 60));
 }

function weatherExpired(timestamp) {
    let currentDate = new Date();
    let lastRequestDate = new Date(timestamp);
    return !(
        currentDate.getDate() === lastRequestDate.getDate() &&
        currentDate.getMonth() === lastRequestDate.getMonth() &&
        currentDate.getFullYear === lastRequestDate.getFullYear);
}

 function getData() {

    let requests = [];
    let requestsMap = new Map();
    let requestIndex = 0;
    
    //busca as news se for o load inicial ou caso tenha expirado as noticias
    if (!news || newsExpired(news.timestamp)) {
        requests.push(fetch('https://gnews.io/api/v4/top-headlines?token=c6763eb88c52c398a1e42fd6e590d651&country=BR&lang=pt&max=10'));
        requestsMap.set('news', requestIndex);
        requestIndex++;
    }
    
    if (!weather || weatherExpired(weather.timestamp)) {
        requests.push(fetch('https://apiprevmet3.inmet.gov.br/previsao/' + IBGE_CITY_CODE));
        requestsMap.set('weather', requestIndex);
        requestIndex++;
    }

    Promise.all(requests).then(responses =>
        Promise.all(responses.map(response => response.json()))
    ).then(data => {
        if (requestsMap.has('news')) {
            news = {
                "timestamp": new Date().getTime(),
                "news": data[requestsMap.get('news')].articles
            };
        }

        if (requestsMap.has('weather')) {
            weather = {
                "timestamp": new Date().getTime(),
                "weather": data[requestsMap.get('weather')]
            }
        }

        initSlides();
    }).catch(err =>
        console.log(err)
    );

    if (requests.length == 0)
        initSlides();
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
                "type": "weather",
                "bgImage": "clima_imagem.jpg"
            },
            {
                "type": "image",
                "bgImage": "spa_pes.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            // {
            //     "type": "image",
            //     "bgImage": "alongamento_cilios.png"
            // },
            // {
            //     "type": "news",
            //     "bgImage": "noticias_imagem.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "bioseguranca.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "fibra_vidro.png"
            // },
            // {
            //     "type": "news",
            //     "bgImage": "noticias_imagem.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "base_fortalecedora.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "brow_lamination.png"
            // },
            // {
            //     "type": "news",
            //     "bgImage": "noticias_imagem.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "promocoes.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "drenagem_linfatica.png"
            // },
            // {
            //     "type": "news",
            //     "bgImage": "noticias_imagem.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "site.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "design_sobrancelha.png"
            // },
            // {
            //     "type": "news",
            //     "bgImage": "noticias_imagem.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "giftvoucher.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "depilacao_cera.png"
            // },
            // {
            //     "type": "news",
            //     "bgImage": "noticias_imagem.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "esmaltacao_gel.png"
            // },
            // {
            //     "type": "image",
            //     "bgImage": "lash_lifting.png"
            // }
        ]
    };
}
