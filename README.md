# Bombparty

Room avec X joueurs, chaque joueur a
- un nom
- 3 vies

Room démarre avec un état "started".
Room assigne un joueur pour démarrer, avec 3 lettres.
Si joueur écrit un mot & que le mot contient les 3 lettres & qu'il appartient au dictionnaire
  Alors, room passe au joueur suivant.
Sinon
  Joueur perds une vie
    Si joueur n'a plus de vie, assigner état "lose"
    Checker si c'est le dernier joueur qui n'a plus de vie, si oui, alors c'est lui qui a gagné
  Alors, room passe au joueur suivant.


TODO: Définir un dictionnaire de lettres possibles
TODO: Définir un dictionnaire de mots possibles

RETOURS PREMIER TEST LIVE:

- Autofocus le champ quand c'est au tour du joueur
- Saisie du joueur A, saisie apparu sur le joueur B
- Jack avait une seule vie en joignant la partie
- Rajouter un lien pour revenir aux rooms / home

<!-- TypeError: Cannot read property 'lettersToUse' of undefined
    at index.vue:177
    at Array.map (<anonymous>)
    at a.computedLetters (index.vue:176)
    at nr.get (vue.runtime.esm.js:4479)
    at nr.evaluate (vue.runtime.esm.js:4584)
    at a.computedLetters (vue.runtime.esm.js:4836)
    at a.tt (index.vue?8d9c:8)
    at a.t._render (vue.runtime.esm.js:3548)
    at a.r (vue.runtime.esm.js:4066)
    at nr.get (vue.runtime.esm.js:4479) -->

- Eviter aux joueurs de double, triple ou N cliquer, MERCI GYUkk
- Empecher les joueurs de join une game si elle est "started"
- Joueur A perds une vie, joueur B aussi (cf problème dessus)
- Ajouter une indication sur le temps qu'il reste sur la saisie
  - Remplir le cercle au centre pour l'indication
