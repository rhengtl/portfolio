---
title: ConTeX
tagline: Photograph handwriting or drop in a PDF and get LaTeX back, compiled to a PDF preview in your browser.
summary: >-
  A Cloudflare Worker owns the Gemini prompt; if the AI is unavailable, OCR and an ONNX formula
  recognizer run in the browser instead. LaTeX compiles client-side with pdfTeX in WebAssembly.
  Ported from Flask to the edge with byte-identical output.
tier: flagship
order: 2
status: live
scope: Team of 4
role: Lead developer — edge port, security audit, test suites, CI/CD
timeline:
  start: 2025-05-01
  end: 2026-09-30
stack: [JavaScript, Cloudflare Workers, Gemini API, WebAssembly, Firebase]
metrics:
  - label: Automated checks
    value: '576'
    context: plus 180 Python tests
  - label: In-browser LaTeX compile
    value: 34 ms
    context: warm, desktop
links:
  repo: https://github.com/RhenGTL/contex
  live: https://contex.rhengtl.workers.dev
cover: ../../assets/projects/contex/cover.png
coverAlt: >-
  ConTeX home page headed "Turn any page into LaTeX", with a notice that pages are sent to Gemini,
  a terms checkbox and an upload area for images and PDFs.
---
