import type { SimulationTraceStep } from '../types';

export const simulationTraces = new Map<string, SimulationTraceStep[]>();

simulationTraces.set('ecom-01', [
  {
    timestamp: '2025-10-06T10:01:05Z',
    title: 'Event Triggered',
    payload: { event: 'new-customer-query', source: 'webhook:intercom', queryId: 'q-12345' }
  },
  {
    timestamp: '2025-10-06T10:01:06Z',
    title: 'NLP Classification',
    payload: { model: 'intent-classifier-v3', result: { intent: 'RefundRequest', sentiment: 'negative', urgency: 'medium' } }
  },
  {
    timestamp: '2025-10-06T10:01:08Z',
    title: 'CRM Enrichment',
    payload: { service: 'Salesforce API', customerId: 'c-9876', data: { orderHistory: [ 'ord-555', 'ord-666' ], tier: 'Gold' } }
  },
  {
    timestamp: '2025-10-06T10:01:09Z',
    title: 'Routing Decision',
    payload: { rule: 'intent=RefundRequest', targetQueue: 'enriched-support-tickets' }
  },
  {
    timestamp: '2025-10-06T10:01:10Z',
    title: 'Output to Kafka',
    payload: { topic: 'enriched-support-tickets', success: true, partition: 3 }
  },
]);

simulationTraces.set('saas-02', [
  {
    timestamp: '2025-10-06T23:00:00Z',
    title: 'Cron Triggered',
    payload: { job: 'daily-2300-utc-scoring' }
  },
  {
    timestamp: '2025-10-06T23:00:05Z',
    title: 'Fetching Usage Metrics',
    payload: { accountId: 'acc-abc-123', metrics: ['logins_7d', 'features_used_24h'], source: 'product-usage-db' }
  },
  {
    timestamp: '2025-10-06T23:00:15Z',
    title: 'Fetching Support Tickets',
    payload: { accountId: 'acc-abc-123', count_30d: 2, source: 'Zendesk API' }
  },
  {
    timestamp: '2025-10-06T23:00:20Z',
    title: 'Running Churn Prediction Model',
    payload: { model: 'churn-predictor-v1.2', features: 52, result: { score: 0.87, prediction: 'churn' } }
  },
  {
    timestamp: '2025-10-06T23:00:21Z',
    title: 'Updating Customer Record',
    payload: { database: 'master_db', table: 'customers', field: 'churn_risk_score', value: 0.87 }
  },
  {
    timestamp: '2025-10-06T23:00:22Z',
    title: 'Triggering Retention Workflow',
    payload: { accountType: 'Enterprise', scoreThreshold: 0.8, action: 'Create Salesforce Task', csm: 'jane.doe@example.com' }
  },
]);
