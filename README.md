# Bombparty

TODO:

- Allow user to create a room in a specific langage
  - Perhaps having an API to get/check words
- Add scores per room
- Add a visual info for self in players list

Dictionnary service:

  // Returns a letter for a specific locale
- GET /letters/:locale
    ?length=2/3 if not present, random between 2
  // Check if the word belongs to the dictionnary
- POST /words/:locale
    { word: 'MANGER' }
