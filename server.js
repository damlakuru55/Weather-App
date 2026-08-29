const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

/*
    TÜRKİYE'NİN 81 İLİ
*/

const cities = [
    "Adana",
    "Adıyaman",
    "Afyonkarahisar",
    "Ağrı",
    "Amasya",
    "Ankara",
    "Antalya",
    "Artvin",
    "Aydın",
    "Balıkesir",
    "Bilecik",
    "Bingöl",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "Çanakkale",
    "Çankırı",
    "Çorum",
    "Denizli",
    "Diyarbakır",
    "Düzce",
    "Edirne",
    "Elazığ",
    "Erzincan",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "Giresun",
    "Gümüşhane",
    "Hakkari",
    "Hatay",
    "Iğdır",
    "Isparta",
    "İstanbul",
    "İzmir",
    "Kahramanmaraş",
    "Karabük",
    "Karaman",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "Kilis",
    "Kırıkkale",
    "Kırklareli",
    "Kırşehir",
    "Kocaeli",
    "Konya",
    "Kütahya",
    "Malatya",
    "Manisa",
    "Mardin",
    "Mersin",
    "Muğla",
    "Muş",
    "Nevşehir",
    "Niğde",
    "Ordu",
    "Osmaniye",
    "Rize",
    "Sakarya",
    "Samsun",
    "Siirt",
    "Sinop",
    "Sivas",
    "Şanlıurfa",
    "Şırnak",
    "Tekirdağ",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "Uşak",
    "Van",
    "Yalova",
    "Yozgat",
    "Zonguldak"
];


/*
    HAVA DURUMU AÇIKLAMALARI
*/

const weatherCodes = {
    0: "Açık",
    1: "Çoğunlukla açık",
    2: "Parçalı bulutlu",
    3: "Kapalı",
    45: "Sisli",
    48: "Kırağılı sis",
    51: "Hafif çisenti",
    53: "Çisenti",
    55: "Yoğun çisenti",
    56: "Dondurucu çisenti",
    57: "Yoğun dondurucu çisenti",
    61: "Hafif yağmur",
    63: "Yağmur",
    65: "Kuvvetli yağmur",
    66: "Dondurucu yağmur",
    67: "Kuvvetli dondurucu yağmur",
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
    İLLER LİSTESİ API
*/

app.get("/api/cities", (req, res) => {
    res.json(cities);
});


/*
    HAVA DURUMU API
*/

app.get("/api/weather", async (req, res) => {

    try {

        const city = req.query.city;

        if (!city) {

            return res.status(400).json({
                error: "Şehir seçilmedi."
            });

        }


        /*
            Kullanıcının yalnızca 81 il
            arasından seçim yapmasına izin veriyoruz.
        */

        const validCity = cities.find(
            item =>
                item.toLocaleLowerCase("tr-TR") ===
                city.toLocaleLowerCase("tr-TR")
        );


        if (!validCity) {

            return res.status(400).json({
                error: "Bu şehir Türkiye'nin 81 ili arasında bulunmuyor."
            });

        }


        /*
            KOORDİNAT BUL
        */

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search` +
            `?name=${encodeURIComponent(validCity)}` +
            `&count=10` +
            `&language=tr` +
            `&format=json`;


        const geoResponse =
            await fetch(geoURL);


        if (!geoResponse.ok) {

            throw new Error(
                "Konum servisine ulaşılamadı."
            );

        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            return res.status(404).json({
                error: "Şehir bulunamadı."
            });

        }


        /*
            Türkiye sonucunu bulmaya çalış
        */

        let location =
            geoData.results.find(
                item =>
                    item.country_code === "TR"
            );


        if (!location) {
            location = geoData.results[0];
        }


        /*
            HAVA DURUMU
        */

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${location.latitude}` +
            `&longitude=${location.longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure` +
            `&hourly=temperature_2m,weather_code,precipitation_probability,relative_humidity_2m,wind_speed_10m` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset` +
            `&timezone=auto` +
            `&forecast_days=7`;


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {

            throw new Error(
                "Hava durumu servisine ulaşılamadı."
            );

        }


        const weather =
            await weatherResponse.json();


        const current =
            weather.current;


        res.json({

            city: validCity,

            country: "Türkiye",

            latitude:
                location.latitude,

            longitude:
                location.longitude,

            timezone:
                weather.timezone,

            current: {

                temperature:
                    current.temperature_2m,

                feelsLike:
                    current.apparent_temperature,

                humidity:
                    current.relative_humidity_2m,

                windSpeed:
                    current.wind_speed_10m,

                pressure:
                    current.surface_pressure,

                weatherCode:
                    current.weather_code,

                description:
                    weatherCodes[
                        current.weather_code
                    ] || "Bilinmiyor",

                time:
                    current.time

            },

            hourly: {

                time:
                    weather.hourly.time,

                temperature:
                    weather.hourly.temperature_2m,

                weatherCode:
                    weather.hourly.weather_code,

                precipitation:
                    weather.hourly.precipitation_probability,

                humidity:
                    weather.hourly.relative_humidity_2m,

                wind:
                    weather.hourly.wind_speed_10m

            },

            daily: {

                time:
                    weather.daily.time,

                weatherCode:
                    weather.daily.weather_code,

                max:
                    weather.daily.temperature_2m_max,

                min:
                    weather.daily.temperature_2m_min,

                precipitation:
                    weather.daily.precipitation_probability_max,

                sunrise:
                    weather.daily.sunrise,

                sunset:
                    weather.daily.sunset

            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Hava durumu alınırken bir hata oluştu."

        });

    }

});


app.listen(PORT, () => {

    console.log("");
    console.log(
        "======================================"
    );

    console.log(
        "       WEATHER APP v2.0"
    );

    console.log(
        "======================================"
    );

    console.log(
        `http://localhost:${PORT}`
    );

    console.log("");

});