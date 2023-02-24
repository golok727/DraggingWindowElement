console.log("Radhey Shyam");

const draggableWindow = document.querySelector("[data-window]");
const draggingArea = document.querySelector("[data-dragging-area]");
const tabButtons = [...document.querySelectorAll("[data-tab-btn]")];

tabButtons.forEach((btn) => {
	btn.onclick = (e) => {
		const btnType = e.currentTarget.dataset.type;
		if (btnType === "max") {
			maximizeWindow(draggableWindow);
		}
	};
});

let isMouseDown = false;

const storedData = JSON.parse(localStorage.getItem("window-cords"));
console.log(storedData);
const DraggableWindow = {
	x: 0,
	y: 0,
	dragX: storedData?.dragX || 0,
	dragY: storedData?.dragY || 0,
	height: storedData?.height || 500,
	width: storedData?.width || 700,
	isMaximized: false,
};

draggableWindow.style.width = `${DraggableWindow.width}px`;
draggableWindow.style.height = `${DraggableWindow.height}px`;
setWindowLocationCoordinates(
	draggableWindow,
	DraggableWindow.dragX,
	DraggableWindow.dragY
);

// Window Resize Even
resizeEvent(draggableWindow, () => {
	DraggableWindow.height = draggableWindow.offsetHeight;
	DraggableWindow.width = draggableWindow.offsetWidth;
});

// Mouse Down

document.onmousedown = (e) => {
	if (e.target.id === "draggable-area") {
		isMouseDown = true;
		DraggableWindow.x = e.clientX;
		DraggableWindow.y = e.clientY;
		e.target.style.cursor = "grabbing";
		e.target.classList.add("dragging");
	}
};
// Mouse UP

document.onmouseup = (e) => {
	const dragArea = document.querySelector("#draggable-area");
	dragArea.style.cursor = "grab";
	dragArea.classList.remove("dragging");

	isMouseDown = false;

	save("window-cords", DraggableWindow);
};

// Mouse Move
document.addEventListener("mousemove", (e) => {
	if (!isMouseDown) return;
	e.preventDefault();

	const x = DraggableWindow.x - e.clientX;
	const y = DraggableWindow.y - e.clientY;
	DraggableWindow.x = e.clientX;
	DraggableWindow.y = e.clientY;

	const { offsetLeft, offsetTop } = draggableWindow;

	DraggableWindow.dragX = offsetLeft - x;
	DraggableWindow.dragY = offsetTop - y;

	if (DraggableWindow.dragY < 0) {
		return;
	}
	if (DraggableWindow.isMaximized) {
		DraggableWindow.isMaximized = false;
		draggableWindow.style.width = 700 + "px";
		draggableWindow.style.height = 500 + "px";
	}
	setWindowLocationCoordinates(
		draggableWindow,
		DraggableWindow.dragX,
		DraggableWindow.dragY
	);
});

// window.onbeforeunload = () => {
// 	save("window-cords", DraggableWindow);
// };

function save(name, data) {
	localStorage.setItem(name, JSON.stringify(data));
}

function setWindowLocationCoordinates(window, x, y) {
	window.style.setProperty("--mouse-x", `${x}px`);
	window.style.setProperty("--mouse-y", `${y}px`);
}

function resizeEvent(element, cb) {
	const resizeObserver = new ResizeObserver(() => cb());
	resizeObserver.observe(element);
}

function maximizeWindow(draggableWindow) {
	if (DraggableWindow.isMaximized) {
		DraggableWindow.isMaximized = false;
		draggableWindow.style.width = 700 + "px";
		draggableWindow.style.height = 500 + "px";
		setWindowLocationCoordinates(draggableWindow, 100, 100);
		return;
	}

	DraggableWindow.isMaximized = true;
	DraggableWindow.height = window.innerHeight;
	DraggableWindow.width = window.innerWidth;
	DraggableWindow.dragX = 0;
	DraggableWindow.dragY = 0;
	setWindowLocationCoordinates(draggableWindow, 0, 0);

	draggableWindow.style.width = window.innerWidth + "px";
	draggableWindow.style.height = window.innerHeight + "px";
}
