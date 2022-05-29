DROP TABLE IF EXISTS notebooks;
DROP TABLE IF EXISTS notes;

CREATE TABLE notebooks (
  id TEXT PRIMARY KEY,
  name TEXT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  notebook_id TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  body TEXT
);