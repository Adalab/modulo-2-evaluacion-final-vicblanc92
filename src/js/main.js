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

  html += `<li class="${
    isClickedSerieAlreadyFavourited ? 'favSeries' : ''
  } page__list--serie"><p class="page__list--serieTitle">${serie.title}</p>`;

  if (!serie.image_url) {
    html += `<img src='https://via.placeholder.com/210x295/ffffff/666666/?text=image%20not%20found'>`;
  } else {
    html += `<img class="images" src="${serie.image_url}">`;
  }

  html += `<button class="js-favbutton btn__fav--add"data-id="${serie.mal_id}" data-image_url=
  "${serie.image_url}" data-title="${serie.title}">Añadir a favoritos</button>`;
  html += `</li>`;

  return html;
};

const paintSeries = () => {
  let seriesHtml = '';

  for (const serie of series) {
    seriesHtml += getSeriesHtml(serie);
  }
  seriesContainer.innerHTML = seriesHtml;

  addFavBtnListeners();
};

const addFavBtnListeners = () => {
  const favSeriesBtns = document.querySelectorAll('.btn__fav--add');
  for (const favSeriesBtn of favSeriesBtns) {
    favSeriesBtn.addEventListener('click', handleClickFavBtn);
  }
  setInLocalStorage();
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
    deleteAllFavBtn.classList.remove('hidden');
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
  html += `<li data-id=>${favouriteSerie.title}</li>`;
  html += `<div>`;
  html += `<img class="images" src="${favouriteSerie.imageUrl}"></img>`;
  html += `<i class="fas fa-times-circle js-delete-favBtn btn__fav--delete" data-id="${favouriteSerie.id}"></i>`;
  html += `</div>`;

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
  deleteAllFavBtn.classList.add('hidden');

  paintFavSeries();
};

const getFromLocalStorage = () => {
  const localStorageFavSeries = localStorage.getItem('favSeries');
  if (localStorageFavSeries !== null) {
    favSeries = JSON.parse(localStorageFavSeries);
    paintFavSeries();
  }
};
const setInLocalStorage = () => {
  const stringifyFavSeries = JSON.stringify(favSeries);
  localStorage.setItem('favSeries', stringifyFavSeries);
};
getFromLocalStorage();

searchBtn.addEventListener('click', handleClickSearchBtn);
resetBtn.addEventListener('click', handleClickResetBtn);
deleteAllFavBtn.addEventListener('click', handleClickDeleteAllFavBtn);
