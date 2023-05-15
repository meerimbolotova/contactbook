let API = "http://localhost:8000/contacts";
let list = document.querySelector(".list");
let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let number = document.querySelector("#number");
let photo = document.querySelector("#photo");
let email = document.querySelector("#email");
let btnAdd = document.querySelector(".add-btn");
let modalAdd = document.querySelector(".add-modal");
let newContBtn = document.querySelector(".new-cont-btn");
let closeBtn = document.querySelector(".close-btn");
let saveBtn = document.querySelector(".save-btn");
let textModal = document.querySelector(".modal-text");
let editId = 0;

let inpSearch = document.querySelector(".inp-search");
let btnSearch = document.querySelector(".btn-search");
let searchVal = "";

// pagination
let count = 1;
let totalCount = 1;
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let pagList = document.querySelector(".pag-list");

// открытие модалки для добавления нового контакта
newContBtn.addEventListener("click", function () {
  modalAdd.style.display = "flex";
  btnAdd.style.display = "block";
  saveBtn.style.display = "none";
  textModal.innerText = "Add new contact";
  name.value = "";
  surname.value = "";
  number.value = "";
  photo.value = "";
  email.value = "";
});
closeBtn.addEventListener("click", () => {
  modalAdd.style.display = "none";
});
// добавление
btnAdd.addEventListener("click", async function () {
  let obj = {
    name: name.value,
    surname: surname.value,
    number: number.value,
    photo: photo.value,
    email: email.value,
  };

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  surname.value = "";
  number.value = "";
  photo.value = "";
  email.value = "";
  read();
});

// отображение bla bla

async function read() {
  let res = await fetch(`${API}?q=${searchVal}&_page=${count}&_limit=2`);
  let data = await res.json();
  paginationFunc();
  list.innerHTML = "";
  data.forEach((elem) => {
    list.innerHTML += `<div class="lii" id =${elem.id}><h3 class = "names">${elem.name}</h3> <div><button id =${elem.id} class="info-btn">Info</button>
    <button class="edit-btn" id =${elem.id} >Edit</button>
    <button class="delete-btn" id =${elem.id} >Delete</button></div></div>`;
  });
  let btnInfo = document.querySelectorAll(".info-btn");
  btnInfo.forEach((btnInfoitem) => {
    btnInfoitem.addEventListener("click", () => {
      let id = btnInfoitem.id;
      info(id);
    });
  });

  let deleteInfo = document.querySelectorAll(".delete-btn");
  deleteInfo.forEach((delItem) => {
    delItem.addEventListener("click", () => {
      let id = delItem.id;
      deleteItem(id);
    });
  });

  let editInfo = document.querySelectorAll(".edit-btn");
  editInfo.forEach((edItem) => {
    edItem.addEventListener("click", () => {
      let id = edItem.id;
      editItem(id);
    });
  });
}

// функция отображения инфо modal-info
let modalInfo = document.querySelector(".modal-info");
async function info(id) {
  modalInfo.innerHTML = "";
  modalInfo.style.display = "flex";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  modalInfo.innerHTML += `<button class="info-close">X</button> <img src="${data.photo}"/>
  <p>ФИО:${data.surname} ${data.name}</p><p>Эл.почта: ${data.email}</p><p>Номер: ${data.number}</p>`;

  let infoClose = document.querySelector(".info-close");
  infoClose.addEventListener("click", () => {
    modalInfo.style.display = "none";
  });
}
read();

// функция удаления
async function deleteItem(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  read();
}

// функция редактирования
async function editItem(id) {
  editId = id;
  modalAdd.style.display = "flex";
  btnAdd.style.display = "none";
  saveBtn.style.display = "block";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();

  name.value = data.name;
  surname.value = data.surname;
  number.value = data.number;
  photo.value = data.photo;
  email.value = data.email;

  textModal.innerText = "Edit contact";

  saveBtn.addEventListener("click", () => {
    save(editId);
  });
}
async function save(id) {
  let obj = {
    name: name.value,
    surname: surname.value,
    number: number.value,
    photo: photo.value,
    email: email.value,
  };

  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  modalAdd.style.display = "none";

  read();
}
// search
btnSearch.addEventListener("click", () => {
  searchVal = inpSearch.value;
  read();
});

// pagination
async function paginationFunc() {
  let res = await fetch(API);
  let data = await res.json();
  totalCount = Math.ceil(data.length / 2);
  pagList.innerHTML = "";
  for (let i = 1; i <= totalCount; i++) {
    pagList.innerHTML += `<p class="page-num">${i}</p>`;
  }
}

prev.addEventListener("click", () => {
  if (count <= 1) {
    return;
  }
  count--;
  read();
});
next.addEventListener("click", () => {
  if (count >= totalCount) {
    return;
  }
  count++;
  read();
});
