const player = document.querySelector('#player');
const gameFrame = document.querySelector('#gameFrame');

const glyph = document.querySelector('#glyph');
const gameSvgPath = document.querySelector('#gameSvgPath');

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

	pbScore.innerText = infos.score;
	pbTime.innerText = infos.time;

	// glyph.setAttribute('viewBox', '0,0,' + infos.glyph.width + ',' + infos.glyph.width);
	gameSvgPath.setAttribute('d', infos.glyph.path);

	title.innerText = infos.game;
	category.innerText = infos.category;
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
