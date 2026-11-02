import { test, expect } from '@playwright/test';

test.describe('Fase 4 SDOP: Certificación E2E de SMAKBOT Core con Backend Real y PostgreSQL', () => {

  test('Control A: Oráculo Funcional y Flujo Completo de Usuario', async ({ page }) => {
    // 1. Cargar aplicación en modo producción HTTP
    await page.goto('http://localhost:8000/frontend/dist/frontend/browser/index.html');
    await expect(page.locator('.chat-card')).toBeVisible();

    // 2. Enviar consulta de compra de producto
    const input = page.locator('.chat-text-input');
    await input.fill('Quiero comprar la silla Wynn');
    await page.locator('.send-btn').click();

    // 3. Verificar que el Backend Spring Boot y PostgreSQL respondieron con la tarjeta del producto
    await expect(page.locator('.product-preview-card')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.product-name')).toContainText('Silla Ergonómica Wynn');

    // 4. Probar componente de audio y nota de voz
    const percheroChip = page.locator('.audio-demo-chip').first();
    await percheroChip.click();
    await expect(page.locator('.transcription-result')).toBeVisible({ timeout: 6000 });

    // 5. Verificar reproductor de audio WhatsApp
    await expect(page.locator('.voice-card').first()).toBeVisible();
    await expect(page.locator('.wave-bar').first()).toBeVisible();

    // 6. Probar modal de rastreo Cargo Expreso
    await page.locator('button:has-text("Rastrear")').click();
    await expect(page.locator('.modal-card')).toBeVisible();
    await page.locator('.modal-input').fill('SMAK-ORD-1001');
    await page.locator('.modal-body .primary-btn').click();

    // 7. Navegación a Admin Backoffice
    await page.locator('a:has-text("Admin Backoffice")').click();
    await expect(page.locator('.admin-card')).toBeVisible();
  });

  test('Control B: Comparación y Regresión Visual', async ({ page }) => {
    await page.goto('http://localhost:8000/frontend/dist/frontend/browser/index.html');
    await expect(page.locator('.chat-card')).toBeVisible();
    await expect(page).toHaveScreenshot('chat-prod-baseline.png', { maxDiffPixelRatio: 0.01 });
  });

  test('Control C: Guardia de Errores en Consola y Excepciones', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.goto('http://localhost:8000/frontend/dist/frontend/browser/index.html');
    await page.waitForTimeout(2000);
    expect(consoleErrors).toHaveLength(0);
  });

  test('Control D: Intercepción de Red y Contratos REST', async ({ page }) => {
    let messageApiCalled = false;
    let messageStatus = 0;

    page.on('response', resp => {
      if (resp.url().includes('/api/v1/chat/message')) {
        messageApiCalled = true;
        messageStatus = resp.status();
      }
    });

    await page.goto('http://localhost:8000/frontend/dist/frontend/browser/index.html');
    await page.locator('.chat-text-input').fill('Hola, qué productos tienen?');
    await page.locator('.send-btn').click();
    await page.waitForTimeout(2000);

    expect(messageApiCalled).toBeTruthy();
    expect(messageStatus).toBe(200);
  });
});
