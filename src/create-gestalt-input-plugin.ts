declare const PLUGIN_VERSION: string;

import type { Logger } from '@agogpixel/pgmmv-logging-support/src/logger';
import { createLogger } from '@agogpixel/pgmmv-logging-support/src/create-logger';

import { getControllerId } from '@agogpixel/pgmmv-object-support/src/object-instance/get-controller-id';
import { getObjectInstance } from '@agogpixel/pgmmv-object-support/src/object-instance/get-object-instance';
import { getParentObjectInstance } from '@agogpixel/pgmmv-object-support/src/object-instance/get-parent-object-instance';

import type { PluginProtectedApi } from '@agogpixel/pgmmv-plugin-support/src/protected-api';
import { createPlugin } from '@agogpixel/pgmmv-plugin-support/src/create-plugin';

import { createResourceCache } from '@agogpixel/pgmmv-resource-support/src/cache/create-cache';

import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types';

import { AgtkLinkConditionPlugin } from '@agogpixel/pgmmv-ts/api/agtk/plugin/link-condition-plugin';

import {
  InputConditionClause,
  InputConditionKeyJsonClause,
  transformInputConditionKeyJsonClause,
  validateInputConditionKeyJsonClause
} from './input-condition';

import {
  InputConditionFallbackParameterId,
  inputConditionParameterDefaults,
  InputConditionParameterId,
  LinkConditionId,
  linkConditionIdToIndexMap,
  linkConditions
} from './link-conditions';
import localizations from './locale';

/**
 *
 */
type InputCondition = [InputConditionClause, InputConditionFallbackParameterId];

/**
 *
 */
type InternalData = JsonValue;

/**
 *
 */
const pluginBanner = `\nGestalt Input Plugin v${PLUGIN_VERSION}\nCopyright 2022 AgogPixel - All Rights Reserved\n`;

/**
 *
 * @returns
 */
