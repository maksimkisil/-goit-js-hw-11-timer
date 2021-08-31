// таймер отсчет вперед

const startBtn = document.querySelector("button[data-action-start]");
const stopBtn = document.querySelector("button[data-action-stop]");
const clockface = document.querySelector(".js-clockface");

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;

    this.init();
  }

  // при загрузке страницы, что бы сразу отображались цифры
  init() {
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

  start() {
    // если мы запускаем таймер и он уже активный, то return из этого кода и больше ничего не выполняй
    // а если же он не активен, то мы делаем его активным, ставим буль(this.isActive = true) и запускаем setInterval
    if (this.isActive) {
      console.log("таймер запущен, кронка старт не активна");
      return;
    }

    const startTime = Date.now();
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      const time = this.getTimeComponents(deltaTime);

      this.onTick(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

  // принимает время в милисекундах
  // высчитывает сколько в них вмещается часов/минут/секунд
  // возвращает объект со свойствами days, hours, mins, secs
  // формулы скопированы с стаоверфлоу
  getTimeComponents(time) {
    const days = this.pad(Math.floor(time / (1000 * 60 * 60 * 24)));
    const hours = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { days, hours, mins, secs };
  }

  // метод pad(написал репета), приводит к строке и добавляет в начало 0, если число меньше 2-х знаков
  // если 1 -> то вернет 01; 7 -> 07; 12 -> 12
  pad(value) {
    return String(value).padStart(2, "0");
  }
}

const timer = new Timer({ onTick: updateClockface });

// при вызове start/stop this будет ссылаться на саму кнопку.
// если передаешь метод объекта как коллбек в какую-то функцию, то он будет undefind/window. а если передаешь в addEventListener, то this внутри этих методов объекта будет ссылаться на DOM элемент, на котором висит этот слушатель событий, поэтому нужно привязать контекст(bind).
startBtn.addEventListener("click", timer.start.bind(timer));
stopBtn.addEventListener("click", timer.stop.bind(timer));

// принимает время в милисекундах
// высчитывает сколько в них вмещается часов/минут/секунд
// рисует интерфейс
function updateClockface({ days, hours, mins, secs }) {
  clockface.textContent = `${days}:${hours}:${mins}:${secs}`;
}

// ----------------------------------------------------------------------------
// плагин - это js, который натягивается на твою разметку (которая ожидает какую-то разметку, возможно, и к ней натягивается).

// разница между объектом и плагином в том, что плагин - это просто класс и из него экземпляры делаются.

//stop и start будут на прототипе лежать, а intervalId, isActive будут на экземпляре лежать.

// класс не должен знать про обновление интерфейса, он занимается только подсчетом.
// класс(модель данных) не должен знать про внешние функции(отрисовка интерфейса).

// onTick - каждый раз когда тикает таймер.
// this.onTick - это просто ссылка на функцию updateClockface.
// когда вызываю this.onTick(time) - вызывается функция updateClockface в которой передается время({ days, hours, mins, secs }).
