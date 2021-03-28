function fetchPBList() {
	nodecg.sendMessage(
		'fetchPBList',
		{
			players : {
				1: runnerIdReplicant_1.value,
				2: runnerIdReplicant_2.value,
				3: runnerIdReplicant_3.value,
				4: runnerIdReplicant_4.value,
			},
			game: game.value,
			season: season.value
		}
	);
}

function fetchPBAggregatedList() {
	nodecg.sendMessage(
		'fetchPbAggregatedList',
		{
			players : {
				1: runnerId_1.value,
				2: runnerId_2.value,
				3: runnerId_3.value,
				4: runnerId_4.value,
			},
			game: game.value,
			season: season.value
		}
	);
}

function fetchRunnersList() {
	nodecg.sendMessage(
		'fetchRunnersList',
		{
			season: season.value
		}
	);
}

function sendGameGlyph(game, season) {
	nodecg.sendMessage(
		'sendGames',
		game
	);
	nodecg.sendMessage(
		'sendLogo',
		{
			game: game,
			season: season
		}
	);
}

function string_to_slug (str) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	var to   = "aaaaeeeeiiiioooouuuunc------";
	for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

	return str;
}
