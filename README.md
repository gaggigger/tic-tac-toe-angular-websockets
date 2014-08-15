tic-tac-toe
===========

This is an extension to the simple [tic-tac-toe](https://github.com/vitosamson/tic-tac-toe) game I wrote previously.

It communicates via websockets with a backend I wrote in node.js. The backend can be found [here](https://github.com/vitosamson/tic-tac-api).

The following socket events are recognized:
  - game -> api
    - connect
    - set nickname
    - new game
    - send move
  - api -> game
    - connect ack (sends back player ID)
    - move (move data from other player)
    - 
