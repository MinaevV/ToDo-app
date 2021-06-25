const app = document.getElementById("app");
const input = document.getElementById("app__input");
const itemList = document.getElementById("app__item-list");
const addBtn = document.getElementById("add");
const delBtn = document.getElementById("del");

localStorage.items;

document.addEventListener("DOMContentLoaded", function () {
  checkStorage();

  function checkStorage() {
    if (localStorage.items === undefined) {
      console.log("localStorage пуст");
    } else {
      console.log("Не пуст, заполняем");
      parsedItems = JSON.parse(localStorage.items);
      parsedItems.forEach((el) => {
        appendItem(el);
      });
    }
  }
  function appendItem(el) {
    // create item
    const tempItem = document.createElement("div");
    tempItem.className = "app__item";
    tempItem.id = el[0];

    // fill item with checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "label-" + el[0];
    tempItem.append(checkbox);
    // and lable
    const label = document.createElement("label");
    label.htmlFor = "label-" + el[0];
    label.innerText = el[1];
    tempItem.append(label);

    // add delBtn
    const delBtn = document.createElement("div");
    delBtn.id = "del";
    delBtn.className = "app__delete-item";
    delBtn.innerText = "×";
    delBtn.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
    tempItem.append(delBtn);

    // append to list
    if (document.contains(document.getElementById("app__item-list"))) {
      itemList.append(tempItem);
    }
  }

  app.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validation();
    }
  });

  addBtn.addEventListener("click", (e) => {
    validation();
  });

  function validation() {
    if (input.value.length) {
      let val = input.value;
      const stamp = Date.now();
      let tempArr = toArr(stamp, val);

      function toArr(id, value) {
        return [id, value];
      }

      if (localStorage.items === undefined) {
        localStorage.items = JSON.stringify([tempArr]);
        appendItem(tempArr);
      } else {
        parsedItems = JSON.parse(localStorage.items);
        parsedItems.push(tempArr);
        localStorage.items = JSON.stringify(parsedItems);
        appendItem(tempArr);
      }

      input.value = "";
    }
  }
});

// localStorage.items = 1;
