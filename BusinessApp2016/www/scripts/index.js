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
        myDB = window.sqlitePlugin.openDatabase({ name: "business.db", location: 'default', createFromLocation: 1 });

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
    myDB.transaction(function (transaction) {
        var sql = "SELECT id, firstName, lastName, title, picture, departmentName " +
                  "FROM employee  JOIN department on employee.departmentId = department.departmentId " +
                  "WHERE employee.departmentId=" + departmentId +
                  " ORDER BY lastName;"
        console.log(sql);
        transaction.executeSql(sql, [],
            function (tx, result) {
                var dataLength = result.rows.length;
                //console.log(dataLength);
                if (dataLength > 0) {
                    //start with empty listview
                    $('#employeeList').empty();
                    var li;
                    for (i = 0; i < dataLength; i++) {
                        var employees = result.rows.item(i);
                        $('#employeeList').append('<li><a class="empdata" href="#" id="' +
                            employees.id + '"><img src="emp_pics/' +
                            employees.picture + '" /><h2>' +
                            employees.title + '</h2>' +
                            employees.firstName + ' ' + employees.lastName +
                            '</a></li>');
                    }
                    $('.headinfo').html(employees.departmentName);

                    //after loop is done - refresh the listview
                    $('#employeeList').listview().listview('refresh');
                } else {
                    console.log("Error getting employees.");
                }
            },
            function (error) {
                console.log("Error occurred while getting the data.");
            });
    });
}
//end getEmployeesByDept

//Get a single employee
function getEmployee(id) {
    myDB.transaction(function (transaction) {
        var empSQL = "SELECT id, firstName, lastName, title, picture, officePhone, cellPhone, email, city " +
                     "FROM employee " +
                     "WHERE id=" + id;
        //console.log(empSQL);
        transaction.executeSql(empSQL, [],
            function (tx, result) {
                var dataLength = result.rows.length;
                //alert(dataLength);
                //console.log(dataLength);
                if (dataLength > 0) {
                    var employee = result.rows.item(0);
                    //console.log(JSON.stringify(employee));
                    $('#employeePic').attr('src', 'emp_pics/' + employee.picture);
                    $('#fullName').text(employee.firstName + ' ' + employee.lastName);
                    $('#employeeTitle').text(employee.title);
                    $('#city').text(employee.city);

                    //start with empty list
                    $('#actionList').empty();

                    if (employee.email) {
                        $('#actionList').append('<li data-icon="mail"><a href="mailto:' + employee.email + '"><p class="line1">Email</p>' +
                            '<p class="line2">' + employee.email + '</p></a></li>');
                    }
                    //Call office
                    if (employee.officePhone) {
                        $('#actionList').append('<li data-icon="user"><a href="tel:' + employee.officePhone + '"><p class="line1">Call Office</p>' +
                            '<p class="line2">' + employee.officePhone + '</p></a></li>');
                    }
                    //Call Cell + Send Text msg
                    if (employee.cellPhone) {
                        $('#actionList').append('<li data-icon="phone"><a href="tel:' + employee.cellPhone + '"><p class="line1">Call Cell</p>' +
                            '<p class="line2">' + employee.cellPhone + '</p></a></li>');
                        $('#actionList').append('<li data-icon="comment"><a href="sms:' + employee.cellPhone + '"><p class="line1">SMS</p>' +
                            '<p class="line2">' + employee.cellPhone + '</p></a></li>');
                    }

                    $('#actionList').listview().listview('refresh');

                } else {
                    console.log("Error getting employee.");
                }
            },
            function (error) {
                console.log("Error occurred while getting the data.");
            });
    });
}
//end getEmployee

//================================ UI EVENT HANDLERS =======================================//
//deptEmp Events:  (From department to employees)
$(document).on('click', '.deptEmp', function () {
    //alert('deptEmp')
    $.mobile.pageContainer.pagecontainer("change", "#employees", {
        stuff: this.id,
        transition: "slidefade"
    });
});

$(document).on("pagebeforechange", function (e, data) {
    if (data.toPage[0].id === "employees") {
        var id = data.options.stuff;
        getEmployeesByDept(id);
    }
});


//Emp details Event (For showing employee details)
$(document).on('click', '.empdata', function () {
    $.mobile.pageContainer.pagecontainer("change", "#employee", {
        stuff: this.id,
        transition: "slidefade"
    });
});

$(document).on("pagebeforechange", function (e, data) {
    if (data.toPage[0].id === "employee") {
        var id = data.options.stuff;
        //alert(id);
        getEmployee(id);
    }
});