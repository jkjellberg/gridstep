//fixes audio problem in chrome
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running')
  Tone.context.resume();
});

// selects all the shapes with a class st0
//const inputs = document.querySelectorAll(".st0");
// for every shape
//inputs.forEach(i =>{
  //when the shape is clicked
  //i.addEventListener("click", ()=>{
   // toggle the class checked on the clicked one
   //i.classList.toggle("checked");
   //play a middle 'C' for the duration of an 8th note
   //var synth = new Tone.Synth().toMaster();
   //synth.triggerAttackRelease('C4', '8n');
//})
//})

// selects all shapes with class sto (all the steps)
let inputs = document.querySelectorAll(".st0");

inputs.forEach(i =>{
  //adds a pointer down listerner to each step to be able to release the target
  i.addEventListener("pointerdown",(e)=>{
    //console.log("down");
    //console.log("attempt release implicit capture");
    i.releasePointerCapture(e.pointerId); // <- Important!
  })

  //adds a pointerenter event listener to all steps
  i.addEventListener("pointerenter",(e)=>{
    //console.log("enter");
    // add the class checked if mouse/fingers enters shape (doesn't care if mouse is down atm...)
     i.classList.toggle("checked");
  })
  // we don't need this at the moment, but adds a listener for when the finger/pointer leaves the shape
  i.addEventListener("pointerleave",(e)=>{
    //console.log("leave");
  })
})

//Creates new synth and sends it to master
var synth = new Tone.Synth().toMaster();

// variables for the stepsequencer
let index = 0;
let previous_step = 0;

// Initialize the time, will call function repeat each 16ths note. 120 bpm atm.
Tone.Transport.scheduleRepeat(repeat, '16n');
//Start the function above
Tone.Transport.start();


// This will happen every 16th note
function repeat(time){
  let step = index % 16;

  // remove the class active_step from the previous step and adds it to the active step
  inputs[previous_step].classList.remove("active_step");
  inputs[step].classList.toggle("active_step");

  // if the active step is cheked a note will be played. 
  if (inputs[step].classList.contains("checked"))
    synth.triggerAttackRelease('g2', '16n');

  previous_step = step;
  index++;
}
