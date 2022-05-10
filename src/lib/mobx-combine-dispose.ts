import { IReactionDisposer } from "mobx";

export const combineDispose = (disposes: IReactionDisposer[]) => () => {
    disposes.forEach((dispose) => dispose());
};
