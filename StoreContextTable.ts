import React from "react";
import { StoreContext, StoreContextValue } from "./StoreContext";

export class StoreContextTable {
  public static borrowContext(name: string): StoreContext<unknown> {
    if (!this.table.has(name)) {
      const context =
        React.createContext<StoreContextValue<unknown>>(undefined);

      this.table.set(name, {
        referenceCounter: 1,
        context,
      });

      return this.table.get(name)!.context;
    }

    const contextRecord = this.table.get(name)!;
    contextRecord.referenceCounter += 1;

    return contextRecord.context;
  }

  public static returnContext(name: string): void {
    const contextRecord = this.table.get(name)!;

    if (contextRecord.referenceCounter > 1) {
      contextRecord.referenceCounter -= 1;
      return;
    }

    this.table.delete(name);
    return;
  }

  public static getContext(name: string): StoreContext<unknown> {
    return this.table.get(name)!.context;
  }

  private static table: Map<string, ContextRecord> = new Map();
}

type ContextRecord = {
  referenceCounter: number;
  context: StoreContext<unknown>;
};
