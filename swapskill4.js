document.addEventListener("DOMContentLoaded", function () {

    const feed = document.getElementById("feed");
    const searchInput = document.getElementById("searchInput");
    const postInput = document.getElementById("postInput");
    const postBtn = document.getElementById("postBtn");

    let currentUser = localStorage.getItem("currentUser");
    let posts;
     
    // Safe parse (prevents JSON crash)
    try {
        posts = JSON.parse(localStorage.getItem("posts")) || [];
    } catch {
        posts = [];
        localStorage.setItem("posts", JSON.stringify(posts));
    } 
    // =============================
    // CREATE LOGIN / LOGOUT BUTTON
    // =============================
    const authBtn = document.createElement("button");
    authBtn.style.margin = "10px";
    document.body.prepend(authBtn);

    function updateAuthButton() {
        currentUser = localStorage.getItem("currentUser");
        authBtn.textContent = currentUser ? "Logout" : "Login";
    }
    updateAuthButton();

    authBtn.addEventListener("click", function () {
        if (currentUser) {
            localStorage.removeItem("currentUser");
            updateAuthButton();
            location.reload();
        } else {
            window.location.href = "swapskill2.html";
        }
    });
   
    // =============================
    // CREATE POST
    // =========== =================
    if (postBtn) {
        postBtn.addEventListener("click", function () {
           currentUser = localStorage.getItem("currentUser");

            if (!currentUser) {
                alert("Login required to post");
                return;
            }
            const text = postInput.value.trim();//
            if (!text) return;//
 
            const newPost = {
                id: Date.now(),
                author: currentUser,
                text: text,
                timestamp: new Date().toLocaleString(),
                likes: 0,
                likedBy: [], 
                 comments: []
            }; 
            posts.push(newPost);
            localStorage.setItem("posts", JSON.stringify(posts));
 
            postInput.value = "";
            displayPosts(posts);
        });
    }

    // =============================
    // DISPLAY POSTS
    // =============================
    function displayPosts(postArray) {

        feed.innerHTML = "";

        if (!postArray.length) {
            feed.innerHTML = "<p>No posts yet</p>";
            return;
        }

        postArray.reverse().forEach(post => {

            // Force safe structure
            post.likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
            post.comments = Array.isArray(post.comments) ? post.comments : [];
            post.likes = typeof post.likes === "number" ? post.likes : 0;

            const isLiked = currentUser && post.likedBy.includes(currentUser);

            const postDiv = document.createElement("div");
            postDiv.style.border = "1px solid #ccc";
            postDiv.style.padding = "10px";
            postDiv.style.marginBottom = "15px";

            postDiv.innerHTML = `
                <h3>${post.author}</h3> 
                <small>${post.timestamp}</small>
                <p>${post.text}</p>

                <button class="likeBtn" data-id="${post.id}">
                    ${isLiked ? "❤️" : "🤍"} ${post.likes}
                </button>

                ${currentUser === post.author ?
                    `<button class="deleteBtn" data-id="${post.id}">Delete</button>`
                    : ""
                }
 
                <div style="margin-top:8px;">
                    <input type="text" class="commentInput" placeholder="Write comment...">
                    <button class="commentBtn" data-id="${post.id}">Comment</button>
                </div>

                <div>
                    ${post.comments.map(c =>
                        `<p><strong>${c.user}:</strong> ${c.text}</p>`
                    ).join("")}
                </div>
            `;

            feed.appendChild(postDiv);
        });

        attachLikeEvents();
        attachDeleteEvents();
        attachCommentEvents();
    }

    // =============================  
    // LIKE TOGGLE
    // =============================
    function attachLikeEvents() {
        document.querySelectorAll(".likeBtn").forEach(btn => {

            btn.addEventListener("click", function () {

                currentUser = localStorage.getItem("currentUser");
                if (!currentUser) {
                    alert("Login required to like");
                    return;
                }

                const id = Number(this.dataset.id);

                posts = posts.map(post => {

                    post.likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
                    post.likes = typeof post.likes === "number" ? post.likes : 0;

                    if (post.id === id) {

                        if (post.likedBy.includes(currentUser)) {
                            post.likes--;
                            post.likedBy = post.likedBy.filter(u => u !== currentUser);
                        } else {
                            post.likes++;
                            post.likedBy.push(currentUser);
                        }
                    }

                    return post;
                });

                localStorage.setItem("posts", JSON.stringify(posts));
                displayPosts(posts);
            });
        });
    }

    // =============================
    // DELETE
    // =============================
    function attachDeleteEvents() {
        document.querySelectorAll(".deleteBtn").forEach(btn => {

            btn.addEventListener("click", function () {

                const id = Number(this.dataset.id);

                posts = posts.filter(post => post.id !== id);

                localStorage.setItem("posts", JSON.stringify(posts));
                displayPosts(posts);
            });
        });
    }

    // =============================
    // COMMENT
    // =============================
    function attachCommentEvents() {
        document.querySelectorAll(".commentBtn").forEach(btn => {

            btn.addEventListener("click", function () {

                currentUser = localStorage.getItem("currentUser");
                if (!currentUser) {
                    alert("Login required to comment");
                    return;
                }

                const id = Number(this.dataset.id);
                const input = this.previousElementSibling;
                const text = input.value.trim();
                if (!text) return;

                posts = posts.map(post => {

                    post.comments = Array.isArray(post.comments) ? post.comments : [];

                    if (post.id === id) {
                        post.comments.push({
                            user: currentUser,
                            text: text
                        });
                    }

                    return post;
                });

                localStorage.setItem("posts", JSON.stringify(posts));
                displayPosts(posts);
            });
        });
    }

    // =============================
    // SEARCH
    // =============================
    if (searchInput) {
        searchInput.addEventListener("input", function () {

            const value = this.value.toLowerCase();

            const filtered = posts.filter(post =>
                post.text.toLowerCase().includes(value) ||
                post.author.toLowerCase().includes(value)
            );

            displayPosts(filtered);
        });
    }

    displayPosts(posts);

});
  
