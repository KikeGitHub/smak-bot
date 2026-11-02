---
name: demo-gap-analysis
description: Skill de análisis de GAPs en modo estricto READ-ONLY bajo el framework SDOP (SyborX). Compara el prototipo/demo contra el Backend y BD sin modificar código de producción.
---

# Skill: Demo GAP Analysis (SDOP Framework)

## Propósito
Ejecutar la auditoría de brechas técnicas y funcionales entre el Oráculo (Demo en LocalStorage) y la arquitectura de producción Fullstack.

## Reglas Mandatorias
1. **MODO ESTRICTO READ-ONLY:** Queda terminantemente prohibido modificar archivos en `frontend/`, `backend/`, `demo/` o alterar bases de datos durante esta fase.
2. **Clasificación de Brechas:**
   - `MISSING`: Componente o endpoint inexistente que debe ser creado.
   - `PARTIAL`: Componente existente pero incompleto o desacoplado parcialmente.
   - `INCORRECT`: Implementación errónea o acoplada directamente a UI/Storage.
   - `VISUAL`: Desviación en el diseño respecto a la demo aprobada.
   - `UX`: Diferencia en tiempos de respuesta, animaciones o flujos de interacción.
   - `DATA`: Desalineación entre esquemas JSON simulados y tablas relacionales DDL.
3. **Entregable Obligatorio:**
   - Generar el reporte formal en `/docs/gap-analysis/gap-report-[modulo].md` con su matriz de evidencia.
