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
      {type:"txt", font:"20%", label:p1GamesWon.toString() + "-" + p2GamesWon.toString(), id:"setScore", pad:"20"},
      {type:"h", c: [
        {type:"btn", font:"25%", label:serverScore, cb: l=>incScore(layout.server, layout.receiver), id:"server", pad:"10"},
        {type:"btn", font:"25%", label:receiverScore, cb: l=>incScore(layout.receiver, layout.server), id:"receiver", pad:"10"}
      ], filly:"1"}
    ]
  });
  draw(layout);
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
    if (scorer.id == "server") {
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
  if (winner.id == "server") {
    p1GamesWon += ((1 + firstServer) % 2);
    p2GamesWon += firstServer;
  } else {
    p2GamesWon += ((1 + firstServer) % 2);
    p1GamesWon += firstServer;
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