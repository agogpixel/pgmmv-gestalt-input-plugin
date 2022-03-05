import type { JsonLogicCondition } from '@agogpixel/pgmmv-link-condition-support/src/json-logic/condition';
import type { JsonLogicConstraint } from '@agogpixel/pgmmv-link-condition-support/src/json-logic/constraint';

import { ControllerConstantPrefix } from './controller-constant-prefix';
import type { InputKey } from './input-key';
import { InputKeyPrefix } from './input-key-prefix';

/**
 *
 * @param condition
 * @returns
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
