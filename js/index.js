const app = document.getElementById("app");
const input = document.getElementById("app__input");
const itemList = document.getElementById("app__item-list");
const addBtn = document.getElementById("add");
const delBtn = document.getElementById("del");
const clearBtn = document.getElementById("clear");
let count = document.getElementById("app__item-count");
let filterList = document.querySelectorAll(".app__filters > *");

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
    tempItem.addEventListener("click", (e) => {
      parsedItems = parse("items");
      let state = e.currentTarget.children[0].checked;
      e.currentTarget.children[0].checked = !state;

      const key = parsedItems.find((item) => item.id == e.currentTarget.id);
      const index = parsedItems.indexOf(key);

      try {
        parsedItems[index].status = e.currentTarget.children[0].checked;
      } catch (e) {}
      writeLS("items", `${JSON.stringify(parsedItems)}`);
      counter();
    });
    tempItem.className = "app__item";
    tempItem.id = el.id;

    // fill item with checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "label-" + el.id;
    checkbox.checked = el.status;
    checkbox.classList = "visually-hidden";
    checkbox.addEventListener("change", (e) => {
      parsedItems = parse("items");
      const key = parsedItems.find(
        (item) => item.id == e.target.parentElement.id
      );
      const index = parsedItems.indexOf(key);
      parsedItems[index].status = e.target.checked;

      writeLS("items", `${JSON.stringify(parsedItems)}`);
      filter(readLS("filter"));
    });
    tempItem.append(checkbox);
    // and lable
    const check = document.createElement("div");
    check.classList = "check";

    const label = document.createElement("label");
    label.htmlFor = "label-" + el.id;
    label.innerText = el.value;
    label.append(check);
    tempItem.append(label);

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
      setHeight();

    });

    tempItem.append(delBtn);

    // append to list
    if (document.contains(document.getElementById("app__item-list"))) {
      itemList.append(tempItem);

      counter();
    }
    return (checkboxes = document.querySelectorAll("div.app__item input"));
  }

  function setHeight() {
    itemList.setAttribute("style", `height: auto`);
    itemList.setAttribute("style", `height: ${itemList.offsetHeight}px`);
  }

  app.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validation();
      setHeight();
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
    setHeight();

    filter(readLS("filter"));
  });

  function validation() {
    if (input.value.length) {
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
    }
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
});
