		var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam molestie condimentum dictum. Etiam condimentum placerat semper. Donec non mauris a est pretium rutrum. Pellentesque molestie massa vitae felis auctor luctus. Donec fermentum dapibus dui, ut pharetra urna ullamcorper ut. Duis ac tempus augue. Proin eu pellentesque risus. Integer posuere pharetra blandit. Nunc dolor tellus, placerat in massa et, posuere consequat nibh. Vestibulum ex diam, elementum quis blandit in, imperdiet id neque. <br> <br> Sed sed sapien vel est iaculis vulputate eu nec nisl. Cras luctus porta accumsan. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla interdum ut sapien vel fermentum. Ut non nulla quis massa auctor condimentum. Aenean rhoncus risus eget erat tempus tristique eu sed orci. Sed in sem in metus vehicula commodo sed sit amet neque. Proin semper scelerisque velit, ut porta lectus bibendum sed. Ut bibendum dignissim tellus, eu aliquam libero dapibus eu. Fusce non nibh nisl. Ut pharetra placerat ex, non tempor orci mattis at. <br> <br> Sed non lorem tempor, eleifend augue a, luctus leo. Curabitur a vulputate elit. Mauris in malesuada felis, id vestibulum libero. Donec imperdiet turpis in est posuere, eu elementum tortor pellentesque. Donec blandit, dolor sit amet dapibus auctor, dolor neque aliquam dui, sodales dignissim tortor magna eu dui. Nam vel finibus nisl, non maximus lorem. Sed molestie felis eros, non sodales lectus bibendum a. Suspendisse venenatis lacus sodales scelerisque rhoncus. Phasellus nulla risus, consequat in velit eu, lobortis semper nisi. Pellentesque facilisis mauris non enim cursus, et sollicitudin lorem lacinia. Quisque fringilla risus ut commodo feugiat. Praesent eu leo et tortor rhoncus convallis pharetra quis risus. Aenean est felis, gravida quis elit vel, tincidunt viverra ligula.";
		var loremArray = [];
		var loremFullArray = [];
		var wordBank = ["test", "example"]; // Words to pick from
		var wordIndex = 0;
		var currentWord = wordBank[wordIndex];
		var guesses = 15;
		var guessedLetters = [];
		var hintArray = [];
		var wins = 0;
		var reset = false;
		var winSpan = document.getElementById('wins');
		var wordSpan = document.getElementById('word');
		var guessSpan = document.getElementById('guesses');
		var letterSpan = document.getElementById('letters');
		var announcementSpan = document.getElementById('announcement');
		var loremDiv = document.getElementById("lorem")


		filterLoremArray();

		mixWordBank();
		
		getFirstWord();

		pickWord();

		document.onkeyup = function(event) {
			if (reset === true) {
				if (event.key === "1") {
					nextGame();	
				}
			} else {
				if (event.keyCode <= 90 && event.keyCode >= 65) {
					testLetter(event.key);
				}
			}

		};

		// function declarations
		

		function filterLoremArray() {
			loremArray = lorem.split(" ")
			for (var i = 0; i < loremArray.length; i++) {
				var thisWord = loremArray[i];
				var lastChar = thisWord[thisWord.length - 1];
				if (thisWord === "<br>") {
					loremArray.splice(i, 1);
					i--;
				} else if (lastChar === "." || lastChar === ",") {
					if (thisWord.length < 7) {
						loremArray.splice(i, 1);
						i--;
					} else {
						thisWord = thisWord.slice(0, -1);
						loremArray[i] = thisWord;
					}
				} else if (thisWord.length < 6) { 
					loremArray.splice(i, 1);
					i--;
				}
			}
		}

		function mixWordBank() { // mixes the wordBank so it is different every page visit
			var mixedBank = [];
			var length = loremArray.length;
			for (var i = 0; i < length; i++) {
				var randomIndex = Math.floor(Math.random() * loremArray.length);
				mixedBank.push(loremArray.splice(randomIndex, 1)[0]);
			}
			wordBank = mixedBank;
		}
		
		function getFirstWord() {
			wordIndex = Math.floor(Math.random() * loremArray.length);
		};

		function pickWord() { // Picks a new word, initializes spans
			letterSpan.innerHTML = "";
			guessedLetters = [];
			hintArray = [];
			guesses = 9;
			guessSpan.innerHTML = 9;
			announcementSpan.innerHTML = "";

			if (wordIndex < wordBank.length - 1) {
				wordIndex++;
			} else {
				wordIndex = 0;
			}
			currentWord = wordBank[wordIndex].toLowerCase();
			for (var i = 0; i < currentWord.length; i++) {
				hintArray.push("_");
			}
			updateHint();
			setTimeout(fadeLorem, 500);
		};

		function testLetter(guessedLetter) { // TODO: check for alpha keys
			if (guessedLetters.includes(guessedLetter) === false) {
				guessedLetters.push(guessedLetter);
				guessLetter(guessedLetter);
			}
		}
		
		function guessLetter(letter) {
			var goodGuess = false;
			for (var i = 0; i < currentWord.length; i++) {
				var check = currentWord[i];
				if (letter === check) {
					updateHintArray(i, letter);
					goodGuess = true;
				}
			}
			if (goodGuess === true) {
				updateHint();
				checkWin();
			} else {
				showWrongLetter(letter);
				if (guesses === 0) {
					youLose();
				}
			}
		};

		function updateHintArray(index, correctGuess) {
			hintArray[index] = correctGuess;
		}

		function updateHint() {
			wordSpan.innerHTML = "";
			for (var i = 0; i < hintArray.length; i++) {
				wordSpan.innerHTML += hintArray[i] + " ";
			}
		};

		function checkWin() {
			checkString = hintArray.join("");
			if (checkString === currentWord) {
				youWin();
			}
		}

		function showWrongLetter(incorrectGuess) {
			guesses--;
			letterSpan.innerHTML += incorrectGuess + " ";
			guessSpan.innerHTML = guesses;
		};

		function youWin() {
			wins++;
			winSpan.innerHTML = wins;
			showLorem();
			announcementSpan.innerHTML = "Magnificum! Press 1 to play again";
			reset = true;
		}

		function youLose() {
			showLorem();
			announcementSpan.innerHTML = "Uh-oh, it was " + currentWord + "! Press 1 to play again";
			reset = true
		};

		function showLorem() {
			loremFullArray = lorem.split(" ");
			for (var i = 0; i < loremFullArray.length; i++) {
				var thisWord = loremFullArray[i]
				var lastChar = thisWord[thisWord.length - 1];
				var shorter = loremFullArray[i].slice(0, -1);
				if (loremFullArray[i].toLowerCase() === currentWord || shorter === currentWord) {
					loremFullArray.splice(i, 0, "<strong>");
					spaceRemove = loremFullArray[i].length;
					loremFullArray[i + 1] += "</strong> ";
					i++;
				}
			}
			loremDiv.innerHTML = "<p>" + loremFullArray.join(" ");
			//fade in
			loremDiv.className = "fadeIn";
		}

		function fadeLorem() { //fade out 
			loremDiv.className = "fadeOut"
		}

		function nextGame() {
			pickWord();
			reset = false;
		}