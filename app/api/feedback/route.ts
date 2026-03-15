import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const DATA_FILE = path.join(process.cwd(), 'data', 'feedback.json');

function readFeedback() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, '[]');
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

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

  const submissions = readFeedback();
  const entry = { id: Date.now(), submittedAt: new Date().toISOString(), ...body };
  submissions.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));

  // Send email notification
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
          <div style="background: #4f46e5; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Nieuwe feedback ontvangen</h1>
            <p style="color: #c7d2fe; margin: 4px 0 0;">Ingediend op ${new Date().toLocaleDateString('nl-NL', { dateStyle: 'full' })}</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Van</h2>
            <p><strong>Naam:</strong> ${body.name}</p>
            ${body.email ? `<p><strong>E-mail:</strong> ${body.email}</p>` : ''}
            ${body.role ? `<p><strong>Functie:</strong> ${body.role}</p>` : ''}
            <p><strong>Relatie:</strong> ${body.relationship}</p>

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Samenwerking (ratings)</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${[
                ['Communicatie', body.ratCommunicatie],
                ['Betrouwbaarheid', body.ratBetrouwbaarheid],
                ['Samenwerking', body.ratSamenwerking],
                ['Luistervaardigheid', body.ratLuistervaardigheid],
                ['Openheid voor feedback', body.ratOpenheid],
                ['Ondersteuning van collega\'s', body.ratOndersteuning],
              ].map(([label, val]) => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 6px 0; color: #6b7280;">${label}</td>
                  <td style="padding: 6px 0; font-weight: bold;">${ratingLabel(Number(val))}</td>
                </tr>
              `).join('')}
            </table>

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Professionele vaardigheden (ratings)</h2>
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
            <blockquote style="border-left: 3px solid #4f46e5; margin: 4px 0 16px; padding: 8px 12px; background: #eef2ff; border-radius: 0 4px 4px 0;">${body.openGoed}</blockquote>
            <p><strong>Waar kan ik het meest groeien?</strong></p>
            <blockquote style="border-left: 3px solid #4f46e5; margin: 4px 0 16px; padding: 8px 12px; background: #eef2ff; border-radius: 0 4px 4px 0;">${body.openGroei}</blockquote>
            ${body.openSituatie ? `<p><strong>Concrete situatie:</strong></p><blockquote style="border-left: 3px solid #e5e7eb; margin: 4px 0 16px; padding: 8px 12px; background: #f9fafb; border-radius: 0 4px 4px 0;">${body.openSituatie}</blockquote>` : ''}
            ${body.openAdvies ? `<p><strong>Advies of tip:</strong></p><blockquote style="border-left: 3px solid #e5e7eb; margin: 4px 0 16px; padding: 8px 12px; background: #f9fafb; border-radius: 0 4px 4px 0;">${body.openAdvies}</blockquote>` : ''}

            <h2 style="color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Algehele indruk</h2>
            <p><strong>Algehele beoordeling:</strong> ${'★'.repeat(Math.min(5, Math.max(0, Number(body.ratAlgemeen) || 0)))}${'☆'.repeat(5 - Math.min(5, Math.max(0, Number(body.ratAlgemeen) || 0)))} (${body.ratAlgemeen}/5)</p>
            <p><strong>Opnieuw samenwerken?</strong> ${body.opnieuwSamenwerken}</p>
            ${body.opmerking ? `<p><strong>Overige opmerkingen:</strong></p><blockquote style="border-left: 3px solid #e5e7eb; margin: 4px 0 16px; padding: 8px 12px; background: #f9fafb;">${body.opmerking}</blockquote>` : ''}
          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `${process.env.SMTP_USER}`,
        to: process.env.FEEDBACK_EMAIL ?? process.env.SMTP_USER,
        subject: `Nieuwe feedback van ${body.name}`,
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

  return NextResponse.json(readFeedback());
}
