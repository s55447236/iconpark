document.addEventListener('DOMContentLoaded', async () => {
    // 获取DOM元素
    const iconGrid = document.getElementById('iconGrid');
    const searchContainer = document.querySelector('.search-container');
    
    // 分类数据
    const categories = [
        { id: 'all', name: 'All' },
        { id: 'arrow', name: 'Arrow', path: 'icons/Arrow' },
        { id: 'charts', name: 'Charts', path: 'icons/Charts' },
        { id: 'communication', name: 'Communication', path: 'icons/Communication' },
        { id: 'cursor', name: 'Cursor', path: 'icons/Cursor' },
        { id: 'development', name: 'Development', path: 'icons/Development' },
        { id: 'editor', name: 'Editor', path: 'icons/Editor' },
        { id: 'files', name: 'Files', path: 'icons/Files' },
        { id: 'finance', name: 'Finance', path: 'icons/Finance' },
        { id: 'general', name: 'General', path: 'icons/General' },
        { id: 'media', name: 'Media', path: 'icons/Media' },
        { id: 'messages', name: 'Messages', path: 'icons/Messages' },
        { id: 'profiles', name: 'Profiles & Users', path: 'icons/Profiles & Users' },
        { id: 'security', name: 'Security', path: 'icons/Security' },
        { id: 'shapes', name: 'Shapes', path: 'icons/Shapes' },
        { id: 'time', name: 'Time', path: 'icons/Time', hasUpdate: true },
        { id: 'travel', name: 'Travel & Location', path: 'icons/Travel & Location', hasUpdate: true },
        { id: 'weather', name: 'Weather', path: 'icons/Weather', hasUpdate: true }
    ];

    // 获取版本号
    let version = 'v1.0.0';
    try {
        const response = await fetch('package.json');
        const packageData = await response.json();
        version = `v${packageData.version}`;
    } catch (error) {
        console.error('Error loading version:', error);
    }

    // 版本更新记录
    const versionHistory = `
        <div class="version-item">
            <h3>v2.5.1 (2024-01-03)</h3>
            <ul>
                <li class="tag tag-update">UPDATE</li>
                <li>优化搜索框和分类选择按钮的交互体验</li>
                <li>改进 hover 和 focus 状态的视觉效果</li>
                <li>统一控件高度，提升界面一致性</li>
                <li class="tag tag-add">ADD</li>
                <li>新增收藏操作的 Toast 提示</li>
                <li>优化图标收藏状态的显示效果</li>
                <li class="tag tag-fix">FIX</li>
                <li>修复分类选择按钮的箭头图标显示问题</li>
                <li>修复部分图标描边样式不一致的问题</li>
            </ul>
        </div>
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
    `;

    // 导航栏收藏按钮图标
    const navStarIcon = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.4951 2.71381C11.7017 2.29527 12.2985 2.29527 12.5051 2.71381L15.1791 8.13194C15.2611 8.29814 15.4196 8.41334 15.6031 8.43999L21.5823 9.30883C22.0442 9.37595 22.2286 9.94357 21.8944 10.2694L17.5678 14.4868C17.4351 14.6162 17.3745 14.8026 17.4058 14.9852L18.4272 20.9403C18.5061 21.4004 18.0233 21.7512 17.6101 21.534L12.2621 18.7224C12.0981 18.6361 11.9021 18.6361 11.738 18.7224L6.39002 21.534C5.97689 21.7512 5.49404 21.4004 5.57294 20.9403L6.59432 14.9852C6.62565 14.8026 6.56509 14.6162 6.43236 14.4868L2.10573 10.2694C1.7715 9.94357 1.95594 9.37595 2.41783 9.30883L8.39708 8.43999C8.5805 8.41334 8.73906 8.29814 8.82109 8.13194L11.4951 2.71381Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
    `;

    // 创建导航栏
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <div class="nav-content">
            <div class="nav-left">
                <div class="brand">
                    <img src="assets/logo.png" alt="IconPark" class="logo" />
                    <button class="version-btn">${version}</button>
                </div>
            </div>
            <div class="nav-right">
                <button class="nav-btn favorites">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="favorites-count">0</span>
                </button>
                <button class="nav-btn download">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    下载
                </button>
                <button class="nav-btn donate">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    打赏
                </button>
            </div>
        </div>
    `;
    document.body.insertBefore(navbar, document.body.firstChild);

    // 收藏图标
    const starIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    // 加号图标
    const plusIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    // 搜索图标
    const searchIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.927 17.0401L20.4001 20.4001M19.2801 11.4401C19.2801 15.77 15.77 19.2801 11.4401 19.2801C7.11019 19.2801 3.6001 15.77 3.6001 11.4401C3.6001 7.11019 7.11019 3.6001 11.4401 3.6001C15.77 3.6001 19.2801 7.11019 19.2801 11.4401Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

    // 分类选择按钮的 SVG 图标
    const arrowIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 10L12.0008 14.58L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    // 渲染分类选择按钮
    searchContainer.innerHTML = `
        <div class="category-select">
            <button class="category-btn">
                <span>All</span>
                ${arrowIcon}
            </button>
            <div class="category-dropdown">
                ${categories.map(category => `
                    <div class="category-option ${category.id === 'all' ? 'selected' : ''}" data-id="${category.id}">
                        ${category.name}
                        ${category.hasUpdate ? '<span class="update-indicator"></span>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="搜索图标..." />
            <button id="searchButton">
                ${searchIcon}
            </button>
        </div>
    `;

    // 获取搜索相关元素
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categorySelect = searchContainer.querySelector('.category-select');
    const categoryBtn = categorySelect.querySelector('.category-btn');
    const categoryDropdown = categorySelect.querySelector('.category-dropdown');
    const categoryOptions = categorySelect.querySelectorAll('.category-option');

    // 添加下拉框交互
    categoryBtn.addEventListener('click', () => {
        categorySelect.classList.toggle('active');
    });

    // 添加分类选择事件
    categoryOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedId = option.dataset.id;
            const selectedName = option.textContent.trim();
            
            // 更新选中状态
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // 更新按钮文本
            categoryBtn.textContent = selectedName;
            
            // 关闭下拉框
            categorySelect.classList.remove('active');
            
            // 触发搜索
            handleSearch();
        });
    });

    document.addEventListener('click', (e) => {
        if (!categorySelect.contains(e.target)) {
            categorySelect.classList.remove('active');
        }
    });

    // 优化搜索功能
    async function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const currentCategory = document.querySelector('.category-option.selected').dataset.id;
        
        // 如果没有搜索词，直接显示当前分类的所有图标
        if (!searchTerm) {
            const iconsByCategory = await loadIcons(currentCategory);
            renderIcons(iconsByCategory);
            return;
        }

        // 加载图标并搜索
        const iconsByCategory = await loadIcons(currentCategory);
        const results = {};
        
        Object.entries(iconsByCategory).forEach(([category, icons]) => {
            const filteredIcons = icons.filter(icon => {
                const name = icon.name.toLowerCase();
                // 模糊搜索：检查搜索词的每个部分是否都包含在图标名称中
                const searchTerms = searchTerm.split(/\s+/);
                return searchTerms.every(term => 
                    name.includes(term) || 
                    // 支持连字符和下划线的模糊匹配
                    name.replace(/-/g, '').includes(term) ||
                    name.replace(/_/g, '').includes(term) ||
                    // 支持首字母匹配
                    term.split('').every(char => name.includes(char))
                );
            });
            
            if (filteredIcons.length > 0) {
                results[category] = filteredIcons;
            }
        });
        
        renderIcons(results);
    }

    // 添加搜索事件监听
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchButton.addEventListener('click', handleSearch);

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

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
                ${versionHistory}
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
        
        const loadCategoryIcons = async (cat) => {
            if (!cat.path) return null;
            
            try {
                console.log(`Loading icons for category: ${cat.name} from ${cat.path}/icons.json`);
                const response = await fetch(`${cat.path}/icons.json`);
                
                if (!response.ok) {
                    console.error(`Failed to load icons for ${cat.name}: ${response.statusText} (${response.status})`);
                    return null;
                }
                
                const data = await response.json();
                // 处理两种可能的数据格式
                const icons = Array.isArray(data) ? data : (data.icons || []);
                
                if (icons.length > 0) {
                    console.log(`Successfully loaded ${icons.length} icons for ${cat.name}`);
                    return { [cat.name]: icons };
                } else {
                    console.warn(`No icons found for category ${cat.name}`);
                    return null;
                }
            } catch (error) {
                console.error(`Error loading icons for ${cat.name}:`, error);
                return null;
            }
        };

        if (category === 'all') {
            // 加载所有分类的图标
            const loadPromises = categories
                .filter(cat => cat.id !== 'all' && cat.path)
                .map(loadCategoryIcons);
            
            const results = await Promise.all(loadPromises);
            
            // 合并所有有效的结果
            results.forEach(result => {
                if (result) {
                    iconsByCategory = { ...iconsByCategory, ...result };
                }
            });
        } else {
            // 加载特定分类的图标
            const selectedCategory = categories.find(c => c.id === category);
            if (selectedCategory) {
                const result = await loadCategoryIcons(selectedCategory);
                if (result) {
                    iconsByCategory = result;
                }
            }
        }

        return iconsByCategory;
    }

    // 渲染图标
    function renderIcons(iconsByCategory) {
        iconGrid.innerHTML = '';
        
        if (Object.keys(iconsByCategory).length === 0) {
            iconGrid.innerHTML = `
                <div class="no-icons-message">
                    <p>暂无图标</p>
                </div>
            `;
            return;
        }
        
        Object.entries(iconsByCategory).forEach(([categoryName, icons]) => {
            if (!icons || icons.length === 0) return;
            
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
                if (!icon || !icon.path) {
                    console.warn('Invalid icon data:', icon);
                    return;
                }

                const iconItem = document.createElement('div');
                iconItem.className = 'icon-item';
                
                fetch(icon.path)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load SVG: ${response.statusText}`);
                        }
                        return response.text();
                    })
                    .then(svgContent => {
                        if (!svgContent.trim().startsWith('<svg')) {
                            throw new Error('Invalid SVG content');
                        }

                        iconItem.innerHTML = `
                            <div class="icon-preview">
                                ${svgContent}
                            </div>
                            <div class="icon-name">${icon.name}</div>
                            <button class="favorite-btn ${favorites.includes(icon.name) ? 'active' : ''}" 
                                    title="${favorites.includes(icon.name) ? '已收藏' : '加入收藏'}">
                                ${favorites.includes(icon.name) ? starIcon : plusIcon}
                            </button>
                        `;

                        // 如果已收藏，添加收藏状态类名
                        if (favorites.includes(icon.name)) {
                            iconItem.classList.add('favorited');
                        }

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
                                iconItem.classList.add('favorited');
                                favoriteBtn.title = '已收藏';
                                favoriteBtn.innerHTML = starIcon;
                                showToast('已添加到收藏夹');
                            } else {
                                favorites.splice(index, 1);
                                favoriteBtn.classList.remove('active');
                                iconItem.classList.remove('favorited');
                                favoriteBtn.title = '加入收藏';
                                favoriteBtn.innerHTML = plusIcon;
                                showToast('已从收藏夹移除');
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
                    })
                    .catch(error => {
                        console.error(`Error loading icon ${icon.name}:`, error);
                        iconItem.innerHTML = `
                            <div class="icon-preview error">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M12 4v12m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
                                </svg>
                            </div>
                            <div class="icon-name">${icon.name}</div>
                        `;
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

    // 创建 Toast 组件
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    // 显示 Toast 提示
    function showToast(message, duration = 2000) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // 初始化显示
    loadIcons().then(iconsByCategory => {
        renderIcons(iconsByCategory);
    });
}); 