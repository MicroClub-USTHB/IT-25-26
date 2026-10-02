// import 
import 'dart:async';
import 'dart:developer';
import 'dart:io';
import 'dart:isolate';

// enum
enum BookStatus { available, loaned, reserved }

enum MemberTier { standard, premium }

// enum












//  exceptions
class BookNotFoundException implements Exception {
  final String message;
  BookNotFoundException(this.message);
  @override
  String toString() => message;
}

class MemberNotFoundException implements Exception {
  final String message;
  MemberNotFoundException(this.message);
  @override
  String toString() => message;
}

class InvalidLoanException implements Exception {
  final String message;
  InvalidLoanException(this.message);
  @override
  String toString() => message;
}

// exceptions











// mixins
mixin Timestampable {
  DateTime? createDat;
  DateTime? updateDat;
  void markCreated() {}
  void markUpdated() {}
  String getTimestampInfo();
}
mixin Searchable {
  bool matchesQuery(String query);
  List<String> getSearchableFields();
}

// mixins












//  abstract 
abstract class LibraryItem {
  String id;
  String title;
  LibraryItem(this.id, this.title);
  String getDetails();
  Map<String, dynamic> toMap();
  void printInfo();
}

abstract class Borrowable {
  bool isAvailable();
  void borrow(String memberId);
  void returnItem();
}

//  abstract 




// classes

class Book extends LibraryItem
    with Timestampable, Searchable
    implements Borrowable {
  String author;
  String? isbn;
  String? description;
  BookStatus status;
  Set<String> genreTags;
  String? currentBorrowerTd;
  int pages;
  Book(String id, String title, this.author)
    : status = BookStatus.available,
      genreTags = {},
      pages = 0,
      super(id, title);
  Book.fromMap(Map<String, dynamic> map)
    : author = map['author'] ?? '',
      isbn = map['isbn'],
      description = map['description'],
      status = map['status'] ?? BookStatus.available,
      genreTags = Set<String>.from(map['genreTags'] ?? []),
      currentBorrowerTd = map['currentBorrowerTd'],
      pages = map['pages'] ?? 0,
      super(map['id'] ?? '', map['title'] ?? '');
  Book.withGenres(
    String id,
    String title,
    this.author, {
    Set<String>? initialGenres,
  }) : status = BookStatus.available,
       genreTags = initialGenres ?? {},
       pages = 0,
       super(id, title);
  @override
  String getDetails() {
    return "ID: $id | Title: $title | Author: $author | Status: $status";
  }

  @override
  Map<String, dynamic> toMap() {
    return {
      "id": id,
      "title": title,
      "author": author,
      "isbn": isbn,
      "description": description,
      "status": status,
      "genreTags": genreTags.toList(),
      "pages": pages,
    };
  }

  @override
  bool isAvailable() {
    if (this.status == BookStatus.available) return true;
    return false;
  }

  @override
  void borrow(String memberId) {
    if (!isAvailable()) {
      BookNotFoundException('not fond book');
      return;
    }
    this.status = BookStatus.loaned;
    currentBorrowerTd = memberId;
    markUpdated();
  }

  @override
  void returnItem() {
    this.currentBorrowerTd = null;
    this.status = BookStatus.available;
    markUpdated();
  }

  @override
  bool matchesQuery(String query) {
    query = query.toLowerCase();
    return title.toLowerCase().contains(query) ||
        author.toLowerCase().contains(query) ||
        genreTags.any((g) => g.toLowerCase().contains(query));
  }

  @override
  List<String> getSearchableFields() {
    return [title, author, ...genreTags];
  }

  void updateStatus(BookStatus newStatus) {
    this.status = newStatus;
  }

  void addGenre(String genre) {
    this.genreTags.add(genre);
  }

  String getStatusText() {
    return status.toString().split('.').last;
  }
  @override
void printInfo() {
  print(getDetails());
}

@override
String getTimestampInfo() {
  return "Created at: ${createDat ?? 'unknown'}, Updated at: ${updateDat ?? 'unknown'}";
}

@override
void markCreated() {
  createDat = DateTime.now();
}

@override
void markUpdated() {
  updateDat = DateTime.now();
}
}

class Member with Timestampable {
  String id;
  String name;
  String? email;
  String? phone;
  MemberTier tier;
  List<String> loanHistory;
  Member(this.id, this.name, this.tier)
    : phone = null,
      loanHistory = [],
      email = null;
  Member.fromMap(Map<String, dynamic> map)
    : id = map['id'],
      name = map['name'],
      email = map['email'],
      phone = map['phone'],
      tier = map['tier'] ?? MemberTier.standard,
      loanHistory = List<String>.from(map['loanHistory'] ?? []);

