//fixes audio problem in chrome
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

// selects all the shapes with a class st0
const inputs = document.querySelectorAll(".st0");
// for every shape
inputs.forEach(i =>{
  //when the shape is clicked
  i.addEventListener("click", ()=>{
   // toggle the class checked on the clicked one
   i.classList.toggle("checked");
   //play a middle 'C' for the duration of an 8th note
   //var synth = new Tone.Synth().toMaster();
   //synth.triggerAttackRelease('C4', '8n');
})
})


var synth = new Tone.Synth().toMaster();

let index = 0;
let previous_step = 0

Tone.Transport.scheduleRepeat(repeat, '16n');
Tone.Transport.start();

function repeat(time){
  let step = index % 16;

  inputs[previous_step].classList.remove("active");
  inputs[step].classList.toggle("active");

  if (inputs[step].classList.contains("checked"))
    synth.triggerAttackRelease('g2', '16n');

  previous_step = step;
  index++;
}
