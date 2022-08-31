import TrashImage from "../images/trash.png";
import {compareAsc} from "date-fns";

import {mainContent} from '../index.js';
import {addNewTask, removeNewTask} from './project';


function sortTask() {
    let taskList = [];
    for (let i = 0; i < localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i)))['title']) {
            taskList.push(getValue(localStorage.key(i)));
        }
    }

    taskList.sort(function (x, y) {
        return compareAsc(new Date(x['dueDate']), new Date(y['dueDate']));
    });

    return taskList;
}

function getValue(key) {
    return JSON.parse(localStorage.getItem(key));
}

function changeCompleted(id) {
    let task = getValue(id);

    task['taskCompleted'] = !task['taskCompleted'];
    localStorage.setItem(id, JSON.stringify(task));
    let taskEle = document.getElementById(task['id']);
    let check = taskEle.querySelector('.taskCompleted');
    if (task['taskCompleted'] === true) {
        taskEle.querySelector('.title').style.textDecoration = 'line-through';
        taskEle.style.background = 'rgba(0,0,0,0.5)';
        check.style.background = 'green';
    } else {
        taskEle.querySelector('.title').style.textDecoration = '';
        check.style.color = '';
        check.style.background = '';
        taskEle.style.background = '';
    }
}


function renderTaskEle(task) {

    let id = task['id'];

    let taskEle = document.createElement('div');
    taskEle.id = id;

    let project = task['project'];

    Object.entries(task).forEach(([key, value]) => {

        if (key !== 'id' && key !== 'project') {
            let taskInfo = document.createElement('div');

            taskInfo.className = key;
            if (typeof value === 'string') {
                taskInfo.textContent = value;
            }
            taskEle.append(taskInfo);
        }
    });

    const completeBtn = taskEle.querySelector('.taskCompleted');
    completeBtn.addEventListener('click', () => {
        changeCompleted(id);
    });
    if (task['taskCompleted'] === true) {

        taskEle.querySelector('.title').style.textDecoration = 'line-through';


        taskEle.style.background = 'rgba(0,0,0,0.5)';
        completeBtn.style.background = 'green';
    }
    let taskPriority = taskEle.lastChild;

    switch (task['priority']) {
        case 1:

            taskPriority.style.background = 'red';
            break;
        case 2:

            taskPriority.style.background = 'yellow';
            break;
        case 3:

            taskPriority.style.background = 'cyan';
            break;


    }

    let taskDelete = document.createElement('img');
    taskDelete.src = TrashImage;
    taskDelete.className = 'taskDelete';
    taskDelete.alt = 'delete';
    taskEle.append(taskDelete);
    taskDelete.addEventListener('click', () => {
        taskDelete.parentElement.remove();
        localStorage.removeItem(id);
        if (project) {
            localStorage.setItem(project, JSON.stringify(removeNewTask(project, id)));

        }
    });

    return taskEle;

}

function renderTasks() {

    let sortedTasks = sortTask();
    sortedTasks.forEach(task => {

        let taskEle = renderTaskEle(task);


        mainContent.appendChild(taskEle);
    });


}

function createTaskEle(project, title, description, dueDate, priority) {

    const id = new Date().getTime();
    let task = {
        'project': project,
        'id': id,
        'taskCompleted': false,
        'title': title,
        'description': description,
        'dueDate': dueDate,
        'priority': priority
    };


    localStorage.setItem(id, JSON.stringify(task));
    if (project) {
        localStorage.setItem(project, JSON.stringify(addNewTask(project, id)));

    }

    return renderTaskEle(task);

}

function createTask(project, title, description, dueDate, priority) {

    let taskEle = createTaskEle(project, title, description, dueDate, priority);
    mainContent.appendChild(taskEle);


}

export {renderTasks, createTask, renderTaskEle, getValue};