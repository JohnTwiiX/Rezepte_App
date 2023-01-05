import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mydatabase.db' });

db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS table_name (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);'
  );
});

db.transaction(tx => {
  tx.executeSql('INSERT INTO table_name (id, name) VALUES (1, "John");');
});

db.transaction(tx => {
  tx.executeSql('SELECT * FROM table_name', [], (tx, results) => {
    console.log(results.rows.item(0).name);
  });
});

