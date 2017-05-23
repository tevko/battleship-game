//create a new game

const btlSHP = window.btlSHP = window.btlSHP || {};

btlSHP.game = {
	state: {
		userTurn: true,
		compBoard: undefined,
		playerBoard: undefined,
		gameInitiated: false,
		userCoordsRecieved: false,
		vessels: ['carrier', 'battleship', 'jetski', 'armedoctopus', 'squirtgun', 'gardenhose'],
		score: {
			userScore: 0,
			userHits: [],
			userMisses: [],
			userTurnNumber: 0,
			computerScore: 0,
			compHits: [],
			compGuesses: [],
			compTurnNumber: 0
		}
	},

	icons: {
		armedoctopus: 'https://c1.staticflickr.com/4/3034/3048380730_85bbe428a7.jpg',
		carrier:'https://68.media.tumblr.com/avatar_99757c17548a_128.png',
		battleship: 'https://s-media-cache-ak0.pinimg.com/736x/e4/cb/77/e4cb77a6ded005906bda2cef36b7234e.jpg',
		jetski: 'http://i2.cdnds.net/12/45/618x328/gaming_gta_5_lifeboat.jpg',
		squirtgun: 'http://teratalks.com/images/uploads/2016/08/20160817-tera-squirt.jpg',
		gardenhose: 'http://ecx.images-amazon.com/images/I/411ChPj4WVL._SL256_.jpg',
	},

	init() {
		if (localStorage.gameState) {
			this.state = localStorage.gameState;
			this.initiateGame();
		} else {
			this.state.compBoard = this.create();

			document.querySelector('._JS_submitBoard').addEventListener('click', () => {
				this.initiateGame();
			});
		}

		document.querySelector('._JS_compGameBoard').addEventListener('click', e => {
			if (e.target.getAttribute('data-comp-coordpoint')) {
				const actualCoords = Object.keys(this.state.compBoard).map(v => `${this.state.compBoard[v].x}-${this.state.compBoard[v].y}`);
				const guess = e.target.getAttribute('data-comp-coordpoint');
				this.plotUserGuess(actualCoords, guess, e);
			}
		});

		document.querySelector('._JS_boardSwitcher').addEventListener('click', e =>
			this.toggleGameBoards(e, document.querySelector('._JS_gameboard.hidden'), document.querySelector('._JS_gameboard:not(.hidden)'))
		);
	},

	initiateGame() {
		document.querySelector('._JS_invalidCoords').classList.add('hidden');
		if (this.validateUserCoords(document.querySelectorAll('input'))) {
			this.state.playerBoard = this.createUserBoard(document.querySelectorAll('[data-for]'));
			this.state.userCoordsRecieved = true;
			this.hide(document.querySelector('._JS_gameControls').classList);
			this.show(document.querySelector('._JS_compGameBoard').classList);
			this.show(document.querySelector('._JS_boardSwitcher').classList);
			this.show(document.querySelector('._JS_scoreBoard').classList);
			this.show(document.querySelector('._JS_messageQueue').classList);
			this.state.gameInitiated = true;
			this.setIcons(this.state.playerBoard);
			this.setIcons(this.state.compBoard, true);
		} else {
			this.show(document.querySelector('._JS_invalidCoords').classList);
		}
	},

	create() {
		/***
		*** Creates a computer gameboard
		***/
		const usedCoords = [];
		const testCoordsHolder = [];
		const returnNewCoords = () => [Math.floor(Math.random() * (6 - 1 + 1) + 1), Math.floor(Math.random() * (6 - 1 + 1) + 1)];
		const returnAvailableCoords = (arr, arrTest) => {
			const coords = returnNewCoords();
			const tester = coords.join('|');

			if (arrTest.every(map => arrTest.indexOf(tester) === -1) === false) {
				return returnAvailableCoords(arr, arrTest)
			}
			arr.push(coords);
			arrTest.push(tester);
			return coords
		};
		const compGameBoard = {};

		this.state.vessels.forEach(vessel => {
			const coords = returnAvailableCoords(usedCoords, testCoordsHolder);
			compGameBoard[vessel] = {
				x: coords[0],
				y: coords[1],
				vessel
			}
		});

		return compGameBoard
	},

	setIcons(boardState, isComputer = false) {
		/**
		 * adds icons to places where user
		 * has placed game pieces
		 */
		Object.keys(boardState).forEach(gamePiece => {
			if (isComputer) {
				return;
			} else {
				document.querySelector(`[data-coordpoint='${boardState[gamePiece].x}-${boardState[gamePiece].y}']`).style.backgroundImage = `url(${this.icons[gamePiece]})`;
			}
		});
	},

	validateUserCoords(nodelist) {
		/**
		 * ensures each vessel is on a unique point
		 */
		const coordPairs = [];
		const inputs = Array.apply(null, nodelist);

		inputs.forEach((inp, idx) => (idx % 2 !== 0) && coordPairs.push(inputs[idx - 1].value + '|' + inputs[idx].value));
		return coordPairs.every((point, idx) => coordPairs.indexOf(point) === idx);
	},

	createUserBoard(vesselInputs) {
		const playerBoard = {};
		vesselInputs.forEach(inp => {
			//not touching dom, just filtering through recieved nodelist
			const vessel = inp.getAttribute('data-for');
			const x = Number(inp.querySelector(`[name=${vessel}X]`).value);
			const y = Number(inp.querySelector(`[name=${vessel}Y]`).value);

			playerBoard[vessel] = {
				x,
				y,
				vessel
			};
		});

		return playerBoard
	},

	plotUserGuess(actualCoords, guess, clickEvent) {
		/**
		 * logs user guess to state
		 * @param  {Array} actualCoords [mapped coord points]
		 * @param  {String} guess        [data-attribute of clicked point]
		 * @param  {Click} clickEvent   [user click]
		 */
		if (this.state.userTurn) {
			if (actualCoords.indexOf(guess) !== -1) {
				this.state.score.userHits.push(clickEvent.target);
				this.state.score.userScore += 1;
				Object.keys(this.state.compBoard).some(vessel => {
					if (`${this.state.compBoard[vessel].x}-${this.state.compBoard[vessel].y}` === clickEvent.target.getAttribute('data-comp-coordpoint')) {
						clickEvent.target.style.backgroundImage = `url(${this.icons[vessel]})`;
						clickEvent.target.classList.add('game-hit');
						this.paintGameUI({
							message: `It's a hit! You sunk the computer's ${vessel}.`,
							messageQueue: document.querySelector('._JS_messageQueue'),
							scoreBoard: document.querySelector('._JS_userScore'),
						});
						return true;
					}
					return false;
				});
			} else {
				this.state.score.userMisses.push(clickEvent.target);
				clickEvent.target.classList.add('game-miss');
				this.paintGameUI({
					message: `It's a miss! Machines are superior. The computer laughs at your foolish human ways.`,
					messageQueue: document.querySelector('._JS_messageQueue')
				});
			}
			if (this.state.score.userHits.length !== 6) {
				this.state.score.userTurnNumber += 1;
				this.state.userTurn = false;
				setTimeout(this.makeComputerGuess.bind(this), 4000);
			} else {
				this.initiateWin();
			}
		}
	},

	makeComputerGuess() {
		this.paintGameUI({
			message: `The computer is guessing!`,
			messageQueue: document.querySelector('._JS_messageQueue')
		});
		setTimeout(function() {
			if (this.state.score.compHits.length < 6) {
				const guessCoords = () => {
					const guess = `${Math.floor(Math.random() * (6 - 1 + 1) + 1)}-${Math.floor(Math.random() * (6 - 1 + 1) + 1)}`;
					return this.state.score.compGuesses.indexOf(guess) === -1 ? guess : guessCoords();
				};
				const officialGuess = guessCoords();
				const guessCoordsObj = {
					x: officialGuess[0],
					y: officialGuess[2]
				};
				const isMiss = Object.keys(this.state.playerBoard).every(vessel => `${this.state.playerBoard[vessel].x}-${this.state.playerBoard[vessel].y}` !== `${guessCoordsObj.x}-${guessCoordsObj.y}`);
				if (isMiss) {
					document.querySelector('._JS_userGameBoard').querySelector(`[data-coordpoint="${guessCoordsObj.x}-${guessCoordsObj.y}"]`).classList.add('game-miss');
					this.paintGameUI({
						message: `It's a miss! The computer curses you under its hypothetical breath.`,
						messageQueue: document.querySelector('._JS_messageQueue')
					});
				} else {
					Object.keys(this.state.playerBoard).some(vessel => {
						if (`${this.state.playerBoard[vessel].x}-${this.state.playerBoard[vessel].y}` === `${guessCoordsObj.x}-${guessCoordsObj.y}`) {
							this.state.score.compHits.push(`${guessCoordsObj.x}-${guessCoordsObj.y}`);
							document.querySelector('._JS_userGameBoard').querySelector(`[data-coordpoint="${guessCoordsObj.x}-${guessCoordsObj.y}"]`).classList.add('game-hit');
							this.paintGameUI({
								message: `It's a hit! The computer humiliates your human race by sinking your ${vessel}.`,
								messageQueue: document.querySelector('._JS_messageQueue'),
								scoreBoard: document.querySelector('._JS_compScore'),
								turn: 'computer',
							});
							if (this.state.score.compHits.length === 6) {
								this.initiateLoss();
							}
							return true
						}
						return false
					});
				}

				this.state.score.compGuesses.push(`${guessCoordsObj.x}-${guessCoordsObj.y}`);
			}
		}.bind(this), 3500);
		setTimeout(function() {
			if (this.state.score.compHits.length < 6) {
				this.state.userTurn = true;
				this.paintGameUI({
					message: `It's your turn!`,
					messageQueue: document.querySelector('._JS_messageQueue')
				});
				if ('vibrate' in navigator) {
					navigator.vibrate(750);
				}
			}
		}.bind(this), 7000);
	},

	paintGameUI(args) {
		if (args.scoreBoard) {
			args.scoreBoard.innerHTML = args.turn === 'computer' ? `<span class="flash-purple">${this.state.score.compHits.length}</span>` : `<span class="flash-purple">${this.state.score.userScore}</span>`;
		}

		if (args.message) {
			args.messageQueue.innerHTML = `<h2>Messages</h2>
			<div class="messageQueue-container flash">
				<p>${args.message}</p>
			</div>`;
		}
	},

	initiateWin() {
		document.body.innerHTML = `
			<div class="final-screen win">
				<h1>YOU WIN.</h1>
				<p>Computers are defeated. The humans emerge superior.</p> <p>LONG LIVE THE HUMANS</p>
			</div>
		`;
		setTimeout(() => confirm('Would you like to play again?') ? window.location.reload() : false, 3000);
	},

	initiateLoss() {
		document.body.innerHTML = `
			<div class="final-screen loss">
				<h1>YOU LOSE.</h1>
				<p>The computer decides to enslave the human race in its wrath.</p> <p>Everyone blames you.</p> <p>01100011 01101111 01101101 01110000 01110101 01110100 01100101 01110010 01110011 00100000 01110111 01101001 01101100 01101100 00100000 01110010 01110101 01101100 01100101 00100000 01100110 01101111 01110010 01100101 01110110 01100101 01110010!</p>
			</div>
		`;
		setTimeout(() => confirm('Would you like to play again?') ? window.location.reload() : false, 3000);
	},

	reset() {
		confirm('Are you sure? All progress will be lost. gone. forever :c') && window.location.reload();
	},

	hide(domNodeClassList) {
		domNodeClassList.add('hidden');
	},

	show(domNodeClassList) {
		domNodeClassList.remove('hidden');
	},

	toggleGameBoards(e, showGameboard, hideGameboard) {
		/**
		 * toggles comp & user gameboards
		 * @param  {click event} e
		 * @param { dom node } [showGameboard] [the gameboard to be shown]
		 * @param { dom node } [hideGameboard] [the gameboard to be hidden]
		 */
		if (e.target.classList.contains('_JS_toggleGameBoard')) {
			 hideGameboard.classList.add('hidden');
			 showGameboard.classList.remove('hidden');
			 e.target.innerText = e.target.innerText === 'Show Computer Game Board' ? 'Show My Game Board' : 'Show Computer Game Board';
		}
	}
};

window.addEventListener('DOMContentLoaded', btlSHP.game.init.bind(btlSHP.game));