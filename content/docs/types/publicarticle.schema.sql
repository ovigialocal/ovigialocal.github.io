CREATE TABLE "PublicArticle" (
    title VARCHAR,
    description VARCHAR,
    story_id VARCHAR,
    locality VARCHAR,
    bairro VARCHAR,
    category VARCHAR,
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    source_repository VARCHAR,
    source_commit VARCHAR,
    source_path VARCHAR,
    source_digest VARCHAR,
    source_refs VARCHAR[],
    source_name VARCHAR,
    source_url VARCHAR,
    source_original_url VARCHAR,
    next_event_at TIMESTAMPTZ,
    next_event_kind VARCHAR,
    next_event_label VARCHAR,
    media_url VARCHAR,
    media_alt VARCHAR,
    media_caption VARCHAR,
    media_credit VARCHAR,
    media_source_url VARCHAR,
    media_width BIGINT,
    media_height BIGINT
);

COMMENT ON TABLE "PublicArticle" IS 'Matéria pública canônica de O Vigia.';
COMMENT ON COLUMN "PublicArticle".story_id IS 'Identidade estável usada na URL pública.';
COMMENT ON COLUMN "PublicArticle".published_at IS 'Momento de publicação da matéria.';
COMMENT ON COLUMN "PublicArticle".updated_at IS 'Momento de atualização material, quando houver.';
COMMENT ON COLUMN "PublicArticle".source_digest IS 'Digest da candidatura editorial aprovada.';
COMMENT ON COLUMN "PublicArticle".source_refs IS 'Lista canônica de PublicSource.source_ref usadas pela matéria.';
COMMENT ON COLUMN "PublicArticle".source_original_url IS 'Compatibilidade: origem viva da primeira fonte quando source_url aponta para snapshot verificável.';
COMMENT ON COLUMN "PublicArticle".next_event_at IS 'Próximo marco verificável usado pelos módulos temporais.';
COMMENT ON COLUMN "PublicArticle".media_url IS 'Mídia editorial opcional vinculada à matéria.';
