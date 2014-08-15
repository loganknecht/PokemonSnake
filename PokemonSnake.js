//TO DO: ask Dr. Palmer about how to get access to object properties when declared in different functions
//Then ask for tips on how to code in javascript because I'm pretty sure I'm doing it wrong

//TO DO: Make is to that you can be directly next to balls on turn, make sure to account for the offset of the ball trail
//TO DO: balls added to field need to be checked for mine overlap 

function Game() {
	
	//code I ripped from the internet, uses browsers to enhance syncing of loop
	window.requestAnimationFrame = (function(){
    	return  window.requestAnimationFrame       || 
        	window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000/60);
            };
    })();

	//ripped and modified from generic snake game
    window.addEventListener('keydown', function(e) {
		if(gameMode === 0) {
			if(startMenuEnterPressed === false) {
				if(e.keyCode === 13) {
					startMenuEnterPressed = true; 
				}
			}
			else {
				//if esc or shift is pressed return to press enter menu
				if(e.keyCode === 27 || e.keyCode === 16) {
					startMenuEnterPressed = false;
				}
				//enter pressed
				else if(e.keyCode === 13) {
					playerOne = new Player();
					playerOne.direction = 0;
					playerOne.xPos = canvas.width/2 - playerOne.width/2;
					playerOne.yPos = arenaHeight-playerOne.height;
					playerOne.playerImage.setCurrentStartEndFrame(10, 10, 14);

					//var i = 0;
					//while(i < 30) {
						//playerOne.collectedBalls.push(new CollectedPokeball(0, 0));
						//playerOne.score += 100;
						//i++;
					//}

					//set classic mode variables
					if(highlightChoice === 0) {
						playerOne.playerImage.frameLength = 1;
						delayTrackerMax = 5;
						playerOne.speed = 16;
						gameType = 0;
					}
					//set modern mode variables
					else if(highlightChoice === 1) {
						playerOne.playerImage.frameLength = 8;
						delayTrackerMax = 0;
						playerOne.speed = 3;
						gameType = 1;
					}
					level = 0;
					mines = [];
					gameMode = 1;
				}
				//a or left key pressed
				else if(e.keyCode === 37 || e.keyCode === 65) {
					if(highlightChoice === 0) {
						highlightChoice = 1;
					}
					else if(highlightChoice === 1) {
						highlightChoice = 0;
					}
				}
				//d or right key
				else if(e.keyCode === 39 || e.keyCode === 68) {
					if(highlightChoice === 0) {
						highlightChoice = 1;
					}
					else if(highlightChoice === 1) {
						highlightChoice = 0;
					}
				}
			}
		}
		else if(gameMode === 1) { 
			// Up or W
        	if (e.keyCode === 38 || e.keyCode == 87) {
				if(playerOne.direction !== 2 && playerOne.direction !== 0) {
					playerOne.direction = 0;
					playerOne.playerImage.setCurrentStartEndFrame(10, 10, 14);
				}
        	}
			// Right or D
	   		else if (e.keyCode === 39 || e.keyCode === 68) {
				if(playerOne.direction !== 3 && playerOne.direction !== 1) {
					playerOne.direction = 1;
					playerOne.playerImage.setCurrentStartEndFrame(15, 15, 19);
				}
        	}
			// Down or S
	    	else if (e.keyCode === 40 || e.keyCode === 83) {
				if(playerOne.direction !== 0 && playerOne.direction !== 2) {
					playerOne.direction = 2;
					playerOne.playerImage.setCurrentStartEndFrame(0, 0, 4);
				}
        	}
			// Left or A
	   		else if (e.keyCode === 37 || e.keyCode === 65) {
				if(playerOne.direction !== 1 && playerOne.direction !== 3) {
					playerOne.direction = 3;
					playerOne.playerImage.setCurrentStartEndFrame(5, 5, 9);
				}
        	}
			//Enter for pause and unpaused
			else if(e.keyCode === 13) {
				if(gamePaused) {
					gamePaused = false;
				}
				else {
					gamePaused = true;
				}
			}
		}
		else if(gameMode === 2) {
			if(e.keyCode === 13) {
				//try again
				if(highlightChoice === 0) {
					playerOne = new Player();
					playerOne.direction = 0;
					playerOne.xPos = canvas.width/2 - playerOne.width/2;
					playerOne.yPos = arenaHeight-playerOne.height;
					playerOne.playerImage.setCurrentStartEndFrame(10, 10, 14);
					mines = [];

					if(gameType === 0) {
						playerOne.playerImage.frameLength = 1;
						delayTrackerMax = 5;
						playerOne.speed = 16;
					}
					else if(gameType === 1) {
						playerOne.playerImage.frameLength = 8;
						delayTrackerMax = 0;
						playerOne.speed = 3;
					}

					level = 0;
					gameMode = 1;
				}
				//back to menu
				else if(highlightChoice === 1) {
					gameMode = 0;
				}
			}
			//a or left key pressed
			else if(e.keyCode === 37 || e.keyCode === 65) {
				if(highlightChoice === 0) {
					highlightChoice = 1;
				}
				else if(highlightChoice === 1) {
					highlightChoice = 0;
				}
			}
			//d or right key
			else if(e.keyCode === 39 || e.keyCode === 68) {
				if(highlightChoice === 0) {
					highlightChoice = 1;
				}
				else if(highlightChoice === 1) {
					highlightChoice = 0;
				}
			}
		}
    });
	//---------end ripped code---------------------
	
	//Grabs the canvas element and creates a context object from it
	var canvas = document.getElementById('gameCanvas');
	canvas.width = 800;
	canvas.height = 600;
	var context = canvas.getContext('2d');

	//---------------Audio Import Handled Here-------------
	
	//-----------------------------------------------------

	//------------OBJECTS AND VARS GO HERE-----------------
	//gameType: 0 - classic, 1 - modern
	var gameType = 0;
	var arenaWidth = canvas.width;
	var arenaHeight = Math.round(canvas.height*.9);
	var playerOne = new Player();
	var gamePaused = false;

	playerOne.direction = 0;
	playerOne.xPos = canvas.width/2 - playerOne.width/2;
	playerOne.yPos = canvas.height - playerOne.height;
	playerOne.playerImage.setCurrentStartEndFrame(10, 10, 14);

	var mines = [];
	var level = 0;
	var pokeball = new Pokeball(canvas.width/2 - 8, canvas.height/2 - 8); 
	var delayTracker = 0;
	var delayTrackerMax = 0;

	//Represents play mode: 0 - title screen, 1 - game mode, 2 - game over screen
	var gameMode = 0;

	var grassBackground = new Image();
	grassBackground.src = 'Images/grassBackground.jpg';

	//-------------TITLE SCREEN OBJECTS GO HERE--------------
	var highlightTimer = 0;
	var highlightMax = 40;
	var highlightChoice = 0;
	var startMenuEnterPressed = false;

	var titleLogo = new Image();	
	titleLogo.src = 'Text/pokemonLogo.jpg';
	//Snake! - 198x80
	var titleSnakeLogo = new Image();	
	titleSnakeLogo.src = 'Text/SnakeLowerCaseTextColor.png';	
	//Press Enter! - 250x50
	var pressEnter = new Image();	
	pressEnter.src = 'Text/PressEnterLowerCaseTextColor.png';	
	//Classic Mode - 225x53
	var classicModeText = new Image();
	classicModeText.src = 'Text/ClassicModeLowerCaseTextColor.png';	
	//Modern Mode - 240x58
	var modernModeText = new Image();
	modernModeText.src = 'Text/ModernModeLowerCaseTextColor.png';	

	//-------------------------------------------------------
	
	//----------------GAME SCREEN OBJECTS GO HERE------------
	//32x64
	var jessieImage = new Image();
	jessieImage.src = 'Images/JessieExtraSmall.png';
	//32x64
	var jamesImage = new Image();
	jamesImage.src = 'Images/JamesExtraSmall.png';
	//32x32
	var meowthImage = new Image();
	meowthImage.src = 'Images/MeowthSmall.png';

	//125x51
	var levelText = new Image();
	levelText.src = 'Text/LevelLowerCaseTextColor.png';
	//134x47
	var scoreText = new Image();
	scoreText.src = 'Text/ScoreLowerCaseTextColor.png';
	//426x85
	var gamePausedText = new Image();
	gamePausedText.src = 'Text/GamePausedText.png';
	//800x600
	var gamePausedBackground = new Image();
	gamePausedBackground.src = 'Images/pausedBackground.png';
	//-------------------------------------------------------
	
	//--------------GAME OVER SCREEN OBJECTS GO HERE---------
	var GameOverText = new Image();
	GameOverText.src = 'Text/GameOverLowerCaseText.png';
	var TryAgainText = new Image();
	TryAgainText.src = 'Text/TryAgainLowerCaseTextColor.png';
	var BackToMenuText = new Image();
	BackToMenuText.src = 'Text/BackTosStartMenu.png';
	//-------------------------------------------------------

	//------------GAME FUNCTION CALLS GO HERE----------------- 
	//requests the animation using the game loops, synced via the browser
	requestAnimationFrame(gameLoop);
	//-----------------------------------------------------

	//------------FUNCTIONS GO HERE-----------------
	function gameLoop() {
		
		if(gameMode === 0) {
			updateTitleScreen();
			drawTitleScreen();
		}	
		else if(gameMode === 1) {
			if(gamePaused === false) {
				if(delayTracker < delayTrackerMax) {
					delayTracker++;
				}	
				else {
					delayTracker = 0;
					updateGame();
				}
				drawGame();
			}
			//paused
			else {
				drawGame();
				drawPauseScreen();
			}
		}	
		else if(gameMode === 2) {
			updateGameOverScreen();
			drawGameOverScreen();
		}

		//ripped code loop sync, allows for better loops
		requestAnimationFrame(gameLoop);
		//end ripped code
	};

	function updateTitleScreen() {
		highlightTimer++;
	};

	function updateGame() {
		//player updates
		playerOne.update(arenaWidth, arenaHeight);
		
		//checks to add new pokeball on collision for picking up
		var collisionCheck = pokeball.checkForCollisionWithPlayer(playerOne, arenaWidth, arenaHeight); 
		if(collisionCheck) {
			playerOne.score += 100;
			collisionCheck = false;

			while(pokeball.checkForCollisionWithPlayer(playerOne, arenaWidth, arenaHeight)) {
				if(playerOne.collectedBalls.length >= 1) {
					var lastBallXPos = playerOne.collectedBalls[playerOne.collectedBalls.length-1].xPos;
					var lastBallYPos = playerOne.collectedBalls[playerOne.collectedBalls.length-1].yPos;
	
					var newBall = new CollectedPokeball(lastBallXPos, lastBallYPos);
				}
				else {
					var newBall = new CollectedPokeball(playerOne.xPos, playerOne.yPos);
				}

				
				pokeball = new Pokeball(Math.round(Math.random()*(arenaWidth/16))*16, Math.round(Math.random()*(arenaHeight/16))*16); 
			}

			playerOne.collectedBalls.push(newBall);

			var newMineProb = Math.random();

			//alert(newMineProb);
			if(newMineProb > .5) {
				mines = addNewMine(mines);
			}
		}

		//pokeball updates
		pokeball.update();

		//
		//checks for player mine collision end game
		for(i = 0; i < mines.length; i++) {
			if(mines[i].checkForCollisionWithPlayer(playerOne)) {
				gameMode = 2;
			}
		}

		//manages scores
		if(gameType === 0) {
			//playerOne.playerImage.frameLength = 1;
			//delayTrackerMax = 5;
			//playerOne.speed = 16;
			
			if(playerOne.score >= 1000 && playerOne.score < 2000) {
				level = 1;
				delayTrackerMax = 4;
			}
			else if(playerOne.score >= 2000 && playerOne.score < 3000) {
				level = 2;
				delayTrackerMax = 3;
			}
			else if(playerOne.score >= 3000 && playerOne.score < 4000) {
				level = 3;
				delayTrackerMax = 2;
			}
			else if(playerOne.score >= 4000 && playerOne.score < 5000) {
				level = 4;
				delayTrackerMax = 1;
			}
			else if(playerOne.score >= 5000) {
				level = 5;
				delayTrackerMax = 0;
			}
		}
		else if(gameType === 1) {
			//playerOne.playerImage.frameLength = 8;
			//delayTrackerMax = 0;
			//playerOne.speed = 3;
			
			if(playerOne.score >= 500 && playerOne.score < 1000) {
				level = 1;
				playerOne.speed=4;
			}
			else if(playerOne.score >= 1000 && playerOne.score < 1500) {
				level = 2;
			}
			else if(playerOne.score >= 1500 && playerOne.score < 2000) {
				level = 3;
				playerOne.speed=5;
			}
			else if(playerOne.score >= 2000 && playerOne.score < 2500) {
				level = 4;
			}
			else if(playerOne.score >= 2500 && playerOne.score < 3000) {
				level = 5;
				playerOne.speed=6;
			}
			else if(playerOne.score >= 3000 && playerOne.score < 3500) {
				level = 6;
			}
			else if(playerOne.score >= 3500 && playerOne.score < 4000) {
				level = 7;
				playerOne.speed=7;
			}
			else if(playerOne.score >= 4000 && playerOne.score < 4500) {
				level = 8;
			}
			else if(playerOne.score >= 4500 && playerOne.score < 5000) {
				level = 9;
				playerOne.speed=8;
			}
		}
	};

	function updateGameOverScreen() {
	};

	function drawTitleScreen() {
		context.clearRect(0,0,canvas.width, canvas.height);

		//creates the border around the game
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.strokeRect(0,0, canvas.width, canvas.height);

		//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
		//draws the title screen logo
		context.drawImage(titleLogo, 0, 0, 281, 117, canvas.width/4, canvas.height/8, ((canvas.width-canvas.width/4)-canvas.width/4), ((canvas.height-canvas.height/4)-canvas.height/4));
		//Snake!
		context.drawImage(titleSnakeLogo, 0, 0, 198, 80, canvas.width/2.5, canvas.height/2, canvas.width/4, canvas.height/7);
		//Press Enter!
		if(startMenuEnterPressed === false) {
			if(highlightTimer < highlightMax) {
				context.drawImage(pressEnter, 0, 0, 250, 50, canvas.width/2.75, canvas.height/1.35, 250, 50);
			}
			else if(highlightTimer >= highlightMax && highlightTimer < highlightMax*1.5) {
				//don't draw the option
			}
			else {
				//reset delay tracker
				highlightTimer = 0;
			}
		}
		//Enter was press and choices are shown
		else {
			highlightTimer++;
			if(highlightTimer < highlightMax) {
				//classic mode highlighted
				if(highlightChoice === 0) {
					context.drawImage(classicModeText, 0, 0, 225, 53, canvas.width/7, canvas.height/1.35, 225, 53);
				}
				//modern mode highlighted
				else if(highlightChoice === 1){
					context.drawImage(modernModeText, 0, 0, 240, 58, canvas.width/1.8, canvas.height/1.35, 240, 58);
				}
			}
			else if(highlightTimer >= highlightMax && highlightTimer < highlightMax*1.5) {
				//again don't show delay
			}
			else {
				//reset delay tracker
				highlightTimer = 0;
			}
			//the choices to be drawn steadily
			//classic mode highlighted
			if(highlightChoice === 0) {
				context.drawImage(modernModeText, 0, 0, 240, 58, canvas.width/1.8, canvas.height/1.35, 240, 58);
			}
			//modern mode highlighted
			else if(highlightChoice === 1) {
				context.drawImage(classicModeText, 0, 0, 225, 53, canvas.width/7, canvas.height/1.35, 225, 53);
			}
		}
	};

	function drawPauseScreen() {
		//context.clearRect(0,0,canvas.width, canvas.height);
		//pause background
		context.drawImage(gamePausedBackground, 0, 0, 800, 600, 0, 0, arenaWidth, arenaHeight);
		//Paused Game Text
		context.drawImage(gamePausedText, 0, 0, 426, 85, canvas.width*.25, canvas.height*.35, 426, 85);
	}
	
	function drawGame() {
		//sx - source image start grab, sWidth is width of grab
		//sy - source image start grab, sHeight is height of grab
		//dx, dy - destination spot to draw
		//dWidth, dHeight - destination draw
		//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
		
		//pause condition fix
		context.clearRect(0,0,canvas.width, canvas.height);

		//creates the border around the game
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.strokeRect(0,0, arenaWidth, arenaHeight);
		context.strokeRect(0,0, canvas.width, canvas.height);
		
		//grass backgroud
		context.drawImage(grassBackground, 0, 0, 800, 600, 0, 0, arenaWidth, arenaHeight);

		//draws score 
		context.drawImage(scoreText, 0, 0, 100, 29, canvas.width*.2, canvas.height*.92, canvas.width*.1, canvas.height*.05);
		context.font = "32pt Arial";
		context.fillText(playerOne.score, canvas.width*.32, canvas.height*.97);

		//draws level
		context.drawImage(levelText, 0, 0, 95, 35, canvas.width*.7, canvas.height*.92, canvas.width*.1, canvas.height*.05);
		context.fillText(level, canvas.width*.82, canvas.height*.97);

		//draws pokeball
		context.drawImage(pokeball.pokeballImage.spriteImage, pokeball.pokeballImage.sourceDrawX, pokeball.pokeballImage.sourceDrawY, pokeball.width, pokeball.height, pokeball.xPos, pokeball.yPos, pokeball.width, pokeball.height);
		
		//mines
		for(i =0; i < mines.length; i++) {
			if(mines[i].mineType === 0) {
				context.drawImage(jessieImage, 0, 0, mines[i].width, mines[i].height, mines[i].xPos, mines[i].yPos, mines[i].width, mines[i].height);
			}
			else if(mines[i].mineType === 1) {
				context.drawImage(jamesImage, 0, 0, mines[i].width, mines[i].height, mines[i].xPos, mines[i].yPos, mines[i].width, mines[i].height);
			}
			else if(mines[i].mineType === 2) {
				context.drawImage(meowthImage, 0, 0, mines[i].width, mines[i].height, mines[i].xPos, mines[i].yPos, mines[i].width, mines[i].height);
			}
		}

		if(playerOne.direction === 0) {
			//draws player
			context.drawImage(playerOne.playerImage.spriteImage, playerOne.playerImage.sourceDrawX, playerOne.playerImage.sourceDrawY, playerOne.width, playerOne.height, playerOne.xPos, playerOne.yPos, playerOne.width, playerOne.height);
		}

		if(playerOne.direction !== 0) {
			//draws the collected balls
			for(i = playerOne.collectedBalls.length-1; i >= 0 ; i--) {
				//player.collectedBalls[i]
				context.drawImage(playerOne.collectedBalls[i].image.spriteImage, playerOne.collectedBalls[i].image.sourceDrawX, playerOne.collectedBalls[i].image.sourceDrawY, playerOne.collectedBalls[i].width, playerOne.collectedBalls[i].height, playerOne.collectedBalls[i].xPos, playerOne.collectedBalls[i].yPos, playerOne.collectedBalls[i].width, playerOne.collectedBalls[i].height);
			}
		}
		else {
			//draws the collected balls
			for(i = 0; i < playerOne.collectedBalls.length; i++) {
				//player.collectedBalls[i]
				context.drawImage(playerOne.collectedBalls[i].image.spriteImage, playerOne.collectedBalls[i].image.sourceDrawX, playerOne.collectedBalls[i].image.sourceDrawY, playerOne.collectedBalls[i].width, playerOne.collectedBalls[i].height, playerOne.collectedBalls[i].xPos, playerOne.collectedBalls[i].yPos, playerOne.collectedBalls[i].width, playerOne.collectedBalls[i].height);
			}
		}
		
		//draws player over pokeballs
		if(playerOne.direction !== 0) {
			//draws player
			context.drawImage(playerOne.playerImage.spriteImage, playerOne.playerImage.sourceDrawX, playerOne.playerImage.sourceDrawY, playerOne.width, playerOne.height, playerOne.xPos, playerOne.yPos, playerOne.width, playerOne.height);
		}
	};

	function drawGameOverScreen() {
		context.clearRect(0,0,canvas.width, canvas.height);

		//creates the border around the game
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.strokeRect(0,0, canvas.width, canvas.height);
	
		//Game Over	
		context.drawImage(GameOverText, 0, 0, 413, 99, canvas.width/6, canvas.height/6, ((canvas.width-canvas.width/8)-canvas.width/6), ((canvas.height-canvas.height/3)-canvas.height/3));

		//Score output
		context.drawImage(scoreText, 0, 0, 100, 29, canvas.width*.4, canvas.height*.55, canvas.width*.1, canvas.height*.05);
		context.font = "32pt Arial";
		context.fillText(playerOne.score, arenaWidth*.52, arenaHeight*.67);

		highlightTimer++;
		if(highlightTimer < highlightMax) {
			if(highlightChoice === 0) {
				context.drawImage(TryAgainText, 0, 0, 185, 57, canvas.width/7, canvas.height/1.35, 185, 57);
			}
			else if(highlightChoice === 1){
				context.drawImage(BackToMenuText, 0, 0, 204, 85, canvas.width/1.8, canvas.height/1.35, 204, 85);
			}
		}
		else if(highlightTimer >= highlightMax && highlightTimer < highlightMax*1.5) {
			//again don't show delay
		}
		else {
			//reset delay tracker
			highlightTimer = 0;
		}
		if(highlightChoice === 0) {
			context.drawImage(BackToMenuText, 0, 0, 204, 85, canvas.width/1.8, canvas.height/1.35, 204, 85);
		}
		else if(highlightChoice === 1) {
			context.drawImage(TryAgainText, 0, 0, 185, 57, canvas.width/7, canvas.height/1.35, 185, 57);
		}
	};
	
	function AnimatedImage(defaultImageName, fWidth, fHeight, imgWidth, imgHeight) {
		//drawRectangle.X = (currentFrame % columns) * (int)frameSize.X;
        //drawRectangle.Y = (currentFrame / columns) * (int)frameSize.Y;
			
		this.currentFrame = 0;
		this.startFrame = 0;
		this.endFrame = 4;

		this.frameTracker = 0;
		this.frameLength = 8;

		this.frameWidth = fWidth;
		this.frameHeight = fHeight;

		this.imageWidth = imgWidth;
		this.imageHeight = imgHeight;

		this.imageColumns = this.imageWidth/this.frameWidth;
		this.imageRows = this.imageHeight/this.frameHeight;

		this.sourceDrawX = Math.floor((this.currentFrame%this.imageColumns)) * this.frameWidth;
		this.sourceDrawY = Math.floor((this.currentFrame/this.imageColumns)) * this.frameHeight;

   		this.spriteImage = new Image();
		this.spriteImage.src = defaultImageName;

		this.pauseAnimation = false;

		this.setCurrentStartEndFrame = function(newCurrent, newStart, newEnd) {
			this.currentFrame = newCurrent;
			this.startFrame = newStart;
			this.endFrame = newEnd;
		};

		//Manages the current frame for the image
		this.updateImage = function() {
			this.frameTracker++;
			if(this.frameTracker > this.frameLength && this.pauseAnimation === false) {
				this.frameTracker = 0;
				this.currentFrame++;
				if(this.currentFrame > this.endFrame) {
					this.currentFrame = this.startFrame;
				}
			}

			this.sourceDrawX = Math.floor((this.currentFrame%this.imageColumns)) * this.frameWidth;
			this.sourceDrawY = Math.floor((this.currentFrame/this.imageColumns)) * this.frameHeight;
			//alert("Current Frame: " + this.currentFrame + "\nX source: " + this.sourceDrawX +"\nY source: " + this.sourceDrawY);
		};
	};

	function Player() {
		//Handles player's top left position
		this.xPos = 0;
		this.yPos = 0;

		this.width = 24;
		this.height = 30;

		//0 - up, 1 - right, 2 - down, 3 - left
		this.direction = 0;

		//how fast the player moves
		this.speed = 4;

		//player Score
		this.score = 0;
		this.collectedBalls = [];

		//Handles the players image
		this.playerImage = new AnimatedImage('Images/playerSpriteRefined.png', this.width, this.height, 120, 120);

		this.update = function(arenaWidth, arenaHeight) {
			this.playerImage.updateImage();

			var oldPlayerX = this.xPos+4;
			var oldPlayerY = this.yPos+7;

			this.updatePlayerMovement();
			this.updateCollectedBalls(oldPlayerX, oldPlayerY);

			this.checkAndFixPlayerArenaBounds(arenaWidth, arenaHeight);

			//handles image updating for collected balls
			for(i = 0; i < this.collectedBalls.length; i++) {
				this.collectedBalls[i].update();
			}

			if(this.checkForTailCollision()) {
				gameMode = 2;
			}
		};

		this.updatePlayerMovement = function() {
			//handles up and down movement
			switch(this.direction) {
				case 0:
					this.yPos -= this.speed;
					break;
				case 1:
					this.xPos += this.speed;
					break;
				case 2:
					this.yPos += this.speed;
					break;
				case 3:
					this.xPos -= this.speed;
					break;
				default:
					alert("Reached update player movement default");
			}
		};
		
		//Checks the bounding against the arena, used for player death
		this.checkAndFixPlayerArenaBounds = function(arenaWidth, arenaHeight) {
			if(this.xPos < 0) {
				this.xPos = 0;
				gameMode = 2;
			}	
			else if(this.yPos < 0) {
				this.yPos = 0;
				gameMode = 2;
			}	
			else if(this.xPos > arenaWidth - this.width) {
				this.xPos = arenaWidth - this.width;
				gameMode = 2;
			}	
			else if(this.yPos > arenaHeight - this.height) {
				this.yPos = arenaHeight - this.height;
				gameMode = 2;
			}	
		};

		this.updateCollectedBalls = function(oldPlayerX, oldPlayerY) {
			var prevBallXPos = 0;
			var prevBallYPos = 0;

			var newPrevBallXPos = 0;
			var newPrevBallYPos = 0;
			
			for(i = 0; i < this.collectedBalls.length; i++) {
				if(i === 0) {
					prevBallXPos = this.collectedBalls[i].xPos;
					prevBallYPos = this.collectedBalls[i].yPos;
					
					this.collectedBalls[i].xPos = oldPlayerX;
					this.collectedBalls[i].yPos = oldPlayerY;
				}		
				else {
					newPrevBallXPos = this.collectedBalls[i].xPos;
					newPrevBallYPos = this.collectedBalls[i].yPos;

					this.collectedBalls[i].xPos = prevBallXPos;
					this.collectedBalls[i].yPos = prevBallYPos;

					prevBallXPos = newPrevBallXPos;
					prevBallYPos = newPrevBallYPos;
				}
			}
		}

		this.checkForTailCollision = function() {
			if(gameType === 0) {
				var i = 3;
			}
			else if(gameType === 1) {
				var i = 15;
			}

			for(i; i < this.collectedBalls.length; i++) {
				//left side of ball hit
				if(this.collectedBalls[i].xPos > this.xPos && this.collectedBalls[i].xPos < this.xPos+this.width) {
					//top side of ball hit
					if(this.collectedBalls[i].yPos > this.yPos && this.collectedBalls[i].yPos < this.yPos+this.height) {
						return true;
					}
					//bottom side of ball hit
					if(this.collectedBalls[i].yPos+this.collectedBalls[i].height > this.yPos && this.collectedBalls[i].yPos+this.collectedBalls[i].height < this.yPos+this.height) {
						return true;
					}
				}
				//right side of ball hit
				if(this.collectedBalls[i].xPos+this.collectedBalls[i].width > this.xPos && this.collectedBalls[i].xPos+this.collectedBalls[i].width < this.xPos+this.width) {
					//top side of ball hit
					if(this.collectedBalls[i].yPos > this.yPos && this.collectedBalls[i].yPos < this.yPos+this.height) {
						return true;
					}
					//bottom side of ball hit
					if(this.collectedBalls[i].yPos+this.collectedBalls[i].height > this.yPos && this.collectedBalls[i].yPos+this.collectedBalls[i].height < this.yPos+this.height) {
						return true;
					}
				}
				//top side of ball hit
				if(this.collectedBalls[i].yPos > this.yPos && this.collectedBalls[i].yPos < this.yPos+this.height) {
					//left side of ball hit
					if(this.collectedBalls[i].xPos > this.xPos && this.collectedBalls[i].xPos < this.xPos+this.width) {
						return true;
					}
					//right side of ball hit
					if(this.collectedBalls[i].xPos+this.collectedBalls[i].width > this.xPos && this.collectedBalls[i].xPos+this.collectedBalls[i].width < this.xPos+this.width) {
						return true;
					}
				}
				//bottom side of ball hit
				if(this.collectedBalls[i].yPos+this.collectedBalls[i].height > this.yPos && this.collectedBalls[i].yPos+this.collectedBalls[i].height < this.yPos+this.height) {
					//left side of ball hit
					if(this.collectedBalls[i].xPos > this.xPos && this.collectedBalls[i].xPos < this.xPos+this.width) {
						return true;
					}
					//right side of ball hit
					if(this.collectedBalls[i].xPos+this.collectedBalls[i].width > this.xPos && this.collectedBalls[i].xPos+this.collectedBalls[i].width < this.xPos+this.width) {
						return true;
					}
				}
			}
		}
	};

	//This is the pokeball to be collected, may change to pokemon depending on my follow through/concern
	function Pokeball(initialXPos, initialYPos) {
		//Handles pokeballs's top left position
		this.xPos = initialXPos;
		this.yPos = initialYPos;

		this.width = 16;
		this.height = 16;

		this.pokeballImage = new AnimatedImage('Images/pokeball.png', this.width, this.height, 64, 16); 
		this.pokeballImage.setCurrentStartEndFrame(0, 0, 3);

		this.update = function() {
			this.pokeballImage.updateImage();
		};

		//Checks if player hit the ball and then moves to a new location on the map
		//arenaWidth/arenaHeight are for changing the ball location, you have to
		//manually account for clipping by subtracting with and height from 
		//arena width and height
		this.checkForCollisionWithPlayer = function(player, arenaWidth, arenaHeight) {
			//left side of ball hit
			if(this.xPos >= player.xPos && this.xPos <= player.xPos+player.width) {
				//top side of ball hit
				if(this.yPos >= player.yPos && this.yPos <= player.yPos+player.height) {
					return true;
				}
				//bottom side of ball hit
				if(this.yPos+this.height >= player.yPos && this.yPos+this.height <= player.yPos+player.height) {
					return true;
				}
			}
			//right side of ball hit
			if(this.xPos+this.width >= player.xPos && this.xPos+this.width <= player.xPos+player.width) {
				//top side of ball hit
				if(this.yPos >= player.yPos && this.yPos <= player.yPos+player.height) {
					return true;
				}
				//bottom side of ball hit
				if(this.yPos+this.height >= player.yPos && this.yPos+this.height <= player.yPos+player.height) {
					return true;
				}
			}
			//top side of ball hit
			if(this.yPos >= player.yPos && this.yPos <= player.yPos+player.height) {
				//left side of ball hit
				if(this.xPos >= player.xPos && this.xPos <= player.xPos+player.width) {
					return true;
				}
				//right side of ball hit
				if(this.xPos+this.width >= player.xPos && this.xPos+this.width <= player.xPos+player.width) {
					return true;
				}
			}
			//bottom side of ball hit
			if(this.yPos+this.height >= player.yPos && this.yPos+this.height <= player.yPos+player.height) {
				//left side of ball hit
				if(this.xPos > player.xPos && this.xPos < player.xPos+player.width) {
					return true;
				}
				//right side of ball hit
				if(this.xPos+this.width >= player.xPos && this.xPos+this.width <= player.xPos+player.width) {
					return true;
				}
			}
		};
	};
	function CollectedPokeball(initialXPos, initialYPos) {
		//Handles pokeballs's top left position
		this.xPos = initialXPos;
		this.yPos = initialYPos;

		this.width = 16;
		this.height = 16;
		
		this.image = new AnimatedImage('Images/pokeball.png', this.width, this.height, 64, 16); 
		this.image.setCurrentStartEndFrame(0, 0, 3);

		this.update = function() {
			this.image.updateImage();
		};

		this.updateNewPosition = function(newXPos, newYPos) {
			this.xPos = newXPos;
			this.yPos = newYPos;
		};
	};

	function Mine() {
		//should be randomly seeded
		this.xPos = (Math.round((Math.random()*16)*(Math.random()*(arenaWidth/16))));
		this.yPos = (Math.round((Math.random()*16)*(Math.random()*(arenaHeight/16))));

		//randomly selects the type 0 - Jessie, 1 - James, 2 -Meowth
		this.mineType = (Math.round(Math.random()*2));

		//jessie/james
		if(this.mineType === 0 || this.mineType === 1) {
			this.width = 16;
			this.height = 32;
		}
		//meowth
		else {
			this.width = 32;
			this.height = 32;
		}

		this.generateNewPosition = function() {
			this.xPos = (Math.round((Math.random()*16)*(Math.random()*(arenaWidth/16))));
			this.yPos = (Math.round((Math.random()*16)*(Math.random()*(arenaHeight/16))));
		};

		this.checkForCollisionWithPlayer = function(player) {
			//left side of ball hit
			if(this.xPos >= player.xPos && this.xPos <= player.xPos+player.width) {
				//top side of ball hit
				if(this.yPos >= player.yPos && this.yPos <= player.yPos+player.height) {
					return true;
				}
				//bottom side of ball hit
				if(this.yPos+this.height >= player.yPos && this.yPos+this.height <= player.yPos+player.height) {
					return true;
				}
			}
			//right side of ball hit
			if(this.xPos+this.width >= player.xPos && this.xPos+this.width <= player.xPos+player.width) {
				//top side of ball hit
				if(this.yPos >= player.yPos && this.yPos <= player.yPos+player.height) {
					return true;
				}
				//bottom side of ball hit
				if(this.yPos+this.height >= player.yPos && this.yPos+this.height <= player.yPos+player.height) {
					return true;
				}
			}
			//top side of ball hit
			if(this.yPos >= player.yPos && this.yPos <= player.yPos+player.height) {
				//left side of ball hit
				if(this.xPos >= player.xPos && this.xPos <= player.xPos+player.width) {
					return true;
				}
				//right side of ball hit
				if(this.xPos+this.width >= player.xPos && this.xPos+this.width <= player.xPos+player.width) {
					return true;
				}
			}
			//bottom side of ball hit
			if(this.yPos+this.height >= player.yPos && this.yPos+this.height <= player.yPos+player.height) {
				//left side of ball hit
				if(this.xPos > player.xPos && this.xPos < player.xPos+player.width) {
					return true;
				}
				//right side of ball hit
				if(this.xPos+this.width >= player.xPos && this.xPos+this.width <= player.xPos+player.width) {
					return true;
				}
			}
			return false;
		};

		this.checkForCollisionWithOtherMines = function(mines) {
			for(i = 0; i < mines.length; i++) { 
				//left side of ball hit
				if(this.xPos >= mines[i].xPos && this.xPos <= mines[i].xPos+mines[i].width) {
					//top side of ball hit
					if(this.yPos >= mines[i].yPos && this.yPos <= mines[i].yPos+mines[i].height) {
						return true;
					}
					//bottom side of ball hit
					if(this.yPos+this.height >= mines[i].yPos && this.yPos+this.height <= mines[i].yPos+mines[i].height) {
						return true;
					}
				}
				//right side of ball hit
				if(this.xPos+this.width >= mines[i].xPos && this.xPos+this.width <= mines[i].xPos+mines[i].width) {
					//top side of ball hit
					if(this.yPos >= mines[i].yPos && this.yPos <= mines[i].yPos+mines[i].height) {
						return true;
					}
					//bottom side of ball hit
					if(this.yPos+this.height >= mines[i].yPos && this.yPos+this.height <= mines[i].yPos+mines[i].height) {
						return true;
					}
				}
				//top side of ball hit
				if(this.yPos >= mines[i].yPos && this.yPos <= mines[i].yPos+mines[i].height) {
					//left side of ball hit
					if(this.xPos >= mines[i].xPos && this.xPos <= mines[i].xPos+mines[i].width) {
						return true;
					}
					//right side of ball hit
					if(this.xPos+this.width >= mines[i].xPos && this.xPos+this.width <= mines[i].xPos+mines[i].width) {
						return true;
					}
				}
				//bottom side of ball hit
				if(this.yPos+this.height >= mines[i].yPos && this.yPos+this.height <= mines[i].yPos+mines[i].height) {
					//left side of ball hit
					if(this.xPos > mines[i].xPos && this.xPos < mines[i].xPos+mines[i].width) {
						return true;
					}
					//right side of ball hit
					if(this.xPos+this.width >= mines[i].xPos && this.xPos+this.width <= mines[i].xPos+mines[i].width) {
						return true;
					}
				}
			}
			return false;
		};
	};

	function addNewMine(mineArray) {
		var newMine = new Mine();
		
		while(newMine.checkForCollisionWithPlayer(playerOne) || newMine.checkForCollisionWithOtherMines(mineArray)) {
			newMine.generateNewPosition();
		}

		mineArray.push(newMine);

		return mineArray;
	};
};
