import * as SQLite from 'expo-sqlite';

// Eine Tabelle erstellen, wenn diese noch nicht existiert
export function createDatabase(title, id, name) {
  const db = SQLite.openDatabase({ name: 'mydatabase.db' });

  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${title} (${id} INTEGER PRIMARY KEY NOT NULL, ${name} TEXT NOT NULL);`
    );
  });
}

// items in eine Tabelle hinzufügen
export const insertData = (title, id, name) => {
  const db = SQLite.openDatabase({ name: 'mydatabase.db' });

  db.transaction(tx => {
    tx.executeSql(`INSERT INTO ${title} (id, name) VALUES (${id}, "${name}");`);
  });
}

// Items aus einer Tabelle auslesen
export const retrieveData = (title) => {
  const db = SQLite.openDatabase({ name: 'mydatabase.db' });

  db.transaction(tx => {
    tx.executeSql(`SELECT * FROM ${title}`, [], (tx, results) => {
      console.log(results.rows.length); // Anzahl der Einträge
      for (let i = 0; i < results.rows.length; i++) {
        console.log(results.rows.item(i).name); // Name des Eintrags
      }
    });
  });
}

// Alle Tabellen die existieren herausgeben
export function getAllTables() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT name FROM sqlite_master WHERE type="table";',
        [],
        (tx, results) => {
          const tables = [];
          for (let i = 0; i < results.rows.length; i++) {
            tables.push(results.rows.item(i).name);
          }
          resolve(tables);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}


// Eine komplette Tabelle löschen (UNWIDERRUFLICH!)
export function deleteTable(tableName) {
  const db = SQLite.openDatabase({ name: 'mydatabase.db' });

  db.transaction(tx => {
    tx.executeSql(
      `DROP TABLE ${tableName}`
    );
  });
}

// Eine Spalte einer Tabelle hinzufügen
export const addColumn = (tableName, columnName, columnType) => {
  const db = SQLite.openDatabase({ name: 'mydatabase.db' });

  db.transaction(tx => {
    tx.executeSql(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
  });
}

// Aus einer Tabelle eine komplette Spalte löschen
export function deleteColumn(tableName, columnName) {
  db.transaction(tx => {
    tx.executeSql(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
  });
}




