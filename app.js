document.addEventListener('DOMContentLoaded', () => {
    const iconGrid = document.getElementById('iconGrid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // 分类数据
    const categories = [
        { id: 'all', name: 'All' },
        { id: 'arrow', name: 'Arrow', path: 'icons/Arrow' },
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
            <button class="modal-close">&times;</button>
            <div class="modal-preview"></div>
            <div class="modal-actions">
                <button class="modal-btn primary" data-action="svg">下载 SVG</button>
                <button class="modal-btn secondary" data-action="png">下载 PNG</button>
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

    // 下载SVG文件
    async function downloadSVG(svgContent, fileName) {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
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
    async function downloadPNG(svgContent, fileName) {
        const img = new Image();
        const svg = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svg);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            const ctx = canvas.getContext('2d');
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0);
            
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

    // 渲染图标
    function renderIcons(iconsByCategory) {
        iconGrid.innerHTML = '';
        
        // 遍历每个分类
        Object.entries(iconsByCategory).forEach(([categoryName, icons]) => {
            // 创建分类标题
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'category-title';
            categoryTitle.innerHTML = `
                ${categoryName}
                <span class="category-count">${icons.length}</span>
            `;
            categorySection.appendChild(categoryTitle);

            // 创建该分类的图标网格
            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'icon-grid';

            // 渲染该分类的所有图标
            icons.forEach(icon => {
                const iconItem = document.createElement('div');
                iconItem.className = 'icon-item';
                
                fetch(icon.path)
                    .then(response => response.text())
                    .then(svgContent => {
                        iconItem.innerHTML = `
                            <div class="icon-preview">
                                ${svgContent}
                            </div>
                            <div class="icon-name">${icon.name}</div>
                            <div class="download-btn">下载</div>
                        `;

                        iconItem.querySelector('.download-btn').addEventListener('click', (e) => {
                            e.stopPropagation();
                            modalOverlay.classList.add('active');
                            const modalPreview = modalOverlay.querySelector('.modal-preview');
                            modalPreview.innerHTML = svgContent;

                            const modalActions = modalOverlay.querySelector('.modal-actions');
                            modalActions.querySelectorAll('.modal-btn').forEach(btn => {
                                btn.onclick = () => {
                                    const action = btn.dataset.action;
                                    if (action === 'svg') {
                                        downloadSVG(svgContent, icon.name);
                                    } else if (action === 'png') {
                                        downloadPNG(svgContent, icon.name);
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

    // 搜索功能
    function handleSearch(iconsByCategory) {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredIconsByCategory = {};
        
        Object.entries(iconsByCategory).forEach(([categoryName, icons]) => {
            const filteredIcons = icons.filter(icon => 
                icon.name.toLowerCase().includes(searchTerm)
            );
            if (filteredIcons.length > 0) {
                filteredIconsByCategory[categoryName] = filteredIcons;
            }
        });
        
        renderIcons(filteredIconsByCategory);
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