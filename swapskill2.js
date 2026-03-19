let users=JSON.parse(localStorage.getItem("users"))||[];
//SIGN UP
const signupBtn=document.getElementById("signupBtn");
signupBtn.addEventListener("click",(e)=>{
   e.preventDefault();

  const fullname=document.getElementById("fullName");

  const signupEmail=document.getElementById("signupEmail");
  const signupPassword=document.getElementById("signupPassword");
  const name=fullname.value;
  const email=signupEmail.value;
  const password=signupPassword.value;
  if(!name||!email||!password){
      alert("Please fill up the all fields !");
      return;
    }
    //CHECK IF ITS ALREADY EXISTS//
    const userExists=users.find(user=>user.email===email);
    if(userExists){
        alert("User already exists");
        return;
    }
    users.push({name,email,password});
    localStorage.setItem("users",JSON.stringify(users));
    alert("Account created successfully");
    console.log(users);
}
);
//LOGIN// mm
const loginBtn=document.getElementById("loginBtn");
loginBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    
    const loginEmail=document.getElementById("loginEmail");
    const loginPassword=document.getElementById("loginPassword");
    const email=loginEmail.value;
    const password=loginPassword.value;
    if (!email||!password){
        alert("Please fill all the fields");
        return;
    }
const user = users.find(u => u.email === email && u.password === password);

if(user){

    alert(`Login successful ${user.name}`);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", user.name);

    window.location.href = "swapskills5.html";

} else {
 
    alert("Invalid password");

}


});

   
















