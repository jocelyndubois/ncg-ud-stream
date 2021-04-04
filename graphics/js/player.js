const player = document.querySelector('#player');
const gameFrame = document.querySelector('#gameFrame');

const glyph = document.querySelector('#game-glyph');

const PBDiv = document.querySelector('#PB-div');
const gameDiv = document.querySelector('#game-infos');

const pbScore = document.querySelector('#pbScore');
const pbTime = document.querySelector('#pbTime');

const title = document.querySelector('#title');
const category = document.querySelector('#category');

const runnerId = document.querySelector('#runnerId');
runnerName.on('change', () => {
	runnerId.innerHTML = runnerName.value.toUpperCase();;
});

nodecg.listenFor('showPB', async infos => {
	player.style.backgroundColor = '#' + infos.color;
	gameFrame.style.borderColor = '#' + infos.color;

	if ('' !== infos.time) {
		pbScore.innerText = infos.score + 'pts';
		pbTime.innerText = infos.time;
	} else {
		pbScore.innerText = '-/-';
		pbTime.innerText = '';
	}

	glyph.setAttribute('class', '');
	glyph.classList.add('glyph-game-' + string_to_slug(infos.game));

	let gameName = infos.game;
	let fontSize = '1em';
	if ('Super Monkey Ball Adventure' === gameName) {
		gameName = 'SMB Adventure';
		fontSize = '0.7em';
	}

	let catFontSize = '1em';
	let categoryName = infos.category;
	if ('All Beginner + Advanced Challenge levels' === categoryName) {
		categoryName = 'All Beginner + Advanced';
		catFontSize = '0.5em';
	}

	title.innerText = gameName;
	title.style.fontSize = fontSize;
	category.innerText = categoryName;
	category.style.fontSize = catFontSize;
	gameDiv.removeAttribute('class');
	gameDiv.classList.add('third')
	gameDiv.classList.add('runner')
	gameDiv.classList.add(string_to_slug(infos.game))

	gameDiv.classList.remove('hidden');
	PBDiv.classList.remove('hidden');
})

nodecg.listenFor('hidePB', async infos => {
	gameDiv.classList.add('hidden');
	PBDiv.classList.add('hidden');
})
