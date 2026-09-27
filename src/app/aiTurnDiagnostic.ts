export type AiTurnTraceEvent =
  | 'effect-enter'
  | 'effect-skip'
  | 'effect-request'
  | 'timer-fired'
  | 'choose-start'
  | 'choose-return'
  | 'choose-error'
  | 'request-guard-pass'
  | 'request-guard-fail'
  | 'game-guard-pass'
  | 'game-guard-fail'
  | 'move-applied'
  | 'effect-cleanup'
  | 'force-enter'
  | 'force-guard-fail';

export type AiTurnTraceRecord = {
  event: AiTurnTraceEvent;
  request?: number;
  turn?: string;
  sameGame?: boolean;
  move?: unknown;
  error?: unknown;
  at: number;
};

const TRACE_KEY = 'yasin-chess-ai-trace';

export function aiTraceEnabled(): boolean {
  try {
    return sessionStorage.getItem(TRACE_KEY) === '1';
  } catch {
    return false;
  }
}

export function traceAiTurn(
  event: AiTurnTraceEvent,
  details: Omit<AiTurnTraceRecord, 'event' | 'at'> = {},
): void {
  if (!aiTraceEnabled()) return;
  const record: AiTurnTraceRecord = { event, ...details, at: Date.now() };
  try {
    const current = JSON.parse(sessionStorage.getItem('yasin-chess-ai-trace-log') ?? '[]');
    const log = Array.isArray(current) ? current : [];
    log.push(record);
    sessionStorage.setItem('yasin-chess-ai-trace-log', JSON.stringify(log.slice(-100)));
  } catch {
    // Diagnostic tracing must never affect game execution.
  }
  console.info('[YASIN_AI_TRACE]', record);
}