export function createGestaltInputPlugin() {
  /**
   *
   */
  const internalApi = {} as PluginProtectedApi<InternalData>;

  /**
   *
   */
  const self = createPlugin<InternalData, AgtkLinkConditionPlugin<InternalData>>(
    { localizations, linkConditions },
    internalApi
  );

  /**
   *
   */
  const inputConditionCache = createResourceCache<string, InputCondition>();

  /**
   *
   */
  let allControllerIds: number[];

  /**
   *
   */
  let logger: Logger;

  /**
   *
   * @param parameters
   * @returns
   */
  function extractInputConditionIdentifier(parameters: { id: number; value: JsonValue }[]) {
    for (let i = 0; i < parameters.length; ++i) {
      if (parameters[i].id === InputConditionParameterId.Identifier) {
        return (parameters[i].value as string).trim();
      }
    }

    return inputConditionParameterDefaults.identifier;
  }

  /**
   *
   * @param parameters
   * @returns
   */
  function parseInputCondition(parameters: { id: number; value: JsonValue }[]): InputCondition {
    let json: JsonValue = JSON.stringify(inputConditionParameterDefaults.json);
    let fallback: InputConditionFallbackParameterId = inputConditionParameterDefaults.fallback;
    let identifier = inputConditionParameterDefaults.identifier;

    for (let i = 0; i < parameters.length; ++i) {
      switch (parameters[i].id) {
        case InputConditionParameterId.Json:
          json = parameters[i].value;
          break;
        case InputConditionParameterId.Fallback:
          fallback = parameters[i].value as InputConditionFallbackParameterId;
          break;
        case InputConditionParameterId.Identifier:
          identifier = parameters[i].value as string;
          break;
      }
    }

    const intermediate = JSON.parse(json as string) as InputConditionKeyJsonClause;
    const result = validateInputConditionKeyJsonClause(intermediate);

    if (typeof result === 'string') {
      logger.error(`parseInputCondition ${identifier}: Invalid input condition JSON: ${result}`);
      logger.error(intermediate);

      let warningLogged = false;

      return [
        function () {
          if (!warningLogged) {
            logger.warn(`${identifier}: Invalid input condition; defaulting to false & suppressing this message`);
            warningLogged = true;
          }

          return false;
        },
        fallback
      ];
    }

    const condition = transformInputConditionKeyJsonClause(intermediate);

    return [
      function (controllerId) {
        return condition(controllerId);
      },
      fallback
    ];
  }

  /**
   *
   * @param objectId
   * @param instanceId
   * @returns
   */
  function fetchControllerId(objectId: number, instanceId: number): number {
    const obj = Agtk.objects.get(objectId);
    const instance = getObjectInstance(instanceId);

    const controllerId = getControllerId(instance);

    if (obj.operatable && controllerId >= 0) {
      return controllerId;
    }

    const parentInstance = getParentObjectInstance(instance);

    if (!parentInstance) {
      return -1;
    }

    return fetchControllerId(parentInstance.objectId, parentInstance.id);
  }

  /**
   *
   * @param objectId
   * @param instanceId
   * @param actionLinkId
   * @param commonActionStatus
   * @param parameters
   * @returns
   */
  function testInputCondition(
    objectId: number,
    instanceId: number,
    actionLinkId: number,
    parameters: { id: number; value: JsonValue }[]
  ) {
    const identifier = extractInputConditionIdentifier(parameters);

    if (!identifier) {
      logger.warn(
        `testInputCondition {objectId: ${objectId}, instanceId: ${instanceId}, actionLinkId: ${actionLinkId}}: Unset identifier; defaulting to false`
      );
      return false;
    }

    const cacheKey = `${objectId},${instanceId},${identifier}`;

    let inputCondition: InputCondition;

    if (!inputConditionCache.has(cacheKey)) {
      inputCondition = parseInputCondition(parameters);
      inputConditionCache.set(cacheKey, inputCondition);
    } else {
      inputCondition = inputConditionCache.get(cacheKey) as InputCondition;
    }

    const clause = inputCondition[0];
    const fallback = inputCondition[1];

    const controllerId = fetchControllerId(objectId, instanceId);

    if (controllerId < 0 && fallback === InputConditionFallbackParameterId.AlwaysFalse) {
      return false;
    }

    const controllerIds = controllerId >= 0 ? [controllerId] : allControllerIds;

    for (let i = 0; i < controllerIds.length; ++i) {
      if (clause(controllerIds[i])) {
        return true;
      }
    }

    return false;
  }

  /**
   *
   * @param data
   * @returns
   */
  self.initialize = function initialize(data) {
    if (!data) {
      data = {};
    }

    self.setInternal(data);

    if (internalApi.inEditor()) {
      return;
    }

    allControllerIds = [];
    for (let i = 0; i <= Agtk.controllers.MaxControllerId; ++i) {
      allControllerIds.push(i);
    }

    logger = createLogger({
      runtimeLog: function (arg1) {
        Agtk.log(`[Gestalt Input Plugin] ${arg1}`);
      }
    });

    Agtk.log(pluginBanner);
  };

  /**
   *
   * @param linkConditionIndex
   * @param parameter
   * @param objectId
   * @param instanceId
   * @param actionLinkId
   * @param commonActionStatus Bug: set to undefined.
   * @returns
   */
  self.execLinkCondition = function execLinkCondition(
    linkConditionIndex,
    parameter,
    objectId,
    instanceId,
    actionLinkId
  ) {
    switch (linkConditionIndex) {
      case linkConditionIdToIndexMap[LinkConditionId.InputCondition]:
        return testInputCondition(objectId, instanceId, actionLinkId, parameter);
    }

    const identifier = `{linkConditionIndex: ${linkConditionIndex}, objectId: ${objectId}, instanceId: ${instanceId}, actionLinkId: ${actionLinkId}}`;
    logger.warn(`execLinkCondition ${identifier}: No matching link condition found; defaulting to false`);

    return false;
  };

  return self;
}
