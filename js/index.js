const app = document.getElementById("app");
const input = document.getElementById("app__input");
const itemList = document.getElementById("app__item-list");
const addBtn = document.getElementById("add");
const delBtn = document.getElementById("del");
const clearBtn = document.getElementById("clear");

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
    }
  }

  function filter(passed) {
    if (!passed) {
      writeLS("filter", "all");
      const radio = document.getElementById(`${localStorage.filter}`);
      radio.checked = true;
      itemList.setAttribute("filter", readLS("filter"));
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
          break;

        case "completed":
          if (readLS("items")) {
            parsedItems.forEach((item) => {
              if (item.status) {
                appendItem(item);
              }
            });
          }
          break;

        case "active":
          if (readLS("items")) {
            parsedItems.forEach((item) => {
              if (!item.status) {
                appendItem(item);
              }
            });
          }
          break;
      }
    }
  }

  function appendItem(el) {
    // create item
    const tempItem = document.createElement("div");
    tempItem.className = "app__item";
    tempItem.id = el.id;

    // fill item with checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "label-" + el.id;
    checkbox.checked = el.status;
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
    const label = document.createElement("label");
    label.htmlFor = "label-" + el.id;
    label.innerText = el.value;
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

  // addBtn.addEventListener("click", (e) => {
  //   validation();
  // });

  allFilter.addEventListener("click", () => {
    filter("all");
  });

  completedFilter.addEventListener("click", () => {
    filter("completed");
  });

  activeFilter.addEventListener("click", () => {
    filter("active");
  });

  clearBtn.addEventListener("click", () => {
    itemList.innerHTML = "";

    parsedItems = parse("items");

    parsedItems = parsedItems.filter((item) => !item.status);
    console.log(parsedItems);
    writeLS("items", JSON.stringify(parsedItems));
    checkStorage();
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
