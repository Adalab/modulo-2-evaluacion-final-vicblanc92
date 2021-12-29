'use strict';

//get data from api

// eslint-disable-next-line no-unused-vars
let animeSeries = [];
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
  html += `<li>${serie.title}</li>`;
  html += `<img src="${serie.image_url}"`;
  return html;
}

function paintAnimeSeries() {
  let seriesCode = '';
  for (const serie of animeSeries) {
    seriesCode += getAnimeSerieshtml(serie);
  }
  animeSerieshtml.innerHTML = seriesCode;
}
