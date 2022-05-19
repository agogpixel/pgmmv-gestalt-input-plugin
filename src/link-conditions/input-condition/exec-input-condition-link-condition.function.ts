/**
 * Exports exec 'Input Condition' link condition function.
 *
 * @module link-conditions/input-condition/exec-input-condition-link-condition.function
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { GestaltInputPluginProtectedApi } from '../../gestalt-input-plugin-protected-api.interface';

import { fetchControllerId } from './fetch-controller-id.function';
import type { InputCondition } from './input-condition.type';
import { InputConditionFallbackParameterId, InputConditionParameterId } from './parameters';
import { parseInputConditionParameters } from './parse-input-condition-parameters.function';

/**
 * Exec 'Input Condition' link condition.
 *
 * @param internalApi Plugin internal API reference.
 * @param parameters Parsed link condition parameters.
 * @param objectId Object ID.
 * @param instanceId Instance ID.
 * @param actionLinkId Action link ID
 * @returns Boolean result based on current input & parsed input condition
 * state.
 */
export function execInputConditionLinkCondition(
  internalApi: GestaltInputPluginProtectedApi,
  parameters: Record<number, JsonValue>,
  objectId: number,
  instanceId: number,
  actionLinkId: number
) {
  const identifier = ((parameters[InputConditionParameterId.Identifier] as string) || '').trim();

  if (!identifier) {
    internalApi.logger.warn(
      `testInputCondition {objectId: ${objectId}, instanceId: ${instanceId}, actionLinkId: ${actionLinkId}}: Unset identifier; defaulting to false`
    );
    return false;
  }

  const cacheKey = `${objectId},${instanceId},${identifier}`;

  let inputCondition: InputCondition;

  if (!internalApi.inputConditionCache.has(cacheKey)) {
    inputCondition = parseInputConditionParameters(internalApi, parameters);
    internalApi.inputConditionCache.set(cacheKey, inputCondition);
  } else {
    inputCondition = internalApi.inputConditionCache.get(cacheKey) as InputCondition;
  }

  const clause = inputCondition[0];
  const fallback = inputCondition[1];

  const controllerId = fetchControllerId(objectId, instanceId);

  if (controllerId < 0 && fallback === InputConditionFallbackParameterId.AlwaysFalse) {
    return false;
  }

  const controllerIds = controllerId >= 0 ? [controllerId] : internalApi.allControllerIds;

  for (let i = 0; i < controllerIds.length; ++i) {
    if (clause(controllerIds[i])) {
      return true;
    }
  }

  return false;
}
