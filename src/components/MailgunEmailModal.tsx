import React, { useState } from 'react';
import { X, Mail, Code, Terminal, Send, CheckCircle2, Copy, Check, Key, ExternalLink, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import {
  generateOrderConfirmationEmailHtml,
  sendOrderConfirmationEmail,
  sendMailgunRawMessage,
  getMailgunConfig,
  saveMailgunConfig,
} from '../services/mailgun';

interface MailgunEmailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const MailgunEmailModal: React.FC<MailgunEmailModalProps> = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'payload' | 'live-dispatch'>('live-dispatch');
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Mailgun Config & API Key in state
  const [config, setConfig] = useState(getMailgunConfig());
  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey || '');
  const [recipientOverride, setRecipientOverride] = useState('EMMANUEL EFFIONG <zeerocodes@gmail.com>');
  const [isKeySaved, setIsKeySaved] = useState(false);

  if (!order) return null;

  const emailHtml = generateOrderConfirmationEmailHtml(order);

  const curlSnippet = `curl -s --user 'api:${apiKeyInput || 'YOUR_MAILGUN_API_KEY'}' \\
  https://api.mailgun.net/v3/${config.domain}/messages \\
  -F from='${config.fromEmail}' \\
  -F to='${recipientOverride}' \\
  -F subject='Order Confirmed #${order.id} — Serena Diamond Bespoke' \\
  -F html=@order_receipt.html`;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleSaveApiKey = () => {
    const updated = saveMailgunConfig({ apiKey: apiKeyInput.trim() });
    setConfig(updated);
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2500);
  };

  const handleTriggerLiveTestSend = async () => {
    setIsResending(true);
    setResendStatus(null);
    try {
      const result = await sendMailgunRawMessage({
        to: recipientOverride,
        subject: `Hello EMMANUEL EFFIONG — Order #${order.id} Confirmed!`,
        text: `Congratulations EMMANUEL EFFIONG, your Serena Diamond Bespoke order #${order.id} was confirmed! You are truly awesome!`,
        html: emailHtml,
        apiKeyOverride: apiKeyInput.trim(),
      });

      setIsResending(false);
      if (result.success) {
        setResendStatus(`Success! Message dispatched via Mailgun (${result.id}). Notice: ${result.message}`);
      } else {
        const fullMessage = result.hint ? `${result.message}. HINT: ${result.hint}` : result.message;
        setResendStatus(`Mailgun Notice: ${fullMessage}`);
      }
    } catch (err: any) {
      setIsResending(false);
      setResendStatus(`Dispatch error: ${err.message}`);
    }
  };

  const mailgunPayload = {
    method: 'POST',
    endpoint: `https://api.mailgun.net/v3/${config.domain}/messages`,
    headers: {
      Authorization: `Basic api:${apiKeyInput ? 'key-***' : 'YOUR_API_KEY'}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    fields: {
      from: config.fromEmail,
      to: recipientOverride || order.customer_email,
      subject: `Order Confirmed #${order.id} — Serena Diamond Bespoke Executive Atelier`,
      'o:tag': ['order-confirmation', 'executive-bespoke', 'lagos-atelier'],
      'v:order_id': order.id,
      'v:user_id': order.user_id,
      'v:currency': 'NGN',
      'v:total_amount': order.total_amount,
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] w-full max-w-4xl h-[90vh] rounded-sm border border-[#E7E2D5] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E7E2D5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#064E3B] text-[#F3E5AB] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold">
                Transactional Email Engine &bull; Mailgun Sandbox Active
              </div>
              <h3 className="font-serif text-lg text-stone-900 font-medium">
                Mailgun Dispatcher &bull; Order #{order.id}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-2.5 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('live-dispatch')}
              className={`px-3 py-1.5 font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'live-dispatch'
                  ? 'bg-[#064E3B] text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-[#F3E5AB]" />
              <span>Live Mailgun Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>Visual HTML Email</span>
            </button>

            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'html'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Branded HTML Template</span>
            </button>

            <button
              onClick={() => setActiveTab('payload')}
              className={`px-3 py-1.5 font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'payload'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-stone-600" />
              <span>API Payload & Schema</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyHtml}
              className="px-2.5 py-1 text-stone-600 hover:text-stone-900 border border-stone-300 rounded bg-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy HTML'}</span>
            </button>
          </div>
        </div>

        {/* Resend Status Alert */}
        {resendStatus && (
          <div className={`px-6 py-2.5 border-b text-xs flex items-center gap-2 ${
            resendStatus.includes('Error')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {resendStatus.includes('Error') ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span className="font-medium">{resendStatus}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-auto bg-stone-100 p-4 sm:p-6">
          
          {/* TAB: Live Sandbox Dispatcher */}
          {activeTab === 'live-dispatch' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Configuration Card */}
              <div className="bg-white p-6 rounded-sm border border-[#E7E2D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#064E3B]" />
                    <h4 className="font-serif text-base font-semibold text-stone-900">
                      Mailgun Sandbox Credentials
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Sandbox Verified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Active Mailgun Sandbox Domain
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={config.domain}
                      className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded font-mono text-stone-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Default Sender (From)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={config.fromEmail}
                      className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded font-mono text-stone-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Authorized Sandbox Recipient (To)
                    </label>
                    <input
                      type="text"
                      value={recipientOverride}
                      onChange={(e) => setRecipientOverride(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded font-mono text-stone-800 focus:outline-none focus:border-[#064E3B]"
                      placeholder="EMMANUEL EFFIONG <zeerocodes@gmail.com>"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Note: Mailgun Sandbox domains only deliver to verified authorized recipients.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Mailgun API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="Paste your Mailgun API key (e.g. key-xxxxxxxx or apikey-xxxx)"
                        className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded font-mono text-xs focus:outline-none focus:border-[#064E3B]"
                      />
                      <button
                        onClick={handleSaveApiKey}
                        className="px-4 py-2 bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                      >
                        {isKeySaved ? 'Saved!' : 'Save Key'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dispatch Button */}
                <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleTriggerLiveTestSend}
                    disabled={isResending}
                    className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#064E3B] text-[#FAF9F5] text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                  >
                    <Send className="w-4 h-4 text-[#F3E5AB]" />
                    <span>
                      {isResending
                        ? 'Executing Mailgun API Request...'
                        : 'Send Confirmation Email via Mailgun API'}
                    </span>
                  </button>
                </div>
              </div>

              {/* cURL Equivalent Card */}
              <div className="bg-stone-900 text-stone-100 p-5 rounded-sm space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>cURL Terminal Command (Official Mailgun HTTP API)</span>
                  </span>
                  <button
                    onClick={handleCopyCurl}
                    className="text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-stone-200 overflow-x-auto whitespace-pre-wrap">
                  {curlSnippet}
                </pre>
              </div>

            </div>
          )}

          {/* TAB: Visual HTML Preview */}
          {activeTab === 'preview' && (
            <div className="max-w-2xl mx-auto bg-white rounded shadow-sm border border-stone-200 overflow-hidden">
              <iframe
                title="Mailgun Email Preview"
                srcDoc={emailHtml}
                className="w-full h-[650px] border-none"
              />
            </div>
          )}

          {/* TAB: HTML Code */}
          {activeTab === 'html' && (
            <div className="max-w-3xl mx-auto bg-stone-900 text-stone-100 p-4 rounded-sm font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">{emailHtml}</pre>
            </div>
          )}

          {/* TAB: Payload */}
          {activeTab === 'payload' && (
            <div className="max-w-3xl mx-auto bg-stone-900 text-emerald-400 p-6 rounded-sm font-mono text-xs overflow-x-auto space-y-4">
              <div className="text-stone-400 font-sans">
                // Official Mailgun API HTTP Request Schema for Serena Diamond Bespoke
              </div>
              <pre className="text-emerald-300">
                {JSON.stringify(mailgunPayload, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-white border-t border-[#E7E2D5] flex items-center justify-between text-xs text-stone-500">
          <div>
            Recipient: <strong className="text-stone-800">{recipientOverride}</strong> &bull; Domain: <code className="text-[#064E3B]">{config.domain}</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
