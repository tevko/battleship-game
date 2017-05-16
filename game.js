//create a new game

const btlSHP = window.btlSHP = window.btlSHP || {};

btlSHP.game = {
	state: {
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
			compMisses: [],
			compTurnNumber: 0
		}
	},

	icons: {
		armedoctopus: 'https://c1.staticflickr.com/4/3034/3048380730_85bbe428a7.jpg',
		carrier:' https://68.media.tumblr.com/avatar_99757c17548a_128.png',
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
				//document.querySelector(`[data-comp-coordpoint='${boardState[gamePiece].x}-${boardState[gamePiece].y}']`).style.backgroundImage = `url(${this.icons[gamePiece]})`;
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
		if (actualCoords.indexOf(guess) !== -1) {
			this.state.score.userScore += 1;
			this.state.score.userHits.push(clickEvent.target);
			Object.keys(this.state.compBoard).some(vessel => {
				if (`${this.state.compBoard[vessel].x}-${this.state.compBoard[vessel].y}` === clickEvent.target.getAttribute('data-comp-coordpoint')) {
					console.log(this.icons[vessel]);
					clickEvent.target.style.backgroundImage = `url(${this.icons[vessel]})`;
					clickEvent.target.classList.add('game-hit');
					return true;
				}
				return false;
			});

		} else {
			this.state.score.userMisses.push(clickEvent.target);
			clickEvent.target.classList.add('game-miss');
		}
		this.state.score.userTurnNumber += 1;
		console.log(this.state.score);
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