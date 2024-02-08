document.addEventListener("DOMContentLoaded", function () {
  const formSubmit = document.getElementById("form");
  formSubmit.addEventListener("submit", function () {
    addBook();
    Event.preventDefault();
  });

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", function () {
    searchBooks(this.value);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
