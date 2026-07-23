#!/usr/bin/env node
// Propaga data/contact.json (telefone/e-mail) para todos os *.html do site.
// Uso: node scripts/sync-contact.mjs
//
// Evita duplicidade manual: o número de WhatsApp e o e-mail hoje aparecem
// dezenas de vezes entre index.html, servicos.html, projetos.html e
// contato.html (links wa.me, mailto, JSON-LD). Trocar um deles à mão corre
// o risco real de esquecer uma ocorrência. Este script lê a fonte única em
// data/contact.json e sincroniza todos os arquivos automaticamente.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const contact = JSON.parse(readFileSync(join(rootDir, 'data/contact.json'), 'utf8'));

const htmlFiles = readdirSync(rootDir).filter((name) => name.endsWith('.html'));

let totalChanges = 0;

for (const file of htmlFiles) {
  const filePath = join(rootDir, file);
  const original = readFileSync(filePath, 'utf8');
  let updated = original;
  let changes = 0;

  // 1) E-mail: descobre o e-mail atual pelo contexto "mailto:" e substitui
  //    todas as ocorrências literais dele (href e texto visível do link).
  const mailtoMatch = updated.match(/mailto:([\w.+-]+@[\w.-]+)/);
  if (mailtoMatch && mailtoMatch[1] !== contact.email) {
    const oldEmail = mailtoMatch[1];
    const escaped = oldEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const count = (updated.match(new RegExp(escaped, 'g')) || []).length;
    updated = updated.replaceAll(oldEmail, contact.email);
    changes += count;
  }

  // 2) WhatsApp (wa.me/<dígitos>) — não mexe na query string (?text=...).
  updated = updated.replace(/wa\.me\/\d+/g, (match) => {
    if (match !== `wa.me/${contact.whatsappDigits}`) changes += 1;
    return `wa.me/${contact.whatsappDigits}`;
  });

  // 3) Telefone formatado no JSON-LD (schema.org "telephone").
  updated = updated.replace(/("telephone":\s*")[^"]*(")/g, (match, pre, post) => {
    if (match !== `${pre}${contact.phoneDisplay}${post}`) changes += 1;
    return `${pre}${contact.phoneDisplay}${post}`;
  });

  if (updated !== original) {
    writeFileSync(filePath, updated, 'utf8');
  }

  console.log(`${file}: ${changes} ocorrência(s) sincronizada(s)`);
  totalChanges += changes;
}

console.log(
  totalChanges === 0
    ? '\nTudo já estava sincronizado com data/contact.json.'
    : `\n${totalChanges} ocorrência(s) atualizada(s) no total.`
);
