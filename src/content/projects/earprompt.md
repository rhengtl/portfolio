---
title: EarPrompt
tagline: A wearable that listens to a conversation and whispers one short tip on how to respond.
summary: >-
  Thesis prototype: a Raspberry Pi 5 earpiece that tells the wearer's voice apart from the other
  speaker, generates a Taglish coaching tip with an LLM and streams it to Bluetooth earbuds, with a
  Flutter app for users and speech-language pathologists.
tier: flagship
order: 1
status: thesis
scope: Team of 4
role: Lead developer — audio/AI pipeline, backend, device control and most of the mobile app
timeline:
  start: 2025-10-01
  end: 2026-09-30
stack: [Python, PyTorch, LLM APIs, Raspberry Pi, Flutter]
metrics:
  - label: End-to-end latency
    value: 3.8 s avg
    context: 4.2 s P95 over 3 test sessions
  - label: LLM cost
    value: $0.02–0.07
    context: per 30-minute session
links:
  paper: https://drive.google.com/file/d/1P69KKB13oHfeHU089pQ5AMQEtUyjJy2s/view?usp=sharing
cover: ../../assets/projects/earprompt/cover.jpg
coverAlt: >-
  The EarPrompt device: a white 3D-printed enclosure with a perforated lid and a microphone module
  on top, a front panel with one red and two blue buttons and a status LED, and a Bluetooth earbud
  case docked on the side.
---
