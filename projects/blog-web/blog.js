// Initialize storage
let posts = JSON.parse(localStorage.getItem('posts') || '[]');

// Load posts when page loads
window.onload = loadPosts;

function loadPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '';
    
    posts.forEach((post, index) => {
        container.innerHTML += `
            <div class="post-card">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <div class="timestamp">
                    Created: ${new Date(post.created).toLocaleString()}<br>
                    ${post.updated ? `Updated: ${new Date(post.updated).toLocaleString()}` : ''}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-warning" onclick="editPost(${index})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePost(${index})">Delete</button>
                </div>
            </div>
        `;
    });
}

function showEditor(postId = null) {
    const modal = new bootstrap.Modal(document.getElementById('editorModal'));
    const form = document.getElementById('postForm');
    
    if(postId !== null) {
        const post = posts[postId];
        document.getElementById('modalTitle').textContent = 'Edit Post';
        document.getElementById('postId').value = postId;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
    } else {
        document.getElementById('modalTitle').textContent = 'New Post';
        form.reset();
    }
    
    modal.show();
}

function savePost(event) {
    event.preventDefault();
    const modal = bootstrap.Modal.getInstance(document.getElementById('editorModal'));
    const postId = document.getElementById('postId').value;
    
    const postData = {
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        created: postId !== '' ? posts[postId].created : new Date().toISOString(),
        updated: postId !== '' ? new Date().toISOString() : null
    };

    if(postId) {
        posts[postId] = postData;
    } else {
        posts.push(postData);
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    modal.hide();
    loadPosts();
}

function editPost(index) {
    showEditor(index);
}

function deletePost(index) {
    if(confirm('Are you sure you want to delete this post?')) {
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}
