// selects all the circles with a class of radio
let inputs = document.querySelectorAll(".st0")
// for every circle
inputs.forEach(i =>{
  //when the circle is clicked
  i.addEventListener("click", ()=>{
   // toggle the class checked on the clicked one
   i.classList.toggle("checked")
})
})
