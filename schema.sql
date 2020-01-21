DROP TABLE IF EXISTS people;

CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(1000),
    last_name VARCHAR(1000)
);