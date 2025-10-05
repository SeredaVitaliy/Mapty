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
    this.pace = this.duration / this.distance;
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
  #workouts = []; //инициализация

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
    //функция для проверки входных данных
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    //реализация функции создания новой тренеровки
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng; //массив ширины и долготы
    let workout;

    //получение данных из формы
    //если воркаут - бег, то создать беговой объект
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //проверка данных в полях ввода
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Входные данные должны быть положительными числами ');

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    //если вокраут - велосипед, то создать велосипедный объект
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //проверка данных в полях ввода
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Входные данные должны быть положительными числами ');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    //добавить новый объект в массив воркаут
    this.#workouts.push(workout);
  }

  //добавление маркера визуализации тренеровки

  renderWorkoutMarker() {
    //отобразить тренеровку в виде маркера
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWIdth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `#{type}-popup`,
        })
      )
      .setPopupContent('Тренировка')
      .openPopup();
  }
}
//отобразить новую тренировку в списке
//
//скрыть форму и очистить поля ввода
inputDistance.value =
  inputDuration.value =
  inputCadence.value =
  inputElevation.value =
    '';

const app = new App();
//использование API геолокации (предоставляет браузер)
//проверка навигации
