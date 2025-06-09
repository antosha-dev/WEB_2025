const username = document.getElementById("username");
const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const phoneNumber = document.getElementById("phone-number");
const dateOfBirth = document.getElementById("date-of-birth");
let currentUser = localStorage.getItem("currentUser");

const response = await fetch(
  `http://localhost:3000/Users?username=${currentUser}`
);
if(!response.ok){
    console.error(`Пользователь "${currentUser}" не найден`)
}
else{
    const user = await response.json();
    username.innerHTML = user[0].username;
    fullname.innerHTML = user[0].fullname;
    email.innerHTML = user[0].email;
    password.innerHTML = user[0].password;
    phoneNumber.innerHTML = user[0].phone;
    dateOfBirth.innerHTML = user[0].birthdate;
}