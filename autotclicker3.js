////////////////////////////////////////////////////////////
// GAME v1.2
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//moles array
var mole_arr = [
	{src:'assets/mole_01.png', hurtSrc:'assets/mole_hurt.png', score:120, hit:1, bomb:false},
	{src:'assets/mole_02.png', hurtSrc:'assets/mole_hurt.png', score:1000, hit:1, bomb:false},
	{src:'assets/mole_03.png', hurtSrc:'assets/mole_hurt.png', score:180, hit:1, bomb:false},
	{src:'assets/mole_04.png', hurtSrc:'assets/mole_hurt.png', score:1000, hit:1, bomb:false},
	{src:'assets/mole_05.png', hurtSrc:'assets/mole_hurt.png', score:20, hit:2, bomb:false},
	{src:'assets/mole_06.png', hurtSrc:'assets/mole_hurt.png', score:200, hit:1, bomb:false},
	{src:'assets/bomb_01.png', hurtSrc:'assets/bomb_explode.png', score:0, hit:1, bomb:true},
	{src:'assets/bomb_02.png', hurtSrc:'assets/bomb_explode.png', score:0, hit:1, bomb:true},
];

//game settings
var gameSettings = {
	levels:[
		{
			target:500,
			hole:[0,1,2],
			mole:3,
			moleType:[0,1],
			moleSpeed:.2,
			molePunchSpeed:.2,
			moleDelay:[1,5],
			turnSpeed:[5,15],
			turnSwitch:[2,4]
		},
		{
			target:1000,
			hole:[0,1,2,3,6],
			mole:4,
			moleType:[0,1,2,6],
			moleSpeed:.2,
			molePunchSpeed:.2,
			moleDelay:[1,4],
			turnSpeed:[3,10],
			turnSwitch:[2,4]
		},
		{
			target:1800,
			hole:[0,1,2,3,4,5,6,7,8],
			mole:6,
			moleType:[0,1,2,3,4,6],
			moleSpeed:.2,
			molePunchSpeed:.2,
			moleDelay:[1,4],
			turnSpeed:[3,8],
			turnSwitch:[3,6]
		},
		{
			target:2500,
			hole:[0,1,2,3,4,5,6,7,8],
			mole:8,
			moleType:[0,1,2,3,4,5,6],
			moleSpeed:.2,
			molePunchSpeed:.2,
			moleDelay:[1,4],
			turnSpeed:[3,8],
			turnSwitch:[3,6]
		},
		{
			target:3000,
			hole:[0,1,2,3,4,5,6,7,8,9,10,11,12],
			mole:10,
			moleType:[0,1,2,3,4,5,6,7],
			moleSpeed:.1,
			molePunchSpeed:.2,
			moleDelay:[1,4],
			turnSpeed:[3,8],
			turnSwitch:[5,8]
		},
	],
	life:3,
	timerEnable:true,
	timer:60000
}

