let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const submitElement = document.querySelector(".to-do__submit");
const tasksStorageKey = "to-do-items";

// void => string[]
function loadTasks() {
	const tasks = localStorage.getItem(tasksStorageKey);
	if (tasks === "undefined") {
		return items;
	}
	return JSON.parse(tasks);
}

// string => void
function createItem(item) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);
 	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");
	if (typeof item !== "string") {
		throw new Error("item arg is not string");
	}
	textElement.textContent = item;
	deleteButton.addEventListener("click", () => {
		clone.remove();
		items = getTasksFromDOM();
		saveTasks(items);
	});
	duplicateButton.addEventListener("click", () => {
		const itemName = textElement.textContent;
		const newItem = createItem(itemName);
		listElement.prepend(newItem);
		items = getTasksFromDOM();
		saveTasks(items);
	});
	editButton.addEventListener("click", () => {
		textElement.setAttribute("contenteditable", true);
		textElement.focus();
		textElement.tempTextContent = textElement.textContent;
	});
	textElement.addEventListener("blur", () => {
		textElement.setAttribute("contenteditable", false);
		if (!textElement.textContent.length) {
			textElement.textContent = textElement.tempTextContent;
			delete textElement.tempTextContent;
		}
	})
	return clone;
}

function getTasksFromDOM() {
	const itemsNamesElements = listElement.querySelectorAll(".to-do__item");
	const tasks = [];
	itemsNamesElements.forEach((item) => {
		tasks.push(item.textContent);
	})
	return tasks;
}

function saveTasks(tasks) {
	localStorage.setItem(tasksStorageKey, JSON.stringify(tasks));
}

function changeSubmitButtonState() {
	if (inputElement.value.length === 0) {
		submitElement.setAttribute("disabled", true);
	} else {
		submitElement.removeAttribute("disabled");
	}
}

formElement.addEventListener("submit", (event) => {
	event.preventDefault();
	const toDoText = inputElement.value;
	const task = createItem(toDoText);
	listElement.prepend(task);
	items = getTasksFromDOM();
	saveTasks(items);
	formElement.reset();
	changeSubmitButtonState();
})

inputElement.addEventListener("input", changeSubmitButtonState);

items = loadTasks();
items.forEach((el) => {
	const toDo = createItem(el);
	listElement.append(toDo);
})
changeSubmitButtonState();