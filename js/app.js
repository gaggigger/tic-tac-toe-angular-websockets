angular.module('ticTacToeApp', ['btford.socket-io'])

.factory('scoreService', function() {
  return {
    loadScore: function() {
      return JSON.parse(localStorage.getItem('score')) || {X: 0, O: 0};
    },
    saveScore: function(score) {
      localStorage.setItem('score', JSON.stringify(score));
    }
  }
})

.factory('gameService', function() {
  return {
    new: function() {
      return {
        topRow: [],
        middleRow: [],
        bottomRow: [],
        ourPiece: '',
        theirPiece: '',
        theirNick: '',
        theirID: '',
        ourTurn: false,
        gameID: '',
        stalemate: false,
        gameOver: false,
        won: false,
        lost: false,
        winner: ''
      };
    }
  }
})

.factory('socketService', function(socketFactory) {
  var ws;
  return {
    connect: function(callbacks) {
      ws = socketFactory({
        ioSocket: io.connect('ws://localhost:3000')
      });
      ws.on('connect ack', callbacks.connect);
      ws.on('move', callbacks.move);
      ws.on('game started', callbacks.gameStarted);
      ws.on('game over', callbacks.gameOver);
      ws.on('game denied', callbacks.gameDenied);
      return ws;
    },
    setNick: function(nick) {
      if (ws) {
        ws.emit('nick', nick);
      }
    },
    sendMove: function(data) {
      if (ws) {
        ws.emit('move', data);
      }
    },
    newGame: function(player) {
      if (ws) {
        ws.emit('new game', player);
      }
    }
  }
})

.controller('gameController', function($scope, socketService, gameService) {
  $scope.gameData = gameService.new();
  $scope.ourID;
  $scope.ourNick;

  socketService.connect({
    connect: wsConnected,
    move: receiveMove,
    gameStarted: receiveNewGame,
    gameOver: gameOver,
    gameDenied: gameDenied
  });

  // websocket callbacks

  function wsConnected(id) {
    $scope.ourID = id;
  }

  function receiveMove(move) {
    console.log(move);
    placePiece(move, $scope.gameData.theirPiece);
    $scope.gameData.ourTurn = true;
  }

  function receiveNewGame(game) {
    console.log(game);
    $scope.gameData.ourPiece = game.ourPiece;
    $scope.gameData.theirPiece = game.theirPiece;
    $scope.gameData.theirNick = game.playerNick;
    $scope.gameData.theirID = game.playerId;
    $scope.gameData.ourTurn = game.ourTurn;
    $scope.gameData.gameID = game.game;
  }

  function gameOver(winner, stalemate) {
    $scope.gameData.gameOver = true;
    if (stalemate) $gameData.stalemate = true;
    if (winner === $scope.ourID) {
      $scope.gameData.winner = $scope.ourNick;
      $scope.gameData.won = true;
    } else {
      $scope.gameData.lost = true;
    }
    console.log(winner);
  }

  function gameDenied(reason) {
    console.log('game denied: ' + reason);
  }

  function placePiece(move, piece) {
    switch (move.row) {
      case 0:
        $scope.gameData.topRow[move.col] = piece;
        break;
      case 1:
        $scope.gameData.middleRow[move.col] = piece;
        break;
      case 2:
        $scope.gameData.bottomRow[move.col] = piece;
        break;
    }
  }

  $scope.setNick = function(nick) {
    socketService.setNick(nick);
    $scope.ourNick = nick;
  }
  
  $scope.makeMove = function(box) {
    if ($scope.gameData.ourTurn) {
      socketService.sendMove({
        col: box[1],
        row: box[0],
        to: $scope.gameData.theirID,
        gameID: $scope.gameData.gameID
      });

      placePiece({col: box[1], row: box[0]}, $scope.gameData.ourPiece);

      $scope.gameData.ourTurn = false;
    }
  }

  $scope.startNewGame = function(player) {
    socketService.newGame(player);
  }


});