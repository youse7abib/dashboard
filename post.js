/***********************
        * Posts page JS
        * - fetch posts from JSONPlaceholder (async/await + error handling)
        * - picsum images for visuals
        * - user posts saved to localStorage (add/edit/delete)
        * - posts from API are read-only
        * - event delegation for edit/delete
        ***********************/

(function () {
    // DOM
    let grid = document.getElementById('grid');
    let status = document.getElementById('status');

    // modal
    let backdrop = document.getElementById('PopUp');
    let modalTitle = document.getElementById('pop-Title');
    let postForm = document.getElementById('postForm');
    let titleInput = document.getElementById('titleInput');
    let bodyInput = document.getElementById('bodyInput');
    let imageInput = document.getElementById('imageInput');
    let openAddBtn = document.getElementById('openAdd');
    let cancelModalBtn = document.getElementById('cancelModal');

    // state
    let posts = []; // combined [apiPosts..., userPosts...]
    let userPostsKey = 'userPosts';
    let editingIndex = null; // index in posts array

    // helper: fetch JSON with error handling
    async function fetchJSON(url) {
        let res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    }

    // load API posts
    async function loadApiPosts(limit = 8) {
        try {
            status.textContent = 'Loading posts from API...';
            let apiData = await fetchJSON('https://jsonplaceholder.typicode.com/posts?_limit=' + limit);
            // map to internal format and add picsum image
            let apiPosts = apiData.map((p, i) => ({
                id: 'api-' + p.id,
                title: p.title,
                body: p.body,
                image: `https://picsum.photos/seed/post-${p.id}/800/480`,
                fromAPI: true,
                createdAt: new Date().toISOString()
            }));
            return apiPosts;
        } catch (err) {
            console.error(err);
            status.textContent = 'Failed loading API posts — showing only saved posts.';
            return [];
        }
    }

    // load user posts from localStorage
    function loadUserPosts() {
        try {
            let raw = localStorage.getItem(userPostsKey);
            if (!raw) return [];
            let arr = JSON.parse(raw);
            // ensure format match
            return arr.map(p => ({ ...p, fromAPI: false }));
        } catch (e) {
            console.error('Failed to parse userPosts', e);
            return [];
        }
    }

    function saveUserPosts() {
        let local = posts.filter(p => !p.fromAPI);
        localStorage.setItem(userPostsKey, JSON.stringify(local));
    }

    // render all posts (current posts state)
    function renderPosts() {
        grid.innerHTML = '';

        if (posts.length === 0) {
            grid.innerHTML = '<div class="muted">No posts found.</div>';
            return;
        }

        for (let i = 0; i < posts.length; i++) {
            let p = posts[i];
            let card = document.createElement('article');
            card.className = 'card';
            card.setAttribute('tabindex', '0');
            card.innerHTML = `
          <div class="meta">
            <h3>${p.title}</h3>
            <p class="excerpt">${p.body.length > 120 ? p.body.slice(0, 120).trim() + '…' : p.body}</p>
          </div>
          <div class="media" aria-hidden="${!p.image ? 'true' : 'false'}">
            <img src="${p.image}" alt="${p.title} image" loading="lazy">
          </div>
          <div class="body">${p.body}</div>
          <div class="actions" data-index="${i}">
            ${p.fromAPI ? '<span class="readonly-badge" aria-hidden="true">API</span>' :
                    `<button class="small-btn edit-btn" data-action="edit" aria-label="Edit post">✏️</button>
                     <button class="small-btn delete-btn" data-action="delete" aria-label="Delete post">🗑️</button>`}
          </div>
        `;
            grid.appendChild(card);
        }
    }


    // open modal
    function openModal(mode = 'add', idx = null) {
        backdrop.style.display = 'flex';
        backdrop.setAttribute('aria-hidden', 'false');
        if (mode === 'add') {
            modalTitle.textContent = 'Add New Post';
            postForm.reset();
            editingIndex = null;
            titleInput.focus();
        } else {
            modalTitle.textContent = 'Edit Post';
            let p = posts[idx];
            if (!p || p.fromAPI) return; // can't edit API post
            editingIndex = idx;
            titleInput.value = p.title;
            bodyInput.value = p.body;
            imageInput.value = p.image || '';
            titleInput.focus();
        }
        // trap focus simple: focus on first input
    }

    function closeModal() {
        backdrop.style.display = 'none';
        backdrop.setAttribute('aria-hidden', 'true');
        editingIndex = null;
    }

    // add/edit
    function handleFormSubmit(e) {
        e.preventDefault();
        let title = titleInput.value.trim();
        let body = bodyInput.value.trim();
        let image = imageInput.value.trim() || `https://picsum.photos/seed/user-${Date.now()}/800/480`;
        if (!title || !body) return;

        let newPost = {
            id: 'user-' + Date.now(),
            title, body, image, fromAPI: false, createdAt: new Date().toISOString()
        };

        if (editingIndex !== null) {
            // find real index in posts array that matches current filtered render
            // editingIndex here is index in posts array (we set it when opening modal)
            posts[editingIndex] = newPost;
        } else {
            // push to front so user posts appear after API posts (or we can push top)
            posts.push(newPost);
        }
        saveUserPosts();
        renderPosts();
        closeModal();
    }

    // event delegation for edit/delete
    grid.addEventListener('click', function (e) {
        let actionBtn = e.target.closest('button');
        if (!actionBtn) return;
        let actionsDiv = actionBtn.closest('.actions');
        if (!actionsDiv) return;
        let index = Number(actionsDiv.dataset.index);
        let action = actionBtn.dataset.action;
        if (action === 'edit') {
            openModal('edit', index);
        } else if (action === 'delete') {
            // confirm
            if (confirm('Delete this post?')) {
                let postToDelete = posts[index];
                let realIndex = index;
                if (realIndex > -1) {
                    posts.splice(realIndex, 1);
                    saveUserPosts();
                    renderPosts();
                }
            }
        }
    });

    // safer: keyboard support for edit/delete via keydown (Enter when card focused)
    grid.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            // try to click first action button inside focused card
            let card = document.activeElement;
            if (card && card.classList.contains('card')) {
                let btn = card.querySelector('.actions button');
                if (btn) btn.click();
            }
        }
    });



    // open modal
    openAddBtn.addEventListener('click', () => openModal('add'));

    cancelModalBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) closeModal();
    });

    postForm.addEventListener('submit', handleFormSubmit);

    // init: load api posts + user posts and render
    async function init() {
        status.textContent = 'Starting...';
        let apiPosts = await loadApiPosts(8); // 8 api posts
        let local = loadUserPosts();
        posts = [...apiPosts, ...local]; // api first then user
        status.textContent = `Showing ${posts.length} posts (${apiPosts.length} from API, ${local.length} yours).`;
        renderPosts();
    }

    // initial call
    init();

})();