-- Enable Row Level Security on all tables
-- This ensures users can only access their own data

-- Enable RLS on circle (root table)
ALTER TABLE circle ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own teams and system teams
CREATE POLICY "Users can view own teams"
ON circle FOR SELECT
USING (auth.uid()::text = created_by OR created_by = 'system');

-- Policy: Users can insert their own teams
CREATE POLICY "Users can create teams"
ON circle FOR INSERT
WITH CHECK (auth.uid()::text = created_by);

-- Policy: Users can update their own teams
CREATE POLICY "Users can update own teams"
ON circle FOR UPDATE
USING (auth.uid()::text = created_by);

-- Policy: Users can delete their own teams
CREATE POLICY "Users can delete own teams"
ON circle FOR DELETE
USING (auth.uid()::text = created_by);

-- Enable RLS on all child tables
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

-- Purpose policies (direct child of circle)
CREATE POLICY "Users can view own team purpose"
ON purpose FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM circle 
        WHERE circle.id = purpose.circle_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team purpose"
ON purpose FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM circle 
        WHERE circle.id = purpose.circle_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Vision policies (child of purpose)
CREATE POLICY "Users can view own team vision"
ON vision FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM purpose
        JOIN circle ON circle.id = purpose.circle_id
        WHERE purpose.id = vision.purpose_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team vision"
ON vision FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM purpose
        JOIN circle ON circle.id = purpose.circle_id
        WHERE purpose.id = vision.purpose_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Mission policies (child of vision)
CREATE POLICY "Users can view own team mission"
ON mission FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM vision
        JOIN purpose ON purpose.id = vision.purpose_id
        JOIN circle ON circle.id = purpose.circle_id
        WHERE vision.id = mission.vision_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team mission"
ON mission FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM vision
        JOIN purpose ON purpose.id = vision.purpose_id
        JOIN circle ON circle.id = purpose.circle_id
        WHERE vision.id = mission.vision_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Strategy policies (child of mission)
CREATE POLICY "Users can view own team strategy"
ON strategy FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM mission
        JOIN vision ON vision.id = mission.vision_id
        JOIN purpose ON purpose.id = vision.purpose_id
        JOIN circle ON circle.id = purpose.circle_id
        WHERE mission.id = strategy.mission_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team strategy"
ON strategy FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM mission
        JOIN vision ON vision.id = mission.vision_id
        JOIN purpose ON purpose.id = vision.purpose_id
        JOIN circle ON circle.id = purpose.circle_id
        WHERE mission.id = strategy.mission_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Goal policies (child of strategy)
CREATE POLICY "Users can view own team goals"
ON goal FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM strategy
        JOIN mission ON mission.id = strategy.mission_id
        JOIN vision ON vision.id = mission.vision_id
        JOIN purpose ON purpose.id = vision.purpose_id
        JOIN circle ON circle.id = purpose.circle_id
        WHERE strategy.id = goal.strategy_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team goals"
ON goal FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM strategy
        JOIN mission ON mission.id = strategy.mission_id
        JOIN vision ON vision.id = mission.vision_id
        JOIN purpose ON purpose.id = vision.purpose_id
        JOIN circle ON circle.id = purpose.circle_id
        WHERE strategy.id = goal.strategy_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Value policies (child of circle)
CREATE POLICY "Users can view own team values"
ON value FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM circle 
        WHERE circle.id = value.circle_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team values"
ON value FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM circle 
        WHERE circle.id = value.circle_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Principle policies (child of value)
CREATE POLICY "Users can view own team principles"
ON principle FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM value
        JOIN circle ON circle.id = value.circle_id
        WHERE value.id = principle.value_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team principles"
ON principle FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM value
        JOIN circle ON circle.id = value.circle_id
        WHERE value.id = principle.value_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Behavior policies (child of principle)
CREATE POLICY "Users can view own team behaviors"
ON behavior FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM principle
        JOIN value ON value.id = principle.value_id
        JOIN circle ON circle.id = value.circle_id
        WHERE principle.id = behavior.principle_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team behaviors"
ON behavior FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM principle
        JOIN value ON value.id = principle.value_id
        JOIN circle ON circle.id = value.circle_id
        WHERE principle.id = behavior.principle_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Role policies (child of circle)
CREATE POLICY "Users can view own team roles"
ON role FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM circle 
        WHERE circle.id = role.circle_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team roles"
ON role FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM circle 
        WHERE circle.id = role.circle_id 
        AND circle.created_by = auth.uid()::text
    )
);

-- Person policies (child of role)
CREATE POLICY "Users can view own team people"
ON person FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM role 
        JOIN circle ON circle.id = role.circle_id
        WHERE role.id = person.role_id 
        AND (circle.created_by = auth.uid()::text OR circle.created_by = 'system')
    )
);

CREATE POLICY "Users can modify own team people"
ON person FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM role 
        JOIN circle ON circle.id = role.circle_id
        WHERE role.id = person.role_id 
        AND circle.created_by = auth.uid()::text
    )
);
