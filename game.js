//create a new game

const btlSHP = window.btlSHP = window.btlSHP || {};

btlSHP.game = {
	state: {
		compBoard: undefined,
		playerBoard: undefined,
		gameInitiated: false,
		userCoordsRecieved: false,
		score: {
			user: 0,
			computer: 0
		}
	},

	init() {
		console.log(this);
		this.state.compBoard = this.create();
	},

	create() {
		/***
		*** Creates a computer gameboard
		***/
		const playerGameBoard = {};
		const vessels = ['carrier', 'battleship', 'jetski', 'armed octopus', 'squirtgun', 'garden hose'];
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

		vessels.forEach(vessel => {
			const coords = returnAvailableCoords(usedCoords);
			compGameBoard[vessel.replace(' ', '_')] = {
				x: coords[0],
				y: coords[1],
				vessel
			}
		});

		return compGameBoard
	},

	reset() {
		confirm('Are you sure? All progress will be lost. gone. forever :c') && window.location.reload();
	}
};

window.addEventListener('DOMContentLoaded', btlSHP.game.init.bind(btlSHP.game));