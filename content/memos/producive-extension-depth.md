---
title: "Producive: Algorithm Warfare & The Firewall for Attention"
date: "2026-03-15"
tags: ["SYSTEMS", "ALGO_WARFARE", "PRODUCTIVITY"]
excerpt: "Taking control back from the YouTube algorithm through hard site constraints and DOM-level intercepts."
---

[SYSTEM_ANALYSIS]: The modern web is structurally hostile to deep work. It is not an accident; it is an optimized engineering outcome. Every pixel on a major platform is designed to hijack the operator's attention spans and maximize watch-time telemetry. Producive is my architectural counter-offensive.

A generic 'site blocker' is a blunt instrument—it's easily bypassed and lacks nuance. I wanted to build a precision filter. Producive doesn't just block YouTube; it re-engineers it. By intercepting YouTube's internal API flows and utilizing mutation observers on the DOM, the extension allows the operator to use the platform for high-value learning while completely neutralizing the algorithmically-designed rabbit holes.

Building a browser extension meant operating within the strict security and memory sandboxes of Manifest V3. We had to ensure that the persistent stopwatch overlay and site-blocking logic were hyper-performant, consuming sub-1% of the host machine's resources while maintaining a sub-10ms response time on DOM modifications.

The goal was to treat the user's attention as a finite, high-value resource that requires an active defense system. If the platform is the adversary, the extension is the shield.

[SYS_CONCLUSION]: In an era of algorithmic consumption, we must build personal systems of constraint. If you do not architect your own environment, the platforms will architect it for you.
