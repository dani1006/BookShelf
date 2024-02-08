const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_WEB";
const books = [];

document.addEventListener(RENDER_EVENT, function (event) {
  const booksToRender = event.detail || books;

  const uncompletedBOOKSList = document.getElementById("books");
  uncompletedBOOKSList.innerHTML = "";

  const completedBOOKSList = document.getElementById("completed-books");
  completedBOOKSList.innerHTML = "";

  for (const bookItem of booksToRender) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) uncompletedBOOKSList.append(bookElement);
    else completedBOOKSList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h1");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("h2");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("h2");
  textYear.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      showConfirmationDialog(bookObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      showConfirmationDialog(bookObject.id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
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

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBooks(query) {
  const filteredBooks = books.filter(function (book) {
    return book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase());
  });

  document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: filteredBooks }));
}

function showConfirmationDialog(bookId) {
  document.body.classList.add("body-scroll-lock");

  const dialogContainer = document.createElement("div");
  dialogContainer.classList.add("dialog-container");

  const dialogBox = document.createElement("div");
  dialogBox.classList.add("dialog-box");

  const dialogMessage = document.createElement("p");
  dialogMessage.innerText = "Yakin ingin menghapus buku ini?";

  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Batal";
  cancelButton.addEventListener("click", function () {
    document.body.classList.remove("body-scroll-lock");
    document.body.removeChild(dialogContainer);
  });

  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Hapus";
  confirmButton.addEventListener("click", function () {
    removeBookFromCompleted(bookId);
    document.body.classList.remove("body-scroll-lock");
    document.body.removeChild(dialogContainer);
  });

  dialogBox.append(dialogMessage, cancelButton, confirmButton);

  dialogContainer.appendChild(dialogBox);

  document.body.appendChild(dialogContainer);
}
