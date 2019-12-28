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
