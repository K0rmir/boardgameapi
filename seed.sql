CREATE TABLE IF NOT EXISTS boardgames (
    id SERIAL PRIMARY KEY,
    game_name TEXT,
    game_description TEXT,
    year_published INTEGER,
    min_players INTEGER,
    max_players INTEGER,
    play_time INTEGER,
    min_playtime INTEGER,
    max_playtime INTEGER,
    game_category TEXT[],
    game_mechanic TEXT[],
    game_designer TEXT[]
)

CREATE TABLE IF NOT EXISTS api_usage (
    id SERIAL PRIMARY KEY,
    api_key TEXT,
    endpoint TEXT,
    method VARCHAR(10),
    status_code INT,
    response_time_ms INT,
    timestame TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)