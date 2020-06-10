//fixes audio problem in chrome
document.documentElement.addEventListener("mousedown", () => {
  if (Tone.context.state !== "running") Tone.context.resume();
});

var sample_url =
  "https://raw.githubusercontent.com/jkjellberg/gridstep/samples/samples/";
// an array of instruments, needs to be the same as the amount of divs with class instrument_switcher
const instruments = [
  {
    synth: new Tone.Player(sample_url + "kick-esm-iconic.wav"),
    note: "c2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "kick-606.wav"),
    note: "g2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "kick-606.wav"),
    note: "c4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "kick-606.wav"),
    note: "d#4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "kick-606.wav"),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

let active_instrument_index = 0;

const gain = new Tone.Gain(0.6);
gain.toMaster();

instruments.forEach((instrument) => instrument.synth.connect(gain));

//selects all instrument switcher buttons
const instr_buttons = document.querySelectorAll(".instrument_switcher");

// selects all shapes with class st0 (all the steps)
const trigs = document.querySelectorAll(".st0");

// selects all shapes with class st0 (all the steps)
const step_indicator = document.querySelectorAll(".step_indicator");

//Connect the bpm slider
var bpm_slider = document.getElementById("bpm_slider"),
  bpm_amount = document.getElementById("bpm_amount");

//Function for bpm_slider
bpm_slider.oninput = function () {
  bpm_amount.innerHTML = this.value;
  Tone.Transport.bpm.value = this.value;
};

//add event listener to all instrument buttons
instr_buttons.forEach((item, i) => {
  item.addEventListener("click", (e) => {
    //removes the class active from the previous active instrument
    instr_buttons[active_instrument_index].classList.remove("active");

    //sets the class active on the active instrument
    item.classList.toggle("active");
    active_instrument_index = i;

    //repaints the trigs to match the active instruments
    trigs.forEach((trig, j) => {
      trig.classList.remove("checked");
      step_indicator[j].classList.remove("checked");
      if (instruments[active_instrument_index].steps[j]) {
        trig.classList.toggle("checked");
        step_indicator[j].classList.toggle("checked");
      }
    });
  });
});

//Lets the user start the 'swipe' outside of the grid as long as they start it in the body
document.body.addEventListener("pointerdown", (e) => {
  document.body.releasePointerCapture(e.pointerId); //
});

// adds eventlisteners to all steps
trigs.forEach((trig, i) => {
  //adds a pointer down listerner to each step to be able to release the target
  trig.addEventListener("pointerdown", (e) => {
    //console.log("down");
    //console.log("attempt release implicit capture");
    trig.releasePointerCapture(e.pointerId); // <- Important!
  });

  //adds a pointerenter event listener to all steps
  trig.addEventListener("pointerenter", (e) => {
    //console.log("enter");
    // add the class checked if mouse/fingers enters shape (doesn't care if mouse is down atm...)
    trig.classList.toggle("checked");
    step_indicator[i].classList.toggle("checked");
    instruments[active_instrument_index].steps[i] = !instruments[
      active_instrument_index
    ].steps[i];
  });
  // we don't need this at the moment, but adds a listener for when the finger/pointer leaves the shape
  //trig.addEventListener("pointerleave", (e) => {
  //console.log("leave");
  //});
});

// variables for the stepsequencer
let index = 0;
let previous_step = 0;

// Initialize the time, will call function 'repeat' each 16ths note. 120 bpm by default.
Tone.Transport.scheduleRepeat(repeat, "16n");
//Start the function above
Tone.Transport.start();

// This will happen every 16th note
function repeat(time) {
  let step = index % 16;

  // remove the class active_step from the previous step and adds it to the active step
  step_indicator[previous_step].classList.remove("active_step");
  step_indicator[step].classList.toggle("active_step");

  instruments.forEach((instrument, i) => {
    // if the active step is cheked a note will be played.
    if (instrument.steps[step]) {
      instrument.synth.start(time, 0, "16n", 0);

      instr_buttons[i].classList.toggle("step");
      setTimeout(() => {
        instr_buttons[i].classList.remove("step");
      }, 50);
    }
  });

  previous_step = step;
  index++;
}
