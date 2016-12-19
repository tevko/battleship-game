//create a new game

const btlSHP = window.btlSHP = window.btlSHP || {};

btlSHP.game = {
	state: {
		compBoard: undefined,
		playerBoard: undefined,
		gameInitiated: false,
		userCoordsRecieved: false,
		vessels: ['carrier', 'battleship', 'jetski', 'armed_octopus', 'squirtgun', 'garden_hose'],
		score: {
			user: 0,
			computer: 0
		}
	},

	init() {
		this.state.compBoard = this.create();

		document.querySelector('._JS_submitBoard').addEventListener('click', () => {
			document.querySelector('._JS_invalidCoords').classList.add('hidden');
			if (this.validateUserCoords('X', document.querySelectorAll('input')) && this.validateUserCoords('Y', document.querySelectorAll('input'))) {
				this.createUserBoard();
			} else {
				this.setValidationError()
			}
		});
	},

	create() {
		/***
		*** Creates a computer gameboard
		***/
		const playerGameBoard = {};
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

	validateUserCoords(plane, nodelist) {
		/**	
		 * ensures user does not enter repeating coordinates
		 */
		const inputs = Array.apply(null, nodelist).filter(inp => inp.name.indexOf(plane) !== -1);
		const values = inputs.map(i => i.value);
		return values.every((v, idx, arr) => arr.indexOf(v) === idx && v !== '');

	},

	setValidationError() {
		document.querySelector('._JS_invalidCoords').classList.remove('hidden');
	},

	createUserBoard() {
		const vesselInputs = documemnt.querySelectorAll('[data-for]');

		vesselInputs.forEach(inp => {
			const shipName = inp.getAttribute('data-for');
			const X = inp.querySelector(`[${shipName}X]`);
			const Y = inp.querySelector(`[${shipName}Y]`);

			console.log(X,Y)
		});
	},

	reset() {
		confirm('Are you sure? All progress will be lost. gone. forever :c') && window.location.reload();
	}
};

window.addEventListener('DOMContentLoaded', btlSHP.game.init.bind(btlSHP.game));