import { createPool } from 'mysql2';

const connection = createPool({
  host: '127.0.0.1',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const execMysqlQuery = (query: string) =>
  connection
    .promise()
    .query(query)
    .then(([rows, fields]: any[]) => {
      // console.log(fields, rows);
      return rows;
    });

export { connection, execMysqlQuery };

// TODO refactor the error/Notification to have only one table with the two types
