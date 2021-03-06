//fixes audio problem in chrome
document.documentElement.addEventListener("mousedown", () => {
  if (Tone.context.state !== "running") Tone.context.resume();
});

// variables  and constants for the stepsequencer
let index = 0; // keeps track on wich step the the stepsequencer are at
let previous_step = 0; //keeps track on the previous step
let active_instrument_index = 0; //keeps track on wich instrument (ie sound) that is active
const grids = [1, 2, 5, 10, 9]; // keeps tracks on each grid-pattern that is available in /patterns
let activeGrid = 0; // Keeps tracks on wich grid-pattern that is active at the moment
const drumkits = ["808", "909", "LinnDrum", "LynnDream", "Oberheim", "Drumulator"]; // Keeps tracks of the different soundbanks that is available, should have the same name as the folder that contains the samples.
const sampleNames = ["kick", "snare", "clap", "lt", "ht", "ch", "oh", "cymbal"];
let activeDrumkitIndex = 0;

// keeps tracks of the index of open and closed hi hat to allow the closed hi hat to kill the open hi hat.
const closed_hi_hat = 5;
const open_hi_hat = 6;

var sample_url =
  "https://raw.githubusercontent.com/jkjellberg/gridstep/master/samples/";
// an array of instruments, needs to be the same as the amount of divs with class instrument_switcher
const instruments = [
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[0] + ".wav"
    ),
    note: "c2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[1] + ".wav"
    ),
    note: "g2",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[2] + ".wav"
    ),
    note: "c4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[3] + ".wav"
    ),
    note: "d#4",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[4] + ".wav"
    ),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[5] + ".wav"
    ),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[6] + ".wav"
    ),
    note: "g5",
    steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    synth: new Tone.Player(
      sample_url + drumkits[activeDrumkitIndex] + "/" + sampleNames[7] + ".wav"
    ),
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

//change-pattern-button
$("#changePattern").click(function (e) {
  //removes the higlight of the previous higlighted grid in the menu
  $(".layout-link").eq(activeGrid).removeClass("active");

  //changes to the next grid
  activeGrid = (activeGrid + 1) % grids.length;

  //Updates the link in the menu for the new grid
  $(".layout-link").eq(activeGrid).addClass("active");

  //Actually updates the grid
  ChangeGrid(grids[activeGrid] + ".html");
});

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
    repaint_trigs();
  });
});

function changeNextDrumKit() {
  activeDrumkitIndex = (activeDrumkitIndex + 1) % drumkits.length;
  changeDrumKit(active_instrument_index);
}

function changeDrumKit(index) {
  instruments.forEach((instrument, i) => {
    instrument.synth.load(
      sample_url + drumkits[index] + "/" + sampleNames[i] + ".wav"
    );
  });
  activeDrumkitIndex = index;
}

/* View in fullscreen */
function openFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  let elem = document.documentElement;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function repaint_trigs() {
  //repaints the trigs to match the active instruments
  $(".step_indicator").removeClass("checked");
  $(".st0").removeClass("checked");
  for (var j = 0; j < 16; j++) {
    if (instruments[active_instrument_index].steps[j]) {
      //console.log("step " + j + " is repainted.");
      $(".step_indicator").eq(j).addClass("checked");
      $(".st0").eq(j).addClass("checked");
    }
  }
}

//Lets the user start the 'swipe' outside of the grid as long as they start it in the body
document.body.addEventListener("pointerdown", (e) => {
  document.body.releasePointerCapture(e.pointerId); //
});
$("#pattern_container").on("pointerdown", function (e) {
  $(this)[0].releasePointerCapture(e.originalEvent.pointerId);
  e.originalEvent.preventDefault();
});
$(".topdiv").on("pointerdown", function (e) {
  $(this)[0].releasePointerCapture(e.originalEvent.pointerId);
  e.originalEvent.preventDefault();
});
$(".main-container").on("pointerdown", function (e) {
  $(this)[0].releasePointerCapture(e.originalEvent.pointerId);
  e.originalEvent.preventDefault();
});

async function ChangeGrid(svg_file) {
  $("#pattern_container").empty();
  $("#pattern_container").load(
    "https://raw.githubusercontent.com/jkjellberg/gridstep/master/patterns/" +
      svg_file,
    repaintAndConnectSVGAfterChange
  );
}

function repaintAndConnectSVGAfterChange() {
  repaint_trigs();
  $(".grid").on("pointerdown", function (e) {
    $(this)[0].releasePointerCapture(e.originalEvent.pointerId);
    //e.originalEvent.preventDefault();
    console.log("grid SVG");
  });
}
function loadAndConnectGridFirstTime(svg_file) {
  //clears the old pattern and loads the new svg-pattern into the file
  $("#pattern_container").empty();
  $("#pattern_container").load(
    "https://raw.githubusercontent.com/jkjellberg/gridstep/master/patterns/" +
      svg_file,
    connectGrid
  );
  return;
}
function connectGrid() {
  // makes it possible to start the swipe outside of the pattern or in the pattern
  $(document).on("pointerdown", "#svg_background", function (e) {
    $(this)[0].releasePointerCapture(e.originalEvent.pointerId);
  });

  $(document).on("pointerdown", ".st0", function (e) {
    $(this)[0].releasePointerCapture(e.originalEvent.pointerId);
    e.originalEvent.preventDefault();
  });

  $(".grid").on("pointerdown", function (e) {
    $(this)[0].releasePointerCapture(e.originalEvent.pointerId);
    //e.originalEvent.preventDefault();
    console.log("grid SVG");
  });

  $(document).on("pointerenter", ".st0", function () {
    let i = $(".st0").index(this);
    $(this).toggleClass("checked");
    //alert(i + " activated");
    $(".step_indicator").eq(i).toggleClass("checked");
    instruments[active_instrument_index].steps[i] = !instruments[
      active_instrument_index
    ].steps[i];
    return false;
  });
}

loadAndConnectGridFirstTime(grids[activeGrid] + ".html");

// Initialize the time, will call function 'repeat' each 16ths note. 120 bpm by default.
Tone.Transport.scheduleRepeat(repeat, "16n");

// This will happen every 16th note
function repeat(time) {
  let step = index % 16;

  // remove the class active_step from the previous step and adds it to the active step
  $(".step_indicator").eq(previous_step).removeClass("active_step");
  $(".step_indicator").eq(step).addClass("active_step");

  instruments.forEach((instrument, i) => {
    // if the active step is checked a note will be played.
    if (instrument.steps[step]) {
      instrument.synth.start(time, 0);

      //if closed hi hat, it should stop the open hi hat:
      if (i == closed_hi_hat) {
        instruments[open_hi_hat].synth.stop();
      }

      // lights up the instrument button for that step
      instr_buttons[i].classList.toggle("step");
      setTimeout(() => {
        instr_buttons[i].classList.remove("step");
      }, 50);
    }
  });

  previous_step = step;
  index++;
}
