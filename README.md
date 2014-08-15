tic-tac-toe
===========

This is an extension to the simple [tic-tac-toe](https://github.com/vitosamson/tic-tac-toe) game I wrote previously.

It communicates via websockets with a backend I wrote in node.js. The backend can be found [here](https://github.com/vitosamson/tic-tac-api).

The following socket events are utilized:
  - game -> api
    - connect
    - set nickname
    - new game
    - send move
  - api -> game
    - connect ack (sends back player ID)
    - ack nick (nickname uniqueness validation)
    - game started (sends game ID, piece data, opponent data)
    - move (move data from opponent)
    - game over (who won)
    - game denied (probably can be removed, along with allowing the user to manually enter a player ID)
    - player list (player IDs, nicks and availability)
