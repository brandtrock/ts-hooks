import { createContext } from "react";

const initalState = {
  first: "Jack",
  last: "Jorgensen",
};

export type UserState = typeof initalState;

const context = createContext<typeof initalState>(initalState);

export default context;
