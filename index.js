
let departmentSelect = document.getElementById('departments');
let departmentdropdown = new Option('Select Department', null, true, true)
departmentdropdown.disabled = true;
departmentSelect.add(departmentdropdown)


fetch('https://localhost:7275/api/StudentManagement/Departments')
  .then(res => res.json())
  .then((res) => {
        const  departments  = res;
        departments.forEach((departments) => {
            let option = new Option(departments.name);
            departmentSelect.add(option);
        });
  });


var editFromStudent;

function getFormStudent() {
    return {
        id:document.getElementById("id").value,
        firstName:document.getElementById("firstname").value,
        lastName:document.getElementById("lastname").value,
        department:document.getElementById("departments").value
    }
}

// when the user clicks a button
function submitForm() {
    if(!editFromStudent) addStudent(); // if the editFromStudent is undefined then call addUser()
    else editStudent();
}


function clearFormStudent() {
    document.getElementById("id").value = ""; 
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("departments").value = "";
}

function setFormData(id,firstname,lastname,departments) {
    document.getElementById("id").value = id; 
    document.getElementById("firstname").value = firstname;
    document.getElementById("lastname").value = lastname;
    document.getElementById("departments").value = departments;
}

function editDataCall(id) {
    // call get user details by id API
    fetch(`https://localhost:7275/api/StudentManagement/${id}`,{
        method:"GET"

    }).then((res)=>res.json()).then((response)=>{
        console.log("Edit info",response);
        editFromStudent =  response;
	    setFormData(editFromStudent.id,editFromStudent.firstName,editFromStudent.lastName,editFromStudent.department)
    })
}

function addStudent() {
    let data = getFormStudent();

    fetch('https://localhost:7275/api/StudentManagement', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        }).then((res)=>res.json()).then(()=>{
                clearFormStudent();
                viewAllStudents(); // reload table 
        })
}


// edit student
function editStudent() {
    var editMessage;
    var data = getFormStudent();
    data['id'] = editFromStudent.id; // get _id from selected user
    fetch(`https://localhost:7275/api/StudentManagement/${editFromStudent.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json"
        }
    }).then((res)=>res.json()).then(()=>{
            clearFormStudent();
            editMessage = "Student's Detail Edited Successfully!";
            document.getElementById("msg").innerHTML = editMessage; 
            clearFormStudent();
            viewAllStudents(); // reload table 
    })

}



// delete student
function deleteStudent(id) {

    function deleteAction() {
        var studentPreference;

        if (confirm("Do you want to delete this Student Detail?") == true) {
            fetch(`https://localhost:7275/api/StudentManagement/${id}`, {
                method: 'DELETE'
            }).then(()=>{
                console.log('Student Detail Removed');
                viewAllStudents();
            })
            studentPreference = "Student's Detail Deleted Successfully!";
            document.getElementById("message").innerHTML = studentPreference; 
  
        }

        else {
            studentPreference = "Deletion Cancelled!";
            document.getElementById("message").innerHTML = studentPreference; 
        }
    }
    deleteAction();
}
    
    

function viewAllStudents() {
    fetch("https://localhost:7275/api/StudentManagement/Students").then(
        (res) => res.json()
    ).then((objectdata)=>{
        let tabledata = '';
        console.log(objectdata)
        objectdata.forEach((values) => {
            tabledata += "<tr>"
            tabledata += "<td>" + values.id + "</td>";
            tabledata += "<td>" + values.firstName + "</td>";
            tabledata += "<td>" + values.lastName + "</td>";
            // tabledata += "<td><select><option>"+values.lastName+"</option></select></td>";

            tabledata += "<td>" + values.department + "</td>";
            tabledata += "<td><button class='btn btn-primary' onclick='editDataCall(`"+values.id+"`)'>Edit</button></td>";
            tabledata +="<td><button class='btn btn-danger' onclick='deleteStudent(`"+values.id+"`)'>Delete</button></td>";

            tabledata += "</tr>"
        });          
        document.getElementById("table-body").innerHTML = tabledata;
    })
}
viewAllStudents();

