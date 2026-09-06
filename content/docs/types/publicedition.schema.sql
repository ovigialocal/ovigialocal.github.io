CREATE TABLE "PublicEdition" (
    "country_code" VARCHAR,
    "description" VARCHAR,
    "edition_id" VARCHAR,
    "geo_radius_km" BIGINT,
    "latitude" DOUBLE,
    "locale" VARCHAR,
    "longitude" DOUBLE,
    "municipality_ibge_code" VARCHAR,
    "municipality_territory_id" VARCHAR,
    "name" VARCHAR,
    "path_prefix" VARCHAR,
    "state_code" VARCHAR,
    "status" VARCHAR,
    "timezone" VARCHAR,
    "title" VARCHAR,
    "geo_names" VARCHAR[]
);

COMMENT ON TABLE "PublicEdition" IS 'Registry público canônico das edições locais de O Vigia.';
COMMENT ON COLUMN "PublicEdition"."edition_id" IS 'Identidade estável da edição, referenciada por PublicArticle.';
COMMENT ON COLUMN "PublicEdition"."path_prefix" IS 'Namespace público absoluto da edição, sem barra final.';
COMMENT ON COLUMN "PublicEdition"."municipality_ibge_code" IS 'Código IBGE de sete dígitos preservado como string.';
COMMENT ON COLUMN "PublicEdition"."geo_names" IS 'Nomes aproximados aceitos do provedor GeoIP para sugestão de edição.';
