CREATE TABLE "PublicTerritory" (
    territory_id VARCHAR,
    name VARCHAR,
    kind VARCHAR,
    parent_territory_id VARCHAR
);

COMMENT ON TABLE "PublicTerritory" IS 'Território editorial público navegável de O Vigia.';
COMMENT ON COLUMN "PublicTerritory".territory_id IS 'Identidade estável usada na URL pública do território.';
COMMENT ON COLUMN "PublicTerritory".name IS 'Nome público do território.';
COMMENT ON COLUMN "PublicTerritory".kind IS 'Granularidade territorial declarada.';
COMMENT ON COLUMN "PublicTerritory".parent_territory_id IS 'Identidade do território pai, quando houver.';
