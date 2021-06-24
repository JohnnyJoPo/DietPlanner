// TO-DO
// Get file stream functionaliy working with import and export buttons
// Fix error: When pressing Enter while the add button is in focus, it tries to add the item twice
//    Use .reset() method on form element
//    Write code for reset button
// Construct interactivity with mobile design that isn't present in tablet and desktop layouts
// Set up local storage functionality
//    Load json from local storage when page is loaded
//    Save json to local storage whenever foodArray changes
// Add paragraph elements below each day for daily calorie totals

"use strict"

var today = new Date();
var foodArray = [];
var inItem = document.getElementById("item");
var inCalories = document.getElementById("calories");
var inDate = document.getElementById("foodDate");
var inMealTime = document.getElementById("foodTime");
var selectedNode;
var selectedFoodIndex;

function Food(foodItem, foodCal, foodDate, foodTime, foodMilliseconds, foodConsumed){
    this.item = foodItem;
    this.calories = foodCal;
    this.date = foodDate;
    this.mealTime = foodTime;
    this.milliseconds = foodMilliseconds;
    this.consumed = foodConsumed;
}

function clearChildNodes(parent) {
    while(parent.firstChild) {
        parent.firstChild.removeEventListener("click", parent.firstChild.eventRef);
        parent.removeChild(parent.firstChild);
    }
}

function setChart(displayDate) {
    let targetDay = displayDate.getDay();
    let startDay = new Date(displayDate.getTime() - (targetDay * 86400000));
    let week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let mealTimeArray =["Breakfast", "Lunch", "Dinner", "Other"];
    let daySectionArray = [];
    let dayContentArray = [];
    let dayMillisecondArray = [];
    deselectNode();
    for(let i=0; i < week.length; i++) {
        let currentDay = new Date(startDay.getTime() + (i * 86400000));
        daySectionArray[i] = document.getElementById(week[i]);
        dayContentArray[i] = daySectionArray[i].children;
        dayContentArray[i][1].innerText = `${currentDay.getMonth() + 1} / ${currentDay.getDate()} / ${currentDay.getFullYear()}`
        dayMillisecondArray[i] = currentDay.getTime();
        clearChildNodes(dayContentArray[i][2]);
    }

    for(let i=0; i < foodArray.length; i++) {
        if(startDay.getTime() <= foodArray[i].milliseconds && foodArray[i].milliseconds < (startDay.getTime() + 604800000)) {
            for(let i2=0; i2 < 7; i2++) {
                if(foodArray[i].milliseconds === dayMillisecondArray[i2]) {
                    let newDataNode = document.createElement("div");
                    newDataNode.classList.add("dataNode");
                    if(foodArray[i].consumed) {
                        newDataNode.classList.add("consumed");
                    } 
                    let nodeItem = document.createElement("p");
                    let nodeCalories = document.createElement("p");
                    let nodeMealTime = document.createElement("p");
                    nodeItem.innerText = foodArray[i].item;
                    nodeCalories.innerText = `${foodArray[i].calories} Calories`;
                    nodeMealTime.innerText = mealTimeArray[foodArray[i].mealTime];
                    newDataNode.appendChild(nodeItem);
                    newDataNode.appendChild(nodeCalories);
                    newDataNode.appendChild(nodeMealTime);
                    dayContentArray[i2][2].appendChild(newDataNode);
                    
                    newDataNode.addEventListener("click", newDataNode.eventRef = function(){
                        selectNode(newDataNode, i);
                    });
                    break;
                }
            }
        }
    }

    return startDay;
}

let sortFood = function (a, b) {
    if(a.milliseconds > b.milliseconds) {return 1;}
    else if(a.milliseconds < b.milliseconds) {return -1;}
    else {
        if(a.mealTime > b.mealTime){return 1;}
        else if(a.mealTime < b.mealTime){return -1;}
        else {return 0;}
    }
}

function deselectNode(){
    document.getElementById("consumedChk").disabled = true;
    document.getElementById("consumedChkLbl").style.opacity = "50%";
    document.getElementById("copyBtn").disabled = true;
    document.getElementById("editBtn").disabled = true;
    document.getElementById("delBtn").disabled = true;
}

function selectNode(node, foodIndex) {
    let nodeArray = document.getElementsByClassName("dataNode");
    for(let i=0; i < nodeArray.length; i++){
        nodeArray[i].classList.remove("selected");
    }
    node.classList.add("selected");
    selectedNode = node;
    selectedFoodIndex = foodIndex;
    consumedChk = document.getElementById("consumedChk");
    consumedChk.disabled = false;
    document.getElementById("consumedChkLbl").style.opacity = "100%";
    document.getElementById("copyBtn").disabled = false;
    document.getElementById("editBtn").disabled = false;
    document.getElementById("delBtn").disabled = false;
    if(node.classList.contains("consumed")){
        consumedChk.checked = true;
    }
    else{
        consumedChk.checked = false;
    }
}

function toggleConsumed() {
    consumedChk = document.getElementById("consumedChk");
    if(consumedChk.checked){
        selectedNode.classList.add("consumed");
        foodArray[selectedFoodIndex].consumed = true;
    }
    else{
        selectedNode.classList.remove("consumed");
        foodArray[selectedFoodIndex].consumed = false;
    }
}

function deleteNode() {
    deselectNode();
    selectedNode.removeEventListener("click", selectNode.eventRef);
    selectedNode.remove();
    foodArray.splice(selectedFoodIndex, 1);
}

function copyNode() {
    inItem.value = foodArray[selectedFoodIndex].item;
    inCalories.value = foodArray[selectedFoodIndex].calories;
    inDate.value = foodArray[selectedFoodIndex].date;
    inMealTime.value = foodArray[selectedFoodIndex].mealTime;
    inItem.focus();
}

function moveNode() {
    copyNode();
    deleteNode();
}

function addFood() {
    let tempDate = new Date(inDate.value);
    let offset = tempDate.getTimezoneOffset();
    let targetDate = new Date(Date.parse(inDate.value) + (offset * 60000));
    let newFood = new Food(inItem.value, inCalories.value, inDate.value, parseInt(inMealTime.value), targetDate.getTime(), false);
    document.getElementById("exportBtn").disabled = false;
    foodArray.push(newFood);
    foodArray.sort(sortFood);
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
    if (!(calRegex.test(inCalories.value)) || inCalories.value === "") {
        inCalories.style.backgroundColor = "#ffafaf";
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please enter a valid amount of calories";
        return;
    }

    if (inDate.value === "") {
        inDate.style.backgroundColor = "ffafaf";
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please select a date";
        return;
    }

    addFood();
    inItem.focus();
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
    consumedChk.addEventListener("change", toggleConsumed);
    copyBtn.addEventListener("click", copyNode);
    // editBtn.addEventListener("click", myFunction);
    delBtn.addEventListener("click", deleteNode);
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