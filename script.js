"use strict"

var today = new Date();
var foodArray = [];
var inItem = document.getElementById("item");
var inCalories = document.getElementById("calories");
var inDate = document.getElementById("foodDate");
var inTime = document.getElementById("foodTime");

function Food(foodItem, foodCal, foodDate, foodTime){
    this.item = foodItem;
    this.calories = foodCal;
    this.date = foodDate;
    this.time = foodTime;
}

function clearChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function setChart(displayDate) {
    let targetDay = displayDate.getDay();
    let startDay = new Date(displayDate.getTime() - (targetDay * 86400000));
    let week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let daySectionArray = [];
    let dayContentArray = [];
    let dayMillisecondArray = [];
    for(let i=0; i < week.length; i++) {
        let currentDay = new Date(startDay.getTime() + (i * 86400000));
        daySectionArray[i] = document.getElementById(week[i]);
        dayContentArray[i] = daySectionArray[i].children;
        dayContentArray[i][1].innerText = `${currentDay.getMonth() + 1} / ${currentDay.getDate()} / ${currentDay.getFullYear()}`
        dayMillisecondArray[i] = currentDay.getTime();
        clearChildNodes(dayContentArray[i][2]);
    }

    for(let i=0; i < foodArray.length; i++) {
        if(startDay.getTime() <= foodArray[i].date && foodArray[i].date < (startDay.getTime() + 604800000)) {
            for(let i2=0; i2 < 7; i2++) {
                if(foodArray[i].date === dayMillisecondArray[i2]) {
                    let newDataNode = document.createElement("div");
                    newDataNode.classList.add("dataNode");
                    let nodeItem = document.createElement("p");
                    let nodeCalories = document.createElement("p");
                    let nodeTime = document.createElement("p");
                    nodeItem.innerText = foodArray[i].item;
                    nodeCalories.innerText = foodArray[i].calories;
                    nodeTime.innerText = foodArray[i].time;
                    newDataNode.appendChild(nodeItem);
                    newDataNode.appendChild(`${nodeCalories} Calories`);
                    newDataNode.appendChild(nodeTime);
                    dayContentArray[i2][2].appendChild(newDataNode);
                    // Continue here
                    break;
                }
            }
        }
    }
    return startDay;
}

function addFood() {
    let tempDate = new Date(inDate.value);
    let offset = tempDate.getTimezoneOffset();
    let targetDate = new Date(Date.parse(inDate.value) + (offset * 60000));
    let newFood = new Food(inItem.value, inCalories.value, targetDate.getTime(), inTime.value);
    foodArray.push(newFood);
    today = setChart(targetDate);
}

function validateInput() {
    let errorMsg = document.getElementById("inputError");
    let resetBtn = document.getElementById("resetBtn");
    errorMsg.style.display = "none";
    errorMsg.innerText = "";
    inItem.style.backgroundColor = "white";
    inCalories.style.backgroundColor = "white";
    inDate.style.backgroundColor = "white";
    let itemRegex = new RegExp("^\s+$");
    let calRegex = new RegExp("^[0-9]+$");
    inItem.value = inItem.value.trim();
    inCalories.value = inCalories.value.trim();

    if (itemRegex.test(inItem.value) || inItem.value === "") {
        inItem.style.backgroundColor = "#ffafaf";
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please enter a food item";
        return;
    }
    if (!(calRegex.test(inCalories.value)) || inCalories.value === ""){
        inCalories.style.backgroundColor = "#ffafaf";
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please enter a valid amount of calories";
        return;
    }

    if (inDate.value === ""){
        inDate.style.backgroundColor = "ffafaf";
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please select a date";
        return;
    }

    addFood();
    resetBtn.click();
}

let previousWeek = function () {
    let newWeek = new Date(today.getTime() - 604800000);
    today = setChart(newWeek);
}

let nextWeek = function () {
    let newWeek = new Date(today.getTime() + 604800000);
    today = setChart(newWeek);
}

function setEvents() {
    let itemTxt = document.getElementById("item");
    let calTxt = document.getElementById("calories");
    let addBtn = document.getElementById("addBtn");
    let prevBtn = document.getElementById("prevBtn");
    let nextBtn = document.getElementById("nextBtn");
    let consumedChk = document.getElementById("consumedChk");
    let copyBtn = document.getElementById("copyBtn");
    let editBtn = document.getElementById("editBtn");
    let delBtn = document.getElementById("delBtn");
    let importBtn = document.getElementById("importBtn");
    let exportBtn = document.getElementById("exportBtn");

    // Uncomment these as new functions are written

    // window.addEventListener("resize", myFunction);
    itemTxt.addEventListener("keyup", function(event){
        if(event.key === "Enter"){
            addBtn.click();
        }
    });
    calTxt.addEventListener("keyup", function(event){
        if(event.key === "Enter"){
            addBtn.click();
        }
    });
    addBtn.addEventListener("click", validateInput);
    prevBtn.addEventListener("click", previousWeek);
    nextBtn.addEventListener("click", nextWeek);
    // consumedChk.addEventListener("change", myFunction);
    // copyBtn.addEventListener("click", myFunction);
    // editBtn.addEventListener("click", myFunction);
    // delBtn.addEventListener("click", myFunction);
    // importBtn.addEventListener("click", myFunction);
    // exportBtn.addEventListener("click", myFunction);
}

function init(){
    setEvents();
    document.getElementById("scriptCheck").remove();
    // loadStorage();
    today = setChart(today);
}

window.addEventListener("load", init);