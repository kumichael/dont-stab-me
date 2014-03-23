/* Variables */
var chosen; /* Target */
var score = 0; 
var multiplier = 1; /* Score multiplier */
var lives = 0;
var lose = false;
var elimVictims = 5; /* Default number of victims */

/* Variable Divs */
var scoreDiv = $('#score');
var livesDiv = $('#lives');
var multiplierDiv = $('#multiplier');

$(function(){
	/* FitText for heading */
	$('#title h1').fitText();
	$('#title h2').fitText(3);

	$('#menu .button').on('click', function(e){
		e.preventDefault();
		var menuClicked = $(this).attr('href');
		$('.view').hide();
		$(menuClicked).fadeIn();
	})

	$('.back').on('click', function(e){
		$('.view').hide();
		$('#menu').fadeIn();
		fullReset();
	})

	/* Generate 5 random victims */
	randomVictim(5);
	/* Start Elimination game (Game mode 1) */
	startElim();
})

/* Functions */

function randomVictim(max){ chosen = Math.floor((Math.random() * max) + 1); }

/* Update Functions */
function updateScore(){ scoreDiv.html(score); }
function updateLives(){	livesDiv.html(lives); }
function updateMultiplier(){ multiplierDiv.html(multiplier); }

function reset(){
	/* Reset all stabbed styles */
	$('div[id^="stab-"]').removeClass('stabbed').removeClass('dead');

	/* Hide overlay message */
	$('#overlay').hide();

	/* Soft-reset game variables */
	lose = false;
	randomVictim(5);
	startElim();
}

function nextRound(){
	/* Display multiplier if greater than 1 (one-time check) */
	if(multiplier == 1){
		$('#score-multiplier').fadeIn();
	}

	/* Increase multiplier and update display */
	multiplier++;
	updateMultiplier();

	/* Increase lives and update display */
	lives++;
	updateLives();
}

function fullReset(){
	/* Execute soft-reset */
	reset();

	/* Reset score */
	score = 0;
	updateScore();

	/* Reset multiplier */
	multiplier = 1;
	updateMultiplier();

	/* Reset lives */
	lives = 0;
	updateLives();

	/* Hide multiplier display */
	$('#score-multiplier').fadeOut();
}

function startElim(){
	/* On victim click... */
	$('div[id^="stab-"]').on('click', function(e){
		/* Disable victim */
		$(this).unbind();

		/* Get victim number */
		var victimClicked = $(this).attr('id');
		victimClicked = victimClicked.replace(/\D/g,'');

		/* If victim is not target... */
		if(victimClicked != chosen){
			/* ...and has not been stabbed... */
			if(!$(this).hasClass('stabbed')){
				/* ...stab target */
				$(this).addClass('stabbed');

				/* Increase score by multiplier (score = score + [1 * multiplier]) */
				score = score + multiplier;
			}
		}

		/* Else, if victim is target... */
		else{
			/* ...marked target as dead */
			$(this).addClass('dead');

			/* If player has no lives, game is lost */
			if(lives <= 0){
				lose = true;
			}
			/* Else, one life is subtracted */
			else{
				minusLives();
			}
		}

		/* Update score */
		updateScore();

		/* Check to see if game has been won or lost */
		elimWinCheck();
	});
}

function elimWinCheck(){
	/* If game has not be lost */
	if(!lose){
		/* Get total number of victims (default 5) */
		var totalVictims = $('.stabbed').length;

		/* Since target has not been stabbed (passed check in startElim()),
			if all other victims have been stabbed... */
		if(totalVictims >= elimVictims - 1){
			/* Gameover (win) */
			gameOver(lose);
		}
	}

	/* Else, if game has been lost (failed check in startElim()) */
	else{
		/* Gameover (lose */
		gameOver(lose);
	}
}

function minusLives(){
	message = '<h1>Mistakes happen.</h1><h2>It\'s okay. You\'ve still got lives.</h2><a href="#retry">Retry</a>';

	/* Display message */
	$('#message').html(message);
	$('#overlay').delay(250).fadeIn();

	/* On button click... */
	$('#message a').on('click', function(e){
		e.preventDefault();
		$(this).unbind();

		/* Subtract 1 life */
		lives--;
		updateLives();

		/* Soft-reset game */
		reset();
	})	
}

function gameOver(lose){
	/* Unbind all click events victims/disable game */
	$('div[id^="stab-"]').unbind( "click" );

	var message;
	if(lose){
		message = '<h1>Oh, no! You got him!</h1><h2>Final Score: '+score+'</h2><a href="#retry">Try again</a>';
	}
	else{
		message = '<h1>Nice Failure!</h1><h2>Lives +1</h2><a href="#continue">Next target</a>';
	}

	$('#message').html(message);
	$('#overlay').delay(250).fadeIn();

	$('#message a').on('click', function(e){
		e.preventDefault();
		$(this).unbind();

		/* Get which type of button was pressed */
		var buttonClicked = $(this).attr('href');
		buttonClicked = buttonClicked.slice(1);
		
		/* If game lost, reset game */
		if(buttonClicked == 'retry'){
			fullReset();
		}

		/* Else, move into next round */
		else{
			nextRound();
			reset();
		}
	})
}