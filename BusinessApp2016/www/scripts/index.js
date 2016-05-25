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
        myDB = window.sqlitePlugin.openDatabase({ name: "business.db", createFromLocation: 1 });

        //Start by getting the departments for home page
        getDepartments();
    }
};

//Initialize 
app.initialize();

//Get all departments 
function getDepartments() {
    myDB.transaction(function (transaction) {
        transaction.executeSql("SELECT d.departmentId, departmentName, COUNT(e.departmentId) as total FROM department d JOIN employee e ON d.departmentId = e.departmentId GROUP BY d.departmentId ORDER BY departmentName;", [],
            function (tx, result) {
                //get num of rows in result
                var dataLength = result.rows.length;
                //check if we have any data
                if (dataLength > 0) {
                    //Populate listview, but first empty it
                    $("#departmentList").empty();
                    $("#departmentList").append('<li data-role="list-divider" data-theme="a">Departments</li>');
                    for (var i = 0; i < dataLength; i++) {
                        var department = result.rows.item(i);
                        $("#departmentList").append('<li><a class="deptEmp" href="#" id="'
                            + department.departmentId + '">'
                            + department.departmentName +
                            '<span class="ui-li-count">'+
                            department.total + '</span></a></li>');
                        // <li><a href="#" class="deptEmp" id="1">Accounting <span class="ui-li-count">1</span></a></li>
                    }
                    //refresh the listview widget
                    $("#departmentList").listview().listview('refresh');                   

                } else {
                    console.log("Error getting departments.")
                }

            }, //end of success
            function (error) {
                console.log("Error occured while getting the data.")
            });
    });//end of transaction
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