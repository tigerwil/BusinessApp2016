var app = {
    //Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    //Bind Event listeners
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        //Open SQLite Database

        //Start by getting the departments for home page
    }
};

//Initialize 
app.initialize();

//Get all departments 
function getDepartments() {

}
//end getDepartments

//Get all employees for a specific department
function getEmployeesByDept(departmentId) {

}
//end getEmployeesByDept

//Get a single employee
function getEmployee(id) {

}
//end getEmployee

//================================ UI EVENT HANDLERS =======================================//
//deptEmp Events:  (From department to employees)


//Emp details Event (For showing employee details)