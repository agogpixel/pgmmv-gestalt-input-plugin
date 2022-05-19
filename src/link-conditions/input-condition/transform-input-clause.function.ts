/**
 * Exports transform input clause function.
 *
 * @module link-conditions/input-condition/transform-input-clause.function
 */
import type { JsonLogicCondition } from '@agogpixel/pgmmv-resource-support/src/json/logic/json-logic-condition.type';
import { createJsonLogicClauseTransform } from '@agogpixel/pgmmv-resource-support/src/json/logic/create-json-logic-clause-transform.function';

import type { InputKey } from './input-key.enum';
import { transformInputCondition } from './transform-input-condition.function';
import { validateInputCondition } from './validate-input-condition.function';

/**
 * Transform input clause.
 *
 * @param clause Input clause as JSON logic clause.
 * @returns Constraint fuction or array of error messages.
 */
export const transformInputClause = createJsonLogicClauseTransform(function (
  condition: JsonLogicCondition<InputKey, boolean>
) {
  const result = validateInputCondition(condition);

  if (result !== true) {
    return result;
  }

  return transformInputCondition(condition);
});
