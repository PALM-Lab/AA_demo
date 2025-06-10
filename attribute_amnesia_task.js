/**
 *
 * attribute_amnesia_task.js
 * William Xiang Quan Ngiam
 *
 * demo of the attribute amnesia task
 *
 * started coding: 3/6/25
 **/

/* Initialize jsPsych */
var jsPsych = initJsPsych({
});
timeline = [];

// DEFINE EXPERIMENT VARIABLES
const n_trials = 30; // Number of trials in the experiment
const n_items = 4; // Number of items in the screen
const canvas_width = 1000; // Width of the canvas
const canvas_height = 600; // Height of the canvas

// EXPERIMENT STIMULI
// Define an array of letters and an array of numbers
var letters = ['A', 'B', 'C', 'D', 'F', 'H', 'J', 'K', 'L', 'N', 'P', 'R', 'T', 'V', 'X', 'Y']; // Based on Chen and Wyble (2016)
const numbers = ['2', '3', '4', '5', '6', '7', '8', '9'] // Based on Chen and Wyble (2016)
const colors = ['red', 'orange', 'blue', 'magenta']

// Set item locations
const item_locations = [
    [canvas_width / 2 - 200, canvas_height / 2 - 200],
    [canvas_width / 2 + 200, canvas_height / 2 - 200],
    [canvas_width / 2 - 200, canvas_height / 2 + 200],
    [canvas_width / 2 + 200, canvas_height / 2 + 200]
]

// Set response cue locations
const cue_locations = [
    [canvas_width / 2 - 150, canvas_height / 2],
    [canvas_width / 2 - 50, canvas_height / 2],
    [canvas_width / 2 + 50, canvas_height / 2],
    [canvas_width / 2 + 150, canvas_height / 2]
]

// BUILD EXPERIMENT VARIABLES

// BUILD EXPERIMENT
/* force fullscreen */
var enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true
}
timeline.push(enter_fullscreen);

/* define welcome message trial */
var welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Welcome to the demo.</p>
    <br>
