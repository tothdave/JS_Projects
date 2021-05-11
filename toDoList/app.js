// ****** SELECT ITEMS **********

const alert = document.querySelector('.alert');
const submitBtn = document.querySelector('.submit-btn')
const text = document.getElementById('to-do')
const toDoList = document.querySelector('.to-do-list')
const toDoForm = document.querySelector('.to-do-form')
const container = document.querySelector('.to-do-container')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
//clear items
clearBtn.addEventListener('click', clearItems);

//submit
toDoForm.addEventListener('submit', addItem);

//load content
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********

function addItem(e){
    e.preventDefault();
    const value = text.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag){
        createListItem(id, value);

        displayAlert('Tennivaló hozzáadva', 'success');

        container.classList.add('show-container');

        addToLocalStorgae(id,value);

        setBackToDefault();
    
    }else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('változtatás megtörtént', 'success');
        editLocalStorage(editID, value);
        setBackToDefault();
    }else{
        displayAlert('Töltsd ki a beviteli mezőt.', 'danger');
    }
}

function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setInterval(() => {
        alert.classList.remove(`alert-${action}`);
        alert.textContent = "";
    }, 2000);
}

function setBackToDefault(){
    text.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "hozzáad";
}

function clearItems(){
    const items = document.querySelectorAll('.to-do-item');

    if(items.length > 0){
        items.forEach(function(item){
            toDoList.removeChild(item);
        })
    }
    container.classList.remove('show-container');
    displayAlert('Lista kiürítve', 'danger')

    setBackToDefault();
    localStorage.removeItem('list');
}

function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    toDoList.removeChild(element)
    if(toDoList.children.length === 0){
        container.classList.remove('show-container');
    }
    displayAlert('Tennivaló törölve', 'danger');

    setBackToDefault();

    removeFromLocalStorage(id);
}

function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;

    editElement = e.currentTarget.parentElement.previousElementSibling;

    text.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "módosít";
}

function doneItem(e){
    const element = e.currentTarget;
    element.parentNode.parentNode.classList.toggle('done');
    element.parentNode.previousElementSibling.classList.toggle('done');
}

// ****** LOCAL STORAGE **********
function addToLocalStorgae(id, value){
    const toDoItem = {id:id, value:value}
    let items = getLocalStorage();
    items.push(toDoItem);
    localStorage.setItem('list', JSON.stringify(items));
};

function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    console.log(items);
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

// ****** SETUP ITEMS **********

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItem(id, value){
    const element = document.createElement('article');
        //add class
        element.classList.add('to-do-item');
        //add id
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
                <button type="button" class="done-btn">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button type="button" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`;

        const doneBtn = element.querySelector('.done-btn');
        const editBtn = element.querySelector('.edit-btn');
        const deleteBtn = element.querySelector('.delete-btn');
        
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);
        doneBtn.addEventListener('click', doneItem);

        //append
        toDoList.appendChild(element);
}