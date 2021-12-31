/* eslint-disable no-use-before-define */
'use strict';

let series = [];
let favouriteSeries = [];

const searchInput = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-button');
const apiUrl = 'https://api.jikan.moe/v3/search/anime?q=';
const animeSeriesUl = document.querySelector('.js-animeSeries');
const resetBtn = document.querySelector('.js-button-reset');

const handleClickSearchBtn = () =>
  fetch(apiUrl + searchInput.value)
    .then((response) => response.json())
    .then((data) => {
      series = data.results;
      paintAnimeSeries();
    });

const getAnimeSeriesHtml = (serie) => {
  let html = '';
  html += `<div>`;
  html += `<li class="anime__list">${serie.title}</li>`;
  html += `<button data-id="${serie.mal_id}" data-image_url=
  "${serie.image_url}" data-title="${serie.title}" class="js-favbutton js-add-fav">Añadir a mis series favoritas</button>`;
  html += `<img src="${serie.image_url}"`;
  html += `</div>`;

  return html;
};

const paintAnimeSeries = () => {
  let seriesHtml = '';

  for (const serie of series) {
    seriesHtml += getAnimeSeriesHtml(serie);
  }
  animeSeriesUl.innerHTML = seriesHtml;

  addFavBtnListeners();
};

const addFavBtnListeners = () => {
  const seriesFavBtns = document.querySelectorAll('.js-add-fav');
  for (const seriesFavBtn of seriesFavBtns) {
    seriesFavBtn.addEventListener('click', handleClickFavBtn);
  }
};

const handleClickFavBtn = (ev) => {
  let clickedImg = ev.target.dataset.image_url;
  let clickedTitle = ev.target.dataset.title;
  let clickedId = ev.target.dataset.id;

  let isClickedSerieAlreadyFavourited = false;

  for (const favouriteSerie of favouriteSeries) {
    if (clickedId === favouriteSerie.id) {
      isClickedSerieAlreadyFavourited = true;
      break;
    }
  }

  // isClickedSerieAlreadyFavourited = favouriteSeries.some(
  //   (favouriteSerie) => clickedId === favouriteSerie.id
  // );

  if (!isClickedSerieAlreadyFavourited) {
    favouriteSeries.push({
      id: clickedId,
      title: clickedTitle,
      image_url: clickedImg,
    });

    renderFavSeries();
  }
};

const renderFavSeries = () => {
  const favSeriesContainer = document.querySelector('.js-favSeriesElement');

  favSeriesContainer.innerHTML = '';
  for (const favouriteSerie of favouriteSeries) {
    favSeriesContainer.innerHTML += getFavSerieHtml(favouriteSerie);
  }
};

const getFavSerieHtml = (favouriteSerie) => {
  let html = '';
  html += `<li data-id=>${favouriteSerie.title}</li>`;
  html += `<img src="${favouriteSerie.image_url}"></img>`;
  return html;
};

const handleClickResetBtn = () => {
  animeSeriesUl.innerHTML = '';
  series = [];
};

searchBtn.addEventListener('click', handleClickSearchBtn);
resetBtn.addEventListener('click', handleClickResetBtn);
