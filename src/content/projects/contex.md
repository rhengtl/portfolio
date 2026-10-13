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
  live: https://contex.rhengtl.tech
cover: ../../assets/projects/contex/cover.png
coverAlt: >-
  Input and output of a ConTeX conversion. Input: a handwritten page reading "The energy of a
  particle is given by E = mc², where c is the speed of light in vacuum." Output: the LaTeX ConTeX
  returned, with the sentence as text and the equation as display math \[ E = mc^2 \].
---
