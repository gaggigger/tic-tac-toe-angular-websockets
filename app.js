'use strict';

var turn = 'X';
var topRow = [];
var middleRow = [];
var bottomRow = [];
var score = {
  X: 0,
  O: 0
};

function changeTurn() {
  turn = (turn == 'X') ? 'O' : 'X';
  $('.turnDisplay').html('Current turn: ' + turn);
}

function placePiece(el) {
  console.log($(el).text());
  if ($(el).text() === '') {
    $(el).text(turn);

    switch ($(el).parent().attr('class')) {
      case 'topRow':
        if ($(el).hasClass('leftBox')) {
          topRow[0] = turn;
        } else if ($(el).hasClass('rightBox')) {
          topRow[2] = turn;
        } else {
          topRow[1] = turn;
        }
        break;
      case 'middleRow':
        if ($(el).hasClass('leftBox')) {
          middleRow[0] = turn;
        } else if ($(el).hasClass('rightBox')) {
          middleRow[2] = turn;
        } else {
          middleRow[1] = turn;
        }
        break;
      case 'bottomRow':
        if ($(el).hasClass('leftBox')) {
          bottomRow[0] = turn;
        } else if ($(el).hasClass('rightBox')) {
          bottomRow[2] = turn;
        } else {
          bottomRow[1] = turn;
        }
        break;
    }

    checkWin();
  }
}

function checkWin() {
  if 
    (topRow.length == 3 &&
    (topRow[0] == topRow[1]) &&
    (topRow[0] == topRow[2]) &&
    (topRow[1] == topRow[2])) {
      handleWin(turn);
  } else if
    (middleRow.length == 3 &&
    (middleRow[0] == middleRow[1]) &&
    (middleRow[0] == middleRow[2]) &&
    (middleRow[1] == middleRow[2])) {
      handleWin(turn);
  } else if
    (bottomRow.length == 3 &&
    (bottomRow[0] == bottomRow[1]) &&
    (bottomRow[0] == bottomRow[2]) &&
    (bottomRow[1] == bottomRow[2])) {
      handleWin(turn);
  } else if
    ((topRow[0] !== undefined && middleRow[0] !== undefined && bottomRow[0] !== undefined) &&
    (topRow[0] == middleRow[0]) &&
    (topRow[0] == bottomRow[0]) &&
    (middleRow[0] == bottomRow[0])) {
      handleWin(turn);
  } else if
    ((topRow[1] !== undefined && middleRow[1] !== undefined && bottomRow[1] !== undefined) &&
    (topRow[1] == middleRow[1]) &&
    (topRow[1] == bottomRow[1]) &&
    (middleRow[1] == bottomRow[1])) {
      handleWin(turn);
  } else if
    ((topRow[2] !== undefined && middleRow[2] !== undefined && bottomRow[2] !== undefined) &&
    (topRow[2] == middleRow[2]) &&
    (topRow[2] == bottomRow[2]) &&
    (middleRow[2] == bottomRow[2])) {
      handleWin(turn);
  } else if
    ((topRow[0] !== undefined && middleRow[1] !== undefined && bottomRow[2] !== undefined) &&
    (topRow[0] == middleRow[1]) &&
    (topRow[0] == bottomRow[2]) &&
    (middleRow[1] == bottomRow[2])) {
      handleWin(turn);
  } else if
    ((topRow[2] !== undefined && middleRow[1] !== undefined && bottomRow[0] !== undefined) &&
    (topRow[2] == middleRow[1]) &&
    (topRow[2] == bottomRow[0]) &&
    (middleRow[1] == bottomRow[0])) {
      handleWin(turn);
  } else {
    changeTurn();
  }
}

function handleWin(turn) {
  updateScore(turn);
  alert(turn + ' wins!');
}

function updateScore(turn) {
  score[turn] +=1;
  $('#' + turn + 'Score').text(score[turn]);
  saveScore();
}

function saveScore() {
  localStorage.setItem('score', JSON.stringify(score));
}

function loadScore() {
  score = JSON.parse(localStorage.getItem('score')) || score;
  $('#XScore').text(score.X);
  $('#OScore').text(score.O);
}

function clearBoard() {
  topRow = [];
  middleRow = [];
  bottomRow = [];
  $('.box').text('');
  changeTurn();
}

function loadEventHandlers() {
  $('.box').click(function() {
    placePiece(this);
  });
  $('#clearBoardBtn').click(clearBoard);
}

$(document).ready(function() {
  loadEventHandlers();
  loadScore();
});