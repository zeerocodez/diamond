import { Order } from '../types';

export const MAILGUN_CONFIG_STORAGE_KEY = 'sdb_mailgun_config_v1';

export interface MailgunConfig {
  apiKey: string;
  keyId?: string;
  domain: string;
  fromEmail: string;
  defaultRecipientName: string;
  defaultRecipientEmail: string;
}

export const DEFAULT_MAILGUN_CONFIG: MailgunConfig = {
  apiKey: 'REMOVED_MAILGUN_KEY',
  keyId: '7543e985-bb815cb5',
  domain: 'sandboxe83f76628af84a1eb4c6d6c3d422a624.mailgun.org',
  fromEmail: 'Mailgun Sandbox <postmaster@sandboxe83f76628af84a1eb4c6d6c3d422a624.mailgun.org>',
  defaultRecipientName: 'EMMANUEL EFFIONG',
  defaultRecipientEmail: 'zeerocodes@gmail.com',
};

export function getMailgunConfig(): MailgunConfig {
  try {
    const stored = localStorage.getItem(MAILGUN_CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Upgrade if empty or old placeholder
      if (!parsed.apiKey || parsed.apiKey === 'API_KEY' || parsed.apiKey === 'MY_MAILGUN_API_KEY') {
        parsed.apiKey = DEFAULT_MAILGUN_CONFIG.apiKey;
        parsed.keyId = DEFAULT_MAILGUN_CONFIG.keyId;
        localStorage.setItem(MAILGUN_CONFIG_STORAGE_KEY, JSON.stringify(parsed));
      }
      return { ...DEFAULT_MAILGUN_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed reading mailgun config from storage', e);
  }
  return DEFAULT_MAILGUN_CONFIG;
}

export function saveMailgunConfig(config: Partial<MailgunConfig>): MailgunConfig {
  const current = getMailgunConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(MAILGUN_CONFIG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed writing mailgun config to storage', e);
  }
  return updated;
}

export interface MailgunSendResult {
  success: boolean;
  status: 'sent' | 'simulated' | 'failed';
  messageId: string;
  recipient: string;
  subject: string;
  htmlContent: string;
  error?: string;
  hint?: string;
  timestamp: string;
  payloadSummary: {
    domain: string;
    from: string;
    to: string;
    subject: string;
    itemCount: number;
    totalAmountFormatted: string;
  };
}

export function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

/**
 * Generates an executive, branded luxury HTML email for Serena Diamond Bespoke
 */
export function generateOrderConfirmationEmailHtml(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #EBE6DD;">
          <div style="font-weight: 600; color: #1C1917; font-size: 15px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            ${item.product_name}
          </div>
          <div style="font-size: 13px; color: #78716C; margin-top: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            Bespoke Size: <strong style="color: #064E3B;">${item.size}</strong> &nbsp;|&nbsp; Quantity: ${item.quantity}
          </div>
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #EBE6DD; text-align: right; vertical-align: top; font-weight: 600; color: #1C1917; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 15px;">
          ${formatNGN(item.unit_price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation | Serena Diamond Bespoke</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF9F5;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E7E2D5; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(6, 78, 59, 0.04);">
    
    <!-- Top Emerald Header Bar -->
    <tr>
      <td style="background-color: #064E3B; padding: 36px 32px; text-align: center;">
        <div style="color: #F3E5AB; letter-spacing: 0.25em; font-size: 11px; text-transform: uppercase; font-family: 'Plus Jakarta Sans', Arial, sans-serif; margin-bottom: 8px;">
          Lagos Atelier &bull; Executive Ready-To-Wear
        </div>
        <h1 style="color: #FAF9F5; font-family: 'Georgia', serif; font-size: 26px; font-weight: 400; letter-spacing: 0.08em; margin: 0; text-transform: uppercase;">
          Serena Diamond Bespoke
        </h1>
        <div style="width: 48px; height: 1px; background-color: #C5A059; margin: 16px auto 0 auto;"></div>
      </td>
    </tr>

    <!-- Body Notice -->
    <tr>
      <td style="padding: 36px 32px 24px 32px;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #064E3B; font-weight: 700; margin-bottom: 8px;">
          Official Order Confirmation &bull; Reference #${order.id}
        </div>
        <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #1C1917; margin: 0 0 16px 0; font-weight: 500;">
          Dear ${order.customer_name},
        </h2>
        <p style="color: #44403C; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
          Thank you for commissioning Serena Diamond Bespoke. Your order has been registered at our Victoria Island Atelier. Our master tailors and concierge team are preparing your executive garments with the highest standard of craftsmanship.
        </p>

        <!-- Order Meta Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F5; border-left: 3px solid #064E3B; padding: 16px; margin-bottom: 28px;">
          <tr>
            <td>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="4">
                <tr>
                  <td style="font-size: 13px; color: #78716C; width: 40%;">Order Identifier:</td>
                  <td style="font-size: 13px; font-weight: 600; color: #064E3B;">${order.id}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #78716C;">Date of Order:</td>
                  <td style="font-size: 13px; color: #1C1917;">${new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #78716C;">Payment Status:</td>
                  <td style="font-size: 13px; font-weight: 600; color: #059669;">Verified (${order.payment_method})</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #78716C;">Concierge Dispatch:</td>
                  <td style="font-size: 13px; color: #1C1917;">${order.shipping_address.area}, ${order.shipping_address.stateOrCity}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Purchased Items Breakdown -->
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #1C1917; margin: 0 0 12px 0; border-bottom: 2px solid #1C1917; padding-bottom: 8px;">
          Commissioned Garments
        </h3>

        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          ${itemsHtml}
        </table>

        <!-- Totals Calculation -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="4" style="border-top: 1px solid #1C1917; padding-top: 12px; margin-bottom: 32px;">
          <tr>
            <td style="font-size: 14px; color: #78716C;">Subtotal:</td>
            <td style="font-size: 14px; text-align: right; color: #1C1917;">${formatNGN(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="font-size: 14px; color: #78716C;">Atelier White-Glove Dispatch:</td>
            <td style="font-size: 14px; text-align: right; color: #1C1917;">${order.shipping_fee === 0 ? 'Complimentary' : formatNGN(order.shipping_fee)}</td>
          </tr>
          <tr>
            <td style="font-size: 16px; font-weight: 700; color: #064E3B; padding-top: 8px;">Total Investment:</td>
            <td style="font-size: 18px; font-weight: 700; text-align: right; color: #064E3B; padding-top: 8px;">${formatNGN(order.total_amount)}</td>
          </tr>
        </table>

        <!-- Delivery Address -->
        <div style="background-color: #FAF9F5; padding: 20px; border-radius: 4px; margin-bottom: 32px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #78716C; margin-bottom: 6px;">
            Concierge Delivery Address
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #1C1917;">${order.shipping_address.fullName}</div>
          <div style="font-size: 14px; color: #44403C; line-height: 1.5; margin-top: 2px;">
            ${order.shipping_address.streetAddress}<br>
            ${order.shipping_address.area}, ${order.shipping_address.stateOrCity}, Nigeria<br>
            Contact: ${order.shipping_address.phone}
          </div>
        </div>

        <!-- Atelier Note -->
        <p style="font-size: 13px; color: #78716C; line-height: 1.6; margin: 0 0 20px 0;">
          <strong>Executive Alterations Guarantee:</strong> Each ready-to-wear corporate piece comes with complimentary fitting adjustments at our Victoria Island Atelier within 14 days of delivery.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #1C1917; padding: 28px 32px; text-align: center; color: #A8A29E; font-size: 12px; line-height: 1.6;">
        <div style="color: #F3E5AB; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">
          Serena Diamond Bespoke Atelier
        </div>
        14A Walter Carrington Crescent, Victoria Island, Lagos, Nigeria<br>
        Concierge WhatsApp: +234 (0) 809 555 4321 &bull; Email: concierge@serenadiamondbespoke.com<br>
        <span style="display: inline-block; margin-top: 10px; color: #78716C; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Serena Diamond Bespoke. All rights reserved.
        </span>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generic Mailgun Message Sender
 * Uses backend proxy /api/mailgun/send to avoid browser CORS restrictions
 */
export async function sendMailgunRawMessage({
  to,
  subject,
  html,
  text,
  apiKeyOverride,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  apiKeyOverride?: string;
}): Promise<{ success: boolean; id?: string; message: string; rawResponse?: any; hint?: string }> {
  const config = getMailgunConfig();
  const apiKey = (apiKeyOverride && apiKeyOverride.trim()) || config.apiKey;
  const domain = config.domain;
  const from = config.fromEmail;

  // 1. Try sending through the Server-Side Proxy route /api/mailgun/send
  try {
    const response = await fetch('/api/mailgun/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
        apiKey,
        domain,
        from,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        id: data.id || `mg-${Date.now()}`,
        message: data.message || 'Queued. Thank you.',
        rawResponse: data,
      };
    } else {
      return {
        success: false,
        message: data.error || data.message || `Mailgun HTTP ${response.status}`,
        hint: data.hint,
        rawResponse: data,
      };
    }
  } catch (backendErr: any) {
    console.warn('Backend proxy error, checking simulated dispatch:', backendErr);

    // If API key is empty or placeholder, inform clearly
    if (!apiKey || apiKey === 'MY_MAILGUN_API_KEY' || apiKey === 'API_KEY') {
      return {
        success: true,
        id: `sim-mg-${Date.now()}`,
        message: `[Simulated Dispatch to ${to}]: API key not set. Enter your Mailgun API key in the Mailgun tab to send live emails.`,
      };
    }

    return {
      success: false,
      message: backendErr.message || 'Unable to reach email service',
    };
  }
}

/**
 * Order Confirmation Email Sender
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<MailgunSendResult> {
  const config = getMailgunConfig();
  const mailgunApiKey = config.apiKey || '';
  const mailgunDomain = config.domain;
  const mailgunFrom = config.fromEmail;

  const subject = `Order Confirmed #${order.id} — Serena Diamond Bespoke Executive Atelier`;
  
  // In Mailgun sandbox, non-authorized emails will fail with HTTP 400.
  // If in sandbox mode and order is not from the authorized sandbox recipient,
  // we target the authorized recipient so the email is genuinely delivered!
  const isSandbox = mailgunDomain.includes('sandbox');
  let recipient = order.customer_email;
  if (isSandbox && config.defaultRecipientEmail) {
    recipient = `${order.customer_name} <${config.defaultRecipientEmail}>`;
  }

  const htmlContent = generateOrderConfirmationEmailHtml(order);

  const payloadSummary = {
    domain: mailgunDomain,
    from: mailgunFrom,
    to: recipient,
    subject: subject,
    itemCount: order.items.length,
    totalAmountFormatted: formatNGN(order.total_amount),
  };

  // If Mailgun API key is configured, send through server proxy
  if (mailgunApiKey && mailgunApiKey !== 'MY_MAILGUN_API_KEY' && mailgunApiKey !== 'API_KEY') {
    const rawResult = await sendMailgunRawMessage({
      to: recipient,
      subject,
      html: htmlContent,
      apiKeyOverride: mailgunApiKey,
    });

    if (rawResult.success) {
      return {
        success: true,
        status: rawResult.id?.startsWith('sim-') ? 'simulated' : 'sent',
        messageId: rawResult.id || `mg-${Date.now()}`,
        recipient,
        subject,
        htmlContent,
        timestamp: new Date().toISOString(),
        payloadSummary,
      };
    } else {
      return {
        success: false,
        status: 'failed',
        messageId: `failed-mg-${Date.now()}`,
        recipient,
        subject,
        htmlContent,
        error: rawResult.message,
        hint: rawResult.hint,
        timestamp: new Date().toISOString(),
        payloadSummary,
      };
    }
  }

  // Graceful simulation: Mailgun API keys are absent or placeholder
  return {
    success: true,
    status: 'simulated',
    messageId: `sim-mg-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    recipient,
    subject,
    htmlContent,
    timestamp: new Date().toISOString(),
    payloadSummary,
  };
}
