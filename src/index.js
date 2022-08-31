import addSVG from './images/add.svg';
import './images/todoList.png';

import {renderTasks, createTask} from './js/tasks';

import {renderProjectList, getProjectName, createProject} from './js/project';
import "./styles.scss";

let mainContent = document.querySelector('.taskContent');


renderTasks();
if (localStorage.length === 0) {
    createTask(null, 'read Book', 'programming', '2022-08-31', 2);
    createTask(null, 'Watch lecture', null, '2020-08-30', 1);
    createTask(null, 'HW', null, '2023-09-01', 3);

}


const btnAddTask = document.getElementsByClassName('addTask')[0];
btnAddTask.addEventListener('click', () => {

    document.querySelector('.taskForm').style.visibility = 'visible';
});

const btnExit = document.querySelector('.taskForm > h3');
btnExit.addEventListener('click', () => {

    document.querySelector('.taskForm').style.visibility = 'hidden';

    taskForm.reset();

});


const taskSubmit = document.querySelector('#taskSubmit');
const taskForm = document.querySelector('#taskNameForm');
taskSubmit.addEventListener('click', (e) => {
    let isFormValid = taskForm.checkValidity();
    if (!isFormValid) {
        taskForm.reportValidity();
    } else {
        e.preventDefault();
        const project = getProjectName();

        const taskName = document.querySelector('#taskName').value;
        const taskDueDate = document.querySelector('#taskDueDate').value;
        const taskPriority = Number(document.querySelector('#taskPriority').value);
        const taskDescription = document.querySelector('#taskDescription').value;
        createTask(project, taskName, taskDescription, taskDueDate, taskPriority);
        taskForm.reset();
        document.querySelector('.taskForm').style.visibility = 'hidden';

    }

});

const projectSubmit = document.querySelector('#projectSubmit');
const projectForm = document.querySelector('#projectNameForm');
projectSubmit.addEventListener('click', (e) => {
    let isFormValid = projectForm.checkValidity();
    if (!isFormValid) {
        projectForm.reportValidity();
    } else {
        e.preventDefault();
        const projectName = document.querySelector('#projectName');

        createProject(projectName.value);
        projectName.value = '';
        document.querySelector('.projectForm').style.visibility = 'hidden';

    }

});

const projectExit = document.querySelector('.projectForm > h3');
projectExit.addEventListener('click', () => {

    document.querySelector('.projectForm').style.visibility = 'hidden';
    const projectName = document.querySelector('#projectName');
    projectName.value = '';

});

function changeTab(tabName) {
    const tabList = document.querySelectorAll(`.sidebar>div>div`);
    tabList.forEach(tab => {
        if (tab.className === tabName) {
            tab.style.background = 'darkcyan';
        } else {
            tab.style.background = '';
        }
    });
    const projectTab = document.querySelector(`.projects > ul>li`);
    if (projectTab) {
        if (projectTab.textContent === tabName) {
            projectTab.style.background = 'darkcyan';
        } else {
            projectTab.remove();
        }
    }
}

changeTab('homeTitle');

function deleteContent() {
    const content = document.querySelector('.rightPanel');
    content.replaceChildren();
}


function makeLayout(tab) {
    const rightPanel = document.querySelector('.rightPanel');
    let content = document.createElement('section');
    content.className = `${tab.toLowerCase()}Content`;
    rightPanel.appendChild(content);
    mainContent = document.querySelector(`.${tab.toLowerCase()}Content`);

    let addProject = document.createElement('div');
    addProject.className = `add${tab}`;
    let addImg = document.createElement('img');
    addImg.src = addSVG;
    addImg.alt = 'add';
    addProject.textContent = `Add new ${tab}`;

    addProject.appendChild(addImg);
    rightPanel.appendChild(addProject);
    addProject.addEventListener('click', () => {

        document.querySelector(`.${tab.toLowerCase()}Form`).style.visibility = 'visible';
    });
}

const tabList = document.querySelectorAll('.sidebar> div>div');
tabList.forEach(function (tab) {

    tab.addEventListener('click', () => {


        changeTab(tab.className);
        if (tab.className === 'homeTitle') {
            deleteContent();
            makeLayout('Task');
            renderTasks();
        } else {
            deleteContent();
            makeLayout('Project');
            renderProjectList();
        }


    });
});


export {changeTab, deleteContent, makeLayout, mainContent};


