/**
 * Observer Pattern
 *
 * USES THE In Memory Database, Factory Pattern and Singleton Pattern For This Example
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

interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

interface AfterSetEvent<T> {
  value: T;
}

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;

  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;
}

/* B. FACTORY PATTERN */
function createDatabase<T extends BaseRecord>() {
  // In Memory Database
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();

    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    public set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue,
        value: this.db[newValue.id],
      });

      this.db[newValue.id] = newValue;

      this.afterAddListeners.publish({
        value: newValue,
      });
    }
    public get(id: string): T {
      return this.db[id];
    }

    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener);
    }
    onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }
  }

  // Singleton
  // const db = new InMemoryDatabase();
  // return db;
  return InMemoryDatabase;
}
/* E. FACTORY PATTERN */

/* B. Implementation example */
interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

// const pokemonDB = createDatabase<Pokemon>();
// pokemonDB.set({
//   id: "Bulbasaur",
//   attack: 50,
//   defense: 10,
// });

const PokemonDB = createDatabase<Pokemon>();

// Subscribe to database
const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) => {
  console.log(value);
});

PokemonDB.instance.set({
  id: "Bulbasaur",
  attack: 50,
  defense: 10,
});

PokemonDB.instance.set({
  id: "Spinosaur",
  attack: 100,
  defense: 20,
});

unsubscribe();

// console.log(PokemonDB.instance.get("Bulbasaur"));
/* E. Implementation example */

// JUST TO APPEASE VSCODE LINTER
class Observer2 {}
export default Observer2;
