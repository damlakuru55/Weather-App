const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const unitButton =
    document.getElementById("unitButton");

const loading =
    document.getElementById("loading");

const dashboard =
    document.getElementById("dashboard");

const errorBox =
    document.getElementById("error");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const temperatureUnit =
    document.getElementById("temperatureUnit");

const description =
    document.getElementById("description");

const weatherIcon =
    document.getElementById("weatherIcon");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const pressure =
    document.getElementById("pressure");

const date =
    document.getElementById("date");

const hourly =
    document.getElementById("hourly");

const forecast =
    document.getElementById("forecast");

const animationLayer =
    document.getElementById("animationLayer");


let cities = [];

let currentWeather = null;

let unit = "C";


/*
    HAVA DURUMU AÇIKLAMALARI
*/

const weatherDescriptions = {

    0: "Açık",
    1: "Çoğunlukla açık",
    2: "Parçalı bulutlu",
    3: "Kapalı",
    45: "Sisli",
    48: "Kırağılı sis",
    51: "Hafif çisenti",
    53: "Çisenti",
    55: "Yoğun çisenti",
    61: "Hafif yağmur",
    63: "Yağmur",
    65: "Kuvvetli yağmur",
    71: "Hafif kar",
    73: "Kar",
    75: "Yoğun kar",
    77: "Kar taneleri",
    80: "Hafif sağanak",
    81: "Sağanak",
    82: "Kuvvetli sağanak",
    85: "Hafif kar sağanağı",
    86: "Kuvvetli kar sağanağı",
    95: "Gök gürültülü fırtına",
    96: "Dolu ihtimalli fırtına",
    99: "Kuvvetli dolulu fırtına"

};


/*
    HAVA İKONU
*/

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 57) {
        return "🌦️";
    }

    if (code >= 61 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️";
    }

    if (code >= 85 && code <= 86) {
        return "🌨️";
    }

    if (code >= 95 && code <= 99) {
        return "⛈️";
    }

    return "🌤️";
}


/*
    SICAKLIK DÖNÜŞÜMÜ
*/

function convertTemperature(value) {

    if (unit === "C") {
        return Math.round(value);
    }

    return Math.round(
        (value * 9 / 5) + 32
    );

}


function temperatureText(value) {

    return `${convertTemperature(value)}°${unit}`;

}


/*
    TARİH
*/

