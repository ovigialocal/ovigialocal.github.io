CREATE TABLE "PublicSource" (
    source_ref VARCHAR,
    name VARCHAR,
    source_kind VARCHAR,
    publisher VARCHAR,
    observed_at TIMESTAMPTZ,
    source_url VARCHAR,
    source_original_url VARCHAR,
    archive_status VARCHAR,
    archive_failure_code VARCHAR
);

COMMENT ON TABLE "PublicSource" IS 'Fonte factual pública com proveniência própria.';
COMMENT ON COLUMN "PublicSource".source_ref IS 'Locator estável da source-observation correspondente na Redação.';
COMMENT ON COLUMN "PublicSource".observed_at IS 'Momento em que a Redação verificou a origem.';
COMMENT ON COLUMN "PublicSource".source_url IS 'Snapshot verificável preferido ou origem viva quando o arquivo não se aplica/falhou validamente.';
