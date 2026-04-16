/*---------------------------------- console.html & accessories.html javascript ----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".view-btn").forEach(btn => {
        let target = document.querySelector(btn.getAttribute("data-bs-target"));

        if (!target) return;

        target.addEventListener("shown.bs.collapse", function () {
            btn.innerHTML = "Hide Details";
        });
        target.addEventListener("hidden.bs.collapse", function () {
            btn.innerHTML = "View Details";
        });
    });
});

/*---------------------------------- games.html javascript ----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("searchBar");
    const genreFilter = document.getElementById("genreFilter");

    if (!searchBar || !genreFilter) return;

    function filterGames() {
        let searchText = searchBar.value.toLowerCase();
        let selectedGenre = genreFilter.value.toLowerCase();
        const games = document.querySelectorAll("#gameList .game");

        games.forEach(game => {
            let title = game.getAttribute("data-title").toLowerCase();
            let genre = game.getAttribute("data-genre").toLowerCase();

            let matchSearch = title.includes(searchText);
            let matchGenre = (selectedGenre === "all" || genre === selectedGenre);

            game.style.display = (matchSearch && matchGenre) ? "" : "none";
        });
    }

    searchBar.addEventListener("input", filterGames);
    genreFilter.addEventListener("change", filterGames);

});

/* Add to Wishlist */
function addToWishlist(button) {
    let gameCard = button.closest(".game");
    let title = gameCard.getAttribute("data-title");
    let genre = gameCard.getAttribute("data-genre");
    let image = gameCard.getAttribute("data-image");
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Prevent duplicates
    let exists = wishlist.some(item => item.title.toLowerCase() === title.toLowerCase());

    if (exists) {
        alert("Already in wishlist!");
        return;
    }

    wishlist.push({
        title: title,
        genre: genre,
        image: image
    });

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to wishlist! ❤️");
}

/*---------------------------------- wishlist.html javascript ----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("wishlistContainer");
    let emptyMessage = document.getElementById("emptyMessage");
    let searchInput = document.getElementById("wishlistSearch");
    let sortBtn = document.getElementById("sortBtn");
    let clearBtn = document.getElementById("clearBtn");

    // Stop running if not on wishlist page
    if (!container || !emptyMessage) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    function displayWishlist(data = wishlist) {
        container.innerHTML = "";

        if (data.length === 0) {
            emptyMessage.classList.remove("hidden");
            return;
        }

        emptyMessage.classList.add("hidden");

        data.forEach(item => {
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card dark-card p-3">
                        <img src="${item.image}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="fw-bold">${item.title}</h5>
                            <p class="desc">Genre: ${item.genre}</p>
                            <button class="btn btn-outline-danger btn-sm" onclick="removeItem('${item.title}')">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    /* Remove item */
    window.removeItem = function (title) {
        wishlist = wishlist.filter(item => item.title !== title);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        displayWishlist(wishlist);
    }

    /* Search */
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            let keyword = this.value.toLowerCase();

            let filtered = wishlist.filter(item =>
                item.title.toLowerCase().includes(keyword)
            );

            displayWishlist(filtered);
        });
    }

    /* Sort A-Z */
    if (sortBtn) {
        sortBtn.addEventListener("click", function () {
            wishlist.sort((a, b) => a.title.localeCompare(b.title));
            displayWishlist();
        });
    }

    /* Clear All */
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to clear your wishlist?")) {
                wishlist = [];
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                displayWishlist();
            }
        });
    }
    displayWishlist();
});

/*---------------------------------- community.html javascript ----------------------------------*/
let posts = JSON.parse(localStorage.getItem("posts")) || [];

/* Ensure properties */
posts.forEach(post => {
    if (!post.comments) post.comments = [];
    if (!post.likes) post.likes = 0;
    if (!post.avatar) post.avatar = post.username.charAt(0).toUpperCase();
});

/* Load page */
document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    if (usernameInput) {
        usernameInput.value = localStorage.getItem("username") || "";
    }
    if (typeof displayPosts === "function") displayPosts();
});

