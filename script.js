const books = document.getElementById("book-list");
const forms = document.getElementById("forms");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const rankInput = document.getElementById("rank");
const yearInput = document.getElementById("year");
const ratingInput = document.getElementById("rating");
const descriptionInput = document.getElementById("description");

let selectedId = null;


// ================= GET ALLA =================
fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(data => {
        data.sort((a, b) => a.rank - b.rank);
        data.forEach(book => {

            const listItem = document.createElement("li");
            listItem.textContent = book.rank + ". " + book.title + " - " + book.author;
            listItem.classList.add("bookStyle");

            // ================= GET EN + FYLL FORM =================
            listItem.addEventListener("click", () => {
                fetch("http://localhost:3000/books/" + book.id)
                    .then(res => res.json())
                    .then(data => {
                        titleInput.value = data.title;
                        authorInput.value = data.author;
                        descriptionInput.value = data.description;
                        genreInput.value = data.genre;
                        yearInput.value = data.year;
                        rankInput.value = data.rank;
                        ratingInput.value = data.rating;

                        selectedId = data.id;
                    })
                    .catch(error => {
                        console.error("GET EN fel:", error);
                    });
            });

            // ================= DELETE =================
            const button = document.createElement("button");
            button.textContent = "Delete";

            button.addEventListener("click", (event) => {
                event.stopPropagation();

                fetch("http://localhost:3000/books/" + book.id, {
                    method: "DELETE"
                })
                .then(() => {
                    listItem.remove(); // ta bort från UI
                })
                .catch(error => {
                    console.error("DELETE fel:", error);
                });
            });

            listItem.appendChild(button);
            books.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("GET ALLA fel:", error);
    });


// ================= POST / PUT =================
forms.addEventListener("submit", (event) => {
    event.preventDefault();

    const newBook = {
        title: titleInput.value,
        author: authorInput.value,
        description: descriptionInput.value,
        genre: genreInput.value,
        year: yearInput.value,
        rank: rankInput.value,
        rating: ratingInput.value
    };

    // ================= PUT =================
    if (selectedId) {
        fetch("http://localhost:3000/books/" + selectedId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBook)
        })
        .then(() => {
            location.reload(); // uppdatera lista
        })
        .catch(error => {
            console.error("PUT fel:", error);
        });

        selectedId = null;

    } 
    // ================= POST =================
    else {
        fetch("http://localhost:3000/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBook)
        })
        .then(() => {
            location.reload(); // uppdatera lista
        })
        .catch(error => {
            console.error("POST fel:", error);
        });
    }

    forms.reset();
});