//game text display
var textDisplay = {
	life:'x [NUMBER]',
	timeUp:'Time\'s Up',
	gameOver:'Game Over',
	score:'+[NUMBER]PTS',
	exitTitle:'Exit Game',
	exitMessage:'Are you sure you want\nto quit game?',
	share:'Share your score:',
	resultTitle:'Game Over',
	resultDesc:'[NUMBER] PTS',
}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Whack A Mole is [SCORE]pts';//social share score title
var shareMessage = '[SCORE]pts is mine new highscore on Whack A Mole game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0};
var gameData = {paused:true, levelNum:0, nextLevel:false, totalMole:0, turn:[], turnIndex:0, turnSwitch:0, animating:false, moleSpeed:0, molePunchSpeed:0, moleDelay:[], mask:{w:200, h:300, y:-1}, holeMove:{distanceX:30, distanceY:5}};
var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0};
var tweenData = {score:0, tweenScore:0};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
    buttonStart.cursor = "pointer";
    buttonStart.addEventListener("click", function(evt) {
        playSound('soundButton');
        goPage('game');
    });

    // Auto-start the game by triggering the click event
    setTimeout(function() {
        buttonStart.click(); // Trigger the click on the button
    }, 500); // Adjust the delay if needed

    itemExit.addEventListener("click", function(evt) {
        // existing or future exit logic
    });
}
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});

	buttonLeaderboard.cursor = "pointer";
	buttonLeaderboard.addEventListener("click", function(evt) {
		share('leaderBoard');
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			
			playSound('soundResult');
			
			tweenData.tweenScore = 0;
			TweenMax.to(tweenData, .5, {tweenScore:playerData.score, overwrite:true, onUpdate:function(){
				resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', Math.floor(tweenData.tweenScore));
			}});

			saveGame(playerData.score);
			clearTimeout(window.leaderboardTimer); 
    window.leaderboardTimer = setTimeout(function() {
        // This simulates clicking the leaderboard button
        buttonLeaderboard.dispatchEvent(new Event("click"));
    }, 60000);
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.paused = false;
	gameData.created = false;
	gameData.nextLevel = false;
	gameData.levelNum = 0;
	gameData.life = gameSettings.life;

	playerData.score = 0;

	timerContainer.visible = false;
	if(gameSettings.timerEnable){
		timerContainer.visible = true;
		timeData.oldTimer = -1;
		timeData.countdown = gameSettings.timer;
		timerTxt.text = timerRedTxt.text = millisecondsToTimeGame(timeData.countdown);
		timerRedTxt.alpha = 0;
		toggleGameTimer(true);
	}
	updateGameLife();

	statusContainer.alpha = 0;

	setPosition();
	createHole();
	positionHole();
	setGameLevel();
	startInterval();
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
 function stopGame(){
	dirtContainer.removeAllChildren();
	scoreContainer.removeAllChildren();

	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	console.log("saveGame : ",score);
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}
	sendScore(score,3);

	// $.ajax({
  //     type: "POST",
  //     url: 'saveResults.php',
  //     data: {score:score},
  //     success: function (result) {
  //         console.log(result);
  //     }
  //   });
}

/*!
 * 
 * SET POSITION - This is the function that runs to set position
 * 
 */
function setPosition(){
	gameData.position = [];

	var centerX = canvasW/2;
	var centerY = canvasH/2 + 50;
	var distanceNumberX = 0;
	var distanceNumberY = 0;

	//middle
	distanceNumberX = 200;
	distanceNumberY = 0;
	gameData.position.push({x:centerX, y:centerY-distanceNumberY});
	gameData.position.push({x:centerX-distanceNumberX, y:centerY-distanceNumberY});
	gameData.position.push({x:centerX+distanceNumberX, y:centerY-distanceNumberY});

	//back
	distanceNumberX = 180;
	distanceNumberY = 140;
	gameData.position.push({x:centerX, y:centerY-distanceNumberY});
	gameData.position.push({x:centerX-distanceNumberX, y:centerY-distanceNumberY});
	gameData.position.push({x:centerX+distanceNumberX, y:centerY-distanceNumberY});

	//front
	distanceNumberX = 220;
	distanceNumberY = -140;
	gameData.position.push({x:centerX, y:centerY-distanceNumberY});
	gameData.position.push({x:centerX-distanceNumberX, y:centerY-distanceNumberY});
	gameData.position.push({x:centerX+distanceNumberX, y:centerY-distanceNumberY});

	if(viewport.isLandscape){
		//left
		distanceNumberX = 350;
		distanceNumberY = -80;
		gameData.position.push({x:centerX-distanceNumberX, y:centerY-distanceNumberY});
		gameData.position.push({x:centerX-distanceNumberX, y:centerY+distanceNumberY});

		//right
		distanceNumberX = 350;
		distanceNumberY = -80;
		gameData.position.push({x:centerX+distanceNumberX, y:centerY-distanceNumberY});
		gameData.position.push({x:centerX+distanceNumberX, y:centerY+distanceNumberY});

	}else{
		//top
		distanceNumberX = 100;
		distanceNumberY = -250;
		gameData.position.push({x:centerX-distanceNumberX, y:centerY+distanceNumberY});
		gameData.position.push({x:centerX+distanceNumberX, y:centerY+distanceNumberY});

		//bottom
		distanceNumberX = 100;
		distanceNumberY = 250;
		gameData.position.push({x:centerX-distanceNumberX, y:centerY+distanceNumberY});
		gameData.position.push({x:centerX+distanceNumberX, y:centerY+distanceNumberY});
	}

	positionHole();
}

/*!
 * 
 * POSITION HOLE - This is the function that runs to position hole
 * 
 */
function positionHole(){
	if(!gameData.created){
		return;
	}

	for(var n=0; n<gameData.position.length; n++){
		$.hole[n].x = $.hole[n].oriX = gameData.position[n].x;
		$.hole[n].y = $.hole[n].oriY = gameData.position[n].y;
		$.mole['container'+n].x = $.mole['mask'+n].x = gameData.position[n].x;
		$.mole['container'+n].y = $.mole['mask'+n].y = gameData.position[n].y + gameData.mask.y;
	}
}

/*!
 * 
 * GAME LEVEL - This is the function that runs to set game level
 * 
 */
function setGameLevel(){
	gameData.moleSpeed = gameSettings.levels[gameData.levelNum].moleSpeed;
	gameData.molePunchSpeed = gameSettings.levels[gameData.levelNum].molePunchSpeed;
	gameData.moleDelay = gameSettings.levels[gameData.levelNum].moleDelay;
	gameData.totalMole = gameSettings.levels[gameData.levelNum].mole;
	gameData.totalMole = gameData.totalMole > gameSettings.levels[gameData.levelNum].hole.length ? gameSettings.levels[gameData.levelNum].hole.length-1 : gameData.totalMole;
	gameData.hole = [];

	for(var n=0; n<gameSettings.levels[gameData.levelNum].hole.length; n++){
		gameData.hole.push(gameSettings.levels[gameData.levelNum].hole[n]);
	}

	resetLevel();
}

function resetLevel(){
	shuffle(gameData.hole);

	for(var n=0; n<gameData.position.length; n++){
		$.hole[n].visible = false;
	}

	gameData.holeObj = [];
	for(var n=0; n<gameData.totalMole; n++){
		var holeIndex = gameData.hole[n];
		$.hole[holeIndex].visible = true;
		loopHole(holeIndex);

		gameData.holeObj.push(holeIndex);
	}

	gameData.turn = [];
	gameData.turnIndex = -1;
	for(var n=0; n<gameSettings.levels[gameData.levelNum].hole.length; n++){
		gameData.turn.push(1);
		gameData.turn.push(0);
	}

	shuffle(gameData.turn);
	gameData.turnSwitch = randomIntFromInterval(gameSettings.levels[gameData.levelNum].turnSwitch[0], gameSettings.levels[gameData.levelNum].turnSwitch[1]);
	gameData.turnSwitch = gameData.turnSwitch > gameData.turn.length ? gameData.turn.length-1 : gameData.turnSwitch;
	loopHoleRange();
}

/*!
 * 
 * LOOP HOLE RANGE - This is the function that runs to loop hole range
 * 
 */
function loopHoleRange(){
	var tweenSpeed = randomIntFromInterval(gameSettings.levels[gameData.levelNum].turnSpeed[0],gameSettings.levels[gameData.levelNum].turnSpeed[0]) * .1;
	TweenMax.to(dirtContainer, tweenSpeed, {overwrite:true, onComplete:function(){
		gameData.turnIndex++;

		gameData.animating = false;
		for(var n=0; n<gameData.position.length; n++){
			if($.hole[n].animating){
				gameData.animating = true;
			}
		}

		if(gameData.turnIndex > gameData.turnSwitch && !gameData.animating){
			if(gameData.nextLevel){
				gameData.nextLevel = false;
				setGameLevel();
			}else{
				resetLevel();
			}
		}else{
			var showMole = gameData.turn[gameData.turnIndex];
			if(showMole == 1){
				var holeIndex = gameData.holeObj[Math.floor(Math.random()*gameData.holeObj.length)];
				createMole(holeIndex);
			}
			loopHoleRange();
		}
	}});
}

function stopHoleRange(){
	TweenMax.killTweensOf(dirtContainer);
}

/*!
 * 
 * LOOP HOLE - This is the function that runs to loop hole
 * 
 */
function loopHole(index){
	var obj = $.hole[index];
	var tweenSpeed = randomIntFromInterval(3,5) * .1;
	var delayNum = randomIntFromInterval(0,9) * .1;
	var randomX = obj.oriX + randomIntFromInterval(-gameData.holeMove.distanceX,gameData.holeMove.distanceX);
	var randomY = obj.oriY + randomIntFromInterval(-gameData.holeMove.distanceY,gameData.holeMove.distanceY);
	obj.gotoAndPlay('move');

	obj.scaleX = 1;
	if(randomX > obj.x){
		obj.scaleX = -1;
	}

	TweenMax.to(obj, tweenSpeed, {x:randomX, y:randomY, overwrite:true, onComplete:function(){
		obj.gotoAndPlay('inStatic');
		TweenMax.to(obj, tweenSpeed, {delay:delayNum, overwrite:true, onComplete:function(){
			loopHole(index);
		}});
	}});
}

/*!
 * 
 * CREATE HOLE - This is the function that runs to create hole
 * 
 */
function createHole(){
	dirtContainer.removeAllChildren();

	var maskW = gameData.mask.w;
	var maskH = gameData.mask.h;

	for(var n=0; n<gameData.position.length; n++){
		$.hole[n] = itemDirt.clone();
		$.hole[n].visible = false;
		$.hole[n].animating = false;

		$.mole['container'+n] = new createjs.Container();
		$.mole['hitContainer'+n] = new createjs.Container();
		$.mole['mask'+n] = new createjs.Shape();	
		$.mole['mask'+n].graphics.beginFill('red').drawRect(-(maskW/2), -maskH, maskW, maskH);
		$.mole['container'+n].mask = $.mole['mask'+n];
		
		$.mole['container'+n].addChild($.mole['hitContainer'+n]);
		dirtContainer.addChild($.mole['container'+n], $.hole[n]);
	}

	gameData.created = true;
	positionHole();
}

/*!
 * 
 * CREATE MOLE - This is the function that runs to create mole
 * 
 */
function createMole(index){
	if($.hole[index].animating){
		return;
	}
	
	stopHoleRange();
	playSound('soundPopin');
	$.hole[index].animating = true;

	$.mole['hitContainer'+index].y = 0;
	$.mole['hitContainer'+index].removeAllChildren();

	var randomMole = Math.floor(Math.random()*gameSettings.levels[gameData.levelNum].moleType.length);
	randomMole = gameSettings.levels[gameData.levelNum].moleType[randomMole];

	$.mole['moleHurt'+index] = new createjs.Bitmap(loader.getResult('itemMoleHurt'+randomMole));
	centerReg($.mole['moleHurt'+index]);
	$.mole['moleHurt'+index].regY = $.mole['moleHurt'+index].oriH = $.mole['moleHurt'+index].image.naturalHeight;
	$.mole['moleHurt'+index].visible = false;

	$.mole['mole'+index] = new createjs.Bitmap(loader.getResult('itemMole'+randomMole));
	centerReg($.mole['mole'+index]);
	$.mole['mole'+index].regY = $.mole['mole'+index].oriH = $.mole['mole'+index].image.naturalHeight;
	$.mole['mole'+index].y = $.mole['mole'+index].oriH;
	$.mole['mole'+index].index = index;
	$.mole['mole'+index].score = mole_arr[randomMole].score;
	$.mole['mole'+index].hit = mole_arr[randomMole].hit;
	$.mole['mole'+index].bomb = mole_arr[randomMole].bomb;
	$.mole['mole'+index].active = true;
	var delayNum = randomIntFromInterval(gameData.moleDelay[0],gameData.moleDelay[1]) * .1;

	$.mole['hitContainer'+index].addChild($.mole['mole'+index], $.mole['moleHurt'+index]);

	//event
	$.mole['mole'+index].cursor = "pointer";
	$.mole['mole'+index].addEventListener("click", function(evt) {
		if(gameData.paused){
			return;
		}

		if(!evt.target.active){
			return;
		}

		playSound('soundButton');
		
		if(evt.target.bomb){
			playSound('soundExplode');

			evt.target.active = false;
			gameData.life--;
			updateGameLife();
			goneMole(evt.target.index, true);

			if(gameData.life <=0 ){
				showGameStatus('over');
				endGame();
			}
		}else{
			var randomSound = Math.floor(Math.random()*3);
			playSound('soundHit'+(randomSound+1));

			evt.target.hit--;
			if(evt.target.hit <= 0){
				playSound('soundScore');
				evt.target.active = false;
				playerData.score += evt.target.score;
				createScore(evt.target.index, evt.target.score);
				checkPlayerScore();
				goneMole(evt.target.index, true);
			}
			hitMole(evt.target.index);
		}
	});

	//animation
	$.mole['container'+index].x = $.mole['mask'+index].x = $.hole[index].x;
	$.mole['container'+index].y = $.mole['mask'+index].y = $.hole[index].y + gameData.mask.y;

	TweenMax.killTweensOf($.hole[index]);
	$.hole[index].gotoAndPlay('out');
	TweenMax.to($.mole['mole'+index], gameData.moleSpeed, {y:0, ease:Expo.easeOut, overwrite:true, onComplete:function(){
		TweenMax.to($.mole['mole'+index], gameData.moleSpeed, {delay:delayNum, overwrite:true, onComplete:function(){
			goneMole(index, false);
		}});
	}});
}

/*!
 * 
 * HIT HOLE - This is the function that runs to hit hole animation
 * 
 */
function hitMole(index){
	var hitObj = $.mole['hitContainer'+index];
	hitObj.y = 100;
	TweenMax.to(hitObj, .2, {y:10, ease: Back. easeOut.config( 1.7), overwrite:true});
}

/*!
 * 
 * GONE HOLE - This is the function that runs to disapear hole
 * 
 */
function goneMole(index, punch){
	var obj = $.mole['mole'+index];
	if(punch){
		TweenMax.killTweensOf(obj);
		obj.visible = false;
		obj = $.mole['moleHurt'+index];
		obj.x = $.mole['mole'+index].x;
		obj.y = $.mole['mole'+index].y;
		obj.visible = true;
	}else{
		playSound('soundPopout');
	}
	var tweenSpeed = punch == true ? gameData.molePunchSpeed : gameData.moleSpeed;
	TweenMax.to(obj, tweenSpeed, {delay:.2, y:obj.oriH, ease:Expo.easeIn, overwrite:true, onComplete:function(){
		resetHole(index);
	}});
}

/*!
 * 
 * RESET HOLE - This is the function that runs to reset hole
 * 
 */
function resetHole(index){
	$.hole[index].gotoAndPlay('in');
	$.hole[index].animating = false;
	loopHole(index);
	loopHoleRange();
}

/*!
 * 
 * CHECK PLAYER SCORE - This is the function that runs to check player score
 * 
 */
function checkPlayerScore(){
	if(playerData.score >= gameSettings.levels[gameData.levelNum].target){
		gameData.levelNum++;
		gameData.levelNum = gameData.levelNum > gameSettings.levels.length-1 ? gameSettings.levels.length-1 :  gameData.levelNum;
		gameData.nextLevel = true;
	}
}

/*!
 * 
 * UPDATE LIFE - This is the function that runs to update life
 * 
 */
function updateGameLife(){
	lifeTxt.text = textDisplay.life.replace('[NUMBER]', gameData.life);
}

/*!
 * 
 * CREATE SCORE - This is the function that runs to create score
 * 
 */
function createScore(index, score){
	$.score[index] = new createjs.Container();

	$.score['bg'+index] = new createjs.Bitmap(loader.getResult('itemScore'));
	centerReg($.score['bg'+index]);

	$.score['text'+index] = new createjs.Text();
	$.score['text'+index].font = "30px bpreplaybold";
	$.score['text'+index].color = '#313135';
	$.score['text'+index].textAlign = "center";
	$.score['text'+index].textBaseline='alphabetic';
	$.score['text'+index].text = textDisplay.score.replace("[NUMBER]", score);
	$.score['text'+index].y = 10;

	$.score[index].addChild($.score['bg'+index], $.score['text'+index]);

	$.score[index].x = $.hole[index].x;
	$.score[index].y = $.hole[index].y + 30;

	scoreContainer.addChild($.score[index]);

	$.score[index].alpha = 0;
	TweenMax.to($.score[index], .2, {alpha:1, y:$.hole[index].y, overwrite:true, onComplete:function(){
		TweenMax.to($.score[index], .2, {delay:.1, alpha:0, overwrite:true, onComplete:function(){
			scoreContainer.removeChild($.score[index]);
		}});
	}});
}

/*!
 * 
 * GAME STATUS - This is the function that runs to show game status
 * 
 */
function showGameStatus(con){
	playSound('soundComplete');

	if(con == 'timer'){
		statusTxt.text = textDisplay.timeUp;
	}else{
		statusTxt.text = textDisplay.gameOver;
	}

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .5, {alpha:1, overwrite:true});
}

