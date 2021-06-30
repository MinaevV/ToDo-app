const app = document.getElementById("app");
const input = document.getElementById("app__input");
const itemList = document.getElementById("app__item-list");
const addBtn = document.getElementById("add");
const delBtn = document.getElementById("del");
const clearBtn = document.getElementById("clear");
let count = document.getElementById("app__item-count");
let filterList = document.querySelectorAll(".app__filters > *");

let popup = document.querySelector(".popup");
let popupInner = document.querySelector(".popup-inner");
let changeVal = document.getElementById("changeVal");
let tossed;

const allFilter = document.getElementById("all");
const completedFilter = document.getElementById("completed");
const activeFilter = document.getElementById("active");

document.addEventListener("DOMContentLoaded", function () {
  if (readLS("filter") !== undefined) {
    filter(readLS("filter"));
    const radio = document.getElementById(`${readLS("filter")}`);
    radio.checked = true;
  } else {
    filter();
  }

  function checkStorage() {
    if (readLS("items")) {
      parsedItems = parse("items");
      parsedItems.forEach((el) => {
        appendItem(el);
      });
      counter();
      checkHeight();
    }
  }

  function counter() {
    if (readLS("items")) {
      let i = 0;
      parsedItems = parse("items");
      parsedItems.forEach((item) => {
        if (!item.status) {
          ++i;
        }
      });
      count.innerHTML = `${i} left`;
    } else {
      count.innerHTML = "0 left";
    }
  }

  function checkFilter(e) {
    filterList.forEach((item) => {
      item.classList.remove("__active");
      if (item === e.currentTarget) {
        item.classList.add("__active");
      }
    });
  }

  function filter(passed) {
    if (!passed) {
      writeLS("filter", "all");
      const radio = document.getElementById(`${localStorage.filter}`);
      radio.checked = true;
      itemList.setAttribute("filter", readLS("filter"));
      allFilter.classList.add("__active");
    } else {
      itemList.innerHTML = "";
      writeLS("filter", `${passed}`);
      itemList.setAttribute("filter", passed);

      if (readLS("items")) {
        parsedItems = parse("items");
      }

      switch (passed) {
        case "all":
          checkStorage();
          allFilter.classList.add("__active");
          break;

        case "completed":
          if (readLS("items")) {
            parsedItems.forEach((item) => {
              if (item.status) {
                appendItem(item);
              }
            });
          }
          completedFilter.classList.add("__active");
          break;

        case "active":
          if (readLS("items")) {
            parsedItems.forEach((item) => {
              if (!item.status) {
                appendItem(item);
              }
            });
          }
          activeFilter.classList.add("__active");

          break;
      }
    }
  }

  function appendItem(el) {
    // create item
    const tempItem = document.createElement("div");

    tempItem.className = "app__item";
    tempItem.id = el.id;
    tempItem.addEventListener('click', (e) => {
      e.target.children[0].checked = !e.target.children[0].checked;

      parsedItems = parse("items");
      let i = parsedItems.findIndex((item) => 
        item.id == e.target.id
      );
      parsedItems[i].status = e.target.children[0].checked
      writeLS("items", JSON.stringify(parsedItems));

    })

    // fill item with checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = el.status;
    checkbox.classList = "visually-hidden";

    tempItem.append(checkbox);
    // and lable
    const check = document.createElement("div");
    check.classList = "check";
    check.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.children[0].checked =
        !e.target.parentElement.parentElement.children[0].checked;

      parsedItems = parse("items");
      let i = parsedItems.findIndex((item) => 
        item.id == e.target.parentElement.parentElement.id
      );
      parsedItems[i].status = e.target.parentElement.parentElement.children[0].checked;
      writeLS("items", JSON.stringify(parsedItems));
    });

    const text = document.createElement("span");
    text.innerText = el.value;

    text.append(check);
    tempItem.append(text);

    // add delBtn
    const delBtn = document.createElement("div");
    delBtn.id = "del";
    delBtn.className = "app__delete-item";
    delBtn.innerText = "×";
    delBtn.addEventListener("click", (e) => {
      parsedItems = parse("items");
      const key = parsedItems.find(
        (item) => item.id == e.target.parentElement.id
      );
      parsedItems.splice(parsedItems.indexOf(key), 1);

      writeLS("items", JSON.stringify(parsedItems));
      e.target.parentElement.remove();
      checkHeight();
    });

    tempItem.append(delBtn);

    // append to list
    if (document.contains(document.getElementById("app__item-list"))) {
      itemList.append(tempItem);
      checkHeight();

      counter();
    }
    return (checkboxes = document.querySelectorAll("div.app__item input"));
  }

  app.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validation();
      checkHeight();
    }
  });

  // addBtn.addEventListener("click", (e) => {
  //   validation();
  // });

  allFilter.addEventListener("click", (e) => {
    filter("all");
    checkFilter(e);
  });

  completedFilter.addEventListener("click", (e) => {
    filter("completed");
    checkFilter(e);
  });

  activeFilter.addEventListener("click", (e) => {
    filter("active");

    checkFilter(e);
  });

  clearBtn.addEventListener("click", () => {
    itemList.innerHTML = "";

    parsedItems = parse("items");

    parsedItems = parsedItems.filter((item) => !item.status);
    writeLS("items", JSON.stringify(parsedItems));
    checkStorage();
    checkHeight();
    filter(readLS("filter"));
  });

  function validation() {
    const inputField = input.value.trim();
    if (inputField.length) {
      const val = input.value;
      const stamp = Date.now();
      const status = false;
      const tempObj = toObj(stamp, val, status);

      function toObj(id, value, status) {
        return { id: id, value: value, status: status };
      }

      if (!readLS("items")) {
        writeLS("items", JSON.stringify([tempObj]));
        appendItem(tempObj);
      } else {
        parsedItems = parse("items");
        parsedItems.push(tempObj);
        writeLS("items", JSON.stringify(parsedItems));
        appendItem(tempObj);

        filter(readLS("filter"));
      }

      counter();

      input.value = "";
    } else {
      input.value = "";
    }
  }

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

  function checkHeight() {
    if (itemList.scrollHeight > 500) {
      itemList.classList.add("__scrolling");
    } else {
      itemList.classList.remove("__scrolling");
    }
  }

  popup.addEventListener("click", (e) => {
    if (e.currentTarget === e.target) {
      popup.classList.remove("__active");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("__active")) {
      popup.classList.remove("__active");
      changeVal.value = "";
    }
  });

  changeVal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const tempVal = changeVal.value.trim();
      if (tempVal.length) {
        parsedItems = parse("items");
        let i = parsedItems.findIndex((item) => item.id == tossed);
        changeVal.value = parsedItems[i].value;
        parsedItems[i].value = tempVal;
        console.log(parsedItems[i].value);

        writeLS("items", `${JSON.stringify(parsedItems)}`);
        changeVal.value = "";
        popup.classList.remove("__active");
        itemList.innerHTML = "";

        checkStorage();
      }
    }
  });
});
