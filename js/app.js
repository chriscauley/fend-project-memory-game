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
var allCards = document.getElementsByClassName('card');
var deck = document.querySelector('.deck');
var openCards = [];
//add event listeners for showing cards
for (let card of allCards){
    card.addEventListener('click', function(event){
	card.classList.toggle('open');
	card.classList.toggle('show');
	openCards.push(card);
	//if there are two open cards, check to see if they match
	if (openCards.length == 2){
	    //if they don't match, flip the cards back over
	    if(openCards[0].childNodes[1].className !== openCards[1].childNodes[1].className){
		//animate them to show red, shake
		setTimeout(function(){
		    for(let opencard of openCards){
			opencard.classList.add('nomatch');
		    }
		}, 400);
		//flip cards over
		setTimeout(function(){
		    for(let opencard of openCards){
			opencard.classList.remove('nomatch');
			opencard.classList.toggle('open');
			opencard.classList.toggle('show');
			openCards = [];
		    }
		}, 1200);
		//if they do match, turn them green, set match class
	    }else{
		for(let opencard of openCards){
		    setTimeout(function(){
			opencard.classList.toggle('match');
			openCards = [];
		    },500);
		}
	    }
	}
    });
}