  Member.premium(String id, String name, {String? email})
    : id = id,
      name = name,
      email = email,
      phone = null,
      tier = MemberTier.premium,
      loanHistory = [];
  Map<String, dynamic> toMap() {
    return {
      "id": id,
      "name": name,
      "email": email,
      "phone": phone,
      "tier": tier,
      "loanHistory": loanHistory,
    };
  }

  void addToHistory(String bookId) {
    loanHistory.add(bookId);
  }

  int getMaxLoans() {
    if (this.tier == MemberTier.standard) return 3;
    return 10;
  }

  bool canBorrow() {
    if (this.loanHistory.length == this.getMaxLoans()) return false;
    if (this.loanHistory.length > this.getMaxLoans()) return false;
    return true;
  }

  String getMemberInfo() {
    return 'name : ${this.name} email : ${this.email} id : ${this.id} phone : ${this.phone} tier : ${tier}';
  }

  void upgradeTier() {
    if (this.tier == MemberTier.standard) {
      this.tier = MemberTier.premium;
    }
  }
  @override
@override
String getTimestampInfo() {
  return "Created at: ${createDat ?? 'unknown'}, Updated at: ${updateDat ?? 'unknown'}";
}

@override
void markCreated() {
  createDat = DateTime.now();
}

@override
void markUpdated() {
  updateDat = DateTime.now();
}
}

class Loan {
  String loanId;
  String bookId;
  String memberId;
  DateTime loanDate;
  DateTime? dueDate;
  DateTime? returnDate;
  bool isReturned;
  Loan(this.loanId, this.bookId, this.memberId)
    : loanDate = DateTime.now(),
      dueDate = null,
      returnDate = null,
      isReturned = false;
  Loan.withDueDate(
    String loanId,
    String bookId,
    String memberId, {
    int dueDays = 14,
  }) : loanId = loanId,
       bookId = bookId,
       memberId = memberId,
       loanDate = DateTime.now(),
       dueDate = DateTime.now().add(Duration(days: dueDays)),
       returnDate = null,
       isReturned = false;
  Loan.fromMap(Map<String, dynamic> map)
    : loanId = map['loanId'],
      bookId = map['bookId'],
      memberId = map['memberId'],
      loanDate = DateTime.parse(map['loanDate']),
      dueDate = map['dueDate'] != null ? DateTime.parse(map['dueDate']) : null,
      returnDate = map['returnDate'] != null
          ? DateTime.parse(map['returnDate'])
          : null,
      isReturned = map['isReturned'] ?? false;
  Map<String, dynamic> toMap() {
    return {
      "loanId": loanId,
      "bookId": bookId,
      "memberId": memberId,
      "loanDate": loanDate.toIso8601String(),
      "dueDate": dueDate?.toIso8601String(),
      "returnDate": returnDate?.toIso8601String(),
      "isReturned": isReturned,
    };
  }

  void markReturned() {
    this.isReturned = true;
    this.returnDate = DateTime.now();
    return;
  }

  bool isOverdue() {
    if (this.isReturned) return false;
    if (this.dueDate == null) return false;
    return DateTime.now().isAfter(dueDate!);
  }

  int getDaysOverdue() {
    if (!isOverdue()) return 0;
    return DateTime.now().difference(dueDate!).inDays;
  }

  String getLoanInfo() {
    return ' id : ${this.loanId} book id : ${this.bookId} member id : ${this.memberId} laon date :${this.loanDate} duedate : ${this.dueDate} returnData ${returnDate} isReturned : ${this.isReturned}';
  }
}


// classes







//  manager
class LibraryManager {
  Map<String, Book> _books;
  Map<String, Member> _members;
  List<Loan> _loans;
  StreamController<String> _activityStream;
  int _bookCounter;
  int _memberCounter;
  int _loanCounter;

  LibraryManager()
    : _books = {},
      _members = {},
      _loans = [],
      _activityStream = StreamController<String>.broadcast(),
      _bookCounter = 0,
      _memberCounter = 0,
      _loanCounter = 0;

  Future<void> addBook(Book book) async {
    _bookCounter++;
    _books['BOOK$_bookCounter'] = book;
  }

  Future<Book?> findBook(String id) async {
    try {
      return _books.values.firstWhere((e) => e.id == id);
    } catch (e) {
      return null;
    }
  }

