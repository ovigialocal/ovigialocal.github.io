CREATE TABLE "PublicTerritory" (
    territory_id VARCHAR PRIMARY KEY,
    name VARCHAR UNIQUE,
    parent_territory_id VARCHAR REFERENCES "PublicTerritory"(territory_id)
);

CREATE TABLE "PublicSource" (
    source_ref VARCHAR PRIMARY KEY
);

CREATE TABLE "PublicEdition" (
    edition_id VARCHAR PRIMARY KEY,
    path_prefix VARCHAR UNIQUE,
    municipality_territory_id VARCHAR REFERENCES "PublicTerritory"(territory_id)
);

CREATE TABLE "PublicEditionRegistry" (
    registry_id VARCHAR PRIMARY KEY,
    default_edition_id VARCHAR REFERENCES "PublicEdition"(edition_id)
);

CREATE TABLE "PublicArticle" (
    story_id VARCHAR PRIMARY KEY,
    edition_id VARCHAR REFERENCES "PublicEdition"(edition_id),
    locality VARCHAR REFERENCES "PublicTerritory"(name),
    bairro VARCHAR REFERENCES "PublicTerritory"(name)
);
