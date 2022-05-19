/**
 * Exports validate input condition function.
 *
 * @module link-conditions/input-condition/validate-input-condition.function
 */
import type { JsonLogicCondition } from '@agogpixel/pgmmv-resource-support/src/json/logic/json-logic-condition.type';

import { InputKey } from './input-key.enum';

/**
 * Validate input condition.
 *
 * @param condition JSON logic input condition.
 * @returns True or error message.
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
