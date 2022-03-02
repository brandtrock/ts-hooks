/**
 * Singleton Pattern
 *
 * USES THE In Memory Database AND Factory Pattern For This Example
 */

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

/* B. FACTORY PATTERN */
function createDatabase<T extends BaseRecord>() {
  // In Memory Database
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }
    public get(id: string): T {
      return this.db[id];
    }
  }

  // Singleton
  const db = new InMemoryDatabase();
  return db;
}
/* E. FACTORY PATTERN */

/* B. Implementation example */
interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

const pokemonDB = createDatabase<Pokemon>();
pokemonDB.set({
  id: "Bulbasaur",
  attack: 50,
  defense: 10,
});

console.log(pokemonDB.get("Bulbasaur"));
/* E. Implementation example */

// JUST TO APPEASE VSCODE LINTER
class Singleton2 {}
export default Singleton2;