`,
    choices: [">>"],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline.push(welcome);

/* show task instructions */
var instructions_1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>On each trial, you will see three coloured numbers and one coloured letter.</p>
    <p>Your goal is to remember the colour of the <b>letter</b>.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline.push(instructions_1);

var instructions_2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>When prompted for a response, press the corresponding number to indicate the colour of the letter.</p>
    <p>Press the button below when you are ready.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline.push(instructions_2);

// TRIAL LOOP
for (var t = 0; t < n_trials; t++) {

    // Set up trial
    var trial_time = function () {
        dur = jsPsych.randomization.randomInt(800, 1800)
        return dur
    }

    var trial_start = {
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: [canvas_height, canvas_width],
        stimulus: draw_fixation,
        choices: "NO_KEYS",
        trial_duration: trial_time
    }

    function draw_fixation(c) {
        var ctx = c.getContext("2d")
        // Add fixation cross
        ctx.font = "50px Arial"
        ctx.fillStyle = 'black'
        ctx.fillText('+', canvas_width / 2, canvas_height / 2)

        for (var i = 0; i < n_items; i++) {
            ctx.beginPath();
            ctx.arc(item_locations[i][0]+20, item_locations[i][1]-20, 20, 0, 2 * Math.PI);
            ctx.stroke();
        }

    }

    timeline.push(trial_start)

    var trial_stim = {
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: [canvas_height, canvas_width],
        stimulus: draw_trial,
        choices: "NO_KEYS",
        trial_duration: 250,
        on_finish: function (data) {
            if (jsPsych.pluginAPI.compareKeys(data.response, null)) {
                data.trial_letter = trial_letter
            } else (
                jsPsych.endCurrentTimeline()
            )
        }

    }

    function draw_trial(c) {
        trial_letter = jsPsych.randomization.sampleWithoutReplacement(letters, 1);
        var trial_numbers = jsPsych.randomization.sampleWithoutReplacement(numbers, 3);
        var trial_stim = trial_letter.concat(trial_numbers)
        var shuffled_stim = jsPsych.randomization.repeat(trial_stim, 1);
        var shuffle_colors = jsPsych.randomization.repeat(colors, 1)

        var ctx = c.getContext("2d");
        ctx.font = "50px Arial"

        for (var i = 0; i < n_items; i++) {
            ctx.fillStyle = shuffle_colors[i]
            ctx.fillText(shuffled_stim[i], item_locations[i][0], item_locations[i][1])
        }
        // Add fixation cross
        ctx.fillStyle = 'black'
        ctx.fillText('+', canvas_width / 2, canvas_height / 2)
    }

    timeline.push(trial_stim);

    var trial_mask = {
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: [canvas_height, canvas_width],
        stimulus: draw_mask,
        choices: "NO_KEYS",
        trial_duration: 100
    }

    function draw_mask(c) {

        var ctx = c.getContext("2d");
        ctx.font = "50px Arial"

        for (var i = 0; i < n_items; i++) {
            ctx.fillStyle = "red";
            ctx.fillRect(item_locations[i][0], item_locations[i][1] - 50, 10, 60);
            ctx.fillStyle = "orange";
            ctx.fillRect(item_locations[i][0], item_locations[i][1] - 50, 60, 10);
            ctx.fillStyle = "blue";
            ctx.fillRect(item_locations[i][0] + 50, item_locations[i][1] - 50, 10, 60);
            ctx.fillStyle = "yellow";
            ctx.fillRect(item_locations[i][0], item_locations[i][1], 60, 10);
            ctx.fillStyle = "black"
            ctx.fillText("@", item_locations[i][0], item_locations[i][1])
        }
    }

    timeline.push(trial_mask);

    var blank = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '',
        choices: "NO_KEYS",
        trial_duration: 500,
        on_finish: function (data) {
            var trial_letter = []
            trial_letter = jsPsych.data.getLastTrialData().values()[0].trial_letter
            data.trial_letter = trial_letter
        },
    }

    timeline.push(blank)

    var response = {
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: [canvas_height, canvas_width],
        stimulus: draw_response,
        choices: ['1', '2', '3', '4'],
        prompt: "Which colour was the letter?"
    }

    function draw_response(c) {
        var ctx = c.getContext("2d")

        // Red square
        ctx.fillStyle = "red";
        ctx.fillRect(cue_locations[0][0], cue_locations[0][1], 50, 50)
        ctx.font = "40px Arial"
        ctx.fillStyle = "white"
        ctx.fillText("1", cue_locations[0][0] + 15, cue_locations[0][1] + 40)

        // Yellow square
        ctx.fillStyle = "orange";
        ctx.fillRect(cue_locations[1][0], cue_locations[1][1], 50, 50)
        ctx.fillStyle = "white"
        ctx.fillText("2", cue_locations[1][0] + 15, cue_locations[1][1] + 40)

        // Blue Square
        ctx.fillStyle = "blue";
        ctx.fillRect(cue_locations[2][0], cue_locations[2][1], 50, 50)
        ctx.fillStyle = "white";
        ctx.fillText("3", cue_locations[2][0] + 15, cue_locations[2][1] + 40)

        // Magenta Square
        ctx.fillStyle = "magenta";
        ctx.fillRect(cue_locations[3][0], cue_locations[3][1], 50, 50)
        ctx.fillStyle = "white";
        ctx.fillText("4", cue_locations[3][0] + 15, cue_locations[3][1] + 40)

    }

    if (t != n_trials - 1) {

        timeline.push(response)

    }

    var ITI = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '',
        choices: "NO_KEYS",
        trial_duration: 400,
        on_finish: function (data) {
            var trial_letter = []
            trial_letter = jsPsych.data.getLastTrialData().values()[0].trial_letter
            data.trial_letter = trial_letter
        },
    }

    timeline.push(ITI)

    // SURPRISE TRIAL!
    var surprise_trial = {
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: [canvas_height, canvas_width],
        stimulus: draw_surprise,
        prompt: "This is a surprise memory test! Here, we test the identity of the target letter. Press a corresponding number to indicate the 'identity' of the target letter.",
        choices: ['5', '6', '7', '8'],
        on_finish: function (data) {
            response = Number(data.response)+4
            correct = correct_letter == shuffled_surprise_letters[response - 1]
            data.correct = correct
        }
    }

    function draw_surprise(c) {
        correct_letter = trial_letter
        let remaining_letters = letters.filter(x => !correct_letter.includes(x))
        other_letters = jsPsych.randomization.sampleWithoutReplacement(remaining_letters, 3)
        surprise_letters = correct_letter.concat(other_letters)
        shuffled_surprise_letters = jsPsych.randomization.repeat(surprise_letters, 1)

        var ctx = c.getContext("2d")

        for (var i = 0; i < 4; i++) {

            ctx.font = "40px Arial"
            ctx.fillStyle = "black";
            ctx.fillText(shuffled_surprise_letters[i], canvas_width / 2 + ((i - 1.5) * 100), canvas_height / 2)
            ctx.fillText(i + 1, canvas_width / 2 + ((i - 1.5) * 100), canvas_height / 2 + 100)
        }

    }

    if (t == n_trials - 1) {
        timeline.push(surprise_trial)
        timeline.push(response)
    }
}

var surprise_feedback = {
    type: jsPsychHtmlButtonResponse,
    stimulus: write_feedback,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
}

function write_feedback() {
    if (correct) {
        return "You got that right! You did not experience attribute amnesia."
    } else {
        return "You got that wrong! You experienced attribute amnesia!"
    }
}

timeline.push(surprise_feedback)

/* upload data */
//var save_data = {
//    type: jsPsychPipe,
//    action: "save",
//    experiment_id: expID,
//    filename: fileID + `.csv`,
//    wait_message: "<p>Saving data. Please do not close this page.</p>",
//    data_string: ()=>jsPsych.data.get().csv()
//};
//
//timeline.push(save_data)

/* end of experiment */
var end_experiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>Thank you for trying the demo!</p>',
    choices: ["FINISH"],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
}

timeline.push(end_experiment)

var close_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false
}

timeline.push(close_fullscreen)

// Run the Task
jsPsych.run(timeline)

