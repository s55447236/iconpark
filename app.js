document.addEventListener('DOMContentLoaded', () => {
    const iconGrid = document.getElementById('iconGrid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // 添加导航栏
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <div class="navbar-left">
            <div class="brand">
                <h1>iiiiicon</h1>
                <button class="version-btn">v1.0.0</button>
            </div>
        </div>
        <div class="navbar-right">
            <button class="nav-btn favorites">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" fill="none" stroke-width="1.5"/>
                </svg>
                收藏夹
                <span class="favorites-count">0</span>
            </button>
            <button class="nav-btn download-all">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" stroke="currentColor" fill="none" stroke-width="1.5"/>
                </svg>
                下载全部
            </button>
            <button class="nav-btn donate">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" fill="none" stroke-width="1.5"/>
                </svg>
                打赏
            </button>
        </div>
    `;
    document.body.insertBefore(navbar, document.body.firstChild);

    // 创建版本历史弹窗
    const versionModal = document.createElement('div');
    versionModal.className = 'version-modal';
    versionModal.innerHTML = `
        <div class="version-modal-content">
            <div class="version-modal-header">
                <h2>版本历史</h2>
                <button class="version-modal-close">&times;</button>
            </div>
            <div class="version-modal-body">
                <div class="version-item">
                    <h3>v2.5.0 (2024-01-02)</h3>
                    <ul>
                        <li class="tag tag-add">ADD</li>
                        <li>新增 122 个图标：copyleft、reply-all、collage、ink-bottle、dashboard-2、dashboard-3、usb、draft、delete-column、delete-row、flow-chart、h-1 到 h-6、insert-column-left、insert-column-right、insert-row-bottom、insert-row-top、merge-cells-horizontal、merge-cells-vertical、mind-map、node-tree、organization-chart、question-mark</li>
                        <li class="tag tag-update">UPDATE</li>
                        <li>根据最新的 logo 样式，重新设计了 discord 和 gitlab 图标</li>
                        <li class="tag tag-fix">FIX</li>
                        <li>修改了 iconfont 的基线，现在图标应该与文字垂直对齐</li>
                    </ul>
                </div>
                <div class="version-item">
                    <h3>v1.0.0 (2024-01-01)</h3>
                    <ul>
                        <li class="tag tag-add">ADD</li>
                        <li>初始版本发布</li>
                        <li>支持箭头图标组</li>
                        <li>支持通用图标组</li>
                        <li>支持形状图标组</li>
                        <li>支持文件图标组</li>
                        <li>支持图标搜索功能</li>
                        <li>支持图标收藏功能</li>
                        <li>支持 SVG 和 PNG 格式下载</li>
                        <li>支持图标颜色和尺寸调整</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(versionModal);

    // 版本号点击事件
    const versionBtn = navbar.querySelector('.version-btn');
    const versionModalClose = versionModal.querySelector('.version-modal-close');

    versionBtn.addEventListener('click', () => {
        versionModal.classList.add('active');
    });

    versionModalClose.addEventListener('click', () => {
        versionModal.classList.remove('active');
    });

    versionModal.addEventListener('click', (e) => {
        if (e.target === versionModal) {
            versionModal.classList.remove('active');
        }
    });

    // 收藏功能
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesCount = navbar.querySelector('.favorites-count');
    favoritesCount.textContent = favorites.length;

    // 分类数据
    const categories = [
        { id: 'all', name: 'All' },
        { id: 'arrow', name: 'Arrow', path: 'icons/Arrow' },
        { id: 'general', name: 'General', path: 'icons/General' },
        { id: 'shapes', name: 'Shapes', path: 'icons/Shapes' },
        { id: 'files', name: 'Files', path: 'icons/Files' }
    ];

    // 创建分类选择器
    const searchContainer = document.querySelector('.search-container');
    const categorySelect = document.createElement('div');
    categorySelect.className = 'category-select';
    categorySelect.innerHTML = `
        <button class="category-btn">All</button>
        <div class="category-dropdown">
            ${categories.map(category => `
                <div class="category-option ${category.id === 'all' ? 'selected' : ''}" data-id="${category.id}">
                    ${category.name}
                </div>
            `).join('')}
        </div>
    `;

    // 替换原有的All按钮
    const oldCategoryBtn = searchContainer.querySelector('.category-btn');
    searchContainer.replaceChild(categorySelect, oldCategoryBtn);

    // 分类选择器交互
    const categoryBtn = categorySelect.querySelector('.category-btn');
    const categoryDropdown = categorySelect.querySelector('.category-dropdown');
    const categoryOptions = categorySelect.querySelectorAll('.category-option');

    categoryBtn.addEventListener('click', () => {
        categorySelect.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!categorySelect.contains(e.target)) {
            categorySelect.classList.remove('active');
        }
    });

    // 创建模态框
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <div class="icon-title">Icon Preview</div>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                <div class="preview-section">
                    <div class="modal-preview"></div>
                    <div class="preview-name"></div>
                </div>
                <div class="modal-actions">
                    <div class="control-group">
                        <div class="control-item">
                            <input type="color" id="iconColor" value="#000000" class="color-picker" />
                        </div>
                        <div class="control-item">
                            <select id="iconSize" class="size-select">
                                <option value="16">16px</option>
                                <option value="20">20px</option>
                                <option value="24" selected>24px</option>
                                <option value="48">48px</option>
                                <option value="60">60px</option>
                                <option value="120">120px</option>
                                <option value="200">200px</option>
                            </select>
                        </div>
                    </div>
                    <div class="download-buttons">
                        <button class="modal-btn primary" data-action="svg">
                            <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 4px;">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                            </svg>
                            SVG
                        </button>
                        <button class="modal-btn secondary" data-action="png">
                            <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 4px;">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                            </svg>
                            PNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // 模态框关闭功能
    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // 尺寸选择功能
    const updatePreviewSize = (size) => {
        const previewSvg = modalOverlay.querySelector('.modal-preview svg');
        if (previewSvg) {
            previewSvg.style.width = `${size}px`;
            previewSvg.style.height = `${size}px`;
        }
    };

    modalOverlay.querySelector('#iconSize').addEventListener('change', (e) => {
        updatePreviewSize(e.target.value);
    });

    // 颜色选择功能
    const updatePreviewColor = (color) => {
        const previewSvg = modalOverlay.querySelector('.modal-preview svg');
        if (previewSvg) {
            previewSvg.querySelectorAll('path').forEach(path => {
                path.setAttribute('stroke', color);
                path.setAttribute('fill', 'none');
                path.style.stroke = color;
                path.style.fill = 'none';
            });
        }
    };

    modalOverlay.querySelector('#iconColor').addEventListener('input', (e) => {
        updatePreviewColor(e.target.value);
    });

    // 加载图标
    async function loadIcons(category = 'all') {
        let iconsByCategory = {};
        if (category === 'all') {
            // 加载所有分类的图标
            for (const cat of categories) {
                if (cat.id !== 'all' && cat.path) {
                    const categoryIcons = await fetch(`${cat.path}/icons.json`)
                        .then(response => response.json())
                        .catch(() => []);
                    if (categoryIcons.length > 0) {
                        iconsByCategory[cat.name] = categoryIcons;
                    }
                }
            }
        } else {
            // 加载特定分类的图标
            const selectedCategory = categories.find(c => c.id === category);
            if (selectedCategory && selectedCategory.path) {
                const categoryIcons = await fetch(`${selectedCategory.path}/icons.json`)
                    .then(response => response.json())
                    .catch(() => []);
                if (categoryIcons.length > 0) {
                    iconsByCategory[selectedCategory.name] = categoryIcons;
                }
            }
        }
        return iconsByCategory;
    }

    // 渲染图标
    function renderIcons(iconsByCategory) {
        iconGrid.innerHTML = '';
        
        Object.entries(iconsByCategory).forEach(([categoryName, icons]) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'category-title';
            categoryTitle.innerHTML = `
                ${categoryName}
                <span class="category-count">${icons.length}</span>
            `;
            categorySection.appendChild(categoryTitle);

            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'icon-grid';

            icons.forEach(icon => {
                const iconItem = document.createElement('div');
                iconItem.className = 'icon-item';
                
                fetch(icon.path)
                    .then(response => response.text())
                    .then(svgContent => {
                        const isFavorite = favorites.includes(icon.name);
                        iconItem.innerHTML = `
                            <div class="icon-preview">
                                ${svgContent}
                            </div>
                            <div class="icon-name">${icon.name}</div>
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" title="${isFavorite ? '已收藏' : '加入收藏'}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.4951 2.71381C11.7017 2.29527 12.2985 2.29527 12.5051 2.71381L15.1791 8.13194C15.2611 8.29814 15.4196 8.41334 15.6031 8.43999L21.5823 9.30883C22.0442 9.37595 22.2286 9.94357 21.8944 10.2694L17.5678 14.4868C17.4351 14.6162 17.3745 14.8026 17.4058 14.9852L18.4272 20.9403C18.5061 21.4004 18.0233 21.7512 17.6101 21.534L12.2621 18.7224C12.0981 18.6361 11.9021 18.6361 11.738 18.7224L6.39002 21.534C5.97689 21.7512 5.49404 21.4004 5.57294 20.9403L6.59432 14.9852C6.62565 14.8026 6.56509 14.6162 6.43236 14.4868L2.10573 10.2694C1.7715 9.94357 1.95594 9.37595 2.41783 9.30883L8.39708 8.43999C8.5805 8.41334 8.73906 8.29814 8.82109 8.13194L11.4951 2.71381Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        `;

                        // 设置图标为描边样式
                        const iconSvg = iconItem.querySelector('.icon-preview svg');
                        if (iconSvg) {
                            iconSvg.querySelectorAll('path').forEach(path => {
                                path.setAttribute('stroke', 'currentColor');
                                path.setAttribute('fill', 'none');
                                path.style.stroke = 'currentColor';
                                path.style.fill = 'none';
                            });
                        }

                        // 收藏按钮点击事件
                        const favoriteBtn = iconItem.querySelector('.favorite-btn');
                        favoriteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const index = favorites.indexOf(icon.name);
                            if (index === -1) {
                                favorites.push(icon.name);
                                favoriteBtn.classList.add('active');
                                favoriteBtn.title = '已收藏';
                            } else {
                                favorites.splice(index, 1);
                                favoriteBtn.classList.remove('active');
                                favoriteBtn.title = '加入收藏';
                            }
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                            favoritesCount.textContent = favorites.length;
                        });

                        // 图标点击事件 - 打开下载模态框
                        iconItem.addEventListener('click', () => {
                            modalOverlay.classList.add('active');
                            const modalPreview = modalOverlay.querySelector('.modal-preview');
                            modalPreview.innerHTML = svgContent;
                            
                            // 设置图标名称
                            const previewName = modalOverlay.querySelector('.preview-name');
                            previewName.textContent = icon.name;
                            
                            // 设置初始预览尺寸和颜色
                            const initialSize = modalOverlay.querySelector('#iconSize').value;
                            const initialColor = modalOverlay.querySelector('#iconColor').value;
                            updatePreviewSize(initialSize);
                            updatePreviewColor(initialColor);

                            // 设置下载按钮事件
                            modalOverlay.querySelectorAll('.modal-btn').forEach(btn => {
                                btn.onclick = () => {
                                    const action = btn.dataset.action;
                                    const size = modalOverlay.querySelector('#iconSize').value;
                                    const color = modalOverlay.querySelector('#iconColor').value;
                                    if (action === 'svg') {
                                        downloadSVG(svgContent, icon.name, size, color);
                                    } else if (action === 'png') {
                                        downloadPNG(svgContent, icon.name, size, color);
                                    }
                                };
                            });
                        });
                    });

                categoryGrid.appendChild(iconItem);
            });
            
            categorySection.appendChild(categoryGrid);
            iconGrid.appendChild(categorySection);
        });
    }

    // 下载SVG文件
    async function downloadSVG(svgContent, fileName, size, color) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgContent;
        const svgElement = tempDiv.querySelector('svg');
        svgElement.setAttribute('width', size);
        svgElement.setAttribute('height', size);
        
        svgElement.querySelectorAll('path').forEach(path => {
            path.setAttribute('stroke', color);
            path.setAttribute('fill', 'none');
            path.style.stroke = color;
            path.style.fill = 'none';
        });

        const blob = new Blob([tempDiv.innerHTML], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 下载PNG文件
    async function downloadPNG(svgContent, fileName, size, color) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgContent;
        const svgElement = tempDiv.querySelector('svg');
        svgElement.setAttribute('width', size);
        svgElement.setAttribute('height', size);
        
        svgElement.querySelectorAll('path').forEach(path => {
            path.setAttribute('stroke', color);
            path.setAttribute('fill', 'none');
            path.style.stroke = color;
            path.style.fill = 'none';
        });
        
        const svg = new Blob([tempDiv.innerHTML], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svg);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, size, size);
            
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/png');
        };

        img.src = url;
    }

    // 分类选择
    categoryOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const categoryId = option.dataset.id;
            const categoryName = option.textContent.trim();
            
            // 更新UI
            categoryBtn.textContent = categoryName;
            categorySelect.classList.remove('active');
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            // 加载并显示图标
            const iconsByCategory = await loadIcons(categoryId);
            renderIcons(iconsByCategory);
            
            // 更新搜索处理函数
            searchInput.oninput = () => handleSearch(iconsByCategory);
            searchButton.onclick = () => handleSearch(iconsByCategory);
        });
    });

    // 初始化显示
    loadIcons().then(iconsByCategory => {
        renderIcons(iconsByCategory);
        // 设置初始搜索处理函数
        searchInput.oninput = () => handleSearch(iconsByCategory);
        searchButton.onclick = () => handleSearch(iconsByCategory);
    });
}); 