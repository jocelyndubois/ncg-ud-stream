# NodeCG - Ultime Decathlon Personnal stream tool.

<p align="center">
  <img src="https://github.com/jocelyndubois/ncg-ud-stream/blob/main/media/UD_Tool_screen.png?raw=true">
</p>

L'Ultime Décathlon est une compétition de speedrun saisonnière ou le but est d'apprendre et maitriser 10 speedruns.

Le site de l'evenement se trouve ici : https://www.ultimedecathlon.com/

## Docs :
- [NodeCG](https://nodecg.dev/)
- [nodecg-livesplit](https://github.com/EwanLyon/nodecg-livesplit)

## Requirements
- NodeCG v1.x
- Node.js v8.3 minimum
- npm v2 minimum
- nodecg-cli
- bower

## Pré-installation:
Si vous n'avez pas encore d'instance de nodecg d'installée :

1. Téléchargez et installez bower si ce n'est pas déjà fait.
```shell
npm install --global bower
```
2. Téléchargez et installez nodecg-cli si ce n'est pas déjà fait.
```shell
npm install --global nodecg-cli
```
3. Créez un nouveau dossier et initialisez nodecg
```shell
mkdir nodecg
cd nodecg
nodecg setup
```

## Installation :
1. `nodecg install jocelyndubois/ncg-ud-stream`. 
2. `cd bundles/ncg-ud-stream`
3. Depuis le dossier nodecg `nodecg start`

## Première utilisaton :
1. Renseigner une saison (> 6) dans le champ `Season` du panneau `UD`
2. Rendez vous dans l'onglet `SETUP` et sélectionnez votre nom dans la liste.
3. Profitez en pour régler les options disponnibles. Les choix seront sauvegardés.

## Doc :
La doc du projet est dispo [ici](https://github.com/jocelyndubois/ncg-ud-stream/wiki)

## Livesplit
Ce bundle inclus une reprise du travail de EwanLyon sur l'intégration de Livesplit.
Je n'ai pas réussi à faire fonctionner sa vue de connection que j'ai donc refaite dans ce bundle.
Son travail est trouvable [ici](https://github.com/EwanLyon/nodecg-livesplit)

## Spotify
Si vous voulez utilisez la vue spotify intégrée, suivez d'abord les étapes d'installation du bundle [ici](https://github.com/EwanLyon/ncg-spotify)

## Utilisation
Pour utiliser nodecg, `nodecg start` dans le dossier racine de nodecg.
