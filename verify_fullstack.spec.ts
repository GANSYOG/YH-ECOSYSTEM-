import { test, expect } from '@playwright/test';

test('Full-stack Integration: Analytics, Logs, and Agent Management', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:3000');
    await page.getByLabel('Command Email').fill('admin@neural.link');
    await page.getByLabel('Access Cipher').fill('neuro-99');
    await page.getByRole('button', { name: 'Initialize' }).click();

    // 2. Navigate to Admin
    await page.getByRole('button', { name: 'Core Analytics' }).click();

    // 2. Dashboard - Analytics
    await expect(page.getByText('Command Center')).toBeVisible();
    await expect(page.getByText('Active Neural Nodes')).toBeVisible();
    await page.screenshot({ path: 'verification/fs_dashboard.png' });

    // 3. Dashboard - Logs
    await page.getByRole('button', { name: /logs/i }).click();
    await expect(page.getByText('Interaction Logs')).toBeVisible();
    await page.screenshot({ path: 'verification/fs_logs.png' });

    // 4. Dashboard - Agents (CRUD)
    await page.getByRole('button', { name: 'agents', exact: true }).click();
    await expect(page.getByText('Agent Manifest')).toBeVisible();

    // Wait for agents to load (wait for the "Edit" button of the first agent)
    const editButton = page.getByRole('button', { name: 'Edit' }).first();
    await editButton.waitFor({ state: 'visible', timeout: 10000 });

    // Edit the first agent
    await editButton.click();
    await expect(page.getByText('Reconfigure Neural Unit')).toBeVisible();

    const nameInput = page.getByLabel('Agent Name');
    const originalName = await nameInput.inputValue();
    await nameInput.fill(originalName + ' (Modified)');
    await page.getByRole('button', { name: 'Apply Configuration' }).click();

    // Verify modification
    await expect(page.getByText(originalName + ' (Modified)')).toBeVisible();
    await page.screenshot({ path: 'verification/fs_agent_edited.png' });

    // 5. Chat Integration
    await page.getByRole('button', { name: 'Exit Analytics' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification/pre_click_agent.png' });

    // Click "Access Brain" on the first agent card
    await page.getByRole('button', { name: 'Access Brain' }).first().click();

    // Click "Neural Link" tab in the modal
    await page.getByRole('button', { name: 'Neural Link' }).click();

    const chatInput = page.getByPlaceholder(/Instruct/);
    await chatInput.fill('Hello, verify neural connection.');
    await page.keyboard.press('Enter');

    // We expect an error message because API key is missing in sandbox,
    // but the UI should show the failure message from the backend.
    await expect(page.getByText(/Critical failure/i)).toBeVisible();
    await page.screenshot({ path: 'verification/fs_chat.png' });
});
