---
name: demo-gap-implementation
description: Skill de integración Fullstack bajo el framework SDOP (SyborX). Guía la migración DDL (Flyway), adaptación hexagonal en Spring Boot y el Patrón Bridge dual en Angular.
---

# Skill: Demo GAP Implementation (SDOP Framework)

## Propósito
Guiar la ejecución técnica de la Fase 3 y Fase 4 tras la aprobación formal del SDD (Gate #1).

## Reglas Mandatorias
1. **Fidelidad al SDD:** La orden de trabajo es exclusivamente lo estipulado en `/docs/sdd/sdd-[modulo].md`. No se permite improvisar contratos ni tablas fuera del plano técnico.
2. **Flyway First:** Toda modificación a base de datos debe ejecutarse vía scripts de migración `V__*.sql` versionados. Queda prohibido alterar esquemas de forma manual.
3. **Bridge Pattern en Frontend:** La UI nunca invoca directamente llamadas HTTP ni servicios concretos. Consume siempre la interfaz/puerto (`InjectionToken`), conmutable por Feature Flag (`useMockData`).
4. **Fidelidad Visual del 100%:** El HTML y CSS de las vistas validadas en el Oráculo no se alteran.
5. **Certificación Playwright:** Toda implementación debe validarse contra la suite de Playwright monitoreando errores de red, excepciones de consola y comparación visual antes de someter a Gate #2.
