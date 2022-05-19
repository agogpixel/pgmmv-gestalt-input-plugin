/**
 * Exports transform input condition function.
 *
 * @module link-conditions/input-condition/transform-input-condition.function
 */
import type { JsonLogicCondition } from '@agogpixel/pgmmv-resource-support/src/json/logic/json-logic-condition.type';
import type { JsonLogicConstraint } from '@agogpixel/pgmmv-resource-support/src/json/logic/json-logic-constraint.type';

import { ControllerConstantPrefix } from './controller-constant-prefix.enum';
import type { InputKey } from './input-key.enum';
import { InputKeyPrefix } from './input-key-prefix.enum';

/**
 * Transform input condition.
 *
 * @param condition JSON logic input condition.
 * @returns Transformed input condition as a JSON logic constraint.
 */
export function transformInputCondition(
  condition: JsonLogicCondition<InputKey, boolean>
): JsonLogicConstraint<[number]> {
  const inputKey = condition[0];
  const desiredValue = condition[1];

  const inputKeyParts = inputKey.split('_');

  const propPrefix = inputKeyParts[0] === InputKeyPrefix.Pc ? ControllerConstantPrefix.Pc : ControllerConstantPrefix.Op;
  const prop = `${propPrefix}${inputKeyParts[1]}` as keyof typeof Agtk.constants.controllers;

  if (inputKeyParts[0] === InputKeyPrefix.Pc) {
    return function (controllerId: number) {
      const pressed = !!Agtk.controllers.getKeyValue(controllerId, Agtk.constants.controllers[prop]);
      return desiredValue ? pressed : !pressed;
    };
  }

  return function (controllerId: number) {
    const pressed = Agtk.controllers.getOperationKeyPressed(controllerId, Agtk.constants.controllers[prop]);
    return desiredValue ? pressed : !pressed;
  };
}
