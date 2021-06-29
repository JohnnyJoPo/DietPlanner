// TO-DO
// Reorganize functions
// Add documentation

"use strict"

var today = new Date();
var foodArray = [];
var consumedArray = [];
var totalConsumed = 0;
var sizeToggle = false;
var inItem = document.getElementById("item");
var inCalories = document.getElementById("calories");
var inDate = document.getElementById("foodDate");
var inMealTime = document.getElementById("foodTime");
var selectedNode;
var selectedFoodIndex;
var selectedDay;
const reader = new FileReader();

function Food(foodItem, foodCal, foodDate, foodTime, foodMilliseconds, foodConsumed){
    this.item = foodItem;
    this.calories = foodCal;
    this.date = foodDate;
    this.mealTime = foodTime;
    this.milliseconds = foodMilliseconds;
    this.consumed = foodConsumed;
}

function setToday(){
    let newDay = today.getDate();
    let newMonth = today.getMonth() + 1;
    let newYear = today.getFullYear();
    let offset = today.getTimezoneOffset();
    let newDate = `${newYear}-${newMonth}-${newDay}`;
    today = new Date(Date.parse(newDate) + (offset * 60000));
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
    let dayCalorieArray = [];
    let totalCalories = 0;
    totalConsumed = 0;
    let dayMillisecondArray = [];
    deselectNode();
    for(let i=0; i < 7; i++) {
        let currentDay = new Date(startDay.getTime() + (i * 86400000));
        daySectionArray[i] = document.getElementById(week[i]);
        dayContentArray[i] = daySectionArray[i].children;
        dayContentArray[i][1].innerText = `${currentDay.getMonth() + 1} / ${currentDay.getDate()} / ${currentDay.getFullYear()}`
        dayCalorieArray[i] = 0;
        consumedArray[i] = 0;
        dayMillisecondArray[i] = currentDay.getTime();
        clearChildNodes(dayContentArray[i][2]);
    }

    for(let i=0; i < foodArray.length; i++) {
        if(startDay.getTime() <= foodArray[i].milliseconds && foodArray[i].milliseconds < (startDay.getTime() + 604800000)) {
            for(let i2=0; i2 < 7; i2++) {
                if(foodArray[i].milliseconds === dayMillisecondArray[i2]) {
                    dayCalorieArray[i2] += foodArray[i].calories;
                    if(foodArray[i].consumed){
                        consumedArray[i2] += foodArray[i].calories;
                    }
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
                        selectNode(newDataNode, i, i2);
                    });
                    break;
                }
            }
        }
    }
    for(let i=0; i < 7; i++){
        document.getElementsByClassName("dailyCalories")[i].innerText = dayCalorieArray[i];
        document.getElementsByClassName("dailyConsumed")[i].innerText = consumedArray[i];
        totalCalories += dayCalorieArray[i];
        totalConsumed += consumedArray[i];
    }
    document.getElementById("totalCalories").innerText = totalCalories;
    document.getElementById("totalConsumed").innerText = totalConsumed;
    saveToStorage();
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
    if(document.getElementsByClassName("selected")[0]){
        document.getElementsByClassName("selected")[0].classList.remove("selected");
    }
    document.getElementById("consumedChk").disabled = true;
    document.getElementById("consumedChkLbl").style.opacity = "50%";
    document.getElementById("copyBtn").disabled = true;
    document.getElementById("editBtn").disabled = true;
    document.getElementById("delBtn").disabled = true;
}

function selectNode(node, foodIndex, day) {
    deselectNode();
    node.classList.add("selected");
    selectedNode = node;
    selectedFoodIndex = foodIndex;
    selectedDay = day;
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
        consumedArray[selectedDay] += foodArray[selectedFoodIndex].calories;
        totalConsumed += foodArray[selectedFoodIndex].calories;
    }
    else{
        selectedNode.classList.remove("consumed");
        foodArray[selectedFoodIndex].consumed = false;
        consumedArray[selectedDay] -= foodArray[selectedFoodIndex].calories;
        totalConsumed -= foodArray[selectedFoodIndex].calories;
    }
    document.getElementsByClassName("dailyConsumed")[selectedDay].innerText = consumedArray[selectedDay];
    document.getElementById("totalConsumed").innerText = totalConsumed;
    saveToStorage();
}

