# Databases Essentials

1- introduction to database
1-1- what is database
1-2- database management system
1-3- Why we need databases (vs files)
2- Types of Databases
3- relational database
3-1- Tables and schema (column + rows)
3-2- types and Data Integrity & Constraints + keys
3-3- relationships
4- who to Design database + Normalization
5- SQL
6- Using Databases in Backend (Practical)
7- what are ORMs & ODMs

---

## introduction to database

### what is database

A database is an organized collection of data stored in a way that makes it easy to access, manage, and update.

- Instead of random files → everything is structured
- Data is stored in a way that can be queried efficiently

### Database Management System (DBMS)

A DBMS is software that allows you to interact with the database.

<!-- ![DBMS](<"./images/Database%20Management%20System%20(DBMS).jpg">) -->

![DBMS](<./images/Database%20Management%20System%20(DBMS).jpg>)

DBMS acts as a middle layer between your app and the data
It handles:

- Storage
- Queries
- Security
- Performance

📌 Examples:

- MySQL
- PostgreSQL
- MongoDB

### Why we need databases (vs files)

🚨 Problems with Files

1. 🔍 Searching is slow and inefficient

- To find a user → you must read the whole file
- No optimized search

2. 🔗 No relationships between data

- Users ↔ Orders
- Posts ↔ Comments

3. 👥 No concurrency (multi-users problem)

- What if 2 users write at the same time?
- Data can be overwritten or corrupted

4. ❌ Data inconsistency, No security, Not scalable...

> Files store data… Databases protect, organize, and optimize data
