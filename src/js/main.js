/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
'use strict';

//get data from api

// eslint-disable-next-line no-unused-vars
let animeSeries = [];
// eslint-disable-next-line no-unused-vars
let favouriteSeries = [];

const input = document.querySelector('.js-input');
const apiUrl = 'https://api.jikan.moe/v3/search/anime?q=';
const btn = document.querySelector('.js-button');
const animeSerieshtml = document.querySelector('.js-animeSeries');

const getApiSearchAnime = () =>
  fetch(apiUrl + input.value)
    .then((response) => response.json())
    .then((data) => {
      animeSeries = data.results;

      paintAnimeSeries();
    });

//start page

btn.addEventListener('click', getApiSearchAnime);

//paint series

function getAnimeSerieshtml(serie) {
  let html = '';
  html += `<div>`;
  html += `<li class="anime__list">${serie.title}</li>`;
  html += `<button data-id="${serie.mal_id}" data-image_url=
  "${serie.image_url}" data-title="${serie.title}" class="js-favbutton js-add-fav">Añadir a mis series favoritas</button>`;
  html += `<img src="${serie.image_url}"`;

  return html;
}
let seriesElement = '';
function paintAnimeSeries() {
  animeSeries.innerHTML = '';
  for (const serie of animeSeries) {
    seriesElement += getAnimeSerieshtml(serie);
  }
  animeSerieshtml.innerHTML = seriesElement;

  // eslint-disable-next-line no-use-before-define
  listenFavButton();
}

//listen fav

const listenFavButton = () => {
  const seriesFavBtns = document.querySelectorAll('.js-add-fav');
  for (const seriesFavBtn of seriesFavBtns) {
    // eslint-disable-next-line no-use-before-define
    seriesFavBtn.addEventListener('click', handlerClickFavSeries);
  }
};

const handlerClickFavSeries = (ev) => {
  // eslint-disable-next-line no-console
  // console.log(ev.target.dataset.id);
  // console.log(favouriteSeries, ev.target.dataset.image_url);
  let clickedImg = ev.target.dataset.image_url;
  let clickedTitle = ev.target.dataset.title;
  const favSeriesElement = document.querySelector('.js-favSeriesElement');

  favouriteSeries.push({
    title: clickedTitle,
    image_url: clickedImg,
  });

  for (const favouriteSerie of favouriteSeries) {
    favSeriesElement.innerHTML += getFavSeries(favouriteSerie);
  }
};

const getFavSeries = (favouriteSerie) => {
  let htmlFav = '';
  htmlFav += `<li>${favouriteSerie.title}</li>`;
  htmlFav += ` <img src="${favouriteSerie.image_url}"></img>`;
  return htmlFav;
};

// function handlerClickBtnReset() {
//   btnReset = document.querySelector('.js-button-reset');
//   favSeriesElement.innerHTML = '';
//   animeSerieshtml.innerHTML = '';
// }
// btnReset.addEventListener('click', handlerClickBtnReset);
