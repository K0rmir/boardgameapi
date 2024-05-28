CREATE TABLE IF NOT EXISTS boardgames (
    id SERIAL PRIMARY KEY,
    game_name VARCHAR(255),
    game_description VARCHAR(255),
    year_published INTEGER,
    min_players INTEGER,
    max_players INTEGER,
    play_time INTEGER,
    min_playtime INTEGER,
    max_playtime INTEGER,
)