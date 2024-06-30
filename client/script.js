document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://blog-site-u7ek.onrender.com'); // Connect to the server via Socket.IO

    fetchPosts();

    document.getElementById('postForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch('https://blog-site-u7ek.onrender.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error creating post:', error.message);
        }
    });

    socket.on('postCreated', (post) => {
        addPostToDOM(post);
    });

    socket.on('postDeleted', (postId) => {
        removePostFromDOM(postId);
    });
});

async function fetchPosts() {
    try {
        const response = await fetch('https://blog-site-u7ek.onrender.com/posts');

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const posts = await response.json();
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';

        posts.forEach((post) => {
            addPostToDOM(post);
        });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
}

function addPostToDOM(post) {
    const postsContainer = document.getElementById('posts');
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <span class="delete-post" data-id="${post._id}">&times;</span>
    `;
    postsContainer.appendChild(postElement);

    postElement.querySelector('.delete-post').addEventListener('click', async () => {
        const postId = postElement.querySelector('.delete-post').getAttribute('data-id');

        try {
            const deleteResponse = await fetch(`https://blog-site-u7ek.onrender.com/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!deleteResponse.ok) {
                throw new Error('Failed to delete post');
            }

            removePostFromDOM(postId);
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    });
}

function removePostFromDOM(postId) {
    const postElement = document.querySelector(`.post .delete-post[data-id="${postId}"]`).parentElement;
    postElement.remove();
}
