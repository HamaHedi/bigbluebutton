import {
  CustomQueryArguments,
} from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-consumption/domain/shared/custom-query/types';
import React from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QueryHookWithArgumentsContainerProps {
  key: string;
  hookArguments: CustomQueryArguments;
  resolveQuery: () => void;
}

export interface ObjectToCustomQueryHookContainerMap {
  count: number;
  hookArguments: CustomQueryArguments;
}

export interface QueryHookWithArgumentContainerToRender {
  componentToRender: React.FunctionComponent<QueryHookWithArgumentsContainerProps>;
  hookArguments: CustomQueryArguments;
  numberOfUses: number;
}
