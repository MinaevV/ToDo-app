const app = document.getElementById("app");
const input = document.getElementById("app__input");
const itemList = document.getElementById("app__item-list");
const addBtn = document.getElementById("add");
const delBtn = document.getElementById("del");

const allFilter = document.getElementById("all");
const completedFilter = document.getElementById("completed");
const activeFilter = document.getElementById("active");

document.addEventListener("DOMContentLoaded", function () {
  // checkStorage();
  if (localStorage.filter !== undefined) {
    filter(localStorage.filter);
    let radio = document.getElementById(`${localStorage.filter}`);
    radio.checked = true;
  } else {
    filter();
  }

  function checkStorage() {
    if (localStorage.items !== undefined) {
      parsedItems = JSON.parse(localStorage.items);
      parsedItems.forEach((el) => {
        appendItem(el);
      });
    }
  }

  function filter(passed) {
    if (passed === undefined) {
      localStorage.filter = "all";
      itemList.setAttribute("filter", localStorage.filter);
    } else {
      itemList.innerHTML = '';
      localStorage.filter = passed;
      itemList.setAttribute("filter", passed);

      parsedItems = JSON.parse(localStorage.items);


      switch (passed) {
        case "all":
            checkStorage();
          break;

        case "completed":
          for (let item of parsedItems) {
            if (item[2] === true) {
              appendItem(item);
            }
          }
          break;

        case "active":
          for (let item of parsedItems) {
            if (item[2] === false) {
              appendItem(item);
            }
          }
          break;
      }
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
    checkbox.checked = el[2];
    checkbox.addEventListener("change", (e) => {
      parsedItems = JSON.parse(localStorage.items);
      let key = parsedItems.find(
        (item) => item[0] == e.target.parentElement.id
      );
      let index = parsedItems.indexOf(key);
      parsedItems[index][2] = e.target.checked;
      
      localStorage.items = JSON.stringify(parsedItems);
      filter(localStorage.filter);
    });
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
      parsedItems = JSON.parse(localStorage.items);
      let key = parsedItems.find(
        (item) => item[0] == e.target.parentElement.id
      );
      parsedItems.splice(parsedItems.indexOf(key), 1);
      localStorage.items = JSON.stringify(parsedItems);

      e.target.parentElement.remove();
    });

    tempItem.append(delBtn);

    // append to list
    if (document.contains(document.getElementById("app__item-list"))) {
      itemList.append(tempItem);
    }
    
    return (checkboxes = document.querySelectorAll("div.app__item input"));
  }

  app.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validation();
    }
  });

  addBtn.addEventListener("click", (e) => {
    validation();
  });

  allFilter.addEventListener("click", () => {
    filter("all");
  });
  
  completedFilter.addEventListener("click", () => {
    filter("completed");
  });

  activeFilter.addEventListener("click", () => {
    filter("active");
  });

  function validation() {
    if (input.value.length) {
      let val = input.value;
      const stamp = Date.now();
      let checkboxState = false;
      let tempArr = toArr(stamp, val, checkboxState);

      function toArr(id, value, checkboxState) {
        return [id, value, checkboxState];
      }

      if (localStorage.items === undefined) {
        localStorage.items = JSON.stringify([tempArr]);
        appendItem(tempArr);
      } else {
        parsedItems = JSON.parse(localStorage.items);
        parsedItems.push(tempArr);
        localStorage.items = JSON.stringify(parsedItems);
        appendItem(tempArr);
  filter(localStorage.filter);

      }

      input.value = "";
    }
  }
});
