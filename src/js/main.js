/* eslint-disable no-use-before-define */
'use strict';

//arrays de series y series favoritas
let series = [];
let favSeries = [];

//variables globales
const searchInput = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-button');
const apiUrl = 'https://api.jikan.moe/v3/search/anime?q=';
const seriesContainer = document.querySelector('.js-animeSeries');
const favSeriesContainer = document.querySelector('.js-favSeriesContainer');
const resetBtn = document.querySelector('.js-button-reset');
const deleteAllFavBtn = document.querySelector('.js-btn-delete-allFav');
const favSeriesTitle = document.querySelector('.js-favSeriesTitle');
const SeriesTitle = document.querySelector('.js-series-results');

//ejecución de la función fetch para obtener api de series de anime
const handleClickSearchBtn = () =>
  fetch(apiUrl + searchInput.value)
    .then((response) => response.json())
    .then((data) => {
      series = data.results;
      paintSeries();
    });

//pintar los titulos en html
SeriesTitle.innerHTML = 'Resultados';
favSeriesTitle.innerHTML = 'Mis series favoritas';

//función que pinta todos los elementos en html al obtener respuesta de la api//comprueba las series pintadas son o no favoritas.
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
  html += `<i class="far fa-star js-favbutton btn__fav--add"data-id="${serie.mal_id}" data-image_url=
  "${serie.image_url}" data-title="${serie.title}"></i>`;
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

//función para pintar cada una de las series favoritas

const getFavSerieHtml = (favouriteSerie) => {
  let html = '';
  html += `<li data-id=>${favouriteSerie.title}</li>`;
  html += `<img class="anime__image" src="${favouriteSerie.imageUrl}"></img>`;
  html += `<i class="fas fa-times-circle js-delete-favBtn btn__fav--delete" data-id="${favouriteSerie.id}"></i>`;

  return html;
};

//función encargada de pintar las series favoritas, se recorren todas con un bucle y se pinta una por una y se añaden con cada vez mediante la función anterior que pintaba cada una

const paintFavSeries = () => {
  favSeriesContainer.innerHTML = '';

  for (const favouriteSerie of favSeries) {
    favSeriesContainer.innerHTML += getFavSerieHtml(favouriteSerie);
  }

  addFavBtnDeleteListeners();
  setInLocalStorage();
};

//función para añadir un botón de borrar los favoritos . Nos traemos un btón declarando una constante y hacemos un bucle para poder recorrer todos  y añadirle luego al botón un listener para que se ejecute otra funcion al hacer click.

const addFavBtnDeleteListeners = () => {
  const seriesDeleteFavBtns = document.querySelectorAll('.js-delete-favBtn');
  for (const seriesDeleteFavBtn of seriesDeleteFavBtns) {
    seriesDeleteFavBtn.addEventListener('click', handleClickDeleteFavBtn);
  }
};

const handleClickResetBtn = () => {
  seriesContainer.innerHTML = '';
  series = [];
};

//esta función se encarga de gestionar el botón de borrar favoritos uno por uno. Recorremos con un bucle todas las series y le decimos que borre una en cuanto se clicke.
//después se llama a las otras funciones para que se vuelvan a pintar las series y las series favoritas además de guardarlo en el localstorage.

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

//esta función se encarga de borrar todos los favoritos, dejamos tanto el array como lo que pintamos en html vacio y volvemos a pintar las series favoritas, quedandose de este modo el recuadro vacio.

const handleClickDeleteAllFavBtn = () => {
  favSeriesContainer.innerHTML = '';
  favSeries = [];

  paintFavSeries();
};

//con estas funciones guardamos la información en el local storage, para que una vez recarguemos la página, las series favoritas no desaparezcan.

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

//estos son los listeners. Al hacer click sobre los botones. se ejecutan las funcioones que van entre paréntesis.
searchBtn.addEventListener('click', handleClickSearchBtn);
resetBtn.addEventListener('click', handleClickResetBtn);
deleteAllFavBtn.addEventListener('click', handleClickDeleteAllFavBtn);
