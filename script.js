'use strict';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now + '').slice(-10);
  constructor(coord, distance, duration) {
    this.coord = coord; // [lat, lng]
    this.distance = distance; //км
    this.duration = duration; //минуты
  }
}

//создание дочерних классов
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  //метод расчета темпа
  calcPace() {
    //мин / км
    this.pace = this.duration / thiss.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    //км/ч
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//тест
// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);

//Архитектура
class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition(); //будет выполняться, когда код загрузится

    //прослушиватель событый на отпавку формы
    form.addEventListener('submit', this._newWorkout.bind(this));
    e.preventDefault();

    //смена кнопок ввода
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), //привязка this к _loadmap
        function () {
          // alert('Не удалось определить ваше местоположение');
        }
      );
  }

  _loadMap(position) {
    const { latidude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latidude},${longitude}`);

    //подключение API
    const coords = [latidude, longitude];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    //добавление обработчик событий из Leaflet(клик по карте)
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    //отображение ввода тренировки при нажатии на карту
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form_row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('.form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    //очистка поля ввода
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWIdth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Тренировка')
      .openPopup();
  }
}

const app = new App();
//использование API геолокации (предоставляет браузер)
//проверка навигации

//прослушиватель событый на отпавку формы
