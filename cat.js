let cat = {
    name : "Кот",
    age : 3,
    image: "https://proprikol.ru/wp-content/uploads/2020/08/krasivye-kartinki-kotov-45.jpg",
    favorite: false,
}

const box = document.querySelector(".container");

// Общая функция добавления котов
// ----------------------------------------------
function createCart (cat) {

// Нахождение нужных элементов
const card = document.createElement("div");
card.className = "card";
    if (!cat.image) {
        card.classList.add("default");
    } else {
        card.style.backgroundImage = `url(${cat.image})`;
    }
const name = document.createElement("h3");
name.innerText = cat.name;
const like = document.createElement("i");
like.className = "fa-heart card__like";

// Лайк или дизлайк
like.classList.add(cat.favorite ? "fa-solid" : "fa-regular");

// клик на сердечко
like.addEventListener("click", e => {
    e.stopPropagation();
    if (cat.id) {
        fetch(`${path}/update/${cat.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({favorite: !cat.favorite})
        })
        .then(res => {
            if (res.status === 200) {
                like.classList.toggle("fa-solid");
                like.classList.toggle("fa-regular");
            }
        })
    }
})

// корзина
const trash = document.createElement("i");
trash.className = "fa-solid fa-trash card__trash";
trash.addEventListener("click", e => {
    e.stopPropagation();
    deleteCard(cat.id, card);
})

// Добавление в карточку
card.append(like, name, trash);
if (cat.age >= 0) {
    const age = document.createElement("span");
    age.innerText = cat.age;
    card.append(age);
}

// Клик на карточку для удаления
// card.addEventListener("click", (e) => {
//     deleteCard(cat.id, card);
//     });

el.append(card)
}   
// ----------------------------------------------
// вызов функции
createCart(cat, el = box)


// Добовление котиков из базы
const user = "beginner-frontender";
const path = `https://cats.petiteweb.dev/api/single/${user}`;

fetch(path + "/show")
    .then(function(res) {
        if (res.statusText === "OK") {
            return res.json();
        }
    })
    .then(function(data) {
        if (!data.length) {
            box.innerHTML = "<div class=\"empty\">У вас пока еще нет питомцев</div>"
        } else {
            for (let c of data) {
            createCart(c, box);
            }
        }
    })

// автоматическое добавление фейковых котов при обновлении страницы
// let ids = [];
// fetch(path + "/ids")
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//         ids = [...data];
//         cat.id = ids.length ? ids[ids.length - 1] + 1 : 1;
//         addCat(cat);
//        })


// функция добавления котика в базу данных
cat.id = 7
function addCat(cat) {
    fetch(path + "/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cat)
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data);
    })
    
}
addCat(cat);

// функция удаления карточки с котом 
function deleteCard(id, el) {
    if (id) {
        fetch(`${path}/delete/${id}`, {
            method: "delete"
        })
        .then(res => {
            if (res.status === 200) {
                el.remove();
            }
        })
    }
}

// Открытие и закрытие модального окна
const addBtn = document.querySelector(".addBtn");
const mdBox = document.querySelector(".modal-container");
const mdClose = mdBox.querySelector(".modal-close");

addBtn.addEventListener("click", e => {
    mdBox.style.display = "flex";
});
mdClose.addEventListener("click", e => {
    mdBox.style = null;
});
// ----------------------------------------------
// Отправка формы обратной связи
const addForm = document.forms.add;
addForm.addEventListener("submit", e => {
    e.preventDefault(); // остановить действие по умолчанию
    const body = {};
    // console.log(addForm.children) // дочерние теги (прямые потомки)
    // console.log(addForm.elements) // все элементы формы (input/select/textarea/button)

    for (let i = 0; i < addForm.elements.length; i++) {
        const inp = addForm.elements[i];
        if (inp.name) { // элемент формы имеет атрибут name (не является кнопкой)
            if (inp.type === "checkbox") {
                body[inp.name] = inp.checked;
            } else {
                body[inp.name] = inp.value;
            }
        }
    }
// отправка формы в базу данных
    fetch(path + "/add", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (res.ok) {
            addForm.reset();  // очистить форму
            mdBox.style = null; //закрыть форму
            createCart(body); //отправка в тело бади без перезагрузки страницы
        } else {
            return res.json();
        }
    })
    .then(err => {
        if (err && err.message) {
            alert(err.message); //вывести сообщение об ошибке
        }
    });
})
// -------------------------------------------------------

