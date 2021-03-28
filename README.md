# NodeCG - Ultime Decathlon Personnal stream tool.

L'Ultime Décathlon est une compétition de speedrun saisonnière ou le but est d'apprendre et maitriser 10 speedruns.

Le site de l'evenement se trouve ici : https://www.ultimedecathlon.com/

##Docs :
- [NodeCG](https://nodecg.dev/)
- [nodecg-livesplit](https://github.com/EwanLyon/nodecg-livesplit)

##Requirements
- NodeCG v1.x
- Node.js v8.3 minimum
- npm v2 minimum
- nodecg-cli

##Pré-installation:
Si vous n'avez pas encore d'instance de nodecg d'installée :

1. Télécharger et installer nodecg-cli
```shell
npm install --global nodecg-cli
```
2. Créez un nouveau dossier et initialisez nodecg
```shell
mkdir nodecg
cd nodecg
nodecg setup
```

##Installation :
1. Clonez (ou téléchargez et dézippez) dans `nodecg/bundles/ncg-ud-stream`. 
2. `cd nodecg/bundles/ncg-ud-stream`
3. `nodecg defaultconfig` ceci va créer un fichier ncg-ud-stream.json dans `nodecg/cfg`
4. Editez le fichier en question et mettez votre identifiant UD à la place de `RUNNER-NAME`
5. `npm install --production`
6. `bower install`

##Livesplit
Ce bundle inclus une reprise du travail de EwanLyon sur l'intégration de Livesplit.
Je n'ai pas réussi à faire fonctionner sa vue de connection que j'ai donc refaite dans ce bundle.
Son travail est trouvable [ici](https://github.com/EwanLyon/nodecg-livesplit)

##Spotify
Si vous voulez utilisez la vue spotify intégrée, suivez d'abord les étapes d'installation du bundle [ici](https://github.com/EwanLyon/ncg-spotify)
