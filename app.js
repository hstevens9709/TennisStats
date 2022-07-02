var p1GamesWon = 0;
var p2GamesWon = 0;

var serverScore = "0";
var receiverScore = "0";

var firstServer;

var Layout = require("Layout");

function draw(layout) {
    layout.update();
    g.clear();
    layout.render();
}

function drawStartScreen() {
    var layout = new Layout( {
        type:"v", c: [
            {type:"txt", font: "6x8:2", label:"First server?", pad:"20"},
            {type:"btn", label:"Player 1", cb: l=>startGame(0), pad:"10"},
            {type:"btn", label:"Player 2", cb: l=>startGame(1), pad:"10"}
        ]
    });
    draw(layout);
}

function drawScoreScreen() { 
  var layout = new Layout( {
    type:"v", c: [
      {type:"h", c: [
        {type:"img", src:maybeDrawBall(firstServer), fillx:1},
        {type:"txt", font:"20%", label:p1GamesWon.toString() + "-" + p2GamesWon.toString(), id:"setScore", pad:"20"},
        {type:"img", src:maybeDrawBall((firstServer + 1) % 2), fillx:1}
    ]},
      {type:"h", c: [
        {type:"btn", font:"25%", label:serverScore, cb: l=>incScore(layout.p1, layout.p2), id:"p1", pad:"10"},
        {type:"btn", font:"25%", label:receiverScore, cb: l=>incScore(layout.p2, layout.p1), id:"p2", pad:"10"}
      ], filly:"1"}
    ]
  });
  draw(layout);
}

function maybeDrawBall(shouldDrawBall) {
  if (shouldDrawBall == 0) {
    return require("heatshrink").decompress(atob("mEwwhC/AFcCkAVTn////w//zCp8DCoIXDAAIzNgQWDC4n/Ih4QBn/wAwZKLh4OBmH/CgPwl41EC5IMCMAfzD4RJLBwPzMAoXFGBBBBmBZDAAIdFMI4NBIAxkCJBYUBRAhBDJBgUBH4oACbwn/+SNGIw5IOCg4pDVJQ7FAA0gGwrsGABPzEoh4EC5gqBBwYXSJIIxCC4kvC5oYBgEjL4gXPMYIZBC6jYIeAIXTh8yYRqPKQYYXTWoJkNC4grEgDcNOwghEbpiOFBQoXRLYgwLXwwRFSRR2EJA8wIx7vG+CqI+YXHJAnzMBBGHJAxgICxAwFkAuQMIvwLpxJHC40gC5kCC4SWECxpKDC4ZENGY4rQAH4Aa"));
  } else {
    return require("heatshrink").decompress(atob("mEwghC/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A="));
  }
}

function startGame(firstServerInput) {
    firstServer = firstServerInput;
    drawScoreScreen();
}

function incScore(scorer, otherPlayer) {
  var newScore;
  var gameEnd = false;
  var otherPlayerScore = otherPlayer.label;
  switch(scorer.label) {
    case "0":
      newScore = "15";
      break;
    case "15":
      newScore = "30";
      break;
    case "30":
      newScore = "40";
      break;
    case "40":
      if (otherPlayerScore == "Ad") {
        newScore = "40";
        otherPlayerScore = "40";
      } else if (otherPlayerScore != "40") {
        gameEnd = true;
      } else {
        newScore = "Ad";
      }
      break;
    case "Ad":
      gameEnd = true;
      break;
  }
  // If the game is still going just update the score,
  // else call a function to reset the game score and update the set score
  if (!gameEnd) {
    if (scorer.id == "p1") {
        serverScore = newScore; 
        receiverScore = otherPlayerScore;
    } else {
        receiverScore = newScore;
        serverScore = otherPlayerScore;
    }
    drawScoreScreen();
  } else {
    endGame(scorer);
  }
}

function endGame(winner) {
  if (winner.id == "p1") {
    p1GamesWon += 1;
  } else {
    p2GamesWon += 1;
  }
  if (isSetWon()) {
    Terminal.println("Set won!");
  } else {
    firstServer = (firstServer + 1) % 2;
    serverScore = "0";
    receiverScore = "0";
    drawScoreScreen();
  }
}

function isSetWon() {
  return (p1GamesWon == 6 && p2GamesWon < 5) || (p2GamesWon == 6 && p1GamesWon < 5) || p1GamesWon == 7 || p2GamesWon == 7;
}

drawStartScreen();