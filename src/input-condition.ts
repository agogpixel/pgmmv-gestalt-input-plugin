enum ControllerConstantPrefix {
  Op = 'OperationKey',
  Pc = 'ReservedKeyCodePc_'
}

enum InputConditionKeyPrefix {
  Op = 'Op',
  Pc = 'Pc'
}

enum InputConditionKey {
  Op_A = 'Op_A',
  Op_B = 'Op_B',
  Op_X = 'Op_X',
  Op_Y = 'Op_Y',
  Op_R1 = 'Op_R1',
  Op_R2 = 'Op_R2',
  Op_L1 = 'Op_L1',
  Op_L2 = 'Op_L2',
  Op_Up = 'Op_Up',
  Op_Down = 'Op_Down',
  Op_Left = 'Op_Left',
  Op_Right = 'Op_Right',
  Op_LeftStickUp = 'Op_LeftStickUp',
  Op_LeftStickDown = 'Op_LeftStickDown',
  Op_LeftStickLeft = 'Op_LeftStickLeft',
  Op_LeftStickRight = 'Op_LeftStickRight',
  Op_RightStickUp = 'Op_RightStickUp',
  Op_RightStickDown = 'Op_RightStickDown',
  Op_RightStickLeft = 'Op_RightStickLeft',
  Op_RightStickRight = 'Op_RightStickRight',
  Op_LeftClick = 'Op_LeftClick',
  Op_RightClick = 'Op_RightClick',
  Op_Start = 'Op_Start',
  Op_Select = 'Op_Select',
  Op_Home = 'Op_Home',
  Op_Ok = 'Op_Ok',
  Op_Cancel = 'Op_Cancel',
  Pc_W = 'Pc_W',
  Pc_A = 'Pc_A',
  Pc_S = 'Pc_S',
  Pc_D = 'Pc_D',
  Pc_LeftClick = 'Pc_LeftClick',
  Pc_RightClick = 'Pc_RightClick',
  Pc_Up = 'Pc_Up',
  Pc_Right = 'Pc_Right',
  Pc_Down = 'Pc_Down',
  Pc_Left = 'Pc_Left',
  Pc_MiddleClick = 'Pc_MiddleClick',
  Pc_WheelUp = 'Pc_WheelUp',
  Pc_WhellDown = 'Pc_WhellDown',
  Pc_MousePointer = 'Pc_MousePointer'
}

type InputConditionKeyJsonPredicate = [InputConditionKey, boolean];

type InputConditionKeyJsonOrClause = { OR: InputConditionKeyJsonClause[] };

type InputConditionKeyJsonAndClause = { AND: InputConditionKeyJsonClause[] };

export type InputConditionKeyJsonClause =
  | InputConditionKeyJsonPredicate
  | InputConditionKeyJsonOrClause
  | InputConditionKeyJsonAndClause;

export type InputConditionClause = (controllerId: number) => boolean;

function validateInputConditionKeyJsonPredicate(predicate: InputConditionKeyJsonPredicate) {
  if (!Array.isArray(predicate)) {
    return 'Input condition predicate must be of type array';
  }

  if (predicate.length !== 2) {
    return 'Input condition predicate must be of type array with exact length of 2';
  }

  if (typeof predicate[0] !== 'string') {
    return 'Input condition predicate must be of type array with first element of type string';
  }

  if (typeof InputConditionKey[predicate[0]] !== 'string') {
    return `Input condition predicate must be of type array with valid first element: '${predicate[0]}' is invalid`;
  }

  if (typeof predicate[1] !== 'boolean') {
    return 'Input condition predicate must be of type array with second element of type boolean';
  }

  return true;
}

export function validateInputConditionKeyJsonClause(clause: InputConditionKeyJsonClause): string | true {
  if (Array.isArray(clause)) {
    return validateInputConditionKeyJsonPredicate(clause);
  }

  if (typeof clause !== 'object') {
    return 'Input condition clause must be of type object';
  }

  if (clause === null) {
    return 'Input condition clause must not be null';
  }

  if (Object.keys(clause).length !== 1) {
    return 'Input condition clause must have exactly one key';
  }

  const orClause = (clause as InputConditionKeyJsonOrClause).OR;
  const andClause = (clause as InputConditionKeyJsonAndClause).AND;

  if (!Array.isArray(orClause) && !Array.isArray(andClause)) {
    return "Input condition clause key must be one of 'OR' or 'AND'";
  }

  const resolvedClause = Array.isArray(orClause) ? orClause : andClause;

  if (!resolvedClause.length) {
    return 'Input condition clause key must map to a value of type array';
  }

  for (let i = 0; i < resolvedClause.length; ++i) {
    const result = validateInputConditionKeyJsonClause(resolvedClause[i]);

    if (typeof result === 'string') {
      return result;
    }
  }

  return true;
}

function transformInputConditionKeyJsonPredicate(predicate: InputConditionKeyJsonPredicate): InputConditionClause {
  const key = predicate[0];
  const condition = predicate[1];

  const keyParts = key.split('_');

  const propPrefix =
    keyParts[0] === InputConditionKeyPrefix.Pc ? ControllerConstantPrefix.Pc : ControllerConstantPrefix.Op;
  const prop = `${propPrefix}${keyParts[1]}` as keyof typeof Agtk.constants.controllers;

  if (keyParts[0] === InputConditionKeyPrefix.Pc) {
    return function (controllerId: number) {
      const pressed = !!Agtk.controllers.getKeyValue(controllerId, Agtk.constants.controllers[prop]);
      return condition ? pressed : !pressed;
    };
  }

  return function (controllerId: number) {
    const pressed = Agtk.controllers.getOperationKeyPressed(controllerId, Agtk.constants.controllers[prop]);
    return condition ? pressed : !pressed;
  };
}

export function transformInputConditionKeyJsonClause(clause: InputConditionKeyJsonClause): InputConditionClause {
  if (Array.isArray(clause)) {
    return transformInputConditionKeyJsonPredicate(clause);
  }

  const orClause = (clause as InputConditionKeyJsonOrClause).OR;
  const andClause = (clause as InputConditionKeyJsonAndClause).AND;
  const resolvedClause = Array.isArray(orClause) ? orClause : andClause;

  const childClauses: InputConditionClause[] = [];

  for (let i = 0; i < resolvedClause.length; ++i) {
    childClauses.push(transformInputConditionKeyJsonClause(resolvedClause[i]));
  }

  if (Array.isArray(orClause)) {
    return function (controllerId) {
      for (let i = 0; i < childClauses.length; ++i) {
        if (childClauses[i](controllerId)) {
          return true;
        }
      }

      return false;
    };
  }

  return function (controllerId) {
    for (let i = 0; i < childClauses.length; ++i) {
      if (!childClauses[i](controllerId)) {
        return false;
      }
    }

    return true;
  };
}
