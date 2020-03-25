// Получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart'),
  cheapestTicket = document.getElementById('cheapest-ticket'),
  otherCheapTickets = document.getElementById('other-cheap-tickets');

// Данные

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '889b033a2665ef3bd21fde2b8a4d1731';
calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

// Функции

const getData = (url, callback) => {
  // получаем базу данных городов
  const request = new XMLHttpRequest(); //API браузера(объект запроса)

  request.open('GET', url); // настраиваем запрос(получаем данные и пердаем url)
  request.addEventListener('readystatechange', () => {
    // событие внутри функции, ready.. - отслеживает событие
    if (request.readyState !== 4) return; // проверяем событие

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status); // сообщаем про ошибку
    }
  }); // событие внутри функции, ready.. - отслеживает событие

  request.send(); // чтобы запрос отправить используем send
};

const showCity = (input, list) => {
  // showCity - функция отображает города
  list.textContent = '';

  if (input.value !== '') {
    const filterCity = city.filter(item => {
      const fixItem = item.name.toLowerCase(); // каждая строчка переводится к нижнему регистру
      return fixItem.startsWith(input.value.toLowerCase());
    });

    filterCity.forEach(item => {
      const li = document.createElement('li'); //создается елемент
      li.classList.add('dropdown__city'); // добавляем класс
      li.textContent = item.name;
      list.append(li);
    });
  }
};

const selectCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
};

const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket')
  let deep = '';

  if (data) {
    deep = `
       <h3 class="agent">Aviakassa</h3>
      <div class="ticket__wrapper">
        <div class="left-side">
          <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить
            за 19700₽</a>
        </div>
        <div class="right-side">
          <div class="block-left">
            <div class="city__from">Вылет из города
              <span class="city__name">Екатеринбург</span>
            </div>
            <div class="date">29 мая 2020 г.</div>
          </div>

          <div class="block-right">
            <div class="changes">Без пересадок</div>
            <div class="city__to">Город назначения:
              <span class="city__name">Калининград</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    deep = '<h3> К сожалениию на текущую дату билетов не нашлось!</h3>'
  }

  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;

}

const renderCheepDay = (cheapTicket) => {
  const ticket = createCard(cheapTicket[0]);
  console.log(ticket);
};

const renderCheepYear = cheapTickets => {
  cheapTickets.sort((a, b) => a.value - b.value);
  console.log(cheapTickets);
};

const renderCheep = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;

  const cheapTicketDay = cheapTicketYear.filter(item => {
    return item.depart_date === date;
  });

  renderCheepDay(cheapTicketDay);
  renderCheepYear(cheapTicketYear);
};

// Обработчик событий

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', event => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', event => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', event => {
  event.preventDefault();

  const cityFrom = city.find(item => inputCitiesFrom.value === item.name); //сокращенный вид

  const cityTo = city.find(item => {
    return inputCitiesTo.value === item.name;
  }); // полный вид

  const formData = {
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value,
  };

  if (formData.from && formData.to) {
    const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}` +
      `&destination=${formData.to.code}&one_way=true`;

    getData(calendar + requestData, response => {
      renderCheep(response, formData.when);
    });
  } else {
    alert('Введите корректное название');
  }
});

// Вызовы функций
getData(proxy + citiesApi, data => {
  city = JSON.parse(data).filter(item => item.name);

  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }

    return 0;
  });
  console.log(city);

});