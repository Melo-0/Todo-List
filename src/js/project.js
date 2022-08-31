import TrashImage from "../images/trash.png";
import {compareAsc} from "date-fns";
import {deleteContent, makeLayout, changeTab, mainContent} from '../index.js';
import {getValue, renderTaskEle} from './tasks';

function sortProjectTask(projectName) {
    let sortedTasks = getValue(projectName);
    let taskList = [];
    if (sortedTasks) {
        sortedTasks.forEach(task => {

            taskList.push(getValue(task));

        });
    }

    taskList.sort(function (x, y) {

        return compareAsc(new Date(x['dueDate']), new Date(y['dueDate']));

    });

    return taskList;

}

function getProjectList() {
    return getValue('projectList');
}

function addNewProject(projectName) {
    let projectList = getProjectList();
    projectList.push(projectName);
    return projectList;
}

function removeNewProject(projectName) {
    let projectList = getProjectList();
    let index = projectList.indexOf(projectName);
    projectList.splice(index, 1);
    return projectList;
}

function getTaskList(projectName) {
    return getValue(projectName);
}

function addNewTask(projectName, taskName) {
    let projectTaskList = getTaskList(projectName);
    projectTaskList.push(taskName);
    return projectTaskList;
}

function removeNewTask(projectName, taskName) {
    let projectList = getTaskList(projectName);
    let index = projectList.indexOf(taskName);
    projectList.splice(index, 1);
    return projectList;
}

function getProjectName() {
    let projectName = document.getElementsByClassName('projects')[0].querySelector(' ul> li');
    if (projectName) {

        return projectName.textContent;
    }
    return null;
}

function renderProjectTasks(projectName) {

    let sortedTasks = sortProjectTask(projectName);
    if (sortedTasks) {
        sortedTasks.forEach(task => {
            let taskEle = renderTaskEle(task);
            mainContent.appendChild(taskEle);
        });
    }


}


function renderProjectEle(projectName) {

    let projectEle = document.createElement('div');
    projectEle.id = projectName;


    let projectTitle = document.createElement('div');

    projectTitle.className = 'projectName';
    projectTitle.textContent = projectName;
    projectTitle.addEventListener('click', () => {
        deleteContent();
        makeLayout('Task');
        renderProjectTasks(projectName);
        let projectDelete = document.createElement('li');
        projectDelete.textContent = projectName;
        const projectTab = document.getElementsByClassName('projects')[0].querySelector('ul');
        projectTab.replaceChildren();
        projectTab.appendChild(projectDelete);
        changeTab(projectName);

    });

    projectEle.append(projectTitle);

    let projectDelete = document.createElement('img');
    projectDelete.src = TrashImage;
    projectDelete.className = 'projectDelete';
    projectDelete.alt = 'delete';
    projectEle.append(projectDelete);
    projectDelete.addEventListener('click', () => {
        projectDelete.parentElement.remove();
        let projectTasks = getTaskList(projectName);
        if (projectTasks) {
            projectTasks.forEach(task => {

                localStorage.removeItem(task);

            });
        }
        localStorage.removeItem(projectName);
        localStorage.setItem('projectList', JSON.stringify(removeNewProject(projectName)));
    });


    return projectEle;
}

function renderProjectList() {

    let projectList = getProjectList();
    if (projectList) {
        projectList.forEach(project => {

            let taskEle = renderProjectEle(project);
            mainContent.appendChild(taskEle);

        });
    }


}


function createProject(projectName) {


    let task = [];
    localStorage.setItem(projectName, JSON.stringify(task));
    if (!JSON.parse(localStorage.getItem('projectList'))) {
        let projectList = [];
        projectList.push(projectName);
        localStorage.setItem('projectList', JSON.stringify(projectList));
    } else {

        localStorage.setItem('projectList', JSON.stringify(addNewProject(projectName)));
    }


    let projectEle = renderProjectEle(projectName);
    mainContent.appendChild(projectEle);
}

export {renderProjectList, getProjectName, createProject, addNewTask, removeNewTask};