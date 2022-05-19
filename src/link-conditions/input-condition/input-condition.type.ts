/**
 * Exports 'Input Condition' link condition input condition type.
 *
 * @module link-conditions/input-condition/input-condition.type
 */
import type { JsonLogicConstraint } from '@agogpixel/pgmmv-resource-support/src/json/logic/json-logic-constraint.type';

import type { InputConditionFallbackParameterId } from './parameters';

/**
 * Input condition type.
 */
export type InputCondition = [JsonLogicConstraint<[number]>, InputConditionFallbackParameterId];
