// задание собрано с помощью parcel, не browserify (он у меня почему-то ругался на запрет скриптов)

import * as bootstrap from "bootstrap";
import moment from "moment";
import ru from "moment/locale/ru.js";
import Chart from "chart.js/auto";

let tasks = [
	{
		title: "задача 1",
		status: "в процессе",
		priority: "высокий",
		startDate: "2023-10-01",
		endDate: "2023-10-10"
	},
	{
		title: "задача 2",
		status: "выполнено",
		priority: "высокий",
		startDate: "2023-10-01",
		endDate: "2023-10-05"
	},
	{
		title: "задача 3",
		status: "в процессе",
		priority: "низкий",
		startDate: "2023-10-10",
		endDate: "2023-11-10"
	},
	{
		title: "задача 4",
		status: "выполнено",
		priority: "средний",
		startDate: "2023-09-01",
		endDate: "2023-10-01"
	},
	{
		title: "задача 5",
		status: "в процессе",
		priority: "высокий",
		startDate: "2023-10-01",
		endDate: "2023-10-10"
	}
];

const taskList = document.getElementById("taskList");

// task making class
class Task {
	constructor(title, status, priority, startDate, endDate) {
		this.title = title;
		this.status = status;
		this.priority = priority;
		this.startDate = startDate;
		this.endDate = endDate;
		this.printTask();
	}

	printTask() {
		const newTask = document.createElement("div");
		newTask.classList.add("task");
		// task title
		const title = document.createElement("h3");
		title.textContent = `Заголовок: ${this.title}`;
		title.classList.add("h3");
		newTask.appendChild(title);
		// task options
		const taskOptions = document.createElement("div");
		taskOptions.classList.add("task-options");
		newTask.appendChild(taskOptions);
		// options > priority
		const priority = document.createElement("div");
		priority.textContent = `приоритет: ${this.priority}`;
		taskOptions.appendChild(priority);
		// options > status
		const status = document.createElement("div");
		status.textContent = `статус: ${this.status}`;
		taskOptions.appendChild(status);
		// task dates
		const taskDates = document.createElement("div");
		taskDates.classList.add("task-dates");
		newTask.appendChild(taskDates);
		// dates > start date
		const startDate = document.createElement("div");
		startDate.textContent = `дата начала: ${this.startDate}`;
		taskDates.appendChild(startDate);
		// options > status
		const endDate = document.createElement("div");
		endDate.textContent = `дата окончания: ${this.endDate}`;
		taskDates.appendChild(endDate);
		taskList.appendChild(newTask);
	}
}

// print tasks to page
const getTasks = function() {
	for (let task of tasks) {
		const newTask = new Task(task.title, task.status, task.priority, task.startDate, task.endDate);
	}
};
// getTasks();

// get canvas for status chart
let taskStatusChart = document.getElementById("taskStatusChart").getContext("2d");
const color1 = "rgba(221, 19, 227, 0.8)";
const color2 = "rgba(255, 138, 22, 0.8)";
const color3 = "rgba(54, 220, 187, 0.8)";

// count tasks per status
let statusLabels = [];
let statusCounts = [];
let statusMap = new Map();
for (let task of tasks) {
	let status = task.status;
	if (statusMap.has(status)) {
		statusMap.set(status, statusMap.get(status) + 1);
	} else {
		statusMap.set(status, 1);
	}
}
for (let [status, count] of statusMap.entries()) {
	statusLabels.push(status);
	statusCounts.push(count);
}

// make status chart
let statusChart = new Chart(taskStatusChart, {
	type: "bar",
	data: {
		labels: statusLabels,
		datasets: [
			{
				label: "задачи по статусу выполнения",
				data: statusCounts,
				backgroundColor: [color1, color2],
				borderColor: [color2, color1],
				borderWidth: 2
			}
		]
	},
	options: {
		responsive: true,
		elements: {
			bar: {
				borderWidth: 2,
				borderRadius: 10,
			}
		},
		barThickness: 90,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 1
				}
			}
		}
	}
});

// get canvas for priority chart
let taskPriorityChart = document.getElementById('taskPriorityChart').getContext('2d');
let priorityLabels = [];
let priorityCounts = [];
let priorityMap = new Map();
for (let task of tasks) {
	let priority = task.priority;
	if (priorityMap.has(priority)) {
		priorityMap.set(priority, priorityMap.get(priority) + 1);
	} else {
		priorityMap.set(priority, 1);
	}
}
for (let [priority, count] of priorityMap.entries()) {
	priorityLabels.push(priority);
	priorityCounts.push(count);
}

// make priority chart
        let taskChart = new Chart(taskPriorityChart, {
            type: 'bar',
            data: {
                labels: priorityLabels,
                datasets: [{
                    label: 'Задачи по приоритетам',
                    data: priorityCounts,
						backgroundColor: [color1, color2, color3],
						borderColor: [color2, color3, color1],
						borderWidth: 2
                }]
            },
            options: {
				responsive: true,
				elements: {
					bar: {
						borderWidth: 2,
						borderRadius: 10,
					}
				},
				barThickness: 90,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});

// making date in footer
const date = document.getElementById("date");

function updateClock() {
	let currentTime = moment();
	let formattedTime = currentTime.format("DD/MM/YYYY dddd HH:mm:ss");
	date.textContent = formattedTime;
}
setInterval(updateClock, 1000);

// making time counter in footer

// making proper endings for hours, minutes and seconds
function makeEnding (number, titles) {
	let cases = [2, 0, 1, 1, 1, 2];
    return label = titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
}

const counter = document.getElementById("counter");
const start = moment();

function calculateTime() {
	const end = moment();
	let seconds = Math.round((end - start) / 1000);
	let minutes = 0;
	let hours = 0;
	// pass to minutes when seconds>60
	if (seconds > 60) {
		minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;
	}
	// pass to hours when minutes>60
	if (minutes > 60) {
		hours = Math.floor(minutes / 60);
		minutes = minutes % 60;
		seconds = seconds % 60;
	}
		// format hours ending
		let formattedHours = ["час", "часа", "часов"];
		let hoursLabel = makeEnding(hours, formattedHours);
		// format minutes ending
		let formattedMinutes = ["минуту", "минуты", "минут"];
		let minutesLabel = makeEnding(minutes, formattedMinutes);
		  // format seconds ending
		let formattedSeconds = ["секунду", "секунды", "секунд"];
		let secondsLabel = makeEnding(seconds, formattedSeconds);

	let timeSpent = `${hours} ${hoursLabel} ${minutes} ${minutesLabel} ${seconds} ${secondsLabel}`;
	counter.textContent = timeSpent;
}

setInterval(calculateTime, 1000);

function postTasks(){
		fetch('https://jsonplaceholder.typicode.com/todos', {
			method: 'POST',
			body: JSON.stringify(tasks),
			headers: {
			"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(response => response.json())
		.then(json => getTasks(json))
		.catch((error) => {
			console.error("Ошибка", error);
		});
	}
	postTasks();