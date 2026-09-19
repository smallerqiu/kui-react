export interface UsageIssue {
  kind: string;
  message: string;
  line?: number;
  column?: number;
  component?: string;
  prop?: string;
}
export function validateUsage(source: string, metadata: unknown): {
  valid: boolean;
  complete: false;
  scope: string;
  issues: UsageIssue[];
  skipped: string[];
  nextStep?: string;
};