  Future<List<Book>> getAllBooks() async {
    List<Book> books = _books.values.toList();
    return books;
  }

  Future<void> updateBook(String id, Book updatedBook) async {
    Book? mybook = await findBook(id);
    if (mybook == null) return;
    final bok = _books.entries.firstWhere((entry) => entry.value == mybook);
    if (bok.key.isEmpty) return;
    _books[bok.key] = updatedBook;
  }

  Future<void> deleteBook(String id) async {
    Book? mybook = await findBook(id);
    if (mybook == null) return;
    _books.removeWhere((key, value) => value == mybook);
  }

  Future<List<Book>> getAvailableBooks() async {
    List<Book> books = await getAllBooks();
    books = books.where((e) => e.status == BookStatus.available).toList();
    return books;
  }

  Future<List<Book>> getBooksByGenre(String genre) async {
    List<Book> books = await getAllBooks();
    books = books.where((e) => e.genreTags.contains(genre)).toList();
    return books;
  }

  Future<List<Book>> getBooksByAuthor(String author) async {
    List<Book> books = await getAllBooks();
    books = books.where((e) => e.author == author).toList();
    return books;
  }

  Future<void> addMember(Member member) async {
    _memberCounter++;
    _members['member$_memberCounter'] = member;
  }

  Future<Member?> findMember(String id) async {
    try {
      return _members.values.firstWhere((e) => e.id == id);
    } catch (e) {
      return null;
    }
  }

  Future<List<Member>> getAllMembers() async {
    List<Member> members = _members.values.toList();
    return members;
  }

  Future<void> updateMember(String id, Member updatedMember) async {
    Member? member = await findMember(id);
    if (member == null) return;
    final meb = _members.entries.firstWhere((e) => e.value == member);
    if (meb.key.isEmpty) return;
    _members[meb.key] = updatedMember;
  }

  Future<void> deleteMember(String id) async {
    Member? member = await findMember(id);
    if (member == null) return;
    _members.removeWhere((key, value) => value == member);
  }

  Future<List<Member>> getPremiumMembers() async {
    List<Member> members = await getAllMembers();
    members = members.where((e) => e.tier == MemberTier.premium).toList();
    return members;
  }

  Future<List<Member>> getStandardMembers() async {
    List<Member> members = await getAllMembers();
    members = members.where((e) => e.tier == MemberTier.standard).toList();
    return members;
  }

Future<void> loanBook(String bookId, String memberId) async {
  Book? book = await findBook(bookId);
  if (book == null) {
    throw BookNotFoundException('Book not found $bookId');
  }
  Member? member = await findMember(memberId);
  if (member == null) {
    throw MemberNotFoundException('Member not found $memberId');
  }
  _validateLoan(book, member);
  _loanCounter++;
  String loanId = "LOAN$_loanCounter";
  Loan loan = Loan.withDueDate(loanId, bookId, memberId);
  _loans.add(loan);
  book.borrow(memberId);
  member.addToHistory(bookId);
  _logActivity("Book $bookId loaned to $memberId");
}
Future<void> returnBook(String loanId) async {
  Loan? loan = await findLoan(loanId);
  if (loan == null) return;
  loan.markReturned();
  Book? book = await findBook(loan.bookId);
  if (book != null) {
    book.returnItem();
  }
  _logActivity("Loan $loanId returned");
}

  Future<void> reserveBook(String bookId, String memberId) async {
    Book? book = await findBook(bookId);
    if (book == null) {
      BookNotFoundException('book not foond');
      return;
    }
    if (book.status != BookStatus.available) return;
    Member? member = await findMember(memberId);
    if (member == null) {
      MemberNotFoundException('member not fond');
      return;
    }
  }

  Future<List<Loan>> getActiveLoans() async {
    return _loans.where((e) => !e.isReturned).toList();
  }

  Future<List<Loan>> getOverdueLoans() async {
    return _loans.where((e) => e.isOverdue()).toList();
  }

  Future<List<Loan>> getMemberLoans(String memberId) async {
    return _loans.where((e) => e.memberId == memberId).toList();
  }

  Future<Loan?> findLoan(String loanId) async {
    try {
      return _loans.firstWhere((e) => e.loanId == loanId);
    } catch (_) {
      return null;
    }
  }

  Future<List<Book>> searchCatalog(String query) async {
    return _books.values.where((b) => b.matchesQuery(query)).toList();
  }

