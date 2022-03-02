/**
 * Factory Pattern
 *
 * A way of requesting a DB from a global source (such as this in-memory DB), this "factory"
 * is going to hide which thing you are going to implement this with, like the class,
 * from the code.
 *
 * USES THE In Memory Database For This Example
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

  return InMemoryDatabase;
}
/* E. FACTORY PATTERN */

/* B. Implementation example */
interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

const PokemonDB = createDatabase<Pokemon>();
const pokemonDB = new PokemonDB();
pokemonDB.set({
  id: "Bulbasaur",
  attack: 50,
  defense: 10,
});

console.log(pokemonDB.get("Bulbasaur"));
/* E. Implementation example */

// JUST TO APPEASE VSCODE LINTER
class FactoryPattern2 {}
export default FactoryPattern2;
