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
	const availableCoords = [
		[1,1],
		[1,2],
		[1,3],
		[1,4],
		[1,5],
		[2,1],
		[2,2],
		[2,3],
		[2,4],
		[2,5],
		[3,1],
		[3,2],
		[3,3],
		[3,4],
		[3,5],
		[4,1],
		[4,2],
		[4,3],
		[4,4],
		[4,5],
		[5,1],
		[5,2],
		[5,3],
		[5,4],
		[5,5]
	];
	const getAvailableCoords = availableCoords.forEach((cordMap, idx, arr) => {
		//return obj with x/y coords & remove from availablecoords val
	});
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