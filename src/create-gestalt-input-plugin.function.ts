/**
 * Exports a Gestalt Input plugin instance factory.
 *
 * @module
 */
import { createLogger } from '@agogpixel/pgmmv-logging-support/src/create-logger.function';
import { createPlugin } from '@agogpixel/pgmmv-plugin-support/src/create-plugin.function';
import { createResourceCache } from '@agogpixel/pgmmv-resource-support/src/cache/create-resource-cache.function';
import type { AgtkLinkConditionPlugin } from '@agogpixel/pgmmv-ts/api/agtk/plugin/link-condition-plugin';

import type { GestaltInputPluginInternalData } from './gestalt-input-plugin-internal-data.type';
import type { GestaltInputPluginProtectedApi } from './gestalt-input-plugin-protected-api.interface';
import { execLinkCondition, linkConditions } from './link-conditions';
import type { InputCondition } from './link-conditions/input-condition';
import localizations from './locale';

/**
 * Plugin sematic version.
 */
declare const PLUGIN_VERSION: string;

/**
 *
 */
const pluginBanner = `\nGestalt Input Plugin v${PLUGIN_VERSION}\n`;

/**
 * Creates a plugin instance.
 *
 * @returns Gestalt Input plugin instance.
 */
export function createGestaltInputPlugin() {
  const internalApi = {} as GestaltInputPluginProtectedApi;

  const self = createPlugin<GestaltInputPluginInternalData, AgtkLinkConditionPlugin<GestaltInputPluginInternalData>>(
    { localizations, linkConditions },
    internalApi
  );

  internalApi.inputConditionCache = createResourceCache<string, InputCondition>();

  self.initialize = function initialize(data) {
    if (!data) {
      data = {};
    }

    self.setInternal(data);

    if (internalApi.inEditor()) {
      return;
    }

    internalApi.allControllerIds = [];
    for (let i = 0; i <= Agtk.controllers.MaxControllerId; ++i) {
      internalApi.allControllerIds.push(i);
    }

    internalApi.logger = createLogger({
      runtimeLog: function (arg1) {
        Agtk.log(`[Gestalt Input Plugin] ${arg1}`);
      }
    });

    Agtk.log(pluginBanner);
  };

  self.execLinkCondition = function (linkConditionIndex, parameter, objectId, instanceId, actionLinkId) {
    return execLinkCondition(
      internalApi,
      linkConditionIndex,
      internalApi.normalizeLinkConditionParameters(linkConditionIndex, parameter),
      objectId,
      instanceId,
      actionLinkId
    );
  };

  return self;
}
