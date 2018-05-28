/*
 * Create a list that holds all of your cards
 */


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
//Global variables and functions
var deck = document.querySelector('.deck');
var card_icons = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"]
var all_cards = document.getElementsByClassName('card');
var open_cards = [];
var moves_counter = document.querySelector('.moves');
var moves = 0;
var stars = document.getElementsByClassName('fa-star');
var restart = document.querySelector('.restart');
var start_time;
var end_time;
var matched_cards = 0;
var busy;
document.addEventListener("DOMContentLoaded", function(event) {
    load();
    bindListeners();
});
//shuffles and intially loads cards
function load(){
    moves_counter.innerHTML = moves;
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
}

//add event listeners for showing cards
function bindListeners(){
    for (let card of all_cards){
	card.addEventListener('click', function(event){
	    if(busy){return;}
	    card.classList.toggle('open');
	    card.classList.toggle('show');
	    open_cards.push(card);
	    //up the moves counter with each click
	    moves ++;
	    moves_counter.innerHTML = moves;
	    updateStarStatus();
	    //if there are two open cards, check to see if they match
	    if (open_cards.length == 2){
		//if they don't match, flip the cards back over
		if(open_cards[0].childNodes[0].className !== open_cards[1].childNodes[0].className){
		    //if they do match, turn them green, set match class
		    nomatch();
		}else{
		    match();
		    matched_cards ++;
		}
	    }
	    if (moves == 1){
		start_time = new Date().valueOf();
	    }
	    if (matched_cards == 8){
		end_time = new Date().valueOf();
		gameOver((end_time-start_time)/1000, stars.length);
	    }
	});
    }
    restart.addEventListener('click', function(){
	location.reload();
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
	alert(`your gamplay time was ${ut.h} hours ${ut.m} minutes and ${ut.s} seconds, and your star status was ${stars}!`);
    }, 700);
}
    
