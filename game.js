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

	icons: {
		armedoctopus: 'https://c1.staticflickr.com/4/3034/3048380730_85bbe428a7.jpg',
		carrier:' https://68.media.tumblr.com/avatar_99757c17548a_128.png',
		battleship: 'https://s-media-cache-ak0.pinimg.com/736x/e4/cb/77/e4cb77a6ded005906bda2cef36b7234e.jpg',
		jetski: 'http://i2.cdnds.net/12/45/618x328/gaming_gta_5_lifeboat.jpg',
		squirtgun: 'http://teratalks.com/images/uploads/2016/08/20160817-tera-squirt.jpg',
		gardenhose: 'http://ecx.images-amazon.com/images/I/411ChPj4WVL._SL256_.jpg'
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
			this.show(document.querySelector('._JS_userGameBoard').classList);
			this.show(document.querySelector('._JS_boardSwitcher').classList);
			this.state.gameInitiated = true;
			this.setIcons(this.state.playerBoard);
			this.setIcons(this.state.compBoard, true);
		} else {
			this.setValidationErrorOnDom(document.querySelector('._JS_invalidCoords').classList);
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
				document.querySelector(`[data-comp-coordpoint='${boardState[gamePiece].x}-${boardState[gamePiece].y}']`).style.backgroundImage = `url(${this.icons[gamePiece]})`;
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
		console.log(coordPairs, coordPairs.every((point, idx) => coordPairs.indexOf(point) === idx));
		return coordPairs.every((point, idx) => coordPairs.indexOf(point) === idx);
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