  Future<List<Book>> advancedSearch({
    String? title,
    String? author,
    String? genre,
  }) async {
    return _books.values.where((b) {
      bool match = true;
      if (title != null) match &= b.title.contains(title);
      if (author != null) match &= b.author.contains(author);
      if (genre != null) match &= b.genreTags.contains(genre);
      return match;
    }).toList();
  }

  int getTotalBooks() {
    return _bookCounter;
  }

  int getTotalMembers() {
    return _memberCounter;
  }

  int getActiveLoansCount() {
    return this._loans.length;
  }

  Map<BookStatus, int> getBookStatusDistribution() {
    Map<BookStatus, int> result = {};
    for (var b in _books.values) {
      result[b.status] = (result[b.status] ?? 0) + 1;
    }
    return result;
  }

  Map<MemberTier, int> getMemberTierDistribution() {
    Map<MemberTier, int> result = {};
    for (var m in _members.values) {
      result[m.tier] = (result[m.tier] ?? 0) + 1;
    }
    return result;
  }

  List<Book> getMostBorrowedBooks() {
    return _books.values.toList();
  }

  Stream<String> get activityLog => _activityStream.stream;

  void _logActivity(String message) {
    _activityStream.add(message);
  }

  void dispose() {
    _activityStream.close();
  }

  void _validateLoan(Book book, Member member) {
    if (!book.isAvailable()) {
      throw InvalidLoanException("Book not available");
    }
    if (!member.canBorrow()) {
      throw InvalidLoanException("Member reached limit");
    }
  }
}
// manager


// helpers
String? readInput(String prompt) {
  print(prompt);
  return stdin.readLineSync();
}

int? readInt(String prompt) {
  return int.tryParse(readInput(prompt) ?? '');
}

String readRequiredInput(String prompt) {
  while (true) {
    String input = readInput(prompt) ?? 'null';
    if (input != 'null') {
      return input;
    }
  }
}

int readRequiredInt(String prompt) {
  while (true) {
    int num = readInt(prompt) ?? -1;
    if (num != -1) {
      return num;
    }
  }
}

BookStatus selectBookStatus() {
  return BookStatus.available;
}

MemberTier selectMemberTier() {
  return MemberTier.standard;
}

bool confirm(String message) {
  return true;
}

void printHeader(String title) {
  print("===== $title =====");
}

void printSeparator() {
  print("----------------------------");
}

void printSuccess(String message) {
  print("SUCCESS: $message");
}

void printError(String message) {
  print("ERROR: $message");
}

void printInfo(String message) {
  print("INFO: $message");
}

void printLoanDetails(Loan loan) {
  print(loan.getLoanInfo());
}

void printTable(List<List<String>> data, List<String> headers) {
  print(headers.join(" | "));
  for (var row in data) {
    print(row.join(" | "));
  }
}

Map<String, dynamic> bookToMap(Book book) {
  Map<String, dynamic> c = {
    'id': book.id,
    'title': book.title,
    'author': book.author,
    'isbn': book.isbn,
    'description': book.description,
    'statue': book.status,
    'genreTags': book.genreTags,
    'currentBorrowerTd': book.currentBorrowerTd,
    'pages': book.pages,
    'createDat': book.createDat,
    'updateDat': book.updateDat,
  };
  return c;
}

Book mapToBook(Map<String, dynamic> map) {
  Book c = Book(map['id'] ?? '', map['title'] ?? '', map['author'] ?? '');
  c.isbn = map['isbn'];
  c.description = map['description'];
  c.status = map['status'];
  c.genreTags = map['genreTags'];
  c.currentBorrowerTd = map['currentBorrowerTd'];
  c.pages = map['pages'];
  c.createDat = map['createDat'];
  c.updateDat = map['updateDat'];
  return c;
}

String formatDate(DateTime date) {
  return "${date.day}/${date.month}/${date.year}";
}

String formatDuration(Duration duration) {
  return "${duration.inDays} days";
}

List<T> filterList<T>(List<T> list, bool Function(T) test) {
  return list.where(test).toList();
}

List<R> mapList<T, R>(List<T> list, R Function(T) mapper) {
  return list.map(mapper).toList();
}

T reduceList<T>(List<T> list, T Function(T, T) combine) {
  return list.reduce(combine);
}

void forEachWithIndex<T>(List<T> list, void Function(int, T) action) {
  for (int i = 0; i < list.length; i++) {
    action(i, list[i]);
  }
}

bool isBookAvailable(Book book) => book.status == BookStatus.available;
String getBookTitle(Book book) => book.title;
int countActiveLoans(List<Loan> loans) =>
    loans.where((l) => !l.isReturned).length;
