/* eslint-disable no-use-before-define */
'use strict';

let series = [];
let favSeries = [];

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
  html += `<nav>`;
  html += `<li class="anime__list--serie">${serie.title}</li>`;
  html += `<button data-id="${serie.mal_id}" data-image_url=
  "${serie.image_url}" data-title="${serie.title}" class="js-favbutton btn__fav--add">Añadir a mis series favoritas</button>`;
  html += `<img src="${serie.image_url}"`;
  html += `</nav>`;

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
  const seriesFavBtns = document.querySelectorAll('.btn__fav--add');
  for (const seriesFavBtn of seriesFavBtns) {
    seriesFavBtn.addEventListener('click', handleClickFavBtn);
  }
};

const handleClickFavBtn = (ev) => {
  let clickedImg = ev.target.dataset.image_url;
  let clickedTitle = ev.target.dataset.title;
  let clickedId = ev.target.dataset.id;

  let isClickedSerieAlreadyFavourited = false;

  for (const favouriteSerie of favSeries) {
    if (clickedId === favouriteSerie.id) {
      isClickedSerieAlreadyFavourited = true;
      break;
    }
  }

  if (!isClickedSerieAlreadyFavourited) {
    favSeries.push({
      id: clickedId,
      title: clickedTitle,
      imageUrl: clickedImg,
    });

    paintFavSeries();
    setInLocalStorage();
  }
};

const paintFavSeries = () => {
  const favSeriesContainer = document.querySelector('.js-favSeriesContainer');

  favSeriesContainer.innerHTML = '';
  for (const favouriteSerie of favSeries) {
    favSeriesContainer.innerHTML += getFavSerieHtml(favouriteSerie);
  }
  addFavBtnDeleteListeners();
};

const addFavBtnDeleteListeners = () => {
  const seriesDeleteFavBtns = document.querySelectorAll('.js-delete-favBtn');
  for (const seriesDeleteFavBtn of seriesDeleteFavBtns) {
    seriesDeleteFavBtn.addEventListener('click', handleClickDeleteFavBtn);
  }
};

const getFavSerieHtml = (favouriteSerie) => {
  let html = '';
  html += `<nav class="anime__nav">`;
  html += `<li data-id=>${favouriteSerie.title}</li>`;
  html += `<button class="js-delete-favBtn btn__fav--delete" data-id="${favouriteSerie.id}">Borrar de favoritos</button>`;
  html += `<img class="anime__image" src="${favouriteSerie.imageUrl}"></img>`;
  html += `</nav>`;
  return html;
};

const handleClickResetBtn = () => {
  animeSeriesUl.innerHTML = '';
  series = [];
};

const handleClickDeleteFavBtn = (ev) => {
  let clickedId = ev.target.dataset.id;
  for (let index = 0; index < favSeries.length; index++) {
    if (clickedId === favSeries[index].id) {
      favSeries.splice(index, 1);
    }
  }
  paintFavSeries();
  setInLocalStorage();
};

searchBtn.addEventListener('click', handleClickSearchBtn);
resetBtn.addEventListener('click', handleClickResetBtn);

const getFromLocalStorage = () => {
  const localStorageFavSeries = localStorage.getItem('FavSeries');
  if (localStorageFavSeries !== null) {
    favSeries = JSON.parse(localStorageFavSeries);
    paintFavSeries();
  }
};
const setInLocalStorage = () => {
  const stringifyFavSeries = JSON.stringify(favSeries);
  localStorage.setItem('FavSeries', stringifyFavSeries);
};

getFromLocalStorage();
