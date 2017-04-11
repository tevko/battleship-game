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
			user: 0,
			computer: 0
		}
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

		document.querySelector('._JS_userGameBoard').addEventListener('click', e => {

		});
	},

	initiateGame() {
		document.querySelector('._JS_invalidCoords').classList.add('hidden');
		if (this.validateUserCoords(document.querySelectorAll('input'))) {
			this.state.playerBoard = this.createUserBoard(document.querySelectorAll('[data-for]'));
			this.state.userCoordsRecieved = true;
			this.hide(document.querySelector('._JS_gameControls').classList);
			this.show(document.querySelector('._JS_userGameBoard ').classList);
			this.state.gameInitiated = true;
		} else {
			this.setValidationErrorOnDom(document.querySelector('._JS_invalidCoords').classList);
		}
	},

	create() {
		/***
		*** Creates a computer gameboard
		***/
		const usedCoords = [];
		const returnNewCoords = () => [Math.floor(Math.random() * (6 - 1 + 1) + 1), Math.floor(Math.random() * (6 - 1 + 1) + 1)];
		const returnAvailableCoords = arr => {
			const coords = returnNewCoords();

			if (arr.every(map => map[0] !== coords[0] && map[1] !== coords[1]) === false) {
				return returnAvailableCoords(arr)
			}
			arr.push(coords);
			return coords
		};
		const compGameBoard = {};

		this.state.vessels.forEach(vessel => {
			const coords = returnAvailableCoords(usedCoords);
			compGameBoard[vessel] = {
				x: coords[0],
				y: coords[1],
				vessel
			}
		});

		return compGameBoard
	},

	validateUserCoords(nodelist) {
		/**
		 * ensures each vessel is on a unique point
		 */
		const coordPairs = [];
		const inputs = Array.apply(null, nodelist);

		inputs.forEach((inp, idx) => (idx % 2 === 0 && idx !== 0) && coordPairs.push(inputs[idx].value + '|' + inputs[idx - 1].value));
		return coordPairs.every((arr, idx) => coordPairs.indexOf(arr) === idx);
	},

	setValidationErrorOnDom(nodeClassList) {
		nodeClassList.remove('hidden');
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

	reset() {
		confirm('Are you sure? All progress will be lost. gone. forever :c') && window.location.reload();
	},

	hide(domNodeClassList) {
		domNodeClassList.add('hidden');
	},

	show(domNodeClassList) {
		domNodeClassList.remove('hidden');
	}
};

window.addEventListener('DOMContentLoaded', btlSHP.game.init.bind(btlSHP.game));