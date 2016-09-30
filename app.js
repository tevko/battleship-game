const express = require('express');
const app = express();
const apiController = 'controllers/api';
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API Routing

//create new game
app.put('/api/newgame/', require(`./${apiController}/createGame`));

app.delete('/api/destroygame/', (req, res, next) => {
	//delete game
});

app.post('/api/playermove', (req, res, next) => {
	//human updates board
});

app.get('/api/cpumove', (req, res, next) => {
	//robot updates board
});

app.listen(3000);