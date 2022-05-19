/**
 * Exports Gestalt Input plugin protected API.
 *
 * @module
 */
import type { Logger } from '@agogpixel/pgmmv-logging-support/src/logger.interface';
import type { PluginProtectedApi } from '@agogpixel/pgmmv-plugin-support/src/plugin-protected-api.interface';
import type { ResourceCache } from '@agogpixel/pgmmv-resource-support/src/cache/resource-cache.interface';

import type { GestaltInputPluginInternalData } from './gestalt-input-plugin-internal-data.type';
import type { InputCondition } from './link-conditions/input-condition';

/**
 * Gestalt Input plugin protected API.
 */
export interface GestaltInputPluginProtectedApi extends PluginProtectedApi<GestaltInputPluginInternalData> {
  /**
   * All controller IDs.
   */
  allControllerIds: number[];

  /**
   * Parsed input condition cache.
   */
  inputConditionCache: ResourceCache<string, InputCondition>;

  /**
   * Logger reference.
   */
  logger: Logger;
}
