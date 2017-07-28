var Parameters = {},
    URLParameters = window.location.search.replace("?", "").split("&");

for (parameter in URLParameters) Parameters[URLParameters[parameter].split("=")[0]] = URLParameters[parameter].split("=")[1];

// ############################  GENERAL SETTINGS ##########################
//
// Order of presentation
var shuffleSequence = "";
if (Parameters.Blocks == "EN")
  shuffleSequence = seq("instruct", rshuffle(endsWith("QuantifierEvery")), rshuffle(endsWith("QuantifierNo")));
else if (Parameters.Blocks == "NE")
  shuffleSequence = seq("instruct", rshuffle(endsWith("QuantifierNo")), rshuffle(endsWith("QuantifierEvery")));
else if (Parameters.Blocks == "AN")
  shuffleSequence = seq("instruct", rshuffle(endsWith("QuantifierAt least one")), rshuffle(endsWith("QuantifierNo")));
else //if (Parameters.Blocks == "NA")
  shuffleSequence = seq("instruct", rshuffle(endsWith("QuantifierNo")), rshuffle(endsWith("QuantifierAt least one")));

var showProgressBar = true;   // show progress bar

//var practiceItemTypes = ["practice"];

var defaults = [
    "DynamicQuestion", {
        randomOrder: ["F", "J"],   // Randomly ordered answers, but 1st should always be 'F' and 2nd 'J'
        clickableAnswers: false    // Prevents participants from choosing an answer by clicking on it
    },
];

var host = "http://files.lab.florianschwarz.net/ibexfiles/Pictures/"; // Where to look for the pictures
//
// ##########################################################################
    
    
var items =

