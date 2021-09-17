# Pictionary-V2
A multiplayer online game of Pictionary, updated with new features from V1.
## Tech stack:
* Frontend: TypeScript, React, Material-UI
* Backend: Node.js, Express.js, Socket.io
### Verson 2.0.0: 
This product is a complete rewrite of [Pictionary V1](https://github.com/KirollosBotros/Pictionary). An updated stack has been used to rearchetect the whole application. The following are the more notable changes made from a development view:
* Use of TypeScript for better error catching during development
* Material-UI to style the application and allow for mobile compatibility via breakpoints
* A transition from React class-based components to functional components (includes the use of Hooks)
* A new REST API on the server made with Express to securely authenticate passwords, and handle game data requests
#### Latest Feaures in V 2.0.0
* Public and Private room support with passwords
* Mobile compatibility
* Updated UI with easier to use and understand layout
* Updated drawing canvas with faster response times
* Automatic disconnection handling and empty room cleanup
* New score system with leaderboard
* New chat to guess words in and see guesses from other players in real time
* Better handling of asynchronous server calls