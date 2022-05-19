/**
 * Exports 'Input Condition' link condition UI parameter configuration.
 *
 * @module link-conditions/input-condition/parameters/input-condition-parameters.config
 */
import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';
import type { AgtkPluginUiParameter } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter';

import { InputConditionFallbackParameterId } from './input-condition-fallback-parameter-id.enum';
import { InputConditionParameterId } from './input-condition-parameter-id.enum';

/**
 * 'Input Condition' link condition UI parameter configuration.
 */
export const inputConditionParameters: AgtkPluginUiParameter[] = [
  {
    id: InputConditionParameterId.Identifier,
    name: 'loca(LINK_CONDITION_INPUT_CONDITION_PARAMETER_IDENTIFIER_NAME)',
    type: AgtkPluginUiParameterType.String,
    defaultValue: 'loca(LINK_CONDITION_INPUT_CONDITION_PARAMETER_IDENTIFIER_DEFAULT_VALUE)'
  },
  {
    id: InputConditionParameterId.Json,
    name: 'loca(LINK_CONDITION_INPUT_CONDITION_PARAMETER_JSON_NAME)',
    type: AgtkPluginUiParameterType.Json,
    defaultValue: ['Op_A', true]
  },
  {
    id: InputConditionParameterId.Fallback,
    name: 'loca(LINK_CONDITION_INPUT_CONDITION_PARAMETER_FALLBACK_NAME)',
    type: AgtkPluginUiParameterType.CustomId,
    customParam: [
      {
        id: InputConditionFallbackParameterId.Default,
        name: 'loca(LINK_CONDITION_INPUT_CONDITION_PARAMETER_FALLBACK_PARAM_DEFAULT_NAME)'
      },
      {
        id: InputConditionFallbackParameterId.AlwaysFalse,
        name: 'loca(LINK_CONDITION_INPUT_CONDITION_PARAMETER_FALLBACK_PARAM_ALWAYS_FALSE_NAME)'
      }
    ],
    defaultValue: InputConditionFallbackParameterId.Default
  }
];
