const app = document.getElementById('app');
const input = document.getElementById('app__input');
const itemList = document.getElementById('app__item-list');
const addBtn = document.getElementById('add');
const delBtn = document.getElementById('del');
const clearBtn = document.getElementById('clear');
let count = document.getElementById('app__item-count');
let filterList = document.querySelectorAll('.app__filters > *');

let popup = document.querySelector('.popup');
let popupInner = document.querySelector('.popup-inner');
let changeVal = document.getElementById('changeVal');
let tossed;
let valueToEdit;

const allFilter = document.getElementById('all');
const completedFilter = document.getElementById('completed');
const activeFilter = document.getElementById('active');

document.addEventListener('DOMContentLoaded', function () {
  //
  // Functions
  //

  loadFromStorage();

  function createCheckbox(state) {
    const item = document.createElement('input');
    item.type = 'checkbox';
    if (state) {
      item.checked = state;
    }
    return item;
  }

  function createCheckmarker() {
    const item = document.createElement('div');
    item.classList.add('check');
    return item;
  }

  function createDelBtn() {
    const item = document.createElement('div');
    item.id = 'del';
    item.classList.add('app__delete-item');
    item.innerText = '×';
    return item;
  }

  function createSpan(value, id) {
    const item = document.createElement('span');
    item.id = `span-${id}`;
    item.innerText = value;

    return item;
  }

  function toggleCheckbox(e) {
    if (e.target.classList == 'check') {
      const id = e.target.parentElement.parentElement.id;
      const parent = e.target.parentElement.parentElement;
      parent.firstElementChild.checked ^= true;

      parsedItems = parse('items');
      let i = parsedItems.findIndex((item) => item.id == id);
      parsedItems[i].status = parent.firstElementChild.checked;
      writeLS('items', JSON.stringify(parsedItems));
    }
  }

  function deleteItem(e) {
    parsedItems = parse('items');
    const i = parsedItems.findIndex(
      (item) => item.id == e.target.parentElement.id
    );
    parsedItems.splice(i, 1);
    e.target.parentElement.remove();
    writeLS('items', JSON.stringify(parsedItems));
  }

  function createItem(id) {
    const item = document.createElement('div');
    item.classList.add('app__item');
    item.id = id;

    return item;
  }

  function createListNode(id, state, value) {
    const item = createItem(id);
    appendItem(createCheckbox(state), item);
    const span = createSpan(value, id);
    const checkbox = createCheckmarker();
    appendItem(checkbox, span);
    appendItem(span, item);
    appendItem(createDelBtn(), item);

    return item;
  }

  function addItemListeners(item) {
    const checkbox = item.querySelector('.check');
    const deleteBtn = item.querySelector('#del');
    const span = item.querySelector('span');

    checkbox.addEventListener('click', (e) => {
      toggleCheckbox(e);
      counter();
      filter(readLS('filter'));
    });

    deleteBtn.addEventListener('click', (e) => {
      deleteItem(e);
      counter();
    });

    span.addEventListener('dblclick', (e) => {
      openEditField(e);
    });

    return item;
  }

  function appendItem(appendWhat, appendTo) {
    return appendTo.appendChild(appendWhat);
  }

  function toObj(id, value, status) {
    return { id, value, status };
  }

  function loadFromStorage() {
    if (readLS('items')) {
      parsedItems = parse('items');
      parsedItems.forEach((el) => {
        const item = createListNode(el.id, el.status, el.value);

        appendItem(addItemListeners(item), itemList);
      });
      filter(readLS('filter'));
      counter();
      checkHeight();
    }
  }

  function filter(passed) {
    let itemsInList = document.querySelectorAll('.app__item');
    switch (passed) {
      case 'all':
        itemsInList.forEach((item) => (item.style.display = 'flex'));
        allFilter.classList.add('__active');
        return writeLS('filter', 'all');

      case 'completed':
        itemsInList.forEach((item) => (item.style.display = 'flex'));
        itemsInList.forEach((item) => {
          if (!item.firstChild.checked) {
            item.style.display = 'none';
            completedFilter.classList.add('__active');
          }
        });
        return writeLS('filter', 'completed');

      case 'active':
        itemsInList.forEach((item) => (item.style.display = 'flex'));
        itemsInList.forEach((item) => {
          if (item.firstChild.checked) {
            item.style.display = 'none';
          }
        });
        activeFilter.classList.add('__active');
        return writeLS('filter', 'active');

      default:
        allFilter.classList.add('__active');
        return writeLS('filter', 'all');
    }
  }

  function applyFilter(e) {
    filterList.forEach((item) => {
      item.classList.remove('__active');
      if (item === e.currentTarget) {
        item.classList.add('__active');
      }
    });
  }

  // show remaining active tasks
  function counter() {
    if (readLS('items')) {
      let i = 0;
      parsedItems = parse('items');
      parsedItems.forEach((item) => {
        if (!item.status) {
          ++i;
        }
      });
      count.innerHTML = `${i} left`;
    } else {
      count.innerHTML = '0 left';
    }
  }

  // validate before adding to list
  function validation() {
    const inputField = input.value.trim();
    if (inputField.length) {
      const val = input.value;
      const stamp = Date.now();
      const status = false;
      const tempObj = toObj(stamp, val, status);
      const item = createListNode(stamp, status, val);

      appendItem(addItemListeners(item), itemList);

      if (!readLS('items')) {
        writeLS('items', JSON.stringify([tempObj]));
      } else {
        parsedItems = parse('items');
        parsedItems.push(tempObj);
        writeLS('items', JSON.stringify(parsedItems));
      }
      input.value = '';
      filter(readLS('filter'));
    }
  }

  //pass values between functions and event handlers
  function toss(val) {
    tossed = val;
  }

  function parse(item) {
    try {
      return JSON.parse(localStorage.getItem(`${item}`));
    } catch (error) {}
  }

  function writeLS(el, val) {
    localStorage.setItem(`${el}`, val);
  }

  function readLS(el) {
    return localStorage.getItem(el);
  }

  // scroll list if its height more than 500px
  function checkHeight() {
    if (itemList.scrollHeight > 500) {
      itemList.classList.add('__scrolling');
    } else {
      itemList.classList.remove('__scrolling');
    }
  }

  // call popup for item value change
  function openEditField(e) {
    if (e.target.tagName == 'SPAN') {
      popup.classList.add('__active');
      toss(e.target.parentElement.id);
      changeVal.focus();
      changeVal.value = e.target.innerText;
      valueToEdit = e.target.id;
    }
  }

  //
  // Eevnt handlers
  //

  // add item on 'Enter' hit
  app.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      validation();
      checkHeight();
      counter();
    }
  });

  // close popup on side click
  popup.addEventListener('click', (e) => {
    if (e.currentTarget === e.target) {
      popup.classList.remove('__active');
    }
  });

  // close popup on 'Esc' hit
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('__active')) {
      popup.classList.remove('__active');
      changeVal.value = '';
    }
  });

  // save new value of item on 'Enter' hit
  changeVal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const tempVal = changeVal.value.trim();
      if (tempVal.length) {
        parsedItems = parse('items');
        let i = parsedItems.findIndex((item) => item.id == tossed);
        changeVal.value = parsedItems[i].value;
        parsedItems[i].value = tempVal;

        writeLS('items', `${JSON.stringify(parsedItems)}`);
        changeVal.value = '';
        popup.classList.remove('__active');

        let a = document.getElementById(`${valueToEdit}`);
        a = tempVal;
      }
    }
  });

  // filter by ALL tasks
  allFilter.addEventListener('click', (e) => {
    filter('all');
    applyFilter(e);
  });

  // filter by COMPLETED tasks
  completedFilter.addEventListener('click', (e) => {
    filter('completed');
    applyFilter(e);
  });

  // filter by ACTIVE tasks
  activeFilter.addEventListener('click', (e) => {
    filter('active');

    applyFilter(e);
  });

  // clear completed tasks
  clearBtn.addEventListener('click', () => {
    let itemsToDelete = document.querySelectorAll('.app__item');
    parsedItems = parse('items');
    parsedItems = parsedItems.filter((item) => !item.status);
    writeLS('items', JSON.stringify(parsedItems));

    parsedItems = itemsToDelete.forEach((item) => {
      if (item.firstElementChild.checked) {
        item.remove();
      }
    });
    checkHeight();
    counter();

    // filter(readLS('filter'));
  });
});