/* Display posts */
function displayPosts(data = posts) {
    let container = document.getElementById("postsContainer");
    if (!container) return;
    container.innerHTML = "";
    document.getElementById("postCount").innerText = "Total Posts: " + data.length;

    if (data.length === 0) {
        container.innerHTML = `
        <div class="text-center text-muted mt-4">
            <h5>No posts yet 🎮</h5>
            <p>Be the first to start the discussion!</p>
        </div>`;
        return;
    }

    let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    let currentUser = localStorage.getItem("username");

    data.forEach(post => {
        let liked = likedPosts.includes(post.id);
        let ownerButtons = "";
        if (currentUser === post.username) {
            ownerButtons = `
                <button class="btn btn-sm btn-outline-warning" onclick="editPost(${post.id})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})">Delete</button>
            `;
        }

        let commentsHTML = "";
        post.comments.forEach(comment => {
            commentsHTML += `
                <div class=" p-2 rounded mb-2 ms-3 border">
                    <b>${comment.username}</b>: ${comment.text}
                </div>`;
        });

        container.innerHTML += `
        <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="d-flex align-items-center mb-2">
                    <div style="
                        width:40px;
                        height:40px;
                        border-radius:50%;
                        background:#dc3545;
                        color:white;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-weight:bold;
                        margin-right:10px;">
                        ${post.avatar}
                    </div>
                    <h4 class="fw-bold">${post.title}</h4>
                </div>

                <p>${post.content}</p>

                <small>By ${post.username} | ${post.date}</small>

                <div class="mt-2">
                    <span class="me-2">❤️ ${post.likes}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="likePost(${post.id})">
                    ${liked ? "❤️ Liked" : "Like"}</button>${ownerButtons}
                </div>
                <hr>
                <h6>Comments (${post.comments.length})</h6>${commentsHTML}
                <div class="d-flex mt-2">
                    <input type="text" id="comment-${post.id}" class="form-control me-2" placeholder="Write a reply...">
                    <button class="btn btn-sm btn-danger" onclick="addComment(${post.id})">Reply</button>
                </div>
            </div>
        </div>`;
    });
}

/* Add post */
function addPost() {
    let username = document.getElementById("username").value;
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let category = document.getElementById("category").value;

    if (!username || !title || !content) {
        alert("Please fill all fields.");
        return;
    }
    let newPost = {
        id: Date.now(),
        avatar: username.charAt(0).toUpperCase(),
        username,
        title,
        content,
        category,
        likes: 0,
        date: new Date().toLocaleString(),
        comments: []
    };
    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    localStorage.setItem("username", username);
    displayPosts();
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
}

/* Like post */
function likePost(postId) {
    let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    if (likedPosts.includes(postId)) return;
    let post = posts.find(p => p.id === postId);
    post.likes++;
    likedPosts.push(postId);
    localStorage.setItem("posts", JSON.stringify(posts));
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    displayPosts();
}

/* Delete */
function deletePost(postId) {
    let index = posts.findIndex(p => p.id === postId);

    if (confirm("Delete this post?")) {
        posts.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        displayPosts();
    }
}

/* Edit */
function editPost(postId) {
    let post = posts.find(p => p.id === postId);
    let newTitle = prompt("Edit title:", post.title);
    let newContent = prompt("Edit content:", post.content);

    if (newTitle && newContent) {
        post.title = newTitle;
        post.content = newContent;

        localStorage.setItem("posts", JSON.stringify(posts));
        displayPosts();
    }
}

