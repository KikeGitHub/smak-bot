# ADR-001: Selección de Stack Tecnológico y Arquitectura Multitenant

- **Estado:** Aceptado
- **Fecha:** 2026-10-30
- **Autor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX / SDOP Framework)
- **Contexto:** Plataforma comercial omnicanal SMAKBOT (WhatsApp Business + Web Chatbot + Backoffice SaaS Multitenant)

---

## 1. Contexto del Problema
SMAKBOT requiere evolucionar desde un prototipo funcional validado en `LocalStorage` (Fase 0 - Oráculo) hacia una arquitectura Fullstack de grado empresarial capaz de:
1. Servir como gateway de WhatsApp Business mediante Meta Cloud API con concurrencia masiva y tiempos de respuesta de Webhook < 3 segundos.
2. Servir como chatbot embebible de alta velocidad para múltiples comercios web.
3. Permitir administración multitenant de catálogos, configuraciones de Meta y pedidos en tiempo real.
4. Respetar los 6 pilares de la metodología SDOP (Audit-First, Patrón Bridge, Arquitectura Hexagonal, READ-ONLY Gap Analysis, Oráculo Playwright, Gobernanza Human-in-the-Loop).

---

## 2. Decisión Tomada

Se adopta formalmente el siguiente stack tecnológico y de patrones:

| Capa | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Persistencia** | **PostgreSQL 16+** | Soporte híbrido relacional (ACID para órdenes) + columnas `jsonb` para esquemas de catálogos dinámicos, historiales de chat y eventos crudos de Meta. Aislamiento multitenant por `tenant_id`. |
| **Backend** | **Spring Boot 3.3.x (Java 17 LTS)** | Robustez empresarial, inyección de dependencias estricta para puertos y adaptadores (Arquitectura Hexagonal), soporte de Virtual Threads / `@Async` para webhooks de Meta, y documentación viva mediante `springdoc-openapi`. |
| **Migraciones** | **Flyway** | Control de versiones inmutable y reproducible del esquema DDL en base de datos. Cero modificaciones manuales. |
| **Frontend SaaS** | **Angular 20 (Standalone Components)** | Dominio total del equipo, tipado estricto, inyección de dependencias para el Patrón Bridge (`ChatWidgetPort` conmutando entre `LocalStorageAdapter` y `HttpAdapter`), rendimiento y mantenimiento a largo plazo. |
| **Web Widget** | **SDK Vanilla / Shadow DOM / Iframe Bridge** | Distribución ultraligera (<30 KB) para sitios externos sin colisiones de CSS ni dependencias pesadas. |
| **Oráculo de Pruebas** | **Playwright Test Suite** | Intercepción de red, monitoreo de consola (cero errores 500/excepciones JS) y regresión visual de fidelidad (`toHaveScreenshot`). |

---

## 3. Consecuencias
- **Positivas:**
  - Desacoplamiento total entre la lógica de negocio (`SalesEngineUseCase`) y los proveedores de canales (Meta WhatsApp, Web Widget REST).
  - Reutilización al 100% de la heurística comercial validada en la Fase 0 (reglas de Honduras, CAEX, RTN, llaves Allen, cotizaciones de volumen).
  - Capacidad de conmutar en cualquier momento entre modo Mock/Demo y modo Producción mediante Feature Flags (`useMockData`).
- **Mitigaciones:**
  - El monolito JavaScript `bot-engine.js` se portará a servicios Java desacoplados usando el patrón Strategy y State Machine, aumentando la mantenibilidad y cobertura de pruebas unitarias.
