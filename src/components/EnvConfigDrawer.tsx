import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Database,
  Key,
  Mail,
  ShieldCheck,
  Terminal,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  SUPABASE_PROJECT_REF,
  SUPABASE_PROJECT_URL,
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  seedProductsToSupabase,
} from '../services/supabase';
import { dbService } from '../services/db';

interface EnvConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvConfigDrawer: React.FC<EnvConfigDrawerProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'supabase' | 'env' | 'schema' | 'mailgun'>('supabase');

  // Supabase states
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [anonKeyInput, setAnonKeyInput] = useState(supabaseConfig.anonKey || '');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    message: string;
    checked: boolean;
  }>({
    connected: false,
    message: '',
    checked: false,
  });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && supabaseConfig.anonKey) {
      handleTestConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const envTemplate = `# Environment Variables (.env.local)
# Project: Serena Diamond Bespoke (Lagos, Nigeria)

# Database (Supabase PostgreSQL - Active Project: ${SUPABASE_PROJECT_REF})
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.${SUPABASE_PROJECT_REF}.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_PROJECT_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKeyInput || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}

# Google OAuth 2.0 (Google Cloud Console - Active Project: gen-lang-client-0026290484)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Mailgun Transactional Email Configuration (Active Sandbox)
MAILGUN_API_KEY=YOUR_MAILGUN_API_KEY
MAILGUN_DOMAIN=YOUR_MAILGUN_DOMAIN
MAILGUN_FROM_EMAIL="Mailgun Sandbox <postmaster@YOUR_MAILGUN_DOMAIN>"

# App Config
NEXTAUTH_SECRET=9a48f7c3e1b2d5a6c8e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4
NEXT_PUBLIC_APP_URL=http://localhost:3000`;

  const migrationSql = `-- Run this in: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sizes TEXT[] NOT NULL DEFAULT '{"XS","S","M","L","XL"}',
    stock_quantity INTEGER NOT NULL DEFAULT 10,
    images TEXT[] NOT NULL DEFAULT '{}',
    fabric VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_address JSONB NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    size VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public products read access" ON products;
CREATE POLICY "Public products read access" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable product inserts for service/anon" ON products;
CREATE POLICY "Enable product inserts for service/anon" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public order placement" ON orders;
CREATE POLICY "Allow public order placement" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow order select" ON orders;
CREATE POLICY "Allow order select" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public order items insert" ON order_items;
CREATE POLICY "Allow public order items insert" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow order items select" ON order_items;
CREATE POLICY "Allow order items select" ON order_items FOR SELECT USING (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(migrationSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveAnonKey = async () => {
    const updated = saveSupabaseConfig(anonKeyInput);
    setSupabaseConfig(updated);
    await handleTestConnection();
  };

  const handleTestConnection = async () => {
    setIsTestingSupabase(true);
    const res = await testSupabaseConnection();
    setIsTestingSupabase(false);
    setSupabaseStatus({
      connected: res.connected,
      message: res.message,
      checked: true,
    });
  };

  const handleSeedProducts = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    const products = dbService.getProducts();
    const res = await seedProductsToSupabase(products);
    setIsSeeding(false);
    setSeedResult(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#FAF9F5] h-full shadow-2xl flex flex-col z-10 border-l border-[#E7E2D5]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E7E2D5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#064E3B] text-[#F3E5AB] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold">
                Backend Architecture & Cloud Services
              </div>
              <h2 className="font-serif text-xl text-stone-900 font-medium">
                Serena Diamond Bespoke Core
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-2 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('supabase')}
              className={`px-3 py-1 font-medium rounded cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'supabase'
                  ? 'bg-[#064E3B] text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#F3E5AB]" />
              <span>Supabase Project</span>
            </button>

            <button
              onClick={() => setActiveTab('env')}
              className={`px-3 py-1 font-medium rounded cursor-pointer ${
                activeTab === 'env' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
              }`}
            >
              .env.local Config
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1 font-medium rounded cursor-pointer ${
                activeTab === 'schema' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
              }`}
            >
              SQL Migration
            </button>

            <button
              onClick={() => setActiveTab('mailgun')}
              className={`px-3 py-1 font-medium rounded cursor-pointer ${
                activeTab === 'mailgun' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
              }`}
            >
              Mailgun Sandbox
            </button>
          </div>

          {activeTab === 'env' && (
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-white border border-stone-300 text-stone-700 rounded flex items-center gap-1 cursor-pointer hover:border-stone-500 shrink-0"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy .env'}</span>
            </button>
          )}

          {activeTab === 'schema' && (
            <button
              onClick={handleCopySql}
              className="px-2.5 py-1 bg-white border border-stone-300 text-stone-700 rounded flex items-center gap-1 cursor-pointer hover:border-stone-500 shrink-0"
            >
              {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB: Supabase Active Project */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              
              {/* Connected Project Card */}
              <div className="bg-white p-5 rounded-sm border border-[#E7E2D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-bold text-stone-900">
                      Active Supabase Project
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-100 text-[#064E3B] font-bold px-2 py-0.5 rounded border border-stone-200">
                    {SUPABASE_PROJECT_REF}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-400">Project Endpoint:</span>
                    <code className="text-[#064E3B] font-bold font-mono">{SUPABASE_PROJECT_URL}</code>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-400">Dashboard Link:</span>
                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#064E3B] hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Open Project Dashboard</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Direct Dashboard Quick Links */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-[11px] text-stone-800 font-semibold flex flex-col items-center gap-1 transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>SQL Editor</span>
                  </a>

                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/editor`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-[11px] text-stone-800 font-semibold flex flex-col items-center gap-1 transition-colors"
                  >
                    <Database className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>Table Editor</span>
                  </a>

                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/api`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-[11px] text-stone-800 font-semibold flex flex-col items-center gap-1 transition-colors"
                  >
                    <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>API Settings</span>
                  </a>
                </div>
              </div>

              {/* Anon Key Configuration */}
              <div className="bg-white p-5 rounded-sm border border-[#E7E2D5] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Supabase Project Anon Key (Public)
                  </label>
                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/api`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#064E3B] hover:underline flex items-center gap-1"
                  >
                    <span>Get Key from Supabase</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={anonKeyInput}
                    onChange={(e) => setAnonKeyInput(e.target.value)}
                    placeholder="Paste your anon public key (eyJh...)"
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded font-mono focus:outline-none focus:border-[#064E3B]"
                  />
                  <button
                    onClick={handleSaveAnonKey}
                    className="px-4 py-2 bg-[#064E3B] text-[#FAF9F5] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#04241B] transition-colors cursor-pointer"
                  >
                    Save & Test
                  </button>
                </div>

                {/* Connection Test Result */}
                {supabaseStatus.checked && (
                  <div
                    className={`p-3 rounded text-xs flex items-start gap-2 ${
                      supabaseStatus.connected
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border border-amber-200 text-amber-900'
                    }`}
                  >
                    {supabaseStatus.connected ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    )}
                    <div className="flex-1">{supabaseStatus.message}</div>
                  </div>
                )}
              </div>

              {/* Seed / Sync Action */}
              <div className="bg-stone-50 p-5 rounded-sm border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Sync Products to Supabase Database
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Uploads the ready-to-wear corporate attire catalog directly into your Supabase <code className="font-mono">products</code> table.
                    </p>
                  </div>
                  <button
                    onClick={handleSeedProducts}
                    disabled={isSeeding || !anonKeyInput}
                    className="px-3.5 py-2 bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" />
                    <span>{isSeeding ? 'Syncing...' : 'Sync Products'}</span>
                  </button>
                </div>

                {seedResult && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded">
                    {seedResult}
                  </div>
                )}
              </div>

              {/* Quick Step Guide */}
              <div className="p-4 bg-white border border-[#E7E2D5] rounded text-xs text-stone-700 space-y-2">
                <strong className="text-stone-900 block uppercase tracking-wider text-[11px]">
                  How to complete setup in 60 seconds:
                </strong>
                <ol className="list-decimal pl-4 space-y-1.5 text-stone-600">
                  <li>
                    Click <strong className="text-stone-800">Copy SQL</strong> on the SQL Migration tab above.
                  </li>
                  <li>
                    Open the <a href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`} target="_blank" rel="noopener noreferrer" className="text-[#064E3B] underline font-medium">Supabase SQL Editor</a> and run the script.
                  </li>
                  <li>
                    Copy your <strong className="text-stone-800">anon public key</strong> from <a href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/api`} target="_blank" rel="noopener noreferrer" className="text-[#064E3B] underline font-medium">API Settings</a> and paste it above.
                  </li>
                  <li>
                    Orders placed on the website will now automatically persist in your Supabase PostgreSQL database!
                  </li>
                </ol>
              </div>

            </div>
          )}

          {/* TAB: .env.local */}
          {activeTab === 'env' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Pre-configured with your Supabase Project (<code className="font-mono text-[#064E3B]">{SUPABASE_PROJECT_REF}</code>), active Google OAuth client, and Mailgun sandbox domain.
              </p>
              <div className="bg-stone-900 text-stone-100 p-4 rounded-sm font-mono text-xs overflow-x-auto">
                <pre className="whitespace-pre-wrap">{envTemplate}</pre>
              </div>
            </div>
          )}

          {/* TAB: SQL Migration */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>PostgreSQL DDL & RLS script for Supabase:</span>
                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#064E3B] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="bg-stone-900 text-emerald-400 p-4 rounded-sm font-mono text-xs overflow-x-auto max-h-[500px]">
                <pre className="whitespace-pre-wrap">{migrationSql}</pre>
              </div>
            </div>
          )}

          {/* TAB: Mailgun */}
          {activeTab === 'mailgun' && (
            <div className="space-y-4 text-xs text-stone-700">
              <div className="p-4 bg-white border border-stone-200 rounded space-y-2">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#064E3B]" />
                  <span>Mailgun Transactional Sandbox</span>
                </div>
                <p>
                  Configured with sandbox domain <code className="text-[#064E3B] font-mono">sandboxe83f76628af84a1eb4c6d6c3d422a624.mailgun.org</code> and authorized recipient <code className="font-mono text-stone-800">zeerocodes@gmail.com</code>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E7E2D5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#064E3B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer hover:bg-[#04241B]"
          >
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
};