bool isMemberPremium(Member member) => member.tier == MemberTier.premium;











// main 
void main() async {
  LibraryManager manager = LibraryManager();
  bool running = true;

  while (running) {
    print("\n========= MAIN MENU =========");
    print("1. Books");
    print("2. Members");
    print("3. Loans");
    print("4. Statistics");
    print("0. Exit");

    String? choice = readInput("Choose: ");

    switch (choice) {
      // ================= BOOKS =================
      case "1":
        bool booksMenu = true;
        while (booksMenu) {
          print("\n--- BOOKS MENU ---");
          print("1. Add Book");
          print("2. View All Books");
          print("3. Available Books");
          print("4. Search");
          print("5. Back");

          String? bookChoice = readInput("Choose: ");

          switch (bookChoice) {
            case "1":
              String id = readRequiredInput("Book ID: ");
              String title = readRequiredInput("Title: ");
              String author = readRequiredInput("Author: ");
              Book book = Book(id, title, author);
              await manager.addBook(book);
              printSuccess("Book added.");
              break;

            case "2":
              var books = await manager.getAllBooks();
              books.forEach((b) => print(b.getDetails()));
              break;

            case "3":
              var books = await manager.getAvailableBooks();
              books.forEach((b) => print(b.getDetails()));
              break;

            case "4":
              String query = readRequiredInput("Search: ");
              var results = await manager.searchCatalog(query);
              results.forEach((b) => print(b.getDetails()));
              break;

            case "5":
              booksMenu = false;
              break;

            default:
              printError("Invalid option.");
          }
        }
        break;

      // ================= MEMBERS =================
      case "2":
        bool membersMenu = true;
        while (membersMenu) {
          print("\n--- MEMBERS MENU ---");
          print("1. Add Member");
          print("2. View All Members");
          print("3. View Premium Members");
          print("4. Back");

          String? memberChoice = readInput("Choose: ");

          switch (memberChoice) {
            case "1":
              String id = readRequiredInput("Member ID: ");
              String name = readRequiredInput("Name: ");
              print("1.Standard  2.Premium");
              String? tierInput = readInput("Choose tier: ");
              MemberTier tier = tierInput == "2"
                  ? MemberTier.premium
                  : MemberTier.standard;
              Member member = Member(id, name, tier);
              await manager.addMember(member);
              printSuccess("Member added.");
              break;

            case "2":
              var members = await manager.getAllMembers();
              members.forEach((m) => print(m.getMemberInfo()));
              break;

            case "3":
              var members = await manager.getPremiumMembers();
              members.forEach((m) => print(m.getMemberInfo()));
              break;

            case "4":
              membersMenu = false;
              break;

            default:
              printError("Invalid option.");
          }
        }
        break;

      // ================= LOANS =================
      case "3":
        bool loansMenu = true;
        while (loansMenu) {
          print("\n--- LOANS MENU ---");
          print("1. Loan Book");
          print("2. Return Book");
          print("3. Active Loans");
          print("4. Overdue Loans");
          print("5. Back");

          String? loanChoice = readInput("Choose: ");

          switch (loanChoice) {
            case "1":
              String bookId = readRequiredInput("Book ID: ");
              String memberId = readRequiredInput("Member ID: ");
              try {
                await manager.loanBook(bookId, memberId);
                printSuccess("Book loaned.");
              } catch (e) {
                printError(e.toString());
              }
              break;

            case "2":
              String loanId = readRequiredInput("Loan ID: ");
              await manager.returnBook(loanId);
              printSuccess("Book returned.");
              break;

            case "3":
              var loans = await manager.getActiveLoans();
              loans.forEach((l) => print(l.getLoanInfo()));
              break;

            case "4":
              var loans = await manager.getOverdueLoans();
              loans.forEach((l) => print(l.getLoanInfo()));
              break;

            case "5":
              loansMenu = false;
              break;

            default:
              printError("Invalid option.");
          }
        }
        break;

      // ================= STATISTICS =================
      case "4":
        print("\n--- STATISTICS ---");
        var bookStats = manager.getBookStatusDistribution();
        bookStats.forEach((k, v) => print("Book $k : $v"));

        var memberStats = manager.getMemberTierDistribution();
        memberStats.forEach((k, v) => print("Member $k : $v"));
        break;

      case "0":
        running = false;
        print("Goodbye 👋");
        break;

      default:
        printError("Invalid option.");
    }
  }

  manager.dispose();
}
