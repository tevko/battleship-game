//create a new game

const createGame = (req, res, next) => {
	/***
	*** User coords should be
	*** an object whos keys are
	*** vessel names, and values
	*** are objects containing x/y
	**** coordinates
	***/
	const userCoords = req.body.userGameCoords;
	const vessels = ['carrier', 'battleship', 'jetski', 'armed octopus', 'squirtgun'];
	const usedCoords = [];
	const returnNewCoords = () => [Math.floor(Math.random() * (5 - 1 + 1) + 1), Math.floor(Math.random() * (5 - 1 + 1) + 1)];
	const returnAvailableCoords = arr => {
		const coords = returnNewCoords();

		if (usedCoords.every(map => map[0] !== coords[0] && map[1] !== coords[1]) === false) {
			return returnAvailableCoords(arr)
		}
		usedCoords.push(coords);
		return coords
	};
	const compCoords = {
		[vessels[0]]: {
			x: ,
			y:
		},
		[vessels[1]]: {
			x: ,
			y:
		},
		[vessels[2]]: {
			x: ,
			y:
		},
		[vessels[3]]: {
			x: ,
			y:
		},
		[vessels[4]]: {
			x: ,
			y:
		},
	};
};