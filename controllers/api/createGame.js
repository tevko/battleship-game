//create a new game
const express = require('express');
const app = express();

const createGame = () => {
	/***
	*** Creates a computer gameboard with a success msg
	*** or a failure message in case an error occurs
	***/
	try {
		const playerGameBoard = {};
		const usertoken = new Buffer(Date.now() + '').toString('base64');
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
		const compGameBoard = {};

		vessels.forEach(vessel => {
			const coords = returnAvailableCoords(usedCoords);
			compGameBoard[vessel.replace(' ', '_')] = {
				x: coords[0],
				y: coords[1],
				vessel
			}
		});

		if (app.locals.games === undefined) {
			app.locals.games = {};
		}

		app.locals.games[usertoken] = {
			compGameBoard,
			playerGameBoard,
			moves: {
				comp: [],
				usr: []
			}
		};

		return {
			success: true,
			usertoken,
			compGameBoard
		}

	} catch(e) {

		return {
			success: false,
			message: e
		}
	}
};

const returnNewGame = (req, res, next) => {
	console.log(req.body);
	res.json(createGame());
};

module.exports = returnNewGame;