function formatDate(dateString) {

    const d =
        new Date(dateString);

    return d.toLocaleDateString(
        "tr-TR",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

}


/*
    SAAT
*/

function formatHour(timeString) {

    const d =
        new Date(timeString);

    return d.toLocaleTimeString(
        "tr-TR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/*
    81 İLİ AL
*/

async function loadCities() {

    try {

        const response =
            await fetch("/api/cities");

        cities =
            await response.json();

        /*
            Başlangıçta Ankara
        */

        cityInput.value = "Ankara";

        loadWeather("Ankara");

    } catch (error) {

        showError(
            "Şehir listesi yüklenemedi."
        );

    }

}


/*
    ŞEHİR ARAMA
*/

function findCity(searchText) {

    const text =
        searchText
            .trim()
            .toLocaleLowerCase("tr-TR");


    if (!text) {
        return null;
    }


    /*
        Önce tam eşleşme
    */

    const exact =
        cities.find(
            city =>
                city.toLocaleLowerCase("tr-TR") ===
                text
        );


    if (exact) {
        return exact;
    }


    /*
        Sonra başlayan şehir
    */

    const startsWith =
        cities.find(
            city =>
                city.toLocaleLowerCase("tr-TR")
                    .startsWith(text)
        );


    if (startsWith) {
        return startsWith;
    }


    /*
        Son olarak içeren şehir
    */

    const contains =
        cities.find(
            city =>
                city.toLocaleLowerCase("tr-TR")
                    .includes(text)
        );


    return contains || null;

}


/*
    HAVA DURUMUNU AL
*/

async function loadWeather(city) {

    loading.style.display =
        "block";

    dashboard.style.display =
        "none";

    errorBox.style.display =
        "none";


    try {

        const response =
            await fetch(
                `/api/weather?city=${encodeURIComponent(city)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Hava durumu alınamadı."
            );

        }


        currentWeather =
            data;


        cityInput.value =
            data.city;


        renderWeather(data);


        loading.style.display =
            "none";

        dashboard.style.display =
            "grid";


    } catch (error) {

        loading.style.display =
            "none";

        showError(
            error.message
        );

    }

}


/*
    HAVA DURUMUNU EKRANA YAZ
*/

function renderWeather(data) {

    const current =
        data.current;


    cityName.textContent =
        data.city;


    countryName.textContent =
        data.country;


    temperature.textContent =
        convertTemperature(
            current.temperature
        );


    temperatureUnit.textContent =
        `°${unit}`;


    description.textContent =
        current.description;


    weatherIcon.textContent =
        getWeatherIcon(
            current.weatherCode
        );


    feelsLike.textContent =
        temperatureText(
            current.feelsLike
        );


    humidity.textContent =
        `${current.humidity}%`;


    wind.textContent =
        `${Math.round(
            current.windSpeed
        )} km/sa`;


    pressure.textContent =
        `${Math.round(
            current.pressure
        )} hPa`;


    date.textContent =
        formatDate(
            current.time
        );


    renderHourly(
        data.hourly
    );


    renderForecast(
        data.daily
    );


    updateBackground(
        current.weatherCode,
        current.time
    );

}


/*
    SAATLİK TAHMİN
*/

function renderHourly(data) {

    hourly.innerHTML = "";


    const now =
        new Date();


    let shown = 0;


    for (
        let i = 0;
        i < data.time.length;
        i++
    ) {

        const forecastDate =
            new Date(
                data.time[i]
            );


        if (
            forecastDate < now
        ) {
            continue;
        }


        if (shown >= 12) {
            break;
        }


        const card =
            document.createElement("div");

        card.className =
            "hour";


        const time =
            document.createElement("div");

        time.className =
            "hour-time";

        time.textContent =
            shown === 0
                ? "Şimdi"
                : formatHour(
                    data.time[i]
                );


        const icon =
            document.createElement("div");

        icon.className =
            "hour-icon";

        icon.textContent =
            getWeatherIcon(
                data.weatherCode[i]
            );


        const temp =
            document.createElement("div");

        temp.className =
            "hour-temp";

        temp.textContent =
            temperatureText(
                data.temperature[i]
            );


        const rain =
            document.createElement("div");

        rain.className =
            "hour-rain";

        rain.textContent =
            `Yağış ${data.precipitation[i]}%`;


        card.appendChild(time);

        card.appendChild(icon);

        card.appendChild(temp);

        card.appendChild(rain);


        hourly.appendChild(card);


        shown++;

    }

}


/*
    7 GÜNLÜK TAHMİN
*/

function renderForecast(data) {

    forecast.innerHTML = "";


    for (
        let i = 0;
        i < data.time.length;
        i++
    ) {

        const card =
            document.createElement("div");

        card.className =
            "day-card";


        const day =
            document.createElement("div");

        day.className =
            "day-name";


        const d =
            new Date(
                data.time[i]
            );


        day.textContent =
            i === 0
                ? "Bugün"
                : d.toLocaleDateString(
                    "tr-TR",
                    {
                        weekday: "short"
                    }
                );


        const icon =
            document.createElement("div");

        icon.className =
            "day-icon";

        icon.textContent =
            getWeatherIcon(
                data.weatherCode[i]
            );


        const temp =
            document.createElement("div");

        temp.className =
            "day-temp";

        temp.innerHTML =
            `${temperatureText(
                data.max[i]
            )}
            <span class="day-min">
                ${temperatureText(
                    data.min[i]
                )}
            </span>`;


        const rain =
            document.createElement("div");

        rain.className =
            "day-rain";

        rain.textContent =
            `Yağış ${data.precipitation[i]}%`;


        card.appendChild(day);

        card.appendChild(icon);

        card.appendChild(temp);

        card.appendChild(rain);


        forecast.appendChild(card);

    }

}


/*
    ARKA PLAN
*/

function updateBackground(
    code,
    time
) {

    document.body.classList.remove(
        "day",
        "night",
        "rain",
        "snow",
        "storm"
    );


    animationLayer.innerHTML =
        "";


    const hour =
        new Date(time).getHours();


    if (code >= 95) {

        document.body.classList.add(
            "storm"
        );

        createRain();

        return;
    }


    if (
        code >= 71 &&
        code <= 86
    ) {

        document.body.classList.add(
            "snow"
        );

        createSnow();

        return;
    }


    if (
        (
            code >= 51 &&
            code <= 67
        ) ||
        (
            code >= 80 &&
            code <= 82
        )
    ) {

        document.body.classList.add(
            "rain"
        );

        createRain();

        return;
    }


    if (
        hour < 6 ||
        hour >= 19
    ) {

        document.body.classList.add(
            "night"
        );

    } else {

        document.body.classList.add(
            "day"
        );

    }

}


/*
    YAĞMUR
*/

function createRain() {

    animationLayer.innerHTML =
        "";


    for (
        let i = 0;
        i < 80;
        i++
    ) {

        const drop =
            document.createElement(
                "div"
            );


        drop.className =
            "raindrop";


        drop.style.left =
            `${Math.random() * 100}%`;


        drop.style.animationDuration =
            `${0.5 + Math.random()}s`;


        drop.style.animationDelay =
            `${Math.random() * 2}s`;


        animationLayer.appendChild(
            drop
        );

    }

}


/*
    KAR
*/

function createSnow() {

    animationLayer.innerHTML =
        "";


    for (
        let i = 0;
        i < 60;
        i++
    ) {

        const snow =
            document.createElement(
                "div"
            );


        snow.className =
            "snowflake";


        snow.textContent =
            "❄";


        snow.style.left =
            `${Math.random() * 100}%`;


        snow.style.animationDuration =
            `${4 + Math.random() * 6}s`;


        snow.style.animationDelay =
            `${Math.random() * 5}s`;


        animationLayer.appendChild(
            snow
        );

    }

}


/*
    ARAMA BUTONU
*/

searchButton.addEventListener(
    "click",
    () => {

        const searchedCity =
            findCity(
                cityInput.value
            );


        if (!searchedCity) {

            showError(
                "Bu isimde bir şehir bulunamadı. Türkiye'nin 81 ilinden birini yazın."
            );

            return;
        }


        loadWeather(
            searchedCity
        );

    }
);


/*
    ENTER İLE ARAMA
*/

cityInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            searchButton.click();

        }

    }
);


/*
    °C / °F
*/

unitButton.addEventListener(
    "click",
    () => {

        unit =
            unit === "C"
                ? "F"
                : "C";


        if (currentWeather) {

            renderWeather(
                currentWeather
            );

        }

    }
);


/*
    HATA
*/

function showError(message) {

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";

}


/*
    BAŞLAT
*/

loadCities();