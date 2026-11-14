document.addEventListener("DOMContentLoaded", () => {
  // Catalogue: category chips, URL category and search work together.
  const cards = [...document.querySelectorAll(".book-card[data-category]")];
  if (cards.length) {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const resetBtn = document.getElementById("resetBtn");
    const noResults = document.getElementById("noResults");
    const resultCount = document.getElementById("resultCount");
    const chips = [...document.querySelectorAll(".chip")];
    const params = new URLSearchParams(window.location.search);
    let selectedCategory = params.get("category") || "All";

    const normalise = value => value.toLowerCase().trim();

    function applyFilters() {
      const term = normalise(searchInput.value);
      let visible = 0;
      cards.forEach(card => {
        const category = card.dataset.category;
        const searchText = normalise(card.dataset.search + " " + card.innerText);
        const categoryMatch = selectedCategory === "All" || category === selectedCategory;
        const searchMatch = !term || searchText.includes(term);
        const show = categoryMatch && searchMatch;
        card.hidden = !show;
        if (show) visible++;
      });
      noResults.hidden = visible !== 0;
      resultCount.textContent = `${visible} book${visible === 1 ? "" : "s"} found`;
      chips.forEach(chip => chip.classList.toggle("active", chip.dataset.filter === selectedCategory));
    }

    chips.forEach(chip => chip.addEventListener("click", () => {
      selectedCategory = chip.dataset.filter;
      const url = new URL(window.location.href);
      if (selectedCategory === "All") url.searchParams.delete("category");
      else url.searchParams.set("category", selectedCategory);
      history.replaceState({}, "", url);
      applyFilters();
    }));

    searchForm.addEventListener("submit", event => {
      event.preventDefault();
      applyFilters();
    });
    searchInput.addEventListener("input", applyFilters);
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      selectedCategory = "All";
      history.replaceState({}, "", "books.html");
      applyFilters();
    });
    applyFilters();

    // Book details modal.
    const modal = document.getElementById("bookModal");
    const closeModal = document.getElementById("closeModal");
    cards.forEach(card => {
      const detailsButton = card.querySelector(".details-btn");
      detailsButton.addEventListener("click", () => {
        const title = card.querySelector("h3").textContent;
        const author = card.querySelector(".book-info p").textContent;
        const category = card.dataset.category;
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalAuthor").textContent = author;
        document.getElementById("modalCategory").textContent = category;
        document.getElementById("modalEnquire").href = `contact.html?book=${encodeURIComponent(title)}`;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
      });
      card.querySelector(".buy-btn").addEventListener("click", () => {
        const title = card.querySelector("h3").textContent;
        alert(`Thanks for your interest in "${title}"! This is a student demo project. Online payment/checkout is not connected yet. Please use Enquire to contact the bookstore.`);
      });
    });
    function hideModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }
    closeModal.addEventListener("click", hideModal);
    modal.addEventListener("click", event => { if (event.target === modal) hideModal(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") hideModal(); });
  }

  // Prefill enquiry form from book card link or modal.
  const bookName = document.getElementById("bookName");
  if (bookName) {
    const params = new URLSearchParams(window.location.search);
    bookName.value = params.get("book") || "";
  }
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      document.getElementById("formFeedback").textContent =
        "Thank you! Your enquiry has been recorded in this demo. No email or server submission is connected.";
      contactForm.reset();
    });
  }
});
