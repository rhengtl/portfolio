---
title: TindaBot
tagline: Tells sari-sari store owners what to buy, how many, and how much money to bring — offline, in Taglish.
summary: >-
  An installable, local-first PWA: every entry is an append-only event on the phone, with optional
  Supabase sync under row-level security and an AI helper that only drafts entries for the owner to
  confirm. Business rules are tested against an independent Python reference model.
tier: flagship
order: 3
status: live
scope: Solo
role: Sole developer
timeline:
  start: 2026-05-01
  end: 2026-10-31
stack: [TypeScript, React, PostgreSQL, IndexedDB, Gemini API]
metrics:
  - label: Automated tests
    value: '294'
  - label: Faster recompute
    value: 8×
    context: 383 → 46 ms on two years of data
links:
  repo: https://github.com/RhenGTL/tindabot
  live: https://tindabot.vercel.app
cover: ../../assets/projects/tindabot/cover.png
coverAlt: >-
  TindaBot demo store on a phone: next supplier trip on Wednesday, about ₱4,990 to bring, ₱1,580
  short of the owner's budget, and a buy-now list that explains each item.
---
