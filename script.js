//fixes audio problem in chrome
document.documentElement.addEventListener("mousedown", () => {
  if (Tone.context.state !== "running") Tone.context.resume();
});

// an array of instruments and their steps needs to be the same as the amount of divs with class instrument_switcher
const instruments = [
  {
    synth: new Tone.Sampler(
      {
        C3: "path/to/C3.mp3",
        "D#3": "path/to/Dsharp3.mp3",
        "F#3": "path/to/Fsharp3.mp3",
        A3: "path/to/A3.mp3",
      },
      function () {
        //sampler will repitch the closest sample
        sampler.triggerAttack("D3");
      }
    ),
    note: "c2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Synth(),
    note: "g2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Synth(),
    note: "c4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Synth(),
    note: "d#4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Synth(),
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
      if (instruments[active_instrument_index].steps[j])
        trig.classList.toggle("checked");
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
  trigs[previous_step].classList.remove("active_step");
  trigs[step].classList.toggle("active_step");

  instruments.forEach((instrument) => {
    // if the active step is cheked a note will be played.
    if (instrument.steps[step])
      instrument.synth.triggerAttackRelease(instrument.note, "16n", time);
  });

  previous_step = step;
  index++;
}
