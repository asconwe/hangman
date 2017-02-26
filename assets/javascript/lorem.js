var hangman = {


	lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam molestie condimentum dictum. Etiam condimentum placerat semper. Donec non mauris a est pretium rutrum. Pellentesque molestie massa vitae felis auctor luctus. Donec fermentum dapibus dui, ut pharetra urna ullamcorper ut. Duis ac tempus augue. Proin eu pellentesque risus. Integer posuere pharetra blandit. Nunc dolor tellus, placerat in massa et, posuere consequat nibh. Vestibulum ex diam, elementum quis blandit in, imperdiet id neque. <br> <br> Sed sed sapien vel est iaculis vulputate eu nec nisl. Cras luctus porta accumsan. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla interdum ut sapien vel fermentum. Ut non nulla quis massa auctor condimentum. Aenean rhoncus risus eget erat tempus tristique eu sed orci. Sed in sem in metus vehicula commodo sed sit amet neque. Proin semper scelerisque velit, ut porta lectus bibendum sed. Ut bibendum dignissim tellus, eu aliquam libero dapibus eu. Fusce non nibh nisl. Ut pharetra placerat ex, non tempor orci mattis at. <br> <br> Sed non lorem tempor, eleifend augue a, luctus leo. Curabitur a vulputate elit. Mauris in malesuada felis, id vestibulum libero. Donec imperdiet turpis in est posuere, eu elementum tortor pellentesque. Donec blandit, dolor sit amet dapibus auctor, dolor neque aliquam dui, sodales dignissim tortor magna eu dui. Nam vel finibus nisl, non maximus lorem. Sed molestie felis eros, non sodales lectus bibendum a. Suspendisse venenatis lacus sodales scelerisque rhoncus. Phasellus nulla risus, consequat in velit eu, lobortis semper nisi. Pellentesque facilisis mauris non enim cursus, et sollicitudin lorem lacinia. Quisque fringilla risus ut commodo feugiat. Praesent eu leo et tortor rhoncus convallis pharetra quis risus. Aenean est felis, gravida quis elit vel, tincidunt viverra ligula.",
	loremArray: [],
	loremFullArray: [],
	wordBank: ["test", "example"], // Words to pick from
	wordIndex: 0,
	currentWord: "test word",
	guesses: 15,
	guessedLetters: [],
	hintArray: [],
	wins: 0,
	reset: false,
	winSpan: document.getElementById('wins'),
	wordSpan: document.getElementById('word'),
	guessSpan: document.getElementById('guesses'),
	letterSpan: document.getElementById('letters'),
	announcementSpan: document.getElementById('announcement'),
	loremDiv: document.getElementById('lorem'),



	// function declarations
	
// Removes any words with less than 5 letters from loremArray before it is applied to the wordbank
	filterLoremArray: function() { 	
		this.loremArray = this.lorem.split(" ")
		for (var i = 0; i < this.loremArray.length; i++) {
			var thisWord = this.loremArray[i];
			var lastChar = thisWord[thisWord.length - 1];
			if (thisWord === "<br>") {
				this.loremArray.splice(i, 1);
				i--;
			} else if (lastChar === "." || lastChar === ",") {
				if (thisWord.length < 7) {
					this.loremArray.splice(i, 1);
					i--;
				} else {
					thisWord = thisWord.slice(0, -1);
					this.loremArray[i] = thisWord;
				}
			} else if (thisWord.length < 6) { 
				this.loremArray.splice(i, 1);
				i--;
			}
		}
	},

// Mixes the wordBank so it is different every page visit and not in 
// the same order as the lorem paragraph
	mixWordBank: function() { 
		var mixedBank = []; 
		var length = this.loremArray.length;
		for (var i = 0; i < length; i++) {
			var randomIndex = Math.floor(Math.random() * this.loremArray.length);
			mixedBank.push(this.loremArray.splice(randomIndex, 1)[0]);
		}
		this.wordBank = mixedBank;
	},
	
// Picks a first word at random once the wordbank is mixed
	getFirstWord: function() { 
		this.wordIndex = Math.floor(Math.random() * this.loremArray.length);
	},

// Fades out the lorem paragraph (called when the game starts or resets)
	fadeLorem: function(selfArgument) { 
		selfArgument.loremDiv.className = "fadeOut";
	},

// Picks a new word, resets hint, guesses, and guessed letters
	pickWord: function() { 
		this.letterSpan.innerHTML = "";
		this.guessedLetters = [];
		this.hintArray = [];
		this.guesses = 9;
		this.guessSpan.innerHTML = 9;
		this.announcementSpan.innerHTML = "";

		if (this.wordIndex < this.wordBank.length - 1) {
			this.wordIndex++;
		} else {
			this.wordIndex = 0;
		}
		this.currentWord = this.wordBank[this.wordIndex].toLowerCase();
		for (var i = 0; i < this.currentWord.length; i++) {
			this.hintArray.push("_");
		}

		var self = this;
		this.updateHint();
		setTimeout(function() {
			self.fadeLorem(self)
		}, 500);
		
	},

// Tests if the guess was previously made and adds it to the guessed letter list
	testLetter: function(guessedLetter) { 
		if (this.guessedLetters.includes(guessedLetter) === false) {
			this.guessedLetters.push(guessedLetter);
			this.guessLetter(guessedLetter);
		}
	},

// Tests if the guess is good or bad
	guessLetter: function(letter) { 
		var goodGuess = false;
		for (var i = 0; i < this.currentWord.length; i++) {
			var check = this.currentWord[i];
			if (letter === check) {
				this.updateHintArray(i, letter);
				goodGuess = true;
			}
		}
		if (goodGuess === true) {
			this.updateHint();
			this.checkWin();
		} else {
			this.showWrongLetter(letter);
			if (this.guesses === 0) {
				this.youLose();
			}
		}
	},

// Updates the hint array
	updateHintArray: function(index, correctGuess) {
		this.hintArray[index] = correctGuess;
	},

// Updates the visible hint with the new hint array
	updateHint: function() {
		this.wordSpan.innerHTML = "";
		for (var i = 0; i < this.hintArray.length; i++) {
			this.wordSpan.innerHTML += this.hintArray[i] + " ";
		}
	},

// Checks if you have won
	checkWin: function() {
		this.checkString = this.hintArray.join("");
		if (this.checkString === this.currentWord) {
			this.youWin();
		}
	},

// Displays the letter in the guessed letters list when the guess is wrong
	showWrongLetter: function(incorrectGuess) {
		this.guesses--;
		this.letterSpan.innerHTML += incorrectGuess + " ";
		this.guessSpan.innerHTML = this.guesses;
	},

// Adds to the win count, displays a message, and shows the highlighted lorem paragraph
	youWin: function() {
		this.wins++;
		this.winSpan.innerHTML = this.wins;
		this.showLorem();
		this.announcementSpan.innerHTML = "Magnificum! Press 1 to play again";
		this.reset = true;
	},

// Displays a message and shows the highlighted lorem paragraph
	youLose: function() {
		this.showLorem();
		this.announcementSpan.innerHTML = "Uh-oh, it was " + this.currentWord + "! Press 1 to play again";
		this.reset = true;
	},

// Highlights the current word and makes the paragraph visible
	showLorem: function() {
		this.loremFullArray = this.lorem.split(" ");
		for (var i = 0; i < this.loremFullArray.length; i++) {
			var thisWord = this.loremFullArray[i]
			var lastChar = thisWord[thisWord.length - 1];
			var shorter = this.loremFullArray[i].slice(0, -1);
			if (this.loremFullArray[i].toLowerCase() === this.currentWord || shorter === this.currentWord) {
				this.loremFullArray.splice(i, 0, "<strong>");
				this.spaceRemove = this.loremFullArray[i].length;
				this.loremFullArray[i + 1] += "</strong> ";
				i++;
			}
		}
		this.loremDiv.innerHTML = "<p>" + this.loremFullArray.join(" ") + "</p>";
		//fade in
		this.loremDiv.className = "fadeIn";
	},

// Initializes a new game
	nextGame: function() {
		this.pickWord();
		this.reset = false;
	},

// Initializes the first game
	getStarted: function() {
		this.filterLoremArray();
		this.mixWordBank();
		this.getFirstWord();
		this.pickWord();
	}


};

hangman.getStarted();

document.onkeyup = function(event) {
	if (hangman.reset === true) {
		if (event.key === "1") {
			hangman.nextGame();	
		}
	} else {
		if (event.keyCode <= 90 && event.keyCode >= 65) {
			hangman.testLetter(event.key);
		}
	}

};