"use strict";

const axios = require('axios');

const ipc = require("node-ipc");

const serverRetries = 5;
var retryCounter = serverRetries;
var _isConnected = false;

ipc.config.silent = true;
ipc.config.rawBuffer = true;
ipc.config.retry = 1000;
ipc.config.maxRetries = serverRetries;

module.exports = function (nodecg) {
	const graphUrl = 'https://www.ultimedecathlon.com/graphql';

	const runnerName = nodecg.Replicant('runnerName');
	let udRunner = runnerName.value;

	runnerName.on('change', () => {
		udRunner = runnerName.value;
	});

	const fetchPbsReplicant = nodecg.Replicant('fetchPbs');
	nodecg.listenFor('fetchPbs', async query => {
		try {
			let results = {};

			const apiResponse = await axios.get(graphUrl, {
				params: {
					query: 'query AllPBs {  userCardInformations(season: ' + query.season + ', username: "' + udRunner + '", showEmptyPb: true) {    pbList {      game {        name        groupment      }      time      score    }  }}'
				}
			});

			if (undefined !== apiResponse.data.data) {
				apiResponse.data.data.userCardInformations.pbList.forEach(function(PB){
					if (query.game === PB.game.name) {
						if ('grind' === PB.game.groupment || 'light' === PB.game.groupment) {
							results.light = {
								score: PB.score ? PB.score : 0,
								time: PB.time
							}
						} else if ('race' === PB.game.groupment || 'dark' === PB.game.groupment) {
							results.dark = {
								score: PB.score ? PB.score : 0,
								time: PB.time
							}
						}
					}
				})
			}

			fetchPbsReplicant.value = results;

			nodecg.log.info('PB Fetched.');
		} catch (error) {
			nodecg.log.error('ERROR while fetching the PB list.');
		}
	});

	const runnerListReplicant = nodecg.Replicant('runnerList');
	nodecg.listenFor('fetchRunnersList', async query => {
		try {
			let results = [];

			const apiResponse = await axios.get(graphUrl, {
				params: {
					query: 'query AllRunners {  activeSeasonUsers(season: ' + query.season + ', paginator: {page: 1, nbPerPage: 1000}) {    totalPages    data {      id      username      alias      pronouns    }  }}'
				}
			});

			if (apiResponse.data.data.activeSeasonUsers.data) {
				apiResponse.data.data.activeSeasonUsers.data.forEach(function(runner){
					results.push(runner);
				})
			}

			runnerListReplicant.value = results;

			nodecg.log.info('Runner list fetched.');
		} catch (error) {
			nodecg.log.error('ERROR while fetching the runner list for the season ' + query.season);
		}
	});

	const fetchGamesListReplicant = nodecg.Replicant('fetchGamesList');
	nodecg.listenFor('fetchGamesList', async query => {
		try {
			let results = [];
			let glyphs = [];

			let groupment = 'grind';
			if (9 === parseInt(query)) {
				groupment = 'light';
			}

			const apiResponse = await axios.get(graphUrl, {
				params: {
					query: 'query getGames {  activeSeasonGames (season: ' + query + ', groupment: "' + groupment + '") {    name }}',
				}
			});

			if (undefined !== apiResponse.data.data) {
				apiResponse.data.data.activeSeasonGames.forEach(function(game){
					results.push(game.name);
					glyphs.push({
						name: game.name,
						glyph: game.pathInformation,
					});
				})

				fetchGamesListReplicant.value = results;
			}

			nodecg.log.info('Games list fetched for season ' + query);
		} catch (error) {
			nodecg.log.error('ERROR while fetching the games list.');
		}
	});

	const gameInfos = nodecg.Replicant('getGameInfos');
	nodecg.listenFor('getGameInfos', async query => {
		try {
			let gameResult = {};

			let apiResponseLight = await axios.get(graphUrl, {
				params: {
					query: 'query gameInfos {  activeSeasonGames(season: ' + query.season + ', groupment: ' + (parseInt(query.season) === 9 ? "light" : "grind") + ') {    id    name    category  minScore maxScore    bestTime    middleTime    fewestTime    groupment    twitchName    hexColor    pathInformation {      path      width    }  }}'
				}
			});

			gameResult = aggregateGameInfos(query, apiResponseLight.data.data.activeSeasonGames, gameResult);

			let apiResponseDark = await axios.get(graphUrl, {
				params: {
					query: 'query gameInfos {  activeSeasonGames(season: ' + query.season + ', groupment: ' + (parseInt(query.season) === 9 ? 'dark' : 'race') + ') {    id    name    category  minScore maxScore   bestTime    middleTime    fewestTime    groupment    twitchName    hexColor    pathInformation {      path      width    }  }}'
				}
			});
			gameResult = aggregateGameInfos(query, apiResponseDark.data.data.activeSeasonGames, gameResult);

			gameInfos.value = gameResult;

			nodecg.log.info('Game infos fetched.');
		} catch (error) {
			nodecg.log.error('ERROR while fetching the game infos');
		}
	});

	function aggregateGameInfos(query, games, gameResult) {
		games.forEach(function(game){
			if (query.game === game.name) {
				gameResult.name = game.name;
				gameResult.hexColor = game.hexColor;
				gameResult.pathInformation = {
					path: game.pathInformation.path,
					width: game.pathInformation.width
				};

				if ('light' === game.groupment || 'grind' === game.groupment) {
					let category = game.category;
					let regex = /\/\/ (.*)/;
					let found = category.match(regex);

					if (found && found[1]) {
						category = found[1];
					}

					gameResult.light = {
						category: category,
						bestTime: game.bestTime,
						middleTime: game.middleTime,
						fewestTime: game.fewestTime,
						minScore: game.minScore,
						maxScore: game.maxScore,
					}
				} else {
					gameResult.dark = {
						category: game.category,
						bestTime: game.bestTime,
						middleTime: game.middleTime,
						fewestTime: game.fewestTime,
						minScore: game.minScore,
						maxScore: game.maxScore,
					}
				}
			}
		})

		return gameResult;
	}

	/**
	 * Livesplit library
	 */

	const livesplitConnection = nodecg.Replicant('livesplitConnected', {defaultValue: false, persistent: false});
	var lastData;

	nodecg.listenFor('livesplit:connect', (params) => {
		_connectToLiveSplit(params);
	});

	nodecg.listenFor('livesplit:disconnect', () => {
		_disconnectLiveSplit();
	});

	function _connectToLiveSplit(params) {
		ipc.connectToNet('lsConnection', params.ip, params.port, () => {

			ipc.of.lsConnection.on('connect', () => {
				nodecg.sendMessage('livesplit:connectionSuccess');
				nodecg.log.info("Connected to LiveSplit");
				_isConnected = true;
				livesplitConnection.value = true;
			});

			ipc.of.lsConnection.on('data', (serverData) => {
				var formattedMessage;
				try {
					formattedMessage = serverData.toString().trim();
				} catch (error) {
					nodecg.log.error('Something went wrong formatting the returned data: ' + error);
					return;
				}
				lastData = formattedMessage;
			});

			ipc.of.lsConnection.on('disconnect', () => {
				_isConnected = false;
				livesplitConnection.value = false;
				retryCounter--;

				if (retryCounter < 0) {
					nodecg.log.error('Failed to connect to LiveSplit');
					nodecg.sendMessage('livesplit:connectionFail');
					retryCounter = serverRetries;
				}
			});
		});

	}

	function _disconnectLiveSplit() {
		ipc.disconnect('lsConnection');
		livesplitConnection.value = false;
		nodecg.log.info('Disconnected LiveSplit');
	}

	nodecg.listenFor('livesplit:sendAction', (data) => {
		if (!_isConnected){
			nodecg.log.error('LiveSplit is not connected');
			return;
		}

		var sendingMessage;

		try {
			sendingMessage = data.toString().trim();
			sendingMessage += "\r\n";
		}
		catch(e) {
			nodecg.log.error('Something wrong with data being sent: ', e);
		}

		ipc.of.lsConnection.emit(sendingMessage);
	});

	nodecg.listenFor('livesplit:sendData', (data, callback) => {
		if (!_isConnected){
			nodecg.log.error('LiveSplit is not connected');
			return;
		}
		var sendingMessage;
		try {
			sendingMessage = data.toString().trim();
			sendingMessage += "\r\n";
		}
		catch(e) {
			nodecg.log.error('Something wrong with data being sent: ', e);
		}

		ipc.of.lsConnection.emit(sendingMessage);

		setTimeout(() => {
			callback(lastData);
		}, 5);

	});
}
