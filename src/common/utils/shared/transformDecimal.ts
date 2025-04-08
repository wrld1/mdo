import { TransformFnParams } from 'class-transformer';

export function transformDecimal(params: TransformFnParams) {
  const value = params.value;

  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return value.toNumber();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return Number(value) || 0;
  }

  return 0;
}