/* Comment */
function addComment(postId) {
    let input = document.getElementById(`comment-${postId}`);
    let text = input.value;

    if (!text) {
        alert("Comment cannot be empty!");
        return;
    }

    let post = posts.find(p => p.id === postId);

    post.comments.push({
        username: localStorage.getItem("username") || "User",
        text
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
}

/* Search */
function searchPosts() {
    let keyword = document.getElementById("search").value.toLowerCase();
    let filtered = posts.filter(p =>
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword)
    );

    displayPosts(filtered);
}

/* Filter */
function filterCategory() {
    let value = document.getElementById("categoryFilter").value;
    if (value === "all") return displayPosts(posts);
    displayPosts(posts.filter(p => p.category === value));
}

/* Trending */
function showTrending() {
    let sorted = [...posts].sort((a, b) => b.likes - a.likes);
    displayPosts(sorted);
}

/* Reset */
function resetPosts() {
    displayPosts(posts);
}

/* Clear */
function clearAll() {
    if (confirm("Delete ALL posts?")) {
        localStorage.clear();
        posts = [];
        displayPosts();
    }
}

/* Session + cookie */
sessionStorage.setItem("lastVisit", new Date().toLocaleString());
let username = localStorage.getItem("username") || "";
document.cookie = "username=" + username + "; path=/; max-age=80";

/* ------------------------------ games.html API ------------------------------ */
document.addEventListener("DOMContentLoaded", function () {

    const apiContainer = document.getElementById("apiGames");

    if (!apiContainer) return;

    const API_KEY = "f7fe88e1b10f4609bd68a40ff55c6a29"; 
    const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=6`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            data.results.forEach(game => {

                let col = document.createElement("div");
                col.className = "col-md-4 mb-4";

                col.innerHTML = `
                    <div class="card dark-card p-3 text-center">
                        <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
                        <div class="card-body">
                            <h5>${game.name}</h5>
                            <p class="desc">Rating: ${game.rating}</p>
                            <p class="release">Released: ${game.released || "N/A"}</p>
                        </div>
                    </div>
                `;

                apiContainer.appendChild(col);
            });

        })
        .catch(error => {
            console.error("API Error:", error);
            apiContainer.innerHTML = "<p class='text-danger text-center'>Failed to load API data.</p>";
        });

});

/* ------------------------------ news.html jQuery --------------------------- */
$(document).ready(function () {

    const preview = $("#hoverPreview");

    $(".news-item").on("mousemove", function (e) {

        let img = $(this).data("img");
        let desc = $(this).data("desc");

        $("#previewImg").attr("src", img);
        $("#previewDesc").text(desc);

        preview.removeClass("d-none");

        preview.css({
            top: e.pageY + 15 + "px",
            left: e.pageX + 15 + "px"
        });

    });

    $(".news-item").on("mouseleave", function () {
        preview.addClass("d-none");
    });

        const featuredNews = [
        {
            img: "images/news1.jpeg",
            title: "Rhythm Heaven Groove launches soon",
            desc: "A rhythm-based game bringing fun music challenges to Nintendo Switch."
        },
        {
            img: "images/news2.jpeg",
            title: "Nintendo Switch Online Update",
            desc: "Classic NES, SNES and Game Boy titles now available for members."
        },
        {
            img: "images/news3.jpeg",
            title: "Tomodachi Life Returns",
            desc: "Create your Mii and explore a new simulation world full of surprises."
        },
        {
            img: "images/news4.jpeg",
            title: "What’s New on Nintendo eShop",
            desc: "Looking for something new to play? Check out this week’s new releases for Nintendo Switch 2 and Nintendo Switch. To learn more or to buy a game, just head over to Nintendo eShop."
        },
        {
            img: "images/news5.jpeg",
            title: "Tiny Takeover drop is now available for Minecraft on Nintendo Switch",
            desc: "Minecraft’s Tiny Takeover drop has landed for Nintendo Switch, bringing with it a barrage of redesigned baby mobs, a new item to keep them tiny forever, craftable name tags, and more"
        },
        {
            img: "images/news6.jpeg",
            title: "Introducing MAR10 Day and Topics Related to Mario",
            desc: "MAR10 Day comes from the abbreviation “March 10”, which resembles “MARIO” in writing. Let’s take a look at some topics related to Mario, including new information announced on MAR10 Day."
        }
    ];

    let index = 0;

    function updateFeatured() {

        const img = $("#featuredImg");
        const title = $("#featuredTitle");
        const desc = $("#featuredDesc");

        img.addClass("fade-effect");
        title.addClass("fade-effect");
        desc.addClass("fade-effect");

        setTimeout(() => {

            img.attr("src", featuredNews[index].img);
            title.text(featuredNews[index].title);
            desc.text(featuredNews[index].desc);

            img.removeClass("fade-effect").addClass("fade-in");
            title.removeClass("fade-effect").addClass("fade-in");
            desc.removeClass("fade-effect").addClass("fade-in");

        }, 200);
    }

    // Next button
    $("#nextBtn").click(function () {
        index = (index + 1) % featuredNews.length;
        updateFeatured();
    });

    // Prev button
    $("#prevBtn").click(function () {
        index = (index - 1 + featuredNews.length) % featuredNews.length;
        updateFeatured();
    });

    // AUTO SLIDE
    setInterval(function () {
        index = (index + 1) % featuredNews.length;
        updateFeatured();
    }, 3000);

    // Initial load
    updateFeatured();

});
