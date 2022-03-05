import type { JsonLogicCondition } from '@agogpixel/pgmmv-link-condition-support/src/json-logic/condition';
import { createJsonLogicClauseTransform } from '@agogpixel/pgmmv-link-condition-support/src/json-logic/create-clause-transform';

import type { InputKey } from './input-key';
import { transformInputCondition } from './transform-input-condition';
import { validateInputCondition } from './validate-input-condition';

/**
 *
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
