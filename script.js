// selects all the shapes with a class st0
let inputs = document.querySelectorAll(".st0")
// for every shape
inputs.forEach(i =>{
  //when the shape is clicked
  i.addEventListener("pointerenter", ()=>{
   // toggle the class checked on the clicked one
   i.classList.toggle("checked")
})
})
