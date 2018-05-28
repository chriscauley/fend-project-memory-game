/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//Global variables and functions
var deck = document.querySelector('.deck');

// Create a list that holds all of your cards
var card_icons = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"]

//Other variables
var all_cards = document.getElementsByClassName('card');
var open_cards, start_time, end_time, busy, moves, matched_cards;
var moves_counter = document.querySelector('.moves');
var stars = document.getElementsByClassName('fa-star');
var restart = document.querySelector('.restart');

//shuffles and loads cards
function load(){

    //reset initial values
    matched_cards = moves = 0;
    open_cards = [];
    start_time = end_time = busy = undefined;

    //remove cards
    while(deck.hasChildNodes()){
	deck.removeChild(deck.lastChild);
    }
    //reset moves counter
    moves_counter.innerHTML = moves;

    //reset stars
    var empty_stars = document.querySelectorAll('.fa-star-o');
    for(let star of empty_stars){
	star.classList.replace('fa-star-o', 'fa-star');
    }
    
    //append and create cards
    var frag = document.createDocumentFragment();
    var card_list = '';
    var li = document.createElement('li');
    var i = document.createElement('i');
    shuffle(card_icons);
    for(let icon of card_icons){
	li.className = 'card';
	li.appendChild(i);
	i.className = icon;
	frag.appendChild(li.cloneNode(true));
    }
    deck.appendChild(frag);
    bindListeners();
}

//initial page load
document.addEventListener("DOMContentLoaded", load);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//add event listeners for showing cards
function bindListeners(){
    for (let card of all_cards){
	card.addEventListener('click', function(event){

	    //if the card is being matched, or not matched, the user won't be able to click on anything/click event will be stopped
	    if(busy){return;}

	    //toggle card classes so the card shows
	    card.classList.toggle('open');
	    card.classList.toggle('show');

	    //add clicked card to open cards list
	    open_cards.push(card);

	    //If you click the same card then it won't increment the open cards list, and card list gets reset
	      if(open_cards[0] == card){
		open_cards = [];
		return;
	    }

	    //up the moves counter with each click
	    moves ++;
	    moves_counter.innerHTML = moves;

	    //updates the star status
	    updateStarStatus();

	    //if there are two open cards, check to see if they match
	    if (open_cards.length == 2){
		if(open_cards[0].childNodes[0].className !== open_cards[1].childNodes[0].className){
		    //if they don't match, flip the cards back over
		    nomatch();
		}else{
		    //if they do match, turn them green, set match class
		    match();
		    matched_cards ++;
		}
	    }

	    //start timer when the person clicks the first card
	    if (moves == 1){
		start_time = new Date().valueOf();
	    }

	    //if the matched card count equals 8 (which is 16/2 cards) then set the end time and run the game over function
	    if (matched_cards == 8){
		end_time = new Date().valueOf();
		gameOver((end_time-start_time)/1000, stars.length);
	    }
	});
    }
    //handler if someone wants to click the restart button at the top of the game
    restart.addEventListener('click', function(){
	load();
    });
}
//function to update star status counter
function updateStarStatus(){
    if(moves >=17 && stars.length === 3){
	stars[2].classList.replace('fa-star', 'fa-star-o');
    }
    if(moves >=26 && stars.length == 2){
	stars[1].classList.replace('fa-star', 'fa-star-o');
    }
}

//function to run if cards do not match
function nomatch (){
    //set the status to busy so users can't click on other cards
    busy = true;

    //animate them to show red, shake
    setTimeout(function(){
	for(let opencard of open_cards){
	    opencard.classList.add('nomatch');
	}
    }, 400);
    //flip cards over
    setTimeout(function(){
	for(let opencard of open_cards){
	    opencard.classList.remove('nomatch');
	    opencard.classList.toggle('open');
	    opencard.classList.toggle('show');
	    open_cards = [];
	    //set status to not busy to allow clicking
	    busy = false;
	}
    }, 1200);
}
//function to run if cards match
function match(){
    busy = true;
    for(let opencard of open_cards){
	setTimeout(function(){
	    opencard.classList.toggle('match');
	    open_cards = [];
	    busy = false;
	},500);
    }
}
//function to run when user has matched all cards
function gameOver(time, stars){
    //function to convert player seconds into seconds, minutes, hours taken from https://stackoverflow.com/a/37096923
    function secondsToTime(secs){
	var hours = Math.floor(secs / (60 * 60));

	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);

	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);

	var obj = {
	    "h": hours,
	    "m": minutes,
	    "s": seconds
	};
	return obj;
    }
    //alert that displays player status
    setTimeout(function(){
	var ut = secondsToTime(time);
	alert(`Your game play time was ${ut.h} hours ${ut.m} minutes and ${ut.s} seconds, and your star status was ${stars}! Press OK to play again!`);
	load();
    }, 700);
}
    
