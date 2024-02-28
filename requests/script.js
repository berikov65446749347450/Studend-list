//          https://jsonplaceholder.typicode.com
const URL = "http://localhost:8000";
const tbody = document.querySelector(".studentsTable tbody");
const postForm = document.querySelector('.post_form')
const addStudentBtn = document.querySelector('.add_student')

const getStudents = () => {
  fetch(`${URL}/students`)
    .then((response) => response.json())
    .then((data) => {
      const sortedStudents = data.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      renderStudents(sortedStudents);
    });
};

const deleteStudent = (studentID) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  };

  fetch(`${URL}/students/${studentID}`, options)
    .then(() => getStudents());
};

const editStudent = (studentID, obj) => {
  let options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  };

  fetch(`${URL}/students/${studentID}`, options);
};

const onEdit = (studentID) => {
  const name = document.querySelector(`input[name=name-${studentID}]`);
  const gender = document.querySelector(`input[name=gender-${studentID}]`);
  const age = document.querySelector(`input[name=age-${studentID}]`);
  const editBtn = document.querySelector(`.editBtn-${studentID}`);

  name.classList.toggle("active");
  gender.classList.toggle("active");
  age.classList.toggle("active");

  if (editBtn.innerHTML === "Edit") {
    name.removeAttribute("disabled");
    gender.removeAttribute("disabled");
    age.removeAttribute("disabled");
  
    editBtn.textContent = "Save";
  } else {
    name.setAttribute("disabled", true);
    gender.setAttribute("disabled", true);
    age.setAttribute("disabled", true);

    editBtn.textContent = "Edit";
    let obj = {
      name: name.value,
      gender: gender.value,
      age: age.value
    };
    editStudent(studentID, obj);
  }
};

const renderStudents = (students) => {
  tbody.innerHTML = "";
  students.forEach((student, index) => {
    let tr = `
      <tr>
        <td>${index + 1}</td>
        <td><input type="text" value="${student.name}" name="name-${student.id}" disabled></td>
        <td><input type="text" value="${student.gender}" name="gender-${student.id}" disabled></td>
        <td><input type="text" value="${student.age}" name="age-${student.id}" disabled></td>
        <td>
          <button onclick="deleteStudent(${student.id})">Delete</button>
          <button onclick="onEdit(${student.id})" class="editBtn-${student.id}">Edit</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += tr;
  });
};


getStudents();

const postNewStudent = (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  }
  fetch(`${URL}/students`, options)
    .then(() => getStudents())
}

const visibleAddForm = () => {
  if(postForm.classList.contains('active')) {
    const nameValue = document.querySelector('#name').value;
    const genderValue = document.querySelector('#gender').value;
    const ageValue = document.querySelector('#age').value;
    const newStudent = {
      id: new Date().getSeconds(),
      name: nameValue,
      gender: genderValue,
      age: ageValue
    }
    postNewStudent(newStudent)
  } else{
    postForm.classList.add('active')
  }
}

addStudentBtn.addEventListener('click', (event) => {
  event.preventDefault();
  visibleAddForm()
})