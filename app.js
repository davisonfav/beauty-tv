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
        else if (slide.type == 'weather') {

            if (!weather) {
                return;
            }

            let dateToday = new Date().toLocaleDateString("pt-BR");
            let dateTomorrow = new Date(new Date().getTime() + 86400000).toLocaleDateString("pt-BR");
            let periodToday = new Date().getHours() <= 15 ? 'tarde' : 'noite';
            var weatherToday = weather['weather'][IBGE_CITY_CODE][dateToday];
            var weatherTomorrow = weather['weather'][IBGE_CITY_CODE][dateTomorrow];
            var edgeTempToday = getEdgeTemperaturesForDay(weatherToday);
            var edgeTempTomorrow = getEdgeTemperaturesForDay(weatherTomorrow);

            //se tipo de slide é clima, inclui o conteudo/imagem tambem
            let elemImage = new Image();
            elemImage.src = weatherToday[periodToday].icone;
            elemImage.className = 'weatherImage';
            elemDiv.appendChild(elemImage);

            let elemWeatherTodayMinMax = document.createElement("span");
            elemWeatherTodayMinMax.className = 'weatherTodayMinMax';
            elemWeatherTodayMinMax.textContent = 'MIN ' + edgeTempToday.temp_min + '° - MAX ' + edgeTempToday.temp_max + '°';
            elemDiv.appendChild(elemWeatherTodayMinMax);

            let elemWeatherTodayDescription = document.createElement("span");
            elemWeatherTodayDescription.className = 'weatherTodayDescription';
            elemWeatherTodayDescription.textContent = weatherToday[periodToday].resumo;
            elemDiv.appendChild(elemWeatherTodayDescription);

            let elemWeatherTomorrowMinMax = document.createElement("span");
            elemWeatherTomorrowMinMax.className = 'weatherTomorrowMinMax';
            elemWeatherTomorrowMinMax.textContent = 'MIN ' + edgeTempTomorrow.temp_min + '° - MAX ' + edgeTempTomorrow.temp_max + '°';
            elemDiv.appendChild(elemWeatherTomorrowMinMax);

            let elemWeatherTomorrowMorning = document.createElement("span");
            elemWeatherTomorrowMorning.className = 'weatherTomorrowMorning';
            elemWeatherTomorrowMorning.textContent = weatherTomorrow['manha'].resumo;
            elemDiv.appendChild(elemWeatherTomorrowMorning);

            let elemWeatherTomorrowAfternoon = document.createElement("span");
            elemWeatherTomorrowAfternoon.className = 'weatherTomorrowAfternoon';
            elemWeatherTomorrowAfternoon.textContent = weatherTomorrow['tarde'].resumo;
            elemDiv.appendChild(elemWeatherTomorrowAfternoon);

            let elemWeatherTomorrowNight = document.createElement("span");
            elemWeatherTomorrowNight.className = 'weatherTomorrowNight';
            elemWeatherTomorrowNight.textContent = weatherTomorrow['noite'].resumo;
            elemDiv.appendChild(elemWeatherTomorrowNight);

        }
        else if (slide.type == 'weather_week') {

            if (!weather) {
                return;
            }

            for (var i = 1; i <= 4; i++) {
                let currentDate = new Date(new Date().getTime() + (86400000 * i)).toLocaleDateString("pt-BR");
                let weatherCurrent = weather['weather'][IBGE_CITY_CODE][currentDate];
                let edgeTemp;
                let description;
                if (i == 1) {
                    edgeTemp = getEdgeTemperaturesForDay(weatherCurrent);
                    description = truncateText(weatherCurrent['tarde'].resumo, 50);
                }
                else {
                    edgeTemp = { 
                        temp_min: weatherCurrent.temp_min, 
                        temp_max: weatherCurrent.temp_max
                    };
                    description = truncateText(weatherCurrent.resumo, 50);
                }
                
                let elemDivCurrentTemp = document.createElement("div");
                elemDivCurrentTemp.style.top = (160 + ((i - 1) * 220)) + 'px';
                elemDivCurrentTemp.className = 'newsWeek newsWeekTemp';
                elemDivCurrentTemp.innerHTML = currentDate.slice(0, 5) + 
                "&nbsp;-&nbsp;<span style='color:#26b6d5'>MIN " + edgeTemp.temp_min + "°</span> -" +
                "&nbsp;<span style='color:#ee3535'>MAX " + edgeTemp.temp_max + "°</span>";

                let elemDivCurrentDesc = document.createElement("div");
                elemDivCurrentDesc.style.top = (270 + ((i - 1) * 220)) + 'px';
                elemDivCurrentDesc.textContent = description;
                elemDivCurrentDesc.style.paddingLeft = '20px';
                elemDivCurrentDesc.className = 'newsWeek newsWeekDescription';

                elemDiv.appendChild(elemDivCurrentTemp);
                elemDiv.appendChild(elemDivCurrentDesc);
            }
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

function getEdgeTemperaturesForDay(data) {
    var minTempList = [];
    minTempList.push(data['manha'].temp_min);
    minTempList.push(data['tarde'].temp_min);
    minTempList.push(data['noite'].temp_min);

    var maxTempList = [];
    maxTempList.push(data['manha'].temp_max);
    maxTempList.push(data['tarde'].temp_max);
    maxTempList.push(data['noite'].temp_max);

    return { 
        temp_min: Math.min.apply(null, minTempList),
        temp_max: Math.max.apply(null, maxTempList) 
    };
}

function truncateText(text, maxSize) {
    if (text.length <= maxSize)
        return text;
    else
        return text.slice(0, maxSize) + '...';
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
        "speed": 60,
        "slides": [
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
                "type": "weather",
                "bgImage": "clima_imagem.png"
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
                "bgImage": "brow_lamination.png"
            },
            {
                "type": "weather_week",
                "bgImage": "clima_semana_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "esmaltacao_gel.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
            {
                "type": "image",
                "bgImage": "lash_lifting.png"
            },
            {
                "type": "news",
                "bgImage": "noticias_imagem.png"
            },
        ]
    };
}
