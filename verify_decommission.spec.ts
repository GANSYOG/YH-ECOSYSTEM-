import { test, expect } from '@playwright/test';

test('Decommission Agent Flow', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:3000');
    await page.getByLabel('Command Email').fill('admin@neural.link');
    await page.getByLabel('Access Cipher').fill('neuro-99');
    await page.getByRole('button', { name: 'Initialize' }).click();

    // 2. Navigate to Admin Agents
    await page.getByRole('button', { name: 'Core Analytics' }).click();
    await page.getByRole('button', { name: 'agents', exact: true }).click();
    await expect(page.getByText('Agent Manifest')).toBeVisible();

    // Wait for agents to load
    const decommissionButton = page.getByRole('button', { name: 'Decommission' }).first();
    await decommissionButton.waitFor({ state: 'visible', timeout: 10000 });

    // Get the name of the agent to be decommissioned
    const agentCard = page.locator('.grid > div').first();
    const agentName = await agentCard.locator('h3').textContent();
    console.log(`Decommissioning agent: ${agentName}`);

    // Click Decommission
    await decommissionButton.click();

    // Verify Confirmation Modal is visible
    await expect(page.getByText('Decommission Agent')).toBeVisible();
    await expect(page.getByText('Are you sure you want to decommission this neural agent?')).toBeVisible();

    // Click Decommission in the modal
    const modal = page.locator('.fixed.inset-0').filter({ hasText: 'Decommission Agent' });
    await modal.getByRole('button', { name: 'Decommission', exact: true }).click();

    // Verify Toast message
    await expect(page.getByText('Neural agent successfully decommissioned.')).toBeVisible();

    // Verify agent is no longer in the list (or at least that the list refreshed)
    if (agentName) {
        await expect(page.getByText(agentName)).not.toBeVisible();
    }
});
