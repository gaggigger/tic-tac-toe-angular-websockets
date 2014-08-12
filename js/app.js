angular.module('ticTacToeApp', ['btford.socket-io'])

.factory('scoreService', function() {
  var score;
  return {
    loadScore: function() {
      score = JSON.parse(localStorage.getItem('score')) || {won: 0, lost: 0};
      return score;
    },
    saveScore: function() {
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
  // var url = 'ws://lit-anchorage-3918.herokuapp.com:80';
  var url = 'ws://localhost:5000';
  return {
    connect: function(callbacks) {
      ws = socketFactory({
        ioSocket: io.connect(url)
      });
      ws.on('connect ack', callbacks.connect);
      ws.on('move', callbacks.move);
      ws.on('game started', callbacks.gameStarted);
      ws.on('game over', callbacks.gameOver);
      ws.on('game denied', callbacks.gameDenied);
      ws.on('ack nick', callbacks.ackNick);
      ws.on('player list', callbacks.playerList);
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

.controller('gameController', function($scope, $filter, socketService, gameService, scoreService) {
  $scope.gameData;
  $scope.score = scoreService.loadScore();
  $scope.ourID;
  $scope.ourNick = null;
  $scope.badNick;
  $scope.badChallenge, $scope.badChallengeReason; 
  $scope.players = [];

  socketService.connect({
    connect: wsConnected,
    move: receiveMove,
    gameStarted: receiveNewGame,
    gameOver: gameOver,
    gameDenied: gameDenied,
    ackNick: ackNick,
    playerList: playerList
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
    $scope.gameData = gameService.new();
    $scope.gameData.ourPiece = game.ourPiece;
    $scope.gameData.theirPiece = game.theirPiece;
    $scope.gameData.theirNick = game.playerNick;
    $scope.gameData.theirID = game.playerId;
    $scope.gameData.ourTurn = game.ourTurn;
    $scope.gameData.gameID = game.game;

    $scope.badChallenge = false;
  }

  function gameOver(winner, stalemate) {
    $scope.gameData.gameOver = true;
    if (stalemate) $gameData.stalemate = true;
    if (winner === $scope.ourID) {
      $scope.gameData.winner = $scope.ourNick;
      $scope.gameData.won = true;
      $scope.score.won += 1;
      scoreService.saveScore();
    } else {
      $scope.gameData.lost = true;
      $scope.score.lost +=1;
      scoreService.saveScore();
    }
    console.log(winner);
  }

  function gameDenied(reason) {
    $scope.badChallenge = true;
    $scope.badChallengeReason = reason;
    console.log('game denied: ' + reason);
  }

  function ackNick(msg) {
    if (msg === 'good') {
      $scope.ourNick = $scope.nick;
      console.log('nick is good!');
      $scope.badNick = false;
    } else {
      console.log('nick is taken :(');
      $scope.badNick = true;
    }
  }

  function playerList(players) {
    $scope.players = [];
    angular.forEach(players, function(player, id) {
      $scope.players.push(player);
    });
    console.log($scope.players);
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
    // $scope.ourNick = nick;
  }
  
  $scope.makeMove = function(box) {
    if ($scope.gameData.ourTurn && !$scope.gameData.gameOver) {
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