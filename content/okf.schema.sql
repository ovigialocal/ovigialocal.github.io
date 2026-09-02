CREATE TABLE "PublicTerritory" (
    territory_id VARCHAR PRIMARY KEY,
    name VARCHAR UNIQUE,
    parent_territory_id VARCHAR REFERENCES "PublicTerritory"(territory_id)
);

CREATE TABLE "PublicArticle" (
    story_id VARCHAR PRIMARY KEY,
    locality VARCHAR REFERENCES "PublicTerritory"(name),
    bairro VARCHAR REFERENCES "PublicTerritory"(name)
);
