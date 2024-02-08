function addBook() {
  const titleBook = document.getElementById("title").value;
  const authorBook = document.getElementById("author").value;
  const yearBook = parseInt(document.getElementById("year").value);
  const complete = document.getElementById("finish").checked;

  const generatedID = generateId();
  const objectBook = generateObjectBook(generatedID, titleBook, authorBook, yearBook, complete);
  books.push(objectBook);

  if (complete) {
    document.getElementById("completed-books").append(objectBook);
    window.alert("Buku Berhasil ditambahkan");
  } else {
    document.getElementById("books").append(objectBook);
    window.alert("Buku Berhasil ditambahkan");
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function generateId() {
  return +new Date();
}

function generateObjectBook(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
