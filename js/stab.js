/* Variables */
var chosen = 0; /* target */
var score = 0; 
var multiplier = 1; /* score multiplier */
var lives = 0;
var lose = false;
var elimVictims = 5; /* default */

var scoreDiv = $('#score');
var livesDiv = $('#lives');
var multiplierDiv = $('#multiplier');

$(function(){
	$('#title h1').fitText();

	/* Generate Random Victim */
	randomVictim(5);

	/* Start Elimination Game */
	startElim();
})

/* Functions */
function randomVictim(max){
	chosen = Math.floor((Math.random() * max) + 1);
}

function updateScore(){
	scoreDiv.html(score);
}

function updateLives(){
	livesDiv.html(lives);
}

function updateMultiplier(){
	multiplierDiv.html(multiplier);
}

function reset(){
	$('#overlay').hide();
	$('div[id^="stab-"]').removeClass('stabbed').removeClass('dead');
	chosen = 0;
	lose = false;
	randomVictim(5);
	startElim();
}

function nextRound(){
	if(multiplier == 1){
		$('#score-multiplier').fadeIn();
	}

	multiplier++;
	updateMultiplier();

	lives++;
	updateLives();
}

function fullReset(){
	reset();
	score = 0;
	updateScore();

	multiplier = 1;
	updateMultiplier();
	$('#score-multiplier').fadeOut();
}

function startElim(){

	/* On victim click... */
	$('div[id^="stab-"]').on('click', function(e){
		
		/* Get victim number */
		var victimClicked = $(this).attr('id');
		victimClicked = victimClicked.replace(/\D/g,'');

		/* If victim is not target */
		if(victimClicked != chosen){
			if(!$(this).hasClass('stabbed')){
				$(this).addClass('stabbed');
				score = score + multiplier;
			}
		}

		else{
			$(this).addClass('dead');
			if(lives <= 0){
				lose = true;
				gameOver(lose);
				$('div[id^="stab-"]').unbind( "click" );
			}
			else{
				minusLives();
			}
		}

		updateScore();
		elimWinCheck();
	});
}

function elimWinCheck(){
	if(!lose){
		var totalVictims = $('.stabbed').length;
		if(totalVictims >= elimVictims - 1){
			gameOver(lose);
			$('div[id^="stab-"]').unbind( "click" );
		}
	}
}

function minusLives(){
	message = '<h1>Oh, no! You got him!</h1><h2>But it\'s okay. You\'ve still got lives.</h2><a href="#retry">Retry</a>';

	$('#message').html(message);
	$('#overlay').delay(250).fadeIn();

	$('#message a').on('click', function(e){
		e.preventDefault();

		lives--;
		updateLives();
		reset();
	})	
}

function gameOver(lose){
	var message;

	if(lose){
		message = '<h1>Oh, no! You got him!</h1><a href="#retry">Start Over</a>';
	}
	else{
		message = '<h1>Nice Failure!</h1><h2>Lives +1</h2><a href="#continue">Next Target</a>';
	}

	$('#message').html(message);
	$('#overlay').delay(250).fadeIn();

	$('#message a').on('click', function(e){
		e.preventDefault();

		var buttonClicked = $(this).attr('href');
		buttonClicked = buttonClicked.slice(1);
		
		if(buttonClicked == 'retry'){		
			fullReset();
		}
		else{
			reset();
			nextRound();
		}
	})
}