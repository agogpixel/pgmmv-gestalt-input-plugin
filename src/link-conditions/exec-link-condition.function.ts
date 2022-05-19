/**
 * Exports exec link condition functions.
 *
 * @module link-conditions/exec-link-condition.function
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import { GestaltInputPluginProtectedApi } from '../gestalt-input-plugin-protected-api.interface';

import { LinkConditionId } from './link-condition-id.enum';
import { linkConditionIndexMap } from './link-condition-index-map.const';
import { execInputConditionLinkCondition } from './input-condition';

/**
 * Evaluates link condition.
 *
 * @param internalApi The plugin's internal API.
 * @param linkConditionIndex The index of a given link condition.
 * @param parameter Link condition data that is set in & provided by the PGMMV
 * editor or runtime & subsequently normalized.
 * @param objectId The object ID of the object instance through which the
 * link condition is evaluating.
 * @param instanceId The instance ID of the object instance through which the
 * link condition is evaluating.
 * @returns True if link condition is satisfied, false otherwise.
 */
export function execLinkCondition(
  internalApi: GestaltInputPluginProtectedApi,
  linkConditionIndex: number,
  parameter: Record<number, JsonValue>,
  objectId: number,
  instanceId: number,
  actionLinkId: number
) {
  switch (linkConditionIndex) {
    case linkConditionIndexMap[LinkConditionId.InputCondition]:
      return execInputConditionLinkCondition(internalApi, parameter, objectId, instanceId, actionLinkId);
    default:
      break;
  }

  const identifier = `{linkConditionIndex: ${linkConditionIndex}, objectId: ${objectId}, instanceId: ${instanceId}, actionLinkId: ${actionLinkId}}`;
  internalApi.logger.warn(`execLinkCondition ${identifier}: No matching link condition found; defaulting to false`);

  return false;
}
