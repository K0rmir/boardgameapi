# boardapi

#### This API stores the data of over 21,000 board games.

In order to successfully use boardapi, an API key is required. This should be included in the header of every request.

You can register for a key, as well find the documentation and support at [boardapi.dev](https://boardapi.kormir.dev/). Please note this site is currently under development and is subject to change.

Requests are limited to 50 per each 15 minute window.

## Endpoints

`/boardgames` - This is the primary endpoint and should always be used before other queries as you will see below. Queried as is, it will return every single board game. Results are paginated and limited to 50 rows per page.

`/gamename` - This endpoint will return a single board game matching the name entered. Eg. `/boardgames/Catan` will return 1 result for Catan.

`/random` - This endpoint will return a board game at random from the total pool of board games. Eg. `/boardgames/random`

## Query Parameters

`?maxplayers=`

- Used on the primary endpoint, this query param returns all board games where the maxplayers key equals the value.
- Eg. `/boardgames/?maxplayers=4` will return all 4 player board games.
- Results are paginated and limited to 100 per page (unless changed with the `pagesize` query param). This query param only accepts an `Integer`.

`?playtime=`

- Used on the primary endpoint, this query param returns all board games where the playtime key equals the value.
- Eg. `/boardgames/?playtime=60` will return all board games that have a max playtime of 60 minutes.
- Results are paginated and limited to 100 per page (unless changed with the `pagesize` query param). Value should be entered in minutes only. This query param only accepts an `Integer`.

`?yearpublished=`

- Used on the primary endpoint, this query param returns all board games where the yearpublished key equals the value.
- Eg. `/boardgames/?yearpublished=2019` will return all board games that were published in 2019.
- Results are paginated and limited to 100 per page (unless changed with the `pagesize` query param). Value should be entered as year only. This query param only accepts an `Integer`.

`?gamecategory=`

- Used on the primary endpoint, this query param returns all board games where the gamecategory key matches the value.
- Eg. `/boardgames/?gamecategory=Fantasy` will return all board games that contain the gamecategory `Fantasy`.
- Results are paginated and limited to 100 per page (unless changed with the `pagesize` query param). Value should be entered as text only, with spaces if required. This query param only accepts a `String`.

`?gamemechanic=`

- Used on the primary endpoint, this query param returns all board games where the gamemechanic key matches the value.
- Eg. `/boardgames/?gamemechanic=Dice%20Rolling` will return all board games that contain the gamemechanic `Dice Rolling`.
- Results are paginated and limited to 100 per page (unless changed with the `pagesize` query param). Value should be entered as text only, with spaces if required. This query param only accepts a `String`.

`?gamedesigner=`

- Used on the primary endpoint, this query param returns all board games where the gamedesigner key matches the value.
- Eg. `/boardgames/?gamedesigner=Matt%20Leacock` will return all board games that contain the gamedesigner `Matt Leacock`.
- Results are paginated and limited to 100 per page (unless changed with the `pagesize` query param). Value should be entered as text only, with spaces if required. This query param only accepts a `String`.

`?page=`

- Used on the primary endpoint, this query param returns a specific page where the page number matches the value.
- Eg. `/boardgames/?page=5` will return the 5th page of results.
- Results are paginated and limited to 100 per page, (unless changed with the `pagesize` query param). This query param only accepts an `Integer`.

`?pagesize=`

- Used on the primary endpoint, this query param alters how many results are returned per page.
- Eg. `/boardgames/?pagesize=10` will return 10 boardgames.
- By default, this is set to 100. You cannot return greater than 100 results, attempting to do so will just return 100.
