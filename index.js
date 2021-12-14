let countryInfo;
let countryPhotos;
let countryNews = [];
let countryWeather;
let inputValue;
let currentContent = "home";

// Country Info
function getCountryInfo(name) {
  return $.ajax({
    url: `https://restcountries.com/v2/name/${name}`,
    type: "get",
    success: function (data) {
      data = data[0];
      countryInfo = {
        name: data.name,
        capital: data.capital,
        language: data.languages[0].name,
        currencies: data.currencies[0].name,
        flags: data.flags.svg,
      };
      mapCountryInfo();
    },
  });
}
function mapCountryInfo() {
  let element = `<div class="content-country-info">
  <div class="country-heading">
    <h3 class="country-name">${countryInfo.name}</h3>
  </div>
  <div class="country-details">
    <p>Capital: <snap class="country-info country-capital">${countryInfo.capital}</span></p>
    <p>Language: <snap class="country-info country-language">${countryInfo.language}</span></p>
    <p>Currency: <snap class="country-info country-currency">${countryInfo.currencies}</span></p>
  </div>
</div>
<div class="content-country-image" style="background-image: url('${countryInfo.flags}');"></div>`;
  $(".content-country").empty();
  $(".content-country").append(element);
}
// Country Photos
function getCountryPhotos(name) {
  return $.ajax({
    url: `https://api.unsplash.com/search/photos?page=1&query=${name}&client_id=RtI33BSqeA6ecVxWCRd1bLHWiOsOwUKaMj78A5cP3as`,
    type: "get",
    success: function (data) {
      countryPhotos = {
        url: data.results.slice(0, 5),
      };
      mapCountryPhotos();
    },
  });
}
function mapCountryPhotos() {
  $(".content-images").empty();
  countryPhotos.url.map(function (photo) {
    let element = `<div><img src=${photo.urls.regular} alt=${photo.alt_description}></div>`;
    $(".content-images").append(element);
  });
}
// Country News
function getCountryNews(name) {
  return $.ajax({
    url: `https://newsapi.org/v2/everything?q='${name}'&from=2021-11-21&sortBy=popularity&apiKey=f5030e55a3134c2d9db5df2e2ba0de31`,
    type: "get",
    success: function (data) {
      for (let i = 0; i < 10; i++) {
        countryNews.push({
          source: data.articles[i].source.name,
          title: data.articles[i].title,
          img: data.articles[i].urlToImage,
          description: data.articles[i].description,
          url: data.articles[i].url,
        });
      }
      mapCountryNews();
    },
  });
}
function mapCountryNews() {
  $(".content-news__wrapper").empty();
  countryNews.map(function (news) {
    let element = `<div class="content-news" data-url=${news.url}>
  <div class="content-news__text">
    <h3 class="content-news__source">${news.source}</h3>
    <p class="content-news__title">${news.title}</p>
    <p class="content-news__description">${news.description}</p>
  </div>
  <img class="content-news__img" src="${news.img}">
</div>`;
    $(".content-news__wrapper").append(element);
  });
  $(".content-news__wrapper")
    .children()
    .each(function () {
      $(this).click(function () {
        window.open($(this).data("url"), "_blank");
      });
    });
}
// Country Weather
function getCountryWeather(name) {
  return $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=7fbb02f8c26e09f99f9bf3f703972dcc`,
    type: "get",
    success: function (data) {
      countryWeather = {
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        clouds: data.clouds.all,
      };
      mapCountryWeather();
    },
  });
}
function mapCountryWeather() {
  let imageUrl = countryPhotos.url[0].urls.small;
  let element = `
  
  <div class="content-weather-image" style="background-image: url('${imageUrl}')">
  </div>
  <div class="content-weather-info">
    <div>
      <h4 class="content-weather__header">Today</h4>
      <p class="content-weather__date">${getDate()}</p>
      <p class="content-weather__celsium">${
        countryWeather.temp
      } <sup>o</sup>C</p>
    </div>
    <div>
      <p class="content-weather__cloudy">Clouds: <span class="bold">${
        countryWeather.clouds
      }%</span></p>
      <p class="content-weather__humidity">Humidity: <span class="bold">${
        countryWeather.humidity
      }%</span></p>
      <p class="content-weather__wind">Wind speed: <span class="bold">${
        countryWeather.wind
      } km/h</span></p>
    </div>
</div>`;
  $(".content-weather").empty();
  $(".content-weather").append(element);
}

function getDate() {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date();
  let month = months[d.getMonth()];
  let weekday = weekdays[d.getDay()];
  let year = d.getFullYear();
  let date = d.getDate();

  return `${weekday}, ${month} ${date}, ${year}`;
}
function changeActiveLink(link, active) {
  let links = $(".links img").toArray();
  links.forEach((element) => {
    $(element).attr("src", `${$(element).attr("src").replace("-active", "")}`);
  });
  $($(link).children()).attr("src", `./assets/img/${active}-active.png`);
}
function removePrevContent() {
  switch (currentContent) {
    case "home":
      $(".content-country").show();
      $(".content-images, .content-news__wrapper, .content-weather").hide();
      break;
    case "gallery":
      $(".content-images").show();
      $(".content-country, .content-news__wrapper, .content-weather").hide();
      break;
    case "news":
      $(".content-news__wrapper").show();
      $(".content-country, .content-images, .content-weather").hide();
      break;
    case "weather":
      $(".content-weather").show();
      $(".content-country, .content-images, .content-news__wrapper").hide();
      break;
    default:
      break;
  }
}
function changeContent(value) {
  switch (value) {
    case "home":
      currentContent = "home";
      removePrevContent();
      break;
    case "gallery":
      currentContent = "gallery";
      removePrevContent();
      break;
    case "news":
      currentContent = "news";
      removePrevContent();
      break;
    case "weather":
      currentContent = "weather";
      removePrevContent();
      break;
    default:
      break;
  }
}
function getData() {
  getCountryPhotos(inputValue);
  getCountryInfo(inputValue);
  getCountryNews(inputValue);
  getCountryWeather(inputValue);
}
$(document).ready(function () {
  removePrevContent();
  $(".input button img").click(function () {
    inputValue = $(".input input").val().trim();
    if (inputValue) {
      $(".content-news__wrapper").empty();
      getData(inputValue);
    }
  });
  const links = $(".links li").toArray();
  links.map(function (link) {
    $(link).click(function () {
      changeContent($(link).text().trim().toLowerCase());
      changeActiveLink(link, $(link).text().trim().toLowerCase());
    });
  });
});
