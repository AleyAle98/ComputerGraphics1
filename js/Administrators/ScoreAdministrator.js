export class ScoreAdministrator{
    constructor(params){
        this.lifesSpanGame = params.lifesTarget;
        this.timeSpanGame = params.timeTarget;
        this.enemySpanGame = params.enemyTarget;
		this.ammoSpanGame = params.ammoTarget;

        this.totalLifes = params.lifes;
		this.time = params.time;

        this.currLifes = this.totalLifes;
		
 
        this.startTime = 0;
        this.currTime = 0;
        this.pauseTime = 0;
        this.currPassedTime = 0;
		
        this.lastHit = null;
		
		this.quantityEnemy = params.numEnemy;
		this.killedEnemy = 0;
        this.win = false;
        this.gameOver = false;
		this.recoverFlag = 0;

        this.updateSpansGame()
    }

    getRemaningTime(){return this.time-this.currPassedTime;}
    getEnemyKilled(){return this.killedEnemy;}
	getNumEnemy(){return this.quantityEnemy;}


    setStartTime(time){this.startTime = time}

    addPauseTime(time){
        this.pauseTime += time;
    }

    isWin(){return this.win}
    isGameOver(){
        this.updateGameOver();
        return this.gameOver;
    }
    updateGameOver(){
        if(this.currLifes <= 0 || this.currPassedTime < 0){
            this.gameOver = true;
			var audio = new Audio('resources/audios/GameOver.wav');
			audio.play();
        }
        if(this.killedEnemy >= this.quantityEnemy){
            this.win = true;
            this.gameOver = true;
			var audio = new Audio('resources/audios/Victory.wav');
			audio.play();
        }
    }
	
	setUpWeapon(params) {
		this.gun = {
			name: params.name,
			ammo: params.ammo,
			currAmmo: 0,
		}
		this.updateSpansGame();
	}
	
	setCurrAmmo(quantity) {
		this.gun.currAmmo = quantity;
		this.updateSpansGame();
	}

    lose1life(){
		console.log("Colpito")
        var hitTime = Date.now();
		if(this.lastHit && hitTime-this.lastHit < 650)
			return;
		console.log("Eseguo")
		this.lastHit = hitTime;
		this.currLifes -= 1;
		this.updateSpansGame();
		this.updateGameOver();
    }
	
	recoverLife(time){
		var startRecover = Date.now()
		if(this.recoverFlag == 0){
			this.currLifes += 5;
            document.getElementById("recover").style.visibility = "visible";
			setTimeout(function(){
            document.getElementById("recover").style.visibility = "hidden";
				}, 4000);
			this.recoverFlag = 1;
			this.updateSpansGame();
			this.updateGameOver();
			var audio = new Audio('resources/audios/PokemonRecovery.wav');
			audio.play();
		}
				
    }
	
	  
	
    updateCurrTime(time){
        this.currTime = time;
		var oldPassedTime = this.currPassedTime;
        this.currPassedTime = parseInt(this.time - (this.currTime - this.startTime - this.pauseTime) / 1000);
		this.updateGameOver();
		if(oldPassedTime!=this.currPassedTime && !this.gameOver) {
			this.updateSpansGame();
		}
    }
	
    changeScore(value){
        this.currScore += value;
        this.updateSpansGame();
    }
	enemyKilled() {
		this.killedEnemy++;
		this.updateSpansGame();
	}

    updateSpansGame() {
        this.lifesSpanGame.innerHTML = "Lifes: " + this.currLifes;
        this.timeSpanGame.innerHTML = "time: " + parseInt(this.currPassedTime / 60) + ":" + (this.currPassedTime % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        this.enemySpanGame.innerHTML = "enemy: " + this.killedEnemy + "/" + this.quantityEnemy;

		if(this.gun) {
			this.ammoSpanGame.innerHTML = this.gun.name +": " + this.gun.currAmmo + "/" + this.gun.ammo;
		}
    }
}