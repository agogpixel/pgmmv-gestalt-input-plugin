import type { AgtkPluginLinkCondition } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-link-condition';
import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';

export enum LinkConditionId {
  InputCondition = 0x7cc700
}

export const linkConditionIdToIndexMap = {
  [LinkConditionId.InputCondition]: 0
};

export enum InputConditionParameterId {
  Json = LinkConditionId.InputCondition + 1,
  Fallback,
  Identifier
}

export enum InputConditionFallbackParameterId {
  Default,
  AlwaysFalse
}

export const inputConditionParameterDefaults = {
  json: ['Op_A', true],
  fallback: InputConditionFallbackParameterId.Default,
  identifier: 'Unique To Object'
};

export const linkConditions: AgtkPluginLinkCondition[] = [
  {
    id: LinkConditionId.InputCondition,
    name: 'loca(LINK_CONDITION_0_NAME)',
    description: 'loca(LINK_CONDITION_0_DESCRIPTION)',
    parameter: [
      {
        id: InputConditionParameterId.Identifier,
        name: 'loca(LINK_CONDITION_0_PARAMETER_2_NAME)',
        type: AgtkPluginUiParameterType.String,
        defaultValue: inputConditionParameterDefaults.identifier
      },
      {
        id: InputConditionParameterId.Json,
        name: 'loca(LINK_CONDITION_0_PARAMETER_0_NAME)',
        type: AgtkPluginUiParameterType.Json,
        defaultValue: inputConditionParameterDefaults.json
      },
      {
        id: InputConditionParameterId.Fallback,
        name: 'loca(LINK_CONDITION_0_PARAMETER_1_NAME)',
        type: AgtkPluginUiParameterType.CustomId,
        customParam: [
          {
            id: InputConditionFallbackParameterId.Default,
            name: 'loca(LINK_CONDITION_0_PARAMETER_1_PARAM_0_NAME)'
          },
          { id: InputConditionFallbackParameterId.AlwaysFalse, name: 'loca(LINK_CONDITION_0_PARAMETER_1_PARAM_1_NAME)' }
        ],
        defaultValue: inputConditionParameterDefaults.fallback
      }
    ]
  }
];