/*!
 * 
 * ANIMATE TIMER - This is the function that runs to animate countdown
 * 
 */
function animateTimer(){
	timerRedTxt.alpha = 0;
	TweenMax.to(timerRedTxt, .5, {alpha:1, overwrite:true});
}

/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){	
	if(con){
		timeData.startDate = new Date();
	}else{
		
	}
	timeData.enable = con;
}


/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		// Auto-clicker cheat - directly trigger the click handler logic
		for(var n=0; n<gameData.position.length; n++){
			if($.hole[n].animating && 
			   $.mole['mole'+n] && 
			   $.mole['mole'+n].active && 
			   !$.mole['mole'+n].bomb &&
			   $.mole['mole'+n].y < 50) { // Adjusted value for better visibility detection
				
				// Directly run the hit logic
				playSound('soundButton');
				
				$.mole['mole'+n].hit--;
				if($.mole['mole'+n].hit <= 0){
					playSound('soundScore');
					$.mole['mole'+n].active = false;
					playerData.score += $.mole['mole'+n].score;
					createScore(n, $.mole['mole'+n].score);
					checkPlayerScore();
					goneMole(n, true);
				}
				hitMole(n);
			}
		}
		
		if(timeData.enable){
			timeData.nowDate = new Date();
			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.startDate.getTime()));
			timeData.timer = Math.floor((timeData.countdown) - (timeData.elapsedTime));

			if(timeData.oldTimer == -1){
				timeData.oldTimer = timeData.timer;
			}
	
			if(timeData.timer <= 0){
				//stop
				showGameStatus('timer')
				endGame();
			}else{
				if((timeData.oldTimer - timeData.timer) > 1000){
					if(timeData.timer < 1000){
						animateTimer()
						playSound('soundCountdownEnd');
					}else if(timeData.timer < 6000){
						animateTimer()
						playSound('soundCountdown');
					}
					timeData.oldTimer = timeData.timer;
				}
				
				timerTxt.text = timerRedTxt.text = millisecondsToTimeGame(timeData.timer);
			}
		}

		dirtContainer.sortChildren(sortFunction);
	}
}

var sortFunction = function(obj1, obj2, options) {
	if (obj1.y > obj2.y) { return 1; }
	if (obj1.y < obj2.y) { return -1; }
	return 0;
}


/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	gameData.paused = true;

	stopHoleRange();
	toggleGameTimer(false);
	TweenMax.to(gameContainer, 2, {overwrite:true, onComplete:function(){
		goPage('result')
	}});
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}else if( action == 'leaderBoard' ){
		shareurl = `${window.location.protocol}//${window.location.host}`+"/leaderboards";
	}
	
	window.open(shareurl, "_self");
}
