import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, AlertTriangle, CheckCircle, Shield,
  ArrowRight, X, Loader2, Settings, BarChart3, ListChecks,
  FileSearch, ExternalLink, Copy, Check, Activity
} from 'lucide-react'
import { analyzeContract } from './analyzer'
import { demoTokenUsage } from './demoData'
import TokenUsage from './TokenUsage'

function App() {
  const [contractText, setContractText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('risks')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('mimo_api_key') || '')
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState('analyzer') // 'analyzer' | 'usage'

  const handleAnalyze = async () => {
    if (!contractText.trim()) return
    if (!apiKey.trim()) {
      setShowSettings(true)
      return
    }
    setLoading(true)
    try {
      const result = await analyzeContract(contractText, apiKey)
      setAnalysis(result)
    } catch (err) {
      alert('Analysis failed: ' + err.message)
    }
    setLoading(false)
  }

const handleSaveKey = () => {
    localStorage.setItem('mimo_api_key', apiKey)
    setShowSettings(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setContractText(ev.target.result)
    reader.readAsText(file)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setContractText(ev.target.result)
    reader.readAsText(file)
  }, [])

  const copyAnalysis = () => {
    if (!analysis) return
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const riskBadge = (level) => {
    const styles = {
      high: 'bg-red-500/10 text-red-400 border border-red-500/20',
      medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    }
    return styles[level] || styles.low
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* Top navigation */}
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)] shadow-lg shadow-indigo-500/20">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold tracking-tight">ContractShield</span>
              </div>

              {/* Nav tabs */}
              <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                <button
                  onClick={() => { setPage('analyzer'); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border-none ${
                    page === 'analyzer' ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]' : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><FileSearch size={11} /> Analyzer</span>
                </button>
                <button
                  onClick={() => setPage('usage')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border-none ${
                    page === 'usage' ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]' : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Activity size={11} /> Token Usage</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {analysis && (
                <button
                  onClick={copyAnalysis}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border)] bg-transparent transition-all cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Export JSON'}
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] bg-transparent transition-all cursor-pointer"
              >
                <Settings size={12} />
                <span className="hidden sm:inline">{apiKey ? 'Connected' : 'Setup'}</span>
                {apiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden border-t border-[var(--color-border-subtle)] px-4 py-2 flex gap-2">
          <button
            onClick={() => setPage('analyzer')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all cursor-pointer border-none ${
              page === 'analyzer' ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]' : 'bg-transparent text-[var(--color-text-muted)]'
            }`}
          >
            Analyzer
          </button>
          <button
            onClick={() => setPage('usage')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all cursor-pointer border-none ${
              page === 'usage' ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]' : 'bg-transparent text-[var(--color-text-muted)]'
            }`}
          >
            Token Usage
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text)]">API Configuration</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Connect to Xiaomi MiMo inference endpoint</p>
                </div>
                <button onClick={() => setShowSettings(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-transparent border-none cursor-pointer p-1 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)] transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Model</label>
                  <div className="px-3 py-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] font-mono">
                    MiMo-7B-RL
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Your API key is stored locally in your browser. It is only sent directly to the MiMo API endpoint and never to any third-party server.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] bg-transparent cursor-pointer hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-sm font-medium text-white border-none cursor-pointer hover:bg-[var(--color-accent-hover)] transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Token Usage Page */}
        {page === 'usage' && <TokenUsage data={demoTokenUsage} />}

        {/* Analyzer Page */}
        {page === 'analyzer' && (
          <>
            {/* Hero + Input */}
            {!analysis && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Hero */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)] mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    Powered by Xiaomi MiMo-7B-RL
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text)] leading-[1.1] mb-4">
                    Contract Risk Analysis
                    <br />
                    <span className="text-[var(--color-text-muted)]">in seconds, not hours.</span>
                  </h1>
                  <p className="text-base text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
                    Upload any legal contract and get an instant AI-powered breakdown of risks, unfair clauses, and actionable recommendations.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
                  {[
                    { label: 'Clause Types', value: '40+' },
                    { label: 'Avg Analysis', value: '<10s' },
                    { label: 'Risk Categories', value: '8' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                      <p className="text-lg font-bold text-[var(--color-text)]">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="max-w-4xl mx-auto">
                  <div
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-xl shadow-black/20"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)]" />
                          <div className="w-3 h-3 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)]" />
                          <div className="w-3 h-3 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)]" />
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">contract_input</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-accent-hover)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--color-accent-subtle)]">
                        <Upload size={12} />
                        Upload file
                        <input type="file" accept=".txt,.doc,.md,.rtf" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      placeholder="Paste your contract text here, or drag & drop a text file...

Supported: Employment agreements, NDAs, service contracts, lease agreements, partnership agreements, freelancer contracts, SaaS terms of service..."
                      className="w-full h-72 p-5 bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 resize-none focus:outline-none text-sm leading-relaxed font-mono"
                    />

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)]/50">
                      <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                        <span>{contractText.split(/\s+/).filter(Boolean).length} words</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                        <span>{contractText.length.toLocaleString()} chars</span>
                      </div>
                      <button
                        onClick={handleAnalyze}
                        disabled={!contractText.trim() || loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium cursor-pointer border-none hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 disabled:shadow-none"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <FileSearch size={14} />
                            Run Analysis
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-6 mt-6 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Shield size={10} />
                      End-to-end encrypted
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle size={10} />
                      No data stored
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText size={10} />
                      Client-side only
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-[var(--color-text)]">Analysis Report</h1>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${riskBadge(analysis.overallRisk)}`}>
                        {analysis.overallRisk} risk
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {analysis.contractType} · {analysis.risks.length} issues found · {analysis.recommendations.length} recommendations
                    </p>
                  </div>
                  <button
                    onClick={() => { setAnalysis(null); setContractText('') }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] bg-transparent cursor-pointer transition-all hover:bg-[var(--color-surface)]"
                  >
                    <FileText size={12} />
                    New Analysis
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                  <MetricCard
                    label="Risk Score"
                    value={`${analysis.riskScore}/100`}
                    color={analysis.overallRisk === 'high' ? 'danger' : analysis.overallRisk === 'medium' ? 'warning' : 'success'}
                  />
                  <MetricCard label="Contract Type" value={analysis.contractType} />
                  <MetricCard label="Parties" value={analysis.parties || '—'} />
                  <MetricCard label="Issues Found" value={analysis.risks.length.toString()} color={analysis.risks.length > 3 ? 'danger' : 'warning'} />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] w-fit mb-6">
                  {[
                    { id: 'risks', label: 'Risks', icon: AlertTriangle, count: analysis.risks.length },
                    { id: 'recommendations', label: 'Fixes', icon: ListChecks, count: analysis.recommendations.length },
                    { id: 'summary', label: 'Summary', icon: BarChart3 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border-none ${
                        activeTab === tab.id
                          ? 'bg-[var(--color-accent)] text-white shadow-sm'
                          : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      <tab.icon size={12} />
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className={`ml-0.5 px-1.5 py-0.5 rounded text-[10px] ${
                          activeTab === tab.id ? 'bg-white/20' : 'bg-[var(--color-surface-2)]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'risks' && (
                    <motion.div
                      key="risks"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {analysis.risks.map((risk, i) => (
                        <div key={i} className="group p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-border)] transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${riskBadge(risk.level)}`}>
                                  <AlertTriangle size={9} />
                                  {risk.level}
                                </span>
                              </div>
                              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">{risk.title}</h4>
                              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{risk.description}</p>
                              {risk.clause && (
                                <div className="mt-3 p-2.5 rounded-md bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">
                                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Referenced Clause</p>
                                  <p className="text-xs text-[var(--color-text-secondary)] italic font-mono leading-relaxed">"{risk.clause}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'recommendations' && (
                    <motion.div
                      key="recommendations"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {analysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0 mt-0.5">
                            <CheckCircle size={12} className="text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'summary' && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={14} className="text-[var(--color-accent)]" />
                        <h4 className="text-sm font-semibold text-[var(--color-text)]">Executive Summary</h4>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">{analysis.summary}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Shield size={12} className="text-[var(--color-accent)]" />
            <span>ContractShield AI</span>
            <span className="text-[var(--color-border)]">·</span>
            <span>Powered by Xiaomi MiMo</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span>© 2026</span>
            <a href="https://github.com" target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-[var(--color-text-secondary)] transition-colors no-underline text-[var(--color-text-muted)]">
              GitHub <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MetricCard({ label, value, color }) {
  const colorClasses = {
    danger: 'text-red-400',
    warning: 'text-amber-400',
    success: 'text-emerald-400',
  }

  return (
    <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className={`text-lg font-bold truncate ${color ? colorClasses[color] : 'text-[var(--color-text)]'}`}>
        {value}
      </p>
    </div>
  )
}

export default App
