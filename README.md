# Spaceship Battle and Hunting!  
A fun multiplayer browser-based online spaceship-themed game using [React](https://github.com/facebook/react) as frontend, [Node.js](https://github.com/nodejs/node) as backend, [Firebase](https://firebase.google.com) as cloud database and [SockJS](http://sockjs.org) for realtime communication. We also used [redux-firestore](https://github.com/prescottprue/redux-firestore) for accessing data easily.     
## Live demo  
 :point_right: https://asteroidandspaceshipgame.tk  
(:tada: Enjoy **hunt** mode, :disappointed: **battle** mode isn't yet deployed but can be run locally)  
## Features  
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/register.png" width=30% height=30%>&nbsp;&emsp;&emsp;
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/login.png" width=30% height=30%>&nbsp;&emsp;&emsp;
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/profile.png" width=30% height=30%>&nbsp;&emsp;&emsp;
In this game, user can **register** and **log** in and create customized personal **profile** (including avatar, bio and spaceship color) and check other player's profile.  
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/modeChoose.png" width=30% height=30%>&nbsp;&emsp;&emsp;
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/huntBegin.png" width=30% height=30%>&nbsp;&emsp;&emsp;
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/huntOn.png" width=30% height=30%>&nbsp;&emsp;&emsp;
**Hunt**: user plays himself and try to hunt as many points as possible in one minutes by getting fuels and shooting asteroids.   
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/waitingRoom.png" width=30% height=30%>&nbsp;&emsp;&emsp;
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/battleOn.png" width=30% height=30%>&nbsp;&emsp;&emsp;
<img src="https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game/blob/master/result/battleEnd.png" width=30% height=30%>&nbsp;&emsp;&emsp;
**Battle**: user joins game with another player and try to beat each other in one minute.
## Install and Run  
```
git clone https://github.com/ziliHarvey/Online-Spaceship-Battle-and-Hunting-Game  
cd Online-Spaceship-Battle-and-Hunting-Game/  
```
Configure firebase apikey in store.js as [firebase config setup](https://firebase.google.com/docs/web/setup) instructed
```
npm install  
npm start
```  
Open another terminal to launch websocket server  
```
cd cd Online-Spaceship-Battle-and-Hunting-Game/src/websocket/  
node server.js
```  
## Contributors
[Zi Li](https://github.com/ziliHarvey) &emsp;&emsp; [Tianyi Xie](https://github.com/tinamyosotis)  
## Reference  
http://codepen.io/bungu/pen/rawvJe  
https://github.com/chriz001/Reacteroids  
https://www.udemy.com/react-front-to-back  
https://truongtx.me/2014/06/07/simple-chat-application-using-sockjs  

