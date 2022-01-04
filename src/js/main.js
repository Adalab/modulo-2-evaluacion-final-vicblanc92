/* eslint-disable no-use-before-define */
'use strict';

let series = [];
let favSeries = [];

const searchInput = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-button');
const apiUrl = 'https://api.jikan.moe/v3/search/anime?q=';
const seriesContainer = document.querySelector('.js-animeSeries');
const favSeriesContainer = document.querySelector('.js-favSeriesContainer');
const resetBtn = document.querySelector('.js-button-reset');
const deleteAllFavBtn = document.querySelector('.js-btn-delete-allFav');
const favSeriesTitle = document.querySelector('.js-favSeriesTitle');

const handleClickSearchBtn = () =>
  fetch(apiUrl + searchInput.value)
    .then((response) => response.json())
    .then((data) => {
      series = data.results;
      paintSeries();
    });

const getSeriesHtml = (serie) => {
  let isClickedSerieAlreadyFavourited = false;

  for (const favouriteSerie of favSeries) {
    if (serie.mal_id === favouriteSerie.id) {
      isClickedSerieAlreadyFavourited = true;
      break;
    }
  }

  let html = '';

  if (isClickedSerieAlreadyFavourited === true) {
    html += `<li class="favSeries list--serie">${serie.title}`;
  } else {
    html += `<li class="list--serie">${serie.title}`;
  }
  html += `<button data-id="${serie.mal_id}" data-image_url=
  "${serie.image_url}" data-title="${serie.title}" class="js-favbutton btn__fav--add">Añadir a mis series favoritas</button>`;
  if (!serie.image_url) {
    html += `<img src='https://via.placeholder.com/210x295/ffffff/666666/?text=image%20not%20found'>`;
  } else {
    html += `<img src="${serie.image_url}">`;
  }

  html += `</li>`;

  return html;
};

const paintSeries = () => {
  let seriesHtml = '';
  const SeriesTitle = document.querySelector('.js-series-results');

  for (const serie of series) {
    seriesHtml += getSeriesHtml(serie);
  }
  seriesContainer.innerHTML = seriesHtml;
  SeriesTitle.innerHTML = 'Resultados';

  addFavBtnListeners();
};

const addFavBtnListeners = () => {
  const favSeriesBtns = document.querySelectorAll('.btn__fav--add');
  for (const favSeriesBtn of favSeriesBtns) {
    favSeriesBtn.addEventListener('click', handleClickFavBtn);
  }
};

const handleClickFavBtn = (ev) => {
  ev.target.parentNode.classList.add('favSeries');

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
  } else {
    ev.target.parentNode.classList.remove('favSeries');
    const deleteFavSerieIndex = favSeries.indexOf(clickedId);
    favSeries.splice(deleteFavSerieIndex, 1);
  }

  paintFavSeries();
  setInLocalStorage();
};

const paintFavSeries = () => {
  favSeriesContainer.innerHTML = '';

  for (const favouriteSerie of favSeries) {
    favSeriesContainer.innerHTML += getFavSerieHtml(favouriteSerie);
  }
  favSeriesTitle.innerHTML = 'Mis series favoritas';

  addFavBtnDeleteListeners();
  setInLocalStorage();
};

const addFavBtnDeleteListeners = () => {
  const seriesDeleteFavBtns = document.querySelectorAll('.js-delete-favBtn');
  for (const seriesDeleteFavBtn of seriesDeleteFavBtns) {
    seriesDeleteFavBtn.addEventListener('click', handleClickDeleteFavBtn);
  }
};

const getFavSerieHtml = (favouriteSerie) => {
  let html = '';
  html += `<li data-id=>${favouriteSerie.title}</li>`;
  html += `<img class="anime__image" src="${favouriteSerie.imageUrl}"></img>`;
  html += `<i class="fas fa-times-circle js-delete-favBtn btn__fav--delete" data-id="${favouriteSerie.id}"></i>`;

  return html;
};

const handleClickResetBtn = () => {
  seriesContainer.innerHTML = '';
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
  paintSeries();
  setInLocalStorage();
};

const handleClickDeleteAllFavBtn = () => {
  favSeriesContainer.innerHTML = '';
  favSeries = [];

  paintFavSeries();
};

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

searchBtn.addEventListener('click', handleClickSearchBtn);
resetBtn.addEventListener('click', handleClickResetBtn);
deleteAllFavBtn.addEventListener('click', handleClickDeleteAllFavBtn);
