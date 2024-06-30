document.addEventListener('DOMContentLoaded', () => {
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
  
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error.message);
        }
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
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <span class="delete-post" data-id="${post._id}">&times;</span>
            `;
            postsContainer.appendChild(postElement);
        });
  
        document.querySelectorAll('.delete-post').forEach(button => {
            button.addEventListener('click', async () => {
                const postId = button.getAttribute('data-id');
  
                try {
                    const deleteResponse = await fetch(`https://blog-site-u7ek.onrender.com/posts/${postId}`, {
                        method: 'DELETE',
                    });
  
                    if (!deleteResponse.ok) {
                        throw new Error('Failed to delete post');
                    }
  
                    fetchPosts();
                } catch (error) {
                    console.error('Error deleting post:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
}