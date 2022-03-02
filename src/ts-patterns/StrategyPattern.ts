/**
 * Strategy Pattern
 *
 * Play on Visitor and more. For example, what if you wanted to find the best Pokemon
 * in the database?
 *
 * USES THE In Memory Database, Factory Pattern, Singleton Pattern, Observer Pattern and
 * Visitor Pattern For This Example
 */

// Observer
type Listener<EventType> = (ev: EventType) => void;
function createObserver<EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void; // unsubscribe
  publish: (event: EventType) => void;
} {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event));
    },
  };
}

// Observer
interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

// Observer
interface AfterSetEvent<T> {
  value: T;
}

// In Memory Database
interface BaseRecord {
  id: string;
}

// In Memory Database
interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;

  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void; // Observer
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void; // Observer

  // Visitor
  visit(visitor: (item: T) => void): void;

  // Strategy
  selectBest(scoreStrategy: (item: T) => number): T | undefined;
}

// Factory Pattern
function createDatabase<T extends BaseRecord>() {
  // In Memory Database
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    // Singleton
    static instance: InMemoryDatabase = new InMemoryDatabase();

    private beforeAddListeners = createObserver<BeforeSetEvent<T>>(); // Observer
    private afterAddListeners = createObserver<AfterSetEvent<T>>(); // Observer

    public set(newValue: T): void {
      // Observer
      this.beforeAddListeners.publish({
        newValue,
        value: this.db[newValue.id],
      });

      this.db[newValue.id] = newValue;

      // Observer
      this.afterAddListeners.publish({
        value: newValue,
      });
    }
    public get(id: string): T {
      return this.db[id];
    }

    // Observer
    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener);
    }

    // Observer
    onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }

    // Visitor
    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    // Strategy
    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined;
      } = {
        max: 0,
        item: undefined,
      };

      Object.values(this.db).reduce((f, item) => {
        const score = scoreStrategy(item);
        if (score > f.max) {
          f.max = score;
          f.item = item;
        }
        return f;
      }, found);

      return found.item;
    }
  }

  // Singleton
  return InMemoryDatabase;
}

/* B. Implementation example */
interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

const PokemonDB = createDatabase<Pokemon>(); // Singleton

// Subscribe to database- Observer
const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) => {
  console.log(value);
});

// Singleton
PokemonDB.instance.set({
  id: "Bulbasaur",
  attack: 50,
  defense: 50,
});

unsubscribe(); // Observer

// Singleton
PokemonDB.instance.set({
  id: "Spinosaur",
  attack: 100,
  defense: 20,
});

// Visitor
PokemonDB.instance.visit((item) => {
  console.log(item.id);
});

// Strategy
const bestDefensive = PokemonDB.instance.selectBest(({ defense }) => defense);
const bestAttack = PokemonDB.instance.selectBest(({ attack }) => attack);
console.log(`Best defense = ${bestDefensive?.id}`);
console.log(`Best attack = ${bestAttack?.id}`);

/* E. Implementation example */

// JUST TO APPEASE VSCODE LINTER
class Strategy2 {}
export default Strategy2;
