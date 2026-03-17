import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const KV_KEY = 'feedbacks';

function ratingLabel(value: number) {
  const v = Number(value);
  let label = '';
  if (v <= 3) label = 'Onvoldoende';
  else if (v <= 5) label = 'Matig';
  else if (v <= 7) label = 'Voldoende';
  else if (v <= 9) label = 'Goed';
  else label = 'Uitstekend';
  return `${v}/10 — ${label}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = { id: Date.now(), submittedAt: new Date().toISOString(), ...body };

  // Opslaan in Upstash Redis
  try {
    await redis.lpush(KV_KEY, JSON.stringify(entry));
  } catch (err) {
    console.error('Redis opslaan mislukt:', err);
  }

  // E-mail versturen
  console.log('Poging tot versturen mail...');
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: { rejectUnauthorized: false },
      });

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #00ade6; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Nieuwe feedback ontvangen</h1>
            <p style="color: #e0f4fb; margin: 4px 0 0;">Ingediend op ${new Date().toLocaleDateString('nl-NL', { dateStyle: 'full' })}</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Van</h2>
            <p><strong>Naam:</strong> ${body.name || 'Anoniem'}</p>
            <p><strong>Relatie:</strong> ${body.relationship}</p>

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Samenwerking</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${[
                ['Communicatie', body.ratCommunicatie],
                ['Betrouwbaarheid', body.ratBetrouwbaarheid],
                ['Samenwerking', body.ratSamenwerking],
                ['Luistervaardigheid', body.ratLuistervaardigheid],
                ['Openheid voor feedback', body.ratOpenheid],
                ["Ondersteuning van collega's", body.ratOndersteuning],
              ].map(([label, val]) => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 6px 0; color: #6b7280;">${label}</td>
                  <td style="padding: 6px 0; font-weight: bold;">${ratingLabel(Number(val))}</td>
                </tr>
              `).join('')}
            </table>

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Professionele vaardigheden</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${[
                ['Kwaliteit van werk', body.ratKwaliteit],
                ['Proactiviteit', body.ratProactiviteit],
                ['Probleemoplossend vermogen', body.ratProbleemoplossend],
                ['Aanpassingsvermogen', body.ratAanpassingsvermogen],
              ].map(([label, val]) => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 6px 0; color: #6b7280;">${label}</td>
                  <td style="padding: 6px 0; font-weight: bold;">${ratingLabel(Number(val))}</td>
                </tr>
              `).join('')}
            </table>

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Open vragen</h2>
            <p><strong>Wat doe ik bijzonder goed?</strong></p>
            <blockquote style="border-left: 3px solid #00ade6; margin: 4px 0 16px; padding: 8px 12px; background: #e0f4fb; border-radius: 0 4px 4px 0;">${body.openGoed}</blockquote>
            <p><strong>Waar kan ik het meest groeien?</strong></p>
            <blockquote style="border-left: 3px solid #00ade6; margin: 4px 0 16px; padding: 8px 12px; background: #e0f4fb; border-radius: 0 4px 4px 0;">${body.openGroei}</blockquote>
            ${body.openSituatie ? `<p><strong>Concrete situatie:</strong></p><blockquote style="border-left: 3px solid #e5e7eb; margin: 4px 0 16px; padding: 8px 12px; background: #f9fafb;">${body.openSituatie}</blockquote>` : ''}
            ${body.openAdvies ? `<p><strong>Advies of tip:</strong></p><blockquote style="border-left: 3px solid #e5e7eb; margin: 4px 0 16px; padding: 8px 12px; background: #f9fafb;">${body.openAdvies}</blockquote>` : ''}

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Algehele indruk</h2>
            <p><strong>Algehele beoordeling:</strong> ${ratingLabel(Number(body.ratAlgemeen))}</p>
            <p><strong>Opnieuw samenwerken?</strong> ${body.opnieuwSamenwerken}</p>
            ${body.opmerking ? `<p><strong>Overige opmerkingen:</strong></p><blockquote style="border-left: 3px solid #e5e7eb; margin: 4px 0 16px; padding: 8px 12px; background: #f9fafb;">${body.opmerking}</blockquote>` : ''}
          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `${process.env.SMTP_USER}`,
        to: process.env.FEEDBACK_EMAIL ?? process.env.SMTP_USER,
        subject: `Nieuwe feedback van ${body.name || 'Anoniem'}`,
        html,
      });
      console.log('Mail info:', info);
    } catch (err) {
      console.error('SMTP FOUT:', err);
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Ongeautoriseerd' }, { status: 401 });
  }

  try {
    const raw = await redis.lrange(KV_KEY, 0, -1);
    const submissions = raw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item
    );
    return NextResponse.json(submissions);
  } catch (err) {
    console.error('Redis lezen mislukt:', err);
    return NextResponse.json([], { status: 200 });
  }
}