function deleteNode() {
    deselectNode();
    selectedNode.removeEventListener("click", selectNode.eventRef);
    selectedNode.remove();
    foodArray.splice(selectedFoodIndex, 1);
    if(foodArray.length === 0){
        document.getElementById("exportBtn").disabled = true;
    }
    today = setChart(today);
}

function copyNode() {
    inItem.value = foodArray[selectedFoodIndex].item;
    inCalories.value = foodArray[selectedFoodIndex].calories;
    inDate.value = foodArray[selectedFoodIndex].date;
    inMealTime.value = foodArray[selectedFoodIndex].mealTime;
    inItem.focus();
}

function editNode() {
    copyNode();
    deleteNode();
}

function addFood() {
    let tempDate = new Date(inDate.value);
    let offset = tempDate.getTimezoneOffset();
    let targetDate = new Date(Date.parse(inDate.value) + (offset * 60000));
    let newFood = new Food(inItem.value, parseInt(inCalories.value), inDate.value, parseInt(inMealTime.value), targetDate.getTime(), false);
    document.getElementById("exportBtn").disabled = false;
    foodArray.push(newFood);
    foodArray.sort(sortFood);
    today = setChart(targetDate);
}

function validateInput() {
    let errorMsg = document.getElementById("inputError");
    errorMsg.style.display = "none";
    inItem.style.backgroundColor = "white";
    inCalories.style.backgroundColor = "white";
    let itemRegex = new RegExp("^\s+$");
    let calRegex = new RegExp("^[0-9]+$");
    inItem.value = inItem.value.trim();
    inCalories.value = inCalories.value.trim();

    if (itemRegex.test(inItem.value) || inItem.value === "") {
        inItem.style.backgroundColor = "#ffafaf";
        inItem.focus();
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please enter a food item";
        return;
    }
    if (!(calRegex.test(inCalories.value)) || inCalories.value === "") {
        inCalories.style.backgroundColor = "#ffafaf";
        inCalories.focus();
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please enter a valid amount of calories (positive integers)";
        return;
    }

    if (inDate.value === "") {
        inDate.focus();
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error: Please enter a date (MM/DD/YYYY)";
        return;
    }

    addFood();
    resetForm();
}

let previousWeek = function () {
    let newWeek = new Date(today.getTime() - 604800000);
    today = setChart(newWeek);
}

let nextWeek = function () {
    let newWeek = new Date(today.getTime() + 604800000);
    today = setChart(newWeek);
}

function exportData(){
    const saveLink = document.createElement("a");
    let outData = JSON.stringify(foodArray);
    const outFile = new Blob([outData], {type:"text/plain"});
    saveLink.href = URL.createObjectURL(outFile);
    saveLink.download = "DietPlanner_data.json"
    saveLink.click();
    saveLink.remove();
}

function importData(){
    const inFile = this.files[0];
    if(inFile){
        reader.readAsText(inFile);
    }
}

function processImport(){
    let inputStream = reader.result;
    let dataArray;
    try{
        dataArray = JSON.parse(inputStream);
    }
    catch(error){
        alert("Warning: The selected file does not contain valid json data.")
        return;
    }
    let validFlag;
    for(let i=0; i < dataArray.length; i++){
        validFlag = validateImport(dataArray[i]);
        if(validFlag === false){
            break;
        }
    }
    if(validFlag){
        foodArray = dataArray;
        document.getElementById("exportBtn").disabled = false;
        today = setChart(today);
    }
}

function validateImport(inObject){
    if(typeof(inObject) !== "object"){
        return false;
    }
    let propertyArray = Object.getOwnPropertyNames(inObject);
    if(propertyArray.length !== 6){
        return false;
    }
    let propertyCheckArray = ["item", "calories", "date", "mealTime", "milliseconds", "consumed"];
    for(let i=0; i < 6; i++){
        if(propertyArray[i] !== propertyCheckArray[i]){
            return false;
        }
    }
    try{
        if(typeof(inObject.calories) !== "number" || typeof(inObject.mealTime) !== "number" || typeof(inObject.milliseconds) !== "number"){
            return false;
        }
        if(typeof(inObject.item) !== "string" || typeof(inObject.date) !== "string"){
            return false;
        }
        if(inObject.consumed === true || inObject.consumed === false){
            return true;
        }
        else{
            return false;
        }
    }
    catch(error){
        return false;
    }
}

