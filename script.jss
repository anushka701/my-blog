const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const contentInput = document.getElementById("content");
const postIdInput = document.getElementById("postId");

const postsContainer = document.getElementById("posts");
const searchInput = document.getElementById("search");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Get posts from localStorage
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Save posts
function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// Generate ID
function generateId() {
    return Date.now().toString();
}

// Display posts
function displayPosts(postsToDisplay = posts) {

    postsContainer.innerHTML = "";

    if (postsToDisplay.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty">
                <p>No blog posts found.</p>
            </div>
        `;
        return;
    }

    postsToDisplay.forEach(post => {

        const postElement = document.createElement("article");
        postElement.className = "post";

        postElement.innerHTML = `
            <h3>${escapeHTML(post.title)}</h3>

            <div class="post-info">
                By ${escapeHTML(post.author)}
                • ${post.date}
            </div>

            <div class="post-content">
                ${escapeHTML(post.content)}
            </div>

            <div class="actions">
                <button
                    class="edit"
                    onclick="editPost('${post.id}')"
                >
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deletePost('${post.id}')"
                >
                    Delete
                </button>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// Create or update post
postForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const content = contentInput.value.trim();
    const postId = postIdInput.value;

    if (!title || !author || !content) {
        alert("Please fill in all fields.");
        return;
    }

    // Update existing post
    if (postId) {

        const post = posts.find(post => post.id === postId);

        if (post) {
            post.title = title;
            post.author = author;
            post.content = content;
        }

        alert("Post updated successfully!");

    } else {

        // Create new post
        const newPost = {
            id: generateId(),
            title: title,
            author: author,
            content: content,
            date: new Date().toLocaleDateString()
        };

        posts.unshift(newPost);

        alert("Post published successfully!");
    }

    savePosts();
    displayPosts();
    resetForm();
});

// Edit post
function editPost(id) {

    const post = posts.find(post => post.id === id);

    if (!post) return;

    titleInput.value = post.title;
    authorInput.value = post.author;
    contentInput.value = post.content;
    postIdInput.value = post.id;

    formTitle.textContent = "Edit Post";
    submitBtn.textContent = "Update Post";
    cancelBtn.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete post
function deletePost(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    posts = posts.filter(post => post.id !== id);

    savePosts();
    displayPosts();
}

// Reset form
function resetForm() {

    postForm.reset();
    postIdInput.value = "";

    formTitle.textContent = "Create a Post";
    submitBtn.textContent = "Publish Post";
    cancelBtn.style.display = "none";
}

cancelBtn.addEventListener("click", resetForm);

// Search posts
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchText) ||
        post.author.toLowerCase().includes(searchText) ||
        post.content.toLowerCase().includes(searchText)
    );

    displayPosts(filteredPosts);
});

// Prevent HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");
    div.textContent = text;

    return div.innerHTML;
}

// Initial display
displayPosts();