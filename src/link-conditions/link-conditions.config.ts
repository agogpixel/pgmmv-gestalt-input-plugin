/**
 * Exports link condition configurations.
 *
 * @module link-conditions/link-conditions.config
 */
import type { AgtkPluginLinkCondition } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-link-condition';

import { inputConditionParameters } from './input-condition';
import { LinkConditionId } from './link-condition-id.enum';

/**
 * Link condition configurations.
 */
export const linkConditions: AgtkPluginLinkCondition[] = [
  {
    id: LinkConditionId.InputCondition,
    name: 'loca(LINK_CONDITION_INPUT_CONDITION_NAME)',
    description: 'loca(LINK_CONDITION_INPUT_CONDITION_DESCRIPTION)',
    parameter: inputConditionParameters
  }
];
