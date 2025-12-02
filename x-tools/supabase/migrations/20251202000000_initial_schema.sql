-- Initial Schema Migration
-- Defines the STRICT HIERARCHICAL structure for the Circle Up application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Circle (Root Entity)
CREATE TABLE IF NOT EXISTS circle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo TEXT,
    state JSONB, -- Hybrid state for frontend compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- 2. Purpose (Linked to Circle)
CREATE TABLE IF NOT EXISTS purpose (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES circle(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(circle_id) -- One purpose per circle
);

-- 3. Vision (Linked to Purpose)
CREATE TABLE IF NOT EXISTS vision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purpose_id UUID REFERENCES purpose(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    archetype TEXT,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(purpose_id) -- One vision per purpose
);

-- 4. Mission (Linked to Vision)
CREATE TABLE IF NOT EXISTS mission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vision_id UUID REFERENCES vision(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    keywords TEXT[],
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vision_id) -- One mission per vision
);

-- 5. Strategy (Linked to Mission)
CREATE TABLE IF NOT EXISTS strategy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES mission(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mission_id) -- One strategy per mission
);

-- 6. Goal (Linked to Strategy, N:1)
CREATE TABLE IF NOT EXISTS goal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES strategy(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Value (Linked to Circle, N:1)
CREATE TABLE IF NOT EXISTS value (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES circle(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    explanation TEXT,
    source TEXT,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Principle (Linked to Value, N:1)
CREATE TABLE IF NOT EXISTS principle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value_id UUID REFERENCES value(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    explanation TEXT,
    rule_id TEXT,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Behavior (Linked to Principle, N:1)
CREATE TABLE IF NOT EXISTS behavior (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principle_id UUID REFERENCES principle(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    explanation TEXT,
    rule_id TEXT,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Role (Linked to Circle, N:1)
CREATE TABLE IF NOT EXISTS role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES circle(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    responsibilities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Person (Linked to Role, 1:N - One Role has many People)
-- "people: Linked to role (1:N)" implies Person table has role_id
CREATE TABLE IF NOT EXISTS person (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES role(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    picture TEXT,
    responsibilities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_circle_updated_at ON circle(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_purpose_circle_id ON purpose(circle_id);
CREATE INDEX IF NOT EXISTS idx_vision_purpose_id ON vision(purpose_id);
CREATE INDEX IF NOT EXISTS idx_mission_vision_id ON mission(vision_id);
CREATE INDEX IF NOT EXISTS idx_strategy_mission_id ON strategy(mission_id);
CREATE INDEX IF NOT EXISTS idx_goal_strategy_id ON goal(strategy_id);
CREATE INDEX IF NOT EXISTS idx_value_circle_id ON value(circle_id);
CREATE INDEX IF NOT EXISTS idx_principle_value_id ON principle(value_id);
CREATE INDEX IF NOT EXISTS idx_behavior_principle_id ON behavior(principle_id);
CREATE INDEX IF NOT EXISTS idx_role_circle_id ON role(circle_id);
CREATE INDEX IF NOT EXISTS idx_person_role_id ON person(role_id);

-- RLS
ALTER TABLE circle ENABLE ROW LEVEL SECURITY;
ALTER TABLE purpose ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal ENABLE ROW LEVEL SECURITY;
ALTER TABLE value ENABLE ROW LEVEL SECURITY;
ALTER TABLE principle ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE role ENABLE ROW LEVEL SECURITY;
ALTER TABLE person ENABLE ROW LEVEL SECURITY;

-- Public Policies (Dev)
CREATE POLICY "Public Access" ON circle FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON purpose FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON vision FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON mission FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON strategy FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON goal FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON value FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON principle FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON behavior FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON role FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON person FOR ALL USING (true) WITH CHECK (true);

-- AUTOMATION: Hierarchical Sync Trigger
CREATE OR REPLACE FUNCTION sync_circle_state() RETURNS TRIGGER AS $$
DECLARE
    state_data JSONB;
    v_purpose_id UUID;
    v_vision_id UUID;
    v_mission_id UUID;
    v_strategy_id UUID;
    v_value_id UUID;
    v_principle_id UUID;
    v_role_id UUID;
    rec RECORD;
    child_rec RECORD;
BEGIN
    state_data := NEW.state;

    -- 1. Sync Purpose (Circle -> Purpose)
    IF (state_data->'team'->>'teamPurpose') IS NOT NULL THEN
        INSERT INTO purpose (circle_id, text, description, tags, updated_at)
        VALUES (NEW.id, state_data->'team'->>'teamPurpose', state_data->'team'->'purposeMetadata'->>'description', ARRAY(SELECT jsonb_array_elements_text(state_data->'team'->'purposeMetadata'->'tags')), NOW())
        ON CONFLICT (circle_id) DO UPDATE SET text = EXCLUDED.text, description = EXCLUDED.description, tags = EXCLUDED.tags, updated_at = NOW()
        RETURNING id INTO v_purpose_id;
    END IF;

    -- 2. Sync Vision (Purpose -> Vision)
    IF v_purpose_id IS NOT NULL AND (state_data->'vision') IS NOT NULL THEN
        INSERT INTO vision (purpose_id, text, archetype, description, tags, updated_at)
        VALUES (v_purpose_id, state_data->'vision'->>'text', state_data->'vision'->>'archetype', state_data->'vision'->>'description', ARRAY(SELECT jsonb_array_elements_text(state_data->'vision'->'tags')), NOW())
        ON CONFLICT (purpose_id) DO UPDATE SET text = EXCLUDED.text, archetype = EXCLUDED.archetype, description = EXCLUDED.description, tags = EXCLUDED.tags, updated_at = NOW()
        RETURNING id INTO v_vision_id;
    END IF;

    -- 3. Sync Mission (Vision -> Mission)
    IF v_vision_id IS NOT NULL AND (state_data->'mission') IS NOT NULL THEN
        INSERT INTO mission (vision_id, text, keywords, description, tags, updated_at)
        VALUES (v_vision_id, state_data->'mission'->>'text', ARRAY(SELECT jsonb_array_elements_text(state_data->'mission'->'keywords')), state_data->'mission'->>'description', ARRAY(SELECT jsonb_array_elements_text(state_data->'mission'->'tags')), NOW())
        ON CONFLICT (vision_id) DO UPDATE SET text = EXCLUDED.text, keywords = EXCLUDED.keywords, description = EXCLUDED.description, tags = EXCLUDED.tags, updated_at = NOW()
        RETURNING id INTO v_mission_id;
    END IF;

    -- 4. Sync Strategy (Mission -> Strategy)
    IF v_mission_id IS NOT NULL AND (state_data->'strategy') IS NOT NULL THEN
        INSERT INTO strategy (mission_id, text, description, tags, updated_at)
        VALUES (v_mission_id, state_data->'strategy'->>'text', state_data->'strategy'->>'description', ARRAY(SELECT jsonb_array_elements_text(state_data->'strategy'->'tags')), NOW())
        ON CONFLICT (mission_id) DO UPDATE SET text = EXCLUDED.text, description = EXCLUDED.description, tags = EXCLUDED.tags, updated_at = NOW()
        RETURNING id INTO v_strategy_id;
    END IF;

    -- 5. Sync Goals (Strategy -> Goal)
    IF v_strategy_id IS NOT NULL THEN
        DELETE FROM goal WHERE strategy_id = v_strategy_id;
        IF (state_data->'goals') IS NOT NULL THEN
            INSERT INTO goal (strategy_id, text, updated_at)
            SELECT v_strategy_id, g, NOW()
            FROM jsonb_array_elements_text(state_data->'goals') AS g;
        END IF;
    END IF;

    -- 6. Sync Values (Circle -> Value)
    -- We need to handle IDs carefully here to link Principles
    -- For simplicity in this sync function, we'll assume labels are unique enough for matching or just recreate
    -- To do this properly with N:1 hierarchy, we iterate
    
    DELETE FROM value WHERE circle_id = NEW.id; -- Cascade deletes principles and behaviors
    
    IF (state_data->'values') IS NOT NULL THEN
        FOR rec IN SELECT * FROM jsonb_array_elements(state_data->'values')
        LOOP
            INSERT INTO value (circle_id, label, explanation, source, description, tags, updated_at)
            VALUES (NEW.id, rec.value->>'label', rec.value->>'explanation', rec.value->>'source', rec.value->>'description', ARRAY(SELECT jsonb_array_elements_text(rec.value->'tags')), NOW())
            RETURNING id INTO v_value_id;

            -- 7. Sync Principles (Value -> Principle)
            -- Find principles that derive from this value (using the ID from the JSON state)
            -- Note: JSON state uses UUIDs for linking. We need to match them.
            -- This is complex because the JSON state has its own IDs.
            -- We will try to match based on the 'derivedFromValues' array in JSON containing the Value's JSON ID.
            
            IF (state_data->'principles') IS NOT NULL THEN
                FOR child_rec IN SELECT * FROM jsonb_array_elements(state_data->'principles')
                LOOP
                    -- Check if this principle derives from the current value (by checking JSON ID match)
                    -- We assume the frontend passes the Value ID in 'derivedFromValues'
                    IF (child_rec.value->'derivedFromValues') @> jsonb_build_array(rec.value->>'id') THEN
                        INSERT INTO principle (value_id, label, explanation, rule_id, description, tags, updated_at)
                        VALUES (v_value_id, child_rec.value->>'label', child_rec.value->>'explanation', child_rec.value->>'ruleId', child_rec.value->>'description', ARRAY(SELECT jsonb_array_elements_text(child_rec.value->'tags')), NOW())
                        RETURNING id INTO v_principle_id;

                        -- 8. Sync Behaviors (Principle -> Behavior)
                        IF (state_data->'behaviors') IS NOT NULL THEN
                            INSERT INTO behavior (principle_id, label, explanation, rule_id, description, tags, updated_at)
                            SELECT v_principle_id, b->>'label', b->>'explanation', b->>'ruleId', b->>'description', ARRAY(SELECT jsonb_array_elements_text(b->'tags')), NOW()
                            FROM jsonb_array_elements(state_data->'behaviors') AS b
                            WHERE (b->'derivedFromValues') @> jsonb_build_array(child_rec.value->>'id'); -- Using Principle ID logic (frontend might need adjustment here)
                        END IF;
                    END IF;
                END LOOP;
            END IF;
        END LOOP;
    END IF;

    -- 9. Sync Roles & People (Circle -> Role -> Person)
    DELETE FROM role WHERE circle_id = NEW.id;
    IF (state_data->'roles') IS NOT NULL THEN
        FOR rec IN SELECT * FROM jsonb_array_elements_text(state_data->'roles') -- Roles are strings in current state
        LOOP
            INSERT INTO role (circle_id, name, updated_at)
            VALUES (NEW.id, rec.value, NOW())
            RETURNING id INTO v_role_id;

            -- Sync People for this Role
            IF (state_data->'people') IS NOT NULL THEN
                INSERT INTO person (role_id, name, email, picture, responsibilities, updated_at)
                SELECT v_role_id, p->>'name', p->>'email', p->>'picture', p->>'responsibilities', NOW()
                FROM jsonb_array_elements(state_data->'people') AS p
                WHERE p->>'role' = rec.value; -- Match by role name
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_circle_state ON circle;
CREATE TRIGGER trigger_sync_circle_state
AFTER INSERT OR UPDATE OF state ON circle
FOR EACH ROW
EXECUTE FUNCTION sync_circle_state();
