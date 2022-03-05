import type { JsonLogicCondition } from '@agogpixel/pgmmv-link-condition-support/src/json-logic/condition';

import { InputKey } from './input-key';

/**
 *
 * @param condition
 * @returns
 */
export function validateInputCondition(condition: JsonLogicCondition<InputKey, boolean>) {
  if (!Array.isArray(condition)) {
    return 'Input condition condition must be of type array';
  }

  if (condition.length !== 2) {
    return 'Input condition condition must be of type array with exact length of 2';
  }

  if (typeof condition[0] !== 'string') {
    return 'Input condition condition must be of type array with first element of type string';
  }

  if (typeof InputKey[condition[0]] !== 'string') {
    return `Input condition condition must be of type array with valid first element: '${condition[0]}' is invalid`;
  }

  if (typeof condition[1] !== 'boolean') {
    return 'Input condition condition must be of type array with second element of type boolean';
  }

  return true;
}
