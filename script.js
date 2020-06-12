//fixes audio problem in chrome
document.documentElement.addEventListener("mousedown", () => {
  if (Tone.context.state !== "running") Tone.context.resume();
});

// variables for the stepsequencer
let index = 0; // keeps track on wich step the the stepsequencer are at
let previous_step = 0; //keeps track on the previous step
let active_instrument_index = 0; //keeps track on wich instrument that is active

var sample_url =
  "https://raw.githubusercontent.com/jkjellberg/gridstep/master/samples/808/";
// an array of instruments, needs to be the same as the amount of divs with class instrument_switcher
const instruments = [
  {
    synth: new Tone.Player(sample_url + "kick.wav"),
    note: "c2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "sd.wav"),
    note: "g2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "clap.wav"),
    note: "c4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "tl.wav"),
    note: "d#4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "th.wav"),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "ch.wav"),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "oh.wav"),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(sample_url + "cymbal.wav"),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

const gain = new Tone.Gain(0.6);
gain.toMaster();

instruments.forEach((instrument) => instrument.synth.connect(gain));

//selects all instrument switcher buttons
const instr_buttons = document.querySelectorAll(".instrument_switcher");

const start_stop_btn = document.getElementById("start-stop");

start_stop_btn.addEventListener("click", (e) => {
  Tone.Transport.toggle();
  start_stop_btn.classList.toggle("active");
  $(".step_indicator").removeClass("active_step");
  $(".step_indicator").eq(0).addClass("active_step");
  index = 0;
  previous_step = 0;
});

//Select clear_btn
const clear_btn = document.getElementById("clear-btn");
//Connect clear button to fucntion
clear_btn.addEventListener("click", (e) => {
  $(".st0").removeClass("checked");
  $(".step_indicator").removeClass("checked");

  instruments.forEach((instrument) => {
    instrument.steps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  });
});

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
    $(".step_indicator").removeClass("checked");
    $(".st0").removeClass("checked");
    for (var j = 0; j < 16; j++) {
      if (instruments[active_instrument_index].steps[j]) {
        $(".step_indicator").addClass("checked");
        $(".st0").addClass("checked");
      }
    }
  });
});

//Lets the user start the 'swipe' outside of the grid as long as they start it in the body
document.body.addEventListener("pointerdown", (e) => {
  document.body.releasePointerCapture(e.pointerId); //
});
function loadGrid(svg_file) {
  //clears the old pattern and loads the new svg-pattern into the file
  $("#pattern_container").empty();
  $("#pattern_container").load(
    "https://raw.githubusercontent.com/jkjellberg/gridstep/svg-selector/patterns/" +
      svg_file,
    connectGrid()
  );
}
function connectGrid() {
  // makes it possible to start the swipe outside of the pattern

  $(document).on("pointerDown", ".st0", function (e) {
    $(this).releasePointerCapture(e.pointerId);
  });

  $(document).on("pointerenter", ".st0", function () {
    let i = $(".st0").index(this);
    console.log(i);
    $(this).toggleClass("checked");
    $(".step_indicator").eq(i).toggleClass("checked");
    instruments[active_instrument_index].steps[i] = !instruments[
      active_instrument_index
    ].steps[i];
  });
}

loadGrid("1.html");

// Initialize the time, will call function 'repeat' each 16ths note. 120 bpm by default.
Tone.Transport.scheduleRepeat(repeat, "16n");

// This will happen every 16th note
function repeat(time) {
  let step = index % 16;

  // remove the class active_step from the previous step and adds it to the active step
  $(".step_indicator").eq(previous_step).removeClass("active_step");
  $(".step_indicator").eq(step).addClass("active_step");

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
