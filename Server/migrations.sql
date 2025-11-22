-- Create the 'links' table if it doesn't already exist
CREATE TABLE IF NOT EXISTS links (
code varchar(8) PRIMARY KEY, -- Short code for the link, max 8 characters, unique
target_url text NOT NULL,-- Original URL to redirect to
created_at timestamptz NOT NULL DEFAULT now(),  -- Timestamp when the link was created (timezone aware)
deleted boolean NOT NULL DEFAULT false,  -- Soft-delete flag (false = active, true = deleted)
total_clicks bigint NOT NULL DEFAULT 0,  -- Count of how many times the link was clicked
last_clicked timestamptz  -- Timestamp of the last click (nullable)
);

-- Ensure the 'code' column is unique (redundant with primary key, but explicit index helps some queries)
CREATE UNIQUE INDEX IF NOT EXISTS idx_links_code ON links (code);

-- Index on 'deleted' column for faster queries filtering by deleted status
CREATE INDEX IF NOT EXISTS idx_links_deleted ON links (deleted);