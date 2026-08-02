-- ========================================================
--  ШЕЖІРЕ BUILDER - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TREES TABLE
CREATE TABLE IF NOT EXISTS public.trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Жаңа Шежіре',
    description TEXT,
    is_published BOOLEAN DEFAULT false,
    layout_orientation TEXT DEFAULT 'horizontal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. NODES TABLE (Optimized for 10,000+ genealogy entries)
CREATE TABLE IF NOT EXISTS public.nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES public.trees(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.nodes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    birth_year TEXT,
    death_year TEXT,
    gender TEXT CHECK (gender IN ('male', 'female')) DEFAULT 'male',
    zhuz TEXT CHECK (zhuz IN ('uly', 'orta', 'kishi', 'other', 'none')) DEFAULT 'none',
    clan TEXT,
    sub_clan TEXT,
    node_color TEXT DEFAULT '#10B981',
    text_color TEXT DEFAULT '#FFFFFF',
    photo_url TEXT,
    is_root BOOLEAN DEFAULT false,
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast tree traversal and parent querying
CREATE INDEX IF NOT EXISTS idx_nodes_tree_id ON public.nodes(tree_id);
CREATE INDEX IF NOT EXISTS idx_nodes_parent_id ON public.nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_nodes_zhuz ON public.nodes(zhuz);

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.node_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.nodes(id) ON DELETE CASCADE NOT NULL,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_comments ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User update
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trees: Published trees viewable by anyone, Owner has full access
CREATE POLICY "Public or owner can view trees" 
    ON public.trees FOR SELECT 
    USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own trees" 
    ON public.trees FOR ALL 
    USING (auth.uid() = user_id);

-- Nodes: Linked to accessible trees
CREATE POLICY "Nodes viewable if tree viewable" 
    ON public.nodes FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.trees 
            WHERE trees.id = nodes.tree_id 
            AND (trees.is_published = true OR trees.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage nodes in own tree" 
    ON public.nodes FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.trees 
            WHERE trees.id = nodes.tree_id 
            AND trees.user_id = auth.uid()
        )
    );

-- Functions & Triggers for auto updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trees_updated_at BEFORE UPDATE ON public.trees 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_nodes_updated_at BEFORE UPDATE ON public.nodes 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
