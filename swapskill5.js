document.addEventListener("DOMContentLoaded", function () {

    const currentUser = localStorage.getItem("currentUser");

    // 🔐 Block if not logged in
    if (!currentUser) {
        alert("Please login first");
        window.location.href = "swapskill2.html";
        return;
    }

    const postBtn = document.getElementById("submitPostBtn");
    const postInput = document.getElementById("postInput");
    const backBtn = document.getElementById("backBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    postBtn.addEventListener("click", function () {

        const text = postInput.value.trim();

        if (text === "") {
            alert("Write something first");
            return;
        }

        const newPost = {
            id: Date.now(),
            text: text,
            author: currentUser,
            likes: 0,
            timestamp: new Date().toLocaleString()
        };

        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        postInput.value = "";

        window.location.href = "swapskill4.html";
    });

    backBtn.addEventListener("click", function () {
        window.location.href = "swapskill4.html";
    });

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        alert("Logged out successfully");
        window.location.href = "swapskill2.html";
    });

});
