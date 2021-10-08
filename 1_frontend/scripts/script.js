// Variables
// -- DOMelements
const pizzaMenuWrapper = document.querySelector('.pizzaMenuWrapper');
const sortController = document.querySelector('.sortController');
const addPizzaFormElement = document.getElementById('addPizzaForm');
const photoSelectElement = document.getElementById('photo');
const errorMessageElement = document.getElementById('errorMessage');
const clearBtnElement = document.querySelector('.clearBtn');
const popUpElement = document.querySelector('.popUp');
const buttonHandlerElement = document.querySelector('.buttonHandler');

// -- Local
const pizzaImg = ['Img1', 'Img2', 'Img3', 'Img4'];
let seasionStoragePizzas = sessionStorage.pizzas
  ? JSON.parse(sessionStorage.pizzas)
  : '';

const renderMenu = (pizzaArr) => {
  // Check storage is empty or not
  if (pizzaArr.length === 0 || pizzaArr === '') {
    pizzaMenuWrapper.innerHTML = `<h3>Menu is empty :(</h3>`;
    sortController.innerText = '';
    return;
  } else {
    pizzaMenuWrapper.innerText = ``;

    // Creating Sorting Buttons
    if (sortController.innerText === '') {
      const sortByNameBtn = document.createElement('button');
      sortByNameBtn.classList.add('btn', 'sortBtn');
      sortByNameBtn.innerText = 'Sort By Name';
      sortByNameBtn.addEventListener('click', sortByName);

      const sortByPriceBtn = document.createElement('button');
      sortByPriceBtn.classList.add('btn', 'sortBtn');
      sortByPriceBtn.innerText = 'Sort By Price';
      sortByPriceBtn.addEventListener('click', sortByPrice);

      const sortByHeatBtn = document.createElement('button');
      sortByHeatBtn.classList.add('btn', 'sortBtn');
      sortByHeatBtn.innerText = 'Sort By Heat';
      sortByHeatBtn.addEventListener('click', sortByHeat);

      sortController.append(sortByNameBtn, sortByPriceBtn, sortByHeatBtn);
    }
  }

  pizzaArr.forEach((item) => {
    // Creating DOM elements
    const card = document.createElement('div');
    card.classList.add('pizzaMenu_item');

    const cardImg = document.createElement('div');
    cardImg.classList.add('item_img', item.photo);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('item_info');

    const pizzaName = document.createElement('h3');
    pizzaName.innerText = item.name;

    const heat = document.createElement('span');

    for (let x = 0; x < item.heat; x++) {
      const chillPepper = document.createElement('img');
      chillPepper.classList.add('chillPepper');
      chillPepper.src =
        './images/—Pngtree—hot chili pepper icon cartoon_5076458.png';
      heat.appendChild(chillPepper);
    }

    const toppings = document.createElement('p');
    toppings.innerText = item.toppings;

    const price = document.createElement('div');
    price.innerText = `${item.price} €`;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('btn', 'deleteBtn');
    deleteBtn.dataset.id = item.id;
    deleteBtn.addEventListener('click', handleDelete);

    cardInfo.append(pizzaName, heat, toppings, price, deleteBtn);
    card.append(cardImg, cardInfo);
    pizzaMenuWrapper.appendChild(card);
  });
};

// render Img options
const renderForm = () => {
  pizzaImg.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.toLowerCase();
    option.innerText = item;

    photo.appendChild(option);
  });
};

// Handling new Pizza
const handleNewPizza = (e) => {
  e.preventDefault();

  // check for name
  const name = e.target.name.value;
  if (name.length > 30) {
    errorMessage.innerText = 'Sorry, name must be max 30 letters';
    setTimeout(() => {
      errorMessage.innerText = '';
    }, 5000);
    return;
  }

  // handle toppings
  const toppings = e.target.toppings;
  let toppingsArray = [];

  for (let x = 0; x < toppings.length; x++) {
    if (toppings[x].selected) {
      toppingsArray.push(toppings[x].value);
    }
  }

  if (toppingsArray.length < 2) {
    errorMessage.innerText =
      'You have to put more on that pizza! Min 2 toppings are required';
    setTimeout(() => {
      errorMessage.innerText = '';
    }, 5000);
    return;
  }

  const newPizza = {
    id: Math.random(),
    name: name,
    price: e.target.price.value,
    heat: e.target.heat.value,
    toppings: toppingsArray,
    photo: e.target.photo.value,
  };

  savePizza(newPizza);
};

const savePizza = (newPizza) => {
  if (seasionStoragePizzas) {
    // check for duplicates
    let pizzaExist = seasionStoragePizzas.find((item) => {
      return item.name === newPizza.name;
    });

    if (pizzaExist) {
      errorMessage.innerText = 'Pizza with this name already exist';
      setTimeout(() => {
        errorMessage.innerText = '';
      }, 5000);
      return;
    } else {
      seasionStoragePizzas.push(newPizza);

      sessionStorage.setItem('pizzas', JSON.stringify(seasionStoragePizzas));
      errorMessage.innerText = 'Pizza added successfully';
      setTimeout(() => {
        errorMessage.innerText = '';
      }, 5000);

      renderMenu(seasionStoragePizzas);
    }
  } else {
    // create sessionStorage
    sessionStorage.setItem('pizzas', JSON.stringify([newPizza]));
    seasionStoragePizzas = [newPizza];
    renderMenu(seasionStoragePizzas);
  }
};

// Deleting item from menu
const handleDelete = (e) => {
  popUpElement.classList.remove('hidden');

  const agree = document.createElement('button');
  agree.classList.add('btn', 'agree');
  agree.dataset.id = e.target.dataset.id;
  agree.innerText = 'Yes';
  agree.addEventListener('click', agreedToDelete);

  const cancel = document.createElement('button');
  cancel.classList.add('btn', 'cancel');
  cancel.innerText = 'Cancel';
  cancel.addEventListener('click', cancelDelete);

  buttonHandlerElement.append(agree, cancel);
};

const agreedToDelete = (e) => {
  if (seasionStoragePizzas == '') {
    seasionStoragePizzas = JSON.parse(sessionStorage.pizzas);
  }
  seasionStoragePizzas = seasionStoragePizzas.filter((item) => {
    return item.id !== +e.target.dataset.id;
  });
  sessionStorage.setItem('pizzas', JSON.stringify(seasionStoragePizzas));
  renderMenu(seasionStoragePizzas);

  buttonHandlerElement.innerText = '';
  popUpElement.classList.add('hidden');
};

const cancelDelete = () => {
  buttonHandlerElement.innerText = '';
  popUpElement.classList.add('hidden');
};

// Clear Form
const clearForm = () => {
  addPizzaFormElement.reset();
};

// Sorting Buttons
const sortByName = () => {
  const sorted = seasionStoragePizzas.sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
  });
  renderMenu(sorted);
};

const sortByPrice = () => {
  const sorted = seasionStoragePizzas.sort((a, b) => {
    return a.price - b.price;
  });
  renderMenu(sorted);
};

const sortByHeat = () => {
  const sorted = seasionStoragePizzas.sort((a, b) => {
    return a.heat - b.heat;
  });
  renderMenu(sorted);
};

// Events
document.addEventListener('DOMContentLoaded', () => {
  renderMenu(seasionStoragePizzas);
  renderForm();
});
addPizzaFormElement.addEventListener('submit', handleNewPizza);
clearBtnElement.addEventListener('click', clearForm);