GetItemsFrom(data, null, {
     // ItemGroup: ["item","group"],
      Elements: [
        function(row){ return "alien"+row.condition+"Quantifier"+row.quantifier; },
        
    // ALREADY LOADED BEFORE THE PRACTICE ITEM
    /*"Preloader", {
         host: host,
         files: ["CoveredBox.png", "bubble1.png", 
                 "alien_blue1.png", "alien_green1.png", "alien_orange1.png",
                 "alien_pink.png", "alien_yellow1.png", "alien_red1.png"]
        },*/
    
    "DynamicQuestion", {

         legend: function(row){ return [row.condition, row.quantifier, row.item, row.group, row.sentence].join('+'); },
         randomOrder: ["F", "J"],
         answers: function(row){ return {
                  Target: newAliens([
                                     [row.bottom1, row.top1],
                                     [row.bottom2, row.top2],
                                     [row.bottom3, row.top3],
                                     [row.bottom4, row.top4],
                                     [row.bottom5, row.top5],
                                     [row.bottom6, row.top6],
                                     [row.bottom7, row.top7]
                           ]),
                   Covered: newAliens([
                                     ["CoveredBox.png", "CoveredBox.png"],
                                     ["CoveredBox.png", "CoveredBox.png"],
                                     ["CoveredBox.png", "CoveredBox.png"],
                                     ["CoveredBox.png", "CoveredBox.png"],
                                     ["CoveredBox.png", "CoveredBox.png"],
                                     ["CoveredBox.png", "CoveredBox.png"],
                                     ["CoveredBox.png", "CoveredBox.png"]
                            ])
                  };
                },
         enabled: false,                             // The user won't validate the trial by clicking/pressing the key.

         sequence: function(row) { return [
           //{this: "legend"},              // Prints the 'legend' parameter (comment out when done debugging)
           "<H4>"+row.sentence+"</H4>",   
           {pause: "key ", newRT: true},             // Wait for the participant to press the space bar and records a new RT when they do
           function(t){ t.enabled = true; },         // Enable validation
           "Press F or J",
           {this: "answers", showKeys: "bottom", waitFor: true}

         ];
       }
     }
    ]
}).concat([

    ["instruct", "Form", {html: {include: "ID.html"}, continueOnReturn: true}],

    ["instruct", "Form", {  html: { include: "Instructions.html" }}],
           
           
    // FIRST PRACTICE ITEM (TRUE)
    ["instruct",
           
     "Preloader", {
           host: host,
           files: ["CoveredBox.png", "bubble1.png", "alien_blue1.png", "alien_green1.png",
                   "alien_orange1.png", "alien_pink.png", "alien_yellow1.png", "alien_red1.png"]
     },
    
     "DynamicQuestion", {
    
      legend: "practice",
      randomOrder: null, // For the practice items, we want to manually order the visible vs covered images
      answers: {
                 Target: ["F", newAliens([ ["alien_blue1.png", "alien_yellow1.png"], ["alien_blue1.png", "alien_yellow1.png"], 
                                     ["alien_blue1.png", "alien_yellow1.png"], ["alien_blue1.png", "alien_yellow1.png"],
                                     ["alien_blue1.png", "alien_yellow1.png"], ["alien_blue1.png", "alien_yellow1.png"],
                                     ["alien_blue1.png", "alien_yellow1.png"]
                                   ])],
                 Covered: ["J", newAliens([ ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"]
                                   ])]
      },
      enabled: false,                             // The user won't validate the trial by clicking/pressing the key.
      sequence: [
                  //{this: "legend"},  // Prints the 'legend' parameter (comment out when done debugging)
                  TT("#bod", "This experiment is a guessing game: in every trial, you will see two pictures "+
                             "and you will have to select the one that matches the sentence description.", "Press Space", "mc"),
                  {pause: "key\x01"},
                  "<H4 id='sentence'>No alien is aware that he is blue</H4>", 
                  "<span id='press'>Press F or J</span>",
                  {this: "answers", showKeys: "bottom"},
                  // First hide everything but the visible aliens
                  function(t){ $("#sentence, #press, #Covered, [id^=alienmini], [id^=alienbubble], .DynamicQuestion-keyLabel").css("visibility", "hidden"); },
                  TT("#Target", "You will see a series of pictures of seven aliens.", "Press Space", "tc"),
                  {pause: "key\x01"},     
                  TT("#Target #alienbigAlien0", "Unlike humans, these aliens are not able to directly perceive their skin color.", "Press Space", "tr"),
                  {pause: "key\x01"},
                  // Reveal the visible thought bubbles
                  function(t){ $("#Target [id^=alienbubble]").css("visibility", "visible"); },
                  TT("#Target #alienbubble0", "They indirectly learn about their color by using a special machine.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  // Reveal what is inside the bubbles
                  function(t){ $("#Target [id^=alienmini]").css("visibility", "visible"); },
                  TT("#Target #alienminialien0", "Unfortunately, some of the machines have a problem and give the wrong color as the output.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  TT("#Target", "For instance, each one of these aliens used a defective machine and now wrongly believes he is yellow.", "Press Space", "tc"),
                  {pause: "key\x01"},
                  // Reveal the covered picture (including its bubbles and mini aliens)
                  function(t){ $("#Covered, [id^=alienmini], [id^=alienbubble]").css("visibility", "visible"); },
                  TT("#Covered", "In every trial you will face two pictures, but one will be partly hidden from your view.", "Press Space", "tc"),
                  {pause: "key\x01"},
                  // Reveal the sentence
                  function(t){ $("#sentence").css("visibility", "visible"); },
                  TT("#sentence", "You will read a sentence and will have to decide which of the two pictures matches the description.", "Press Space", "bc"),
                  {pause: "key\x01"},
                  // Reveal the instruction ("Press F or J")
                  function(t){ $("#press").css("visibility", "visible"); },
                  TT("#press", "Please use the <b>F</b> and <b>J</b> keys to give your answer.", "Press Space", "bc"),
                  {pause: "key\x01"},
                  // Reveal the labels under the pictures
                  function(t){ $(".DynamicQuestion-keyLabel").css("visibility", "visible"); },
                  TT("#Target", "If you think the visible picture matches the description, you press the corresponding key (here, <b>F</b>).", "Press Space", "tc"),
                  {pause: "key\x01"},
                  TT("#Covered", "If you think a better match is hidden in the other picture, you press the other key (here, <b>J</b>).", "Press Space and then F or J", "tc"),
                  {pause: "key\x01"},
                  {pause: "keyFJ"},
                  // Printing a feedback in function to what key the participant just pressed
                  function(t){
                    setTimeout(function() {
                      if ("F".match(t.pressedKey))
                        TT("#Target", "Right: in this picture no alien is aware that he is blue.", "Press Space to Proceed", "tc")(t);
                      else if ("J".match(t.pressedKey))
                        TT("#Covered", "<span style='color: red;'>Wrong: you should go with the visible picture, "+
                                       "where no alien is aware that he is blue</span>", "Press Space to Proceed", "tc")(t);
                    }, 12);
                  },
                  {pause: "key\x01"}
                ]
     }
    ],
                      

    // SECOND PRACTICE ITEM (FALSE)                      
    ["instruct",
    
     "DynamicQuestion", {
    
      legend: "practice",
      randomOrder: null, // For the practice items, we want to manually order the visible vs covered images
      answers: {
                 Covered: ["F", newAliens([ ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"]
                                   ])],
                 Target: ["J", newAliens([ ["alien_red1.png", "alien_red1.png"], ["alien_red1.png", "alien_red1.png"],
                                     ["alien_red1.png", "alien_red1.png"], ["alien_red1.png", "alien_red1.png"],
                                     ["alien_red1.png", "alien_red1.png"], ["alien_red1.png", "alien_green1.png"],
                                     ["alien_red1.png", "alien_green1.png"]
                                   ])]
      },
      enabled: false,                             // The user won't validate the trial by clicking/pressing the key.
      sequence: [
                  //{this: "legend"},   // Prints the 'legend' parameter (comment out when done debugging)
                  "<H4 id='sentence'>No alien is aware that he is red</H4>",
                  {pause: "key ", newRT: true},             
                  "<span id='press'>Press F or J</span>",
                  {this: "answers", showKeys: "bottom"},
                  TT("#Target #alienbigAlien0", "Of course some of the machines work fine.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  TT("#Target #alienminialien0", "For instance, this alien rightly believes that he is red.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  TT("#sentence", "Now guess which picture matches the description.", "Press Space and then F or J", "bc"),
                  {pause: "key\x01"},
                  {pause: "keyFJ"},
                  // Filling th bullet with blanks to give it some height, but the text will change right after it pops up (takes 10ms).
                  function(t){
                    setTimeout(function() {
                      console.log(t.pressedKey);
                      if ("J".match(t.pressedKey))
                        TT("#Target", "<span style='color: red;'>Wrong: in this picture some aliens are aware that they are red</span>", "Press Space to the Experiment", "tc")(t);
                      else if ("F".match(t.pressedKey))
                        TT("#Covered", "Right: in the visible picture, some aliens are aware that they are red", "Press Space to the Experiment", "tc")(t);
                    }, 12);
                  },
                  {pause: "key\x01"}
                ]
     }
    ],
                      
            // GIVE THE DIFFERENT COLORS 

    ["instruct",
    
     "DynamicQuestion", {
    
      legend: "practice",
      randomOrder: null, // For the practice items, we want to manually order the visible vs covered images
      answers: {
                 Covered: ["F", newAliens([ ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"], ["CoveredBox.png", "CoveredBox.png"],
                                      ["CoveredBox.png", "CoveredBox.png"]
                                   ])],
                 Target: ["J", newAliens([ ["alien_red1.png", "alien_red1.png"], ["alien_blue1.png", "alien_blue1.png"],
                                     ["alien_green1.png", "alien_green1.png"], ["alien_pink.png", "alien_pink.png"],
                                     ["alien_yellow1.png", "alien_yellow1.png"], ["alien_red1.png", "alien_red1.png"],
                                     ["alien_red1.png", "alien_red1.png"]
                                   ])]
      },
      enabled: false,                             // The user won't validate the trial by clicking/pressing the key.
      sequence: [
                  //{this: "legend"},   // Prints the 'legend' parameter (comment out when done debugging)
                  "<H4 id='sentence'>No alien was told the wrong color.</H4>",
                  {pause: "key ", newRT: true},             
                  "<span id='press'>Press F or J</span>",
                  {this: "answers", showKeys: "bottom"},
                  // First hide everything but the visible aliens
                  //function(t){ $("#sentence, #press, #Covered, [id^=alienmini], [id^=alienbubble], .DynamicQuestion-keyLabel").css("visibility", "hidden"); },
                  TT("#Target", "The aliens in this experiment can be of five different colors.", "Press Space", "tc"),
                  {pause: "key\x01"},
                  TT("#Target #alienbigAlien0", "This alien is red.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  TT("#Target #alienbigAlien1", "This alien is blue.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  TT("#Target #alienbigAlien2", "This alien is green.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  TT("#Target #alienbigAlien3", "This alien is pink.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  TT("#Target #alienbigAlien4", "This alien is yellow.", "Press Space", "mr"),
                  {pause: "key\x01"},
                  // Now uncover everything
                  //function(t){ $("#sentence, #press, #Covered, [id^=alienmini], [id^=alienbubble], .DynamicQuestion-keyLabel").css("visibility", "visible"); },
                  TT("#sentence", "Now decide which picture matches the description.", "Press Space and then F or J", "bc"),
                  {pause: "key\x01"},
                  {pause: "keyFJ"},
                     function(t){
                    setTimeout(function() {
                      console.log(t.pressedKey);
                      if ("J".match(t.pressedKey))
                        TT("#Target", "Right: in this picture indeed every alien was given the right color as output by the machine.", "<b>We will now start the actual experiment.</b> Press Space if you're ready to continue to the experiment.", "tc")(t);
                      else if ("F".match(t.pressedKey))
                        TT("#Covered", "<span style='color: red;'>Wrong: in the visible picture, every alien was given the right color as output by the machine.</span>", "<b>We will now start the actual experiment.</b> Press Space if you're ready to continue to the experiment.", "tc")(t);
                    }, 12);
                  },
                  {pause: "key\x01"} 
                ]
     }
    ]          


/*
  ["itemLabel", "DynamicQuestion", {

   legend: "This will be recorded in the result file.",
   randomOrder: ["F", "J"],
   answers: {Target: newAliens([
                               ["alien_blue1.png", "alien_orange1.png"],
                               ["alien_blue1.png", "alien_green1.png"],
                               ["alien_blue1.png", "alien_blue1.png"],
                               ["alien_blue1.png", "alien_red1.png"],
                               ["alien_blue1.png", "alien_pink.png"],
                               ["alien_green1.png", "alien_grey1.png"],
                               ["alien_blue1.png", "alien_yellow1.png"]
                     ]),
             Covered: newAliens([
                               ["CoveredBox.png", "CoveredBox.png"],
                               ["CoveredBox.png", "CoveredBox.png"],
                               ["CoveredBox.png", "CoveredBox.png"],
                               ["CoveredBox.png", "CoveredBox.png"],
                               ["CoveredBox.png", "CoveredBox.png"],
                               ["CoveredBox.png", "CoveredBox.png"],
                               ["CoveredBox.png", "CoveredBox.png"]
                      ])
            },
   enabled: false,                             // The user won't validate the trial by clicking/pressing the key.

   sequence: [

     "<H4>Every alien is aware that he's blue.</H4>",   // Prints the 'legend' parameter
     {pause: "key ", newRT: true},             // Wait for the participant to press the space bar and records a new RT when they do
     function(t){ t.enabled = true; },         // Enable validation
     "Press F or J",
     {this: "answers", showKeys: "bottom", waitFor: true}

   ]
         
         
 }
 ]*/

    ]);
    
         

    
