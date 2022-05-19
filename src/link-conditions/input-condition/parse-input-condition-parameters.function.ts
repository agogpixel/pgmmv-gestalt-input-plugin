/**
 * Exports parse input condition parameters function.
 *
 * @module link-conditions/input-condition/parse-input-condition-parameters.function
 */
import type { JsonLogicClause } from '@agogpixel/pgmmv-resource-support/src/json/logic/json-logic-clause.type';
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { GestaltInputPluginProtectedApi } from '../../gestalt-input-plugin-protected-api.interface';

import type { InputCondition } from './input-condition.type';
import type { InputKey } from './input-key.enum';
import { InputConditionFallbackParameterId, InputConditionParameterId } from './parameters';
import { transformInputClause } from './transform-input-clause.function';

/**
 *
 * @param parameters
 * @returns
 */
export function parseInputConditionParameters(
  internalApi: GestaltInputPluginProtectedApi,
  parameters: Record<number, JsonValue>
): InputCondition {
  const json = parameters[InputConditionParameterId.Json] as string;
  const fallback = parameters[InputConditionParameterId.Fallback] as InputConditionFallbackParameterId;
  const identifier = parameters[InputConditionParameterId.Identifier] as string;

  const intermediate = JSON.parse(json) as JsonLogicClause<InputKey, boolean>;
  const result = transformInputClause(intermediate);

  if (Array.isArray(result)) {
    internalApi.logger.error(
      `parseInputConditionParameters ${identifier}: Invalid JSON logic detected:\n${result.join('\n  - ')}`
    );

    let warningLogged = false;

    return [
      function () {
        if (!warningLogged) {
          internalApi.logger.warn(
            `${identifier}: Invalid input condition; defaulting to false & suppressing this message`
          );
          warningLogged = true;
        }

        return false;
      },
      fallback
    ];
  }

  return [result, fallback];
}