function loadFromStorage(){
    let dietData = localStorage.getItem("dietData");
    foodArray = JSON.parse(dietData);
    if(!foodArray){
        foodArray = [];
    }
    else if(foodArray.length !== 0){
        document.getElementById("exportBtn").disabled = false;
    }
}

function saveToStorage(){
    let dietData = JSON.stringify(foodArray);
    localStorage.setItem("dietData", dietData);
}

function switchLayout(start){
    let winWidth = window.innerWidth;
    let changeFlag = false;
    if(winWidth >= 600 && (sizeToggle === false || start)){
        sizeToggle = true;
        changeFlag = true;
    }
    else if(winWidth < 600 && (sizeToggle === true || start)){
        sizeToggle = false;
        changeFlag = true;
        deselectNode();
    }
    if(changeFlag){
        let weekArray = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        let sectionArray = [];
        for(let i=0; i < 7; i++){
            sectionArray[i] = document.getElementById(weekArray[i]);
            sectionArray[i].children[2].classList.remove("unhide");
            sectionArray[i].children[3].classList.remove("unhide");
            if(sizeToggle){
                sectionArray[i].removeEventListener("click", sectionArray[i].eventRef);
            }
            else{
                sectionArray[i].addEventListener("click", sectionArray[i].eventRef = function(event){
                    if(event.target === this || event.target === this.children[0] || event.target === this.children[1]){
                        toggleSectionDisplay(sectionArray, i);
                    }    
                });
            }   
        }
    }
}

function toggleSectionDisplay(week, day){
    let clickedSection = week[day];
    if(clickedSection.children[2].classList.contains("unhide")){
        clickedSection.children[2].classList.remove("unhide");
        clickedSection.children[3].classList.remove("unhide");
        deselectNode();
    }
    else{
        for(let i=0; i < 7; i++){
            week[i].children[2].classList.remove("unhide");
            week[i].children[3].classList.remove("unhide");
        }
        week[day].children[2].classList.add("unhide");
        week[day].children[3].classList.add("unhide");
    }
}

function resetForm(){
    let errorMsg = document.getElementById("inputError");
    document.getElementById("entryForm").reset();
    errorMsg.style.display = "none";
    inItem.style.backgroundColor = "white";
    inCalories.style.backgroundColor = "white";
    inItem.focus()
}

function setEvents() {
    let addBtn = document.getElementById("addBtn");
    let resetBtn = document.getElementById("resetBtn");
    let prevBtn = document.getElementById("prevBtn");
    let nextBtn = document.getElementById("nextBtn");
    let consumedChk = document.getElementById("consumedChk");
    let copyBtn = document.getElementById("copyBtn");
    let editBtn = document.getElementById("editBtn");
    let delBtn = document.getElementById("delBtn");
    let importBtn = document.getElementById("importBtn");
    let fileInput = document.getElementById("fileInput");
    let exportBtn = document.getElementById("exportBtn");

    window.addEventListener("resize", function(){
        switchLayout(false);
    });
    inItem.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            addBtn.click();
        }
    });
    inCalories.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            addBtn.click();
        }
    });
    inMealTime.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            addBtn.click();
        }
    });
    addBtn.addEventListener("click", validateInput);
    addBtn.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            validateInput();
        }
    });
    resetBtn.addEventListener("click", resetForm);
    resetBtn.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            resetForm();
        }
    });
    prevBtn.addEventListener("click", previousWeek);
    nextBtn.addEventListener("click", nextWeek);
    consumedChk.addEventListener("change", toggleConsumed);
    copyBtn.addEventListener("click", copyNode);
    editBtn.addEventListener("click", editNode);
    delBtn.addEventListener("click", deleteNode);
    importBtn.addEventListener("click", function(){
        fileInput.click();
    });
    fileInput.addEventListener("change", importData);
    exportBtn.addEventListener("click", exportData);
    reader.addEventListener("load", processImport);
}

function init(){
    setEvents();
    setToday();
    switchLayout(true);
    loadFromStorage();
    document.getElementById("scriptCheck").remove();
    today = setChart(today);
}

window.addEventListener("load", init);