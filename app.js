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
            <ul class="update-list">
                <li class="tag tag-update">UPDATE</li>
                <li>优化搜索框和分类选择按钮的交互体验</li>
                <li>改进 hover 和 focus 状态的视觉效果</li>
                <li>统一控件高度，提升界面一致性</li>
            </ul>
            <ul class="add-list">
                <li class="tag tag-add">ADD</li>
                <li>新增收藏操作的 Toast 提示</li>
                <li>优化图标收藏状态的显示效果</li>
            </ul>
            <ul class="fix-list">
                <li class="tag tag-fix">FIX</li>
                <li>修复分类选择按钮的箭头图标显示问题</li>
                <li>修复部分图标描边样式不一致的问题</li>
            </ul>
        </div>
        <div class="version-item">
            <h3>v2.5.0 (2024-01-02)</h3>
            <ul class="add-list">
                <li class="tag tag-add">ADD</li>
                <li>新增 122 个图标：copyleft、reply-all、collage、ink-bottle、dashboard-2、dashboard-3、usb、draft、delete-column、delete-row、flow-chart、h-1 到 h-6、insert-column-left、insert-column-right、insert-row-bottom、insert-row-top、merge-cells-horizontal、merge-cells-vertical、mind-map、node-tree、organization-chart、question-mark</li>
            </ul>
            <ul class="update-list">
                <li class="tag tag-update">UPDATE</li>
                <li>根据最新的 logo 样式，重新设计了 discord 和 gitlab 图标</li>
            </ul>
            <ul class="fix-list">
                <li class="tag tag-fix">FIX</li>
                <li>修改了 iconfont 的基线，现在图标应该与文字垂直对齐</li>
            </ul>
        </div>
        <div class="version-item">
            <h3>v1.0.0 (2024-01-01)</h3>
            <ul class="add-list">
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
                    <span>收藏</span>
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
    categoryBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        categorySelect.classList.toggle('active');
        const dropdown = categorySelect.querySelector('.category-dropdown');
        
        if (categorySelect.classList.contains('active')) {
            const btnRect = categoryBtn.getBoundingClientRect();
            const containerRect = searchContainer.getBoundingClientRect();
            
            // 计算下拉框的位置
            dropdown.style.position = 'fixed';
            dropdown.style.top = `${btnRect.bottom + 4}px`;
            dropdown.style.left = `${btnRect.left}px`;
            dropdown.style.width = `${btnRect.width}px`;
            dropdown.style.zIndex = '1100';
            dropdown.classList.add('show');
            
            // 禁用背景滚动
            document.body.classList.add('dropdown-open');
            
            // 计算最大高度
            const windowHeight = window.innerHeight;
            const dropdownTop = btnRect.bottom + 4;
            const maxHeight = windowHeight - dropdownTop - 20; // 20px 作为底部边距
            dropdown.style.maxHeight = `${Math.min(300, maxHeight)}px`;
        } else {
            dropdown.classList.remove('show');
            // 恢复背景滚动
            document.body.classList.remove('dropdown-open');
        }
    });

    // 添加分类选择事件
    categoryOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const selectedId = option.dataset.id;
            const selectedName = option.textContent.trim();
            
            // 更新选中状态
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // 更新按钮文本
            categoryBtn.querySelector('span').textContent = selectedName;
            
            // 关闭下拉框
            categorySelect.classList.remove('active');
            categorySelect.querySelector('.category-dropdown').classList.remove('show');
            // 恢复背景滚动
            document.body.classList.remove('dropdown-open');
            
            // 触发搜索
            handleSearch();
        });
    });

    // 点击其他区域关闭下拉框
    document.addEventListener('click', (e) => {
        if (!categorySelect.contains(e.target)) {
            categorySelect.classList.remove('active');
            const dropdown = categorySelect.querySelector('.category-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
                // 恢复背景滚动
                document.body.classList.remove('dropdown-open');
            }
        }
    });

    // 阻止下拉框内的滚动传播到背景
    categorySelect.querySelector('.category-dropdown').addEventListener('wheel', (e) => {
        e.stopPropagation();
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
    versionModal.className = 'modal';
    versionModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>版本历史</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${versionHistory}
            </div>
        </div>
    `;
    document.body.appendChild(versionModal);

    // 版本号点击事件
    const versionBtn = navbar.querySelector('.version-btn');
    const versionModalClose = versionModal.querySelector('.modal-close');

    // 禁止背景滚动
    function disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    // 恢复背景滚动
    function enableScroll() {
        document.body.style.overflow = '';
    }

    versionBtn.addEventListener('click', () => {
        versionModal.classList.add('show');
        disableScroll();
    });

    versionModalClose.addEventListener('click', () => {
        versionModal.classList.remove('show');
        enableScroll();
    });

    versionModal.addEventListener('click', (e) => {
        if (e.target === versionModal) {
            versionModal.classList.remove('show');
            enableScroll();
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
                            <div class="category-select">
                                <button class="category-btn">
                                    <span>24px</span>
                                    ${arrowIcon}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="download-buttons">
                        <button class="modal-btn primary" data-action="svg">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                            </svg>
                            下载选中图标
                        </button>
                        <button class="modal-btn secondary" data-action="png">
                            <svg viewBox="0 0 24 24" width="16" height="16">
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

    // 初始化颜色选择器
    function initColorPicker(modalElement) {
        const colorPickerContainer = modalElement.querySelector('.control-item:first-child');
        // 移除旧的 input
        const oldInput = colorPickerContainer.querySelector('input[type="color"]');
        if (oldInput) {
            oldInput.remove();
        }
        
        // 创建新的颜色选择器容器
        const pickrEl = document.createElement('div');
        colorPickerContainer.appendChild(pickrEl);

        // 初始化 Pickr
        const pickr = Pickr.create({
            el: pickrEl,
            theme: 'classic',
            default: '#000000',
            swatches: [
                '#000000',
                '#1a73e8',
                '#4285f4',
                '#34a853',
                '#fbbc04',
                '#ea4335',
                '#5f6368',
            ],
            components: {
                preview: true,
                opacity: false,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    input: true,
                    save: true
                }
            }
        });

        // 颜色变化时更新预览
        pickr.on('change', (color) => {
            const previewSvg = modalElement.querySelector('.modal-preview svg');
            if (previewSvg) {
                previewSvg.querySelectorAll('path').forEach(path => {
                    path.setAttribute('stroke', color.toHEXA().toString());
                    path.setAttribute('fill', 'none');
                    path.style.stroke = color.toHEXA().toString();
                    path.style.fill = 'none';
                });
            }
        });

        return pickr;
    }

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
    const sizeSelects = document.querySelectorAll('.control-item .category-select');
    sizeSelects.forEach(sizeSelect => {
        const sizeBtn = sizeSelect.querySelector('.category-btn');
        const sizeDropdown = sizeSelect.querySelector('.category-dropdown');
        const sizeOptions = sizeSelect.querySelectorAll('.category-option');

        // 点击按钮显示/隐藏下拉框
        sizeBtn.addEventListener('click', () => {
            sizeSelect.classList.toggle('active');
            if (sizeSelect.classList.contains('active')) {
                const btnRect = sizeBtn.getBoundingClientRect();
                const dropdown = sizeSelect.querySelector('.category-dropdown');
                const modalRect = previewModal.querySelector('.modal-content').getBoundingClientRect();
                
                // 计算相对于模态框的位置
                const top = btnRect.bottom - modalRect.top;
                const left = btnRect.left - modalRect.left;
                
                dropdown.style.position = 'fixed';
                dropdown.style.top = `${btnRect.bottom + 4}px`;
                dropdown.style.left = `${btnRect.left}px`;
                dropdown.style.width = `${btnRect.width}px`;
                dropdown.style.zIndex = '1100';
            }
        });

        // 选择尺寸
        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const size = option.dataset.size;
                
                // 更新选中状态
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // 更新按钮文本
                sizeBtn.querySelector('span').textContent = `${size}px`;
                
                // 关闭下拉框
                sizeSelect.classList.remove('active');
                
                // 更新预览尺寸
                updatePreviewSize(size);
            });
        });

        // 点击外部关闭下拉框
        document.addEventListener('click', (e) => {
            if (!sizeSelect.contains(e.target)) {
                sizeSelect.classList.remove('active');
            }
        });
    });

    // 更新预览尺寸函数
    const updatePreviewSize = (size) => {
        const previewSvg = document.querySelector('.modal-preview svg');
        if (previewSvg) {
            previewSvg.style.width = `${size}px`;
            previewSvg.style.height = `${size}px`;
        }
    };

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
                            <button class="favorite-btn" title="${favorites.includes(icon.name) ? '已收藏' : '加入收藏'}">
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
                                path.setAttribute('stroke', favorites.includes(icon.name) ? '#1a73e8' : 'currentColor');
                                path.setAttribute('fill', 'none');
                                path.style.stroke = favorites.includes(icon.name) ? '#1a73e8' : 'currentColor';
                                path.style.fill = 'none';
                            });
                        }

                        // 收藏按钮点击事件
                        const favoriteBtn = iconItem.querySelector('.favorite-btn');
                        favoriteBtn.addEventListener('click', (e) => {
                            e.stopPropagation(); // 阻止事件冒泡到图标项
                            const index = favorites.indexOf(icon.name);
                            if (index === -1) {
                                favorites.push(icon.name);
                                favoriteBtn.classList.add('active');
                                iconItem.classList.add('favorited');
                                favoriteBtn.title = '已收藏';
                                favoriteBtn.innerHTML = starIcon;
                                // 更新图标颜色为蓝色
                                iconSvg.querySelectorAll('path').forEach(path => {
                                    path.setAttribute('stroke', '#1a73e8');
                                    path.style.stroke = '#1a73e8';
                                });
                                showToast('已添加到收藏夹');
                            } else {
                                favorites.splice(index, 1);
                                favoriteBtn.classList.remove('active');
                                iconItem.classList.remove('favorited');
                                favoriteBtn.title = '加入收藏';
                                favoriteBtn.innerHTML = plusIcon;
                                // 更新图标颜色为默认色
                                iconSvg.querySelectorAll('path').forEach(path => {
                                    path.setAttribute('stroke', 'currentColor');
                                    path.style.stroke = 'currentColor';
                                });
                                showToast('已从收藏夹移除');
                            }
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                            favoritesCount.textContent = favorites.length;
                        });

                        // 图标点击事件 - 打开预览模态框
                        iconItem.addEventListener('click', () => {
                            const previewModal = document.createElement('div');
                            previewModal.className = 'preview-modal';
                            previewModal.innerHTML = `
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h2 class="modal-title">图标预览</h2>
                                        <button class="modal-close">&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="preview-section">
                                            <div class="modal-preview">
                                                ${svgContent}
                                            </div>
                                            <div class="preview-name">${icon.name}</div>
                                        </div>
                                        <div class="modal-actions">
                                            <div class="control-group">
                                                <div class="control-item">
                                                    <input type="color" id="iconColor" value="#000000" class="color-picker" />
                                                </div>
                                                <div class="control-item">
                                                    <div class="category-select">
                                                        <button class="category-btn">
                                                            <span>24px</span>
                                                            ${arrowIcon}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="download-buttons">
                                                <button class="modal-btn primary" data-action="svg">
                                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                                                    </svg>
                                                    下载选中图标
                                                </button>
                                                <button class="modal-btn secondary" data-action="png">
                                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                                                    </svg>
                                                    PNG
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            document.body.appendChild(previewModal);

                            // 创建尺寸下拉框
                            const sizeDropdown = document.createElement('div');
                            sizeDropdown.className = 'category-dropdown size-dropdown';
                            sizeDropdown.innerHTML = `
                                <div class="category-option" data-size="16">16px</div>
                                <div class="category-option" data-size="20">20px</div>
                                <div class="category-option selected" data-size="24">24px</div>
                                <div class="category-option" data-size="32">32px</div>
                                <div class="category-option" data-size="48">48px</div>
                                <div class="category-option" data-size="64">64px</div>
                            `;
                            document.body.appendChild(sizeDropdown);

                            // 初始化颜色选择器
                            const pickr = initColorPicker(previewModal);
                            
                            // 显示模态框
                            setTimeout(() => {
                                previewModal.classList.add('show');
                                disableScroll();
                            }, 0);

                            // 关闭模态框时销毁颜色选择器和下拉框
                            const closeModal = () => {
                                pickr.destroyAndRemove();
                                previewModal.classList.remove('show');
                                enableScroll();
                                if (sizeDropdown && document.body.contains(sizeDropdown)) {
                                    document.body.removeChild(sizeDropdown);
                                }
                                setTimeout(() => {
                                    document.body.removeChild(previewModal);
                                }, 300);
                            };

                            // 关闭按钮事件
                            const closeButton = previewModal.querySelector('.modal-close');
                            closeButton.addEventListener('click', closeModal);

                            // 点击模态框外部关闭
                            previewModal.addEventListener('click', (e) => {
                                if (e.target === previewModal) {
                                    closeModal();
                                }
                            });

                            // 设置预览图标的尺寸和颜色
                            const modalPreview = previewModal.querySelector('.modal-preview svg');
                            
                            // 尺寸选择功能
                            const sizeSelect = previewModal.querySelector('.category-select');
                            const sizeBtn = sizeSelect.querySelector('.category-btn');
                            const sizeOptions = sizeDropdown.querySelectorAll('.category-option');
                            
                            // 点击按钮显示/隐藏下拉框
                            sizeBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                const isActive = sizeSelect.classList.contains('active');
                                sizeSelect.classList.toggle('active');
                                
                                if (!isActive) {
                                    const btnRect = sizeBtn.getBoundingClientRect();
                                    sizeDropdown.style.position = 'fixed';
                                    sizeDropdown.style.top = `${btnRect.bottom + 4}px`;
                                    sizeDropdown.style.left = `${btnRect.left}px`;
                                    sizeDropdown.style.width = `${btnRect.width}px`;
                                    sizeDropdown.style.zIndex = '1100';
                                    sizeDropdown.style.opacity = '1';
                                    sizeDropdown.style.visibility = 'visible';
                                } else {
                                    sizeDropdown.style.opacity = '0';
                                    sizeDropdown.style.visibility = 'hidden';
                                }
                            });
                            
                            // 选择尺寸
                            sizeOptions.forEach(option => {
                                option.addEventListener('click', () => {
                                    const size = option.dataset.size;
                                    
                                    // 更新选中状态
                                    sizeOptions.forEach(opt => opt.classList.remove('selected'));
                                    option.classList.add('selected');
                                    
                                    // 更新按钮文本
                                    sizeBtn.querySelector('span').textContent = `${size}px`;
                                    
                                    // 关闭下拉框
                                    sizeSelect.classList.remove('active');
                                    sizeDropdown.style.opacity = '0';
                                    sizeDropdown.style.visibility = 'hidden';
                                    
                                    // 更新预览尺寸
                                    updatePreviewSize(size);
                                });
                            });
                            
                            // 点击外部关闭下拉框
                            document.addEventListener('click', (e) => {
                                if (!sizeSelect.contains(e.target) && !sizeDropdown.contains(e.target)) {
                                    sizeSelect.classList.remove('active');
                                    sizeDropdown.style.opacity = '0';
                                    sizeDropdown.style.visibility = 'hidden';
                                }
                            });

                            // 设置初始值
                            updatePreviewSize(24);

                            // 下载按钮事件
                            previewModal.querySelectorAll('.modal-btn').forEach(btn => {
                                btn.addEventListener('click', () => {
                                    const action = btn.dataset.action;
                                    const size = sizeBtn.querySelector('span').textContent.replace('px', '');
                                    const color = pickr.getColor().toHEXA().toString();
                                    if (action === 'svg') {
                                        downloadSVG(svgContent, icon.name, size, color);
                                    } else if (action === 'png') {
                                        downloadPNG(svgContent, icon.name, size, color);
                                    }
                                });
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

    // 添加下载所有图标的函数
    async function downloadAllIcons() {
        console.log('Starting download process...');
        
        // 创建一个 JSZip 实例
        const zip = new JSZip();
        
        // 创建根目录 PixIcons
        const rootFolder = zip.folder("PixIcons");
        
        // 遍历所有分类
        for (const category of categories) {
            console.log(`Processing category: ${category.name}`);
            
            try {
                // 获取该分类下的所有图标
                const icons = await loadIconsForCategory(category);
                if (!icons || icons.length === 0) {
                    console.error(`No icons found for ${category.name}`);
                    continue;
                }
                
                console.log(`Found ${icons.length} icons in ${category.name}`);
                
                // 为每个分类创建文件夹
                const categoryFolder = rootFolder.folder(category.name);
                
                // 遍历分类下的所有图标
                for (const icon of icons) {
                    try {
                        // 直接从 icons 目录获取 SVG 文件
                        const svgUrl = `icons/${category.path}/${icon.name}.svg`;
                        console.log(`Fetching SVG from: ${svgUrl}`);
                        
                        const svgResponse = await fetch(svgUrl);
                        if (!svgResponse.ok) {
                            console.error(`Failed to fetch SVG for ${icon.name}:`, svgResponse.statusText);
                            continue;
                        }
                        
                        const svgContent = await svgResponse.text();
                        console.log(`SVG content length for ${icon.name}: ${svgContent.length}`);
                        
                        if (!svgContent || svgContent.length === 0) {
                            console.error(`Empty SVG content for ${icon.name}`);
                            continue;
                        }
                        
                        // 保持原始 SVG 内容不变，直接添加到对应分类文件夹中
                        categoryFolder.file(`${icon.name}.svg`, svgContent);
                        console.log(`Added ${icon.name}.svg to ${category.name} folder`);
                        
                    } catch (error) {
                        console.error(`Error processing icon ${icon.name}:`, error);
                    }
                }
            } catch (error) {
                console.error(`Error processing category ${category.name}:`, error);
            }
        }
        
        try {
            showToast("Packaging icons...");
            console.log('Generating ZIP file...');
            
            // 生成 zip 文件，保持文件结构
            const content = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            });
            
            console.log('ZIP file generated, size:', content.size);
            
            // 创建下载链接并触发下载
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "PixIcons.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
            showToast("Download completed");
            console.log('Download process completed');
            
        } catch (error) {
            console.error("Error generating zip:", error);
            showToast("Download failed, please try again");
        }
    }

    // 更新导航栏下载按钮的点击事件
    const navDownloadBtn = document.querySelector('.nav-btn.download');
    const downloadButton = document.getElementById('downloadButton');
    const downloadModal = document.getElementById('downloadModal');
    const closeBtn = document.querySelector('.modal-close');
    const selectAllCheckbox = document.getElementById('selectAll');
    const categoryTree = document.getElementById('categoryTree');
    const confirmDownloadBtn = document.getElementById('confirmDownload');

    // 显示模态框函数
    function showDownloadModal() {
        if (!downloadModal) {
            console.error('Download modal not found');
            return;
        }
        downloadModal.style.display = 'flex';
        // 触发重排以启动动画
        downloadModal.offsetHeight;
        downloadModal.classList.add('show');
        renderCategoryTree();
    }

    // 关闭模态框函数
    function hideDownloadModal() {
        if (!downloadModal) return;
        downloadModal.classList.remove('show');
        // 等待动画完成后隐藏模态框
        setTimeout(() => {
            downloadModal.style.display = 'none';
        }, 300);
    }

    // 导航栏下载按钮点击事件
    if (navDownloadBtn) {
        navDownloadBtn.addEventListener('click', showDownloadModal);
    }

    // 工具栏下载按钮点击事件
    if (downloadButton) {
        downloadButton.addEventListener('click', showDownloadModal);
    }

    // 关闭模态框
    if (closeBtn) {
        closeBtn.addEventListener('click', hideDownloadModal);
    }

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === downloadModal) {
            hideDownloadModal();
        }
    });

    // 渲染分类树
    function renderCategoryTree() {
        if (!categoryTree) {
            console.error('Category tree element not found');
            return;
        }

        categoryTree.innerHTML = '';
        categories
            .filter(category => category.id !== 'all')
            .forEach(category => {
                const div = document.createElement('div');
                div.className = 'tree-item';
                div.innerHTML = `
                    <label>
                        <input type="checkbox" name="category" value="${category.id}">
                        <span>${category.name}</span>
                    </label>
                `;
                categoryTree.appendChild(div);
            });

        // 添加复选框事件监听
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectAllState);
        });
    }

    // 全选/取消全选
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }

    // 更新全选状态
    function updateSelectAllState() {
        if (!selectAllCheckbox) return;
        
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        const checkedCount = Array.from(categoryCheckboxes).filter(cb => cb.checked).length;
        selectAllCheckbox.checked = checkedCount === categoryCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < categoryCheckboxes.length;
    }

    // 下载选中的图标
    if (confirmDownloadBtn) {
        confirmDownloadBtn.addEventListener('click', async () => {
            const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                .map(cb => cb.value);
            
            if (selectedCategories.length === 0) {
                showToast('请至少选择一个分类');
                return;
            }

            showToast('正在打包图标...');
            const zip = new JSZip();
            const rootFolder = zip.folder("PixIcons");
            
            try {
                // 添加选中分类的图标到 zip
                for (const categoryId of selectedCategories) {
                    const category = categories.find(c => c.id === categoryId);
                    if (!category || !category.path) continue;

                    const categoryFolder = rootFolder.folder(category.name);
                    
                    try {
                        const response = await fetch(`${category.path}/icons.json`);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch icons.json for ${category.name}`);
                        }
                        const data = await response.json();
                        const icons = Array.isArray(data) ? data : (data.icons || []);
                        
                        for (const icon of icons) {
                            try {
                                const svgResponse = await fetch(icon.path);
                                if (!svgResponse.ok) {
                                    throw new Error(`Failed to fetch SVG for ${icon.name}`);
                                }
                                const svgContent = await svgResponse.text();
                                categoryFolder.file(`${icon.name}.svg`, svgContent);
                            } catch (error) {
                                console.error(`Error adding ${icon.name}: ${error}`);
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading icons for ${category.name}: ${error}`);
                        showToast(`加载 ${category.name} 分类失败`);
                    }
                }

                // 生成并下载 zip 文件
                const content = await zip.generateAsync({ 
                    type: 'blob',
                    compression: "DEFLATE",
                    compressionOptions: {
                        level: 9
                    }
                });
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'pixicons-icons.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
                
                downloadModal.style.display = 'none';
                showToast('下载完成');
            } catch (error) {
                console.error('Error generating zip:', error);
                showToast('下载失败，请重试');
            }
        });
    }

    // 创建收藏夹弹窗
    const favoritesModal = document.createElement('div');
    favoritesModal.className = 'favorites-modal';
    favoritesModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>收藏夹</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div id="favoritesGrid" class="favorites-grid"></div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn primary" id="downloadAllBtn">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                    </svg>
                    下载全部
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(favoritesModal);

    // 渲染收藏夹图标
    async function renderFavorites() {
        const favoritesGrid = favoritesModal.querySelector('#favoritesGrid');
        favoritesGrid.innerHTML = '';

        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '<div class="empty-favorites">暂无收藏图标</div>';
            return;
        }

        // 显示加载状态
        favoritesGrid.innerHTML = '<div class="loading-favorites">正在加载收藏图标...</div>';

        try {
            // 创建所有分类的加载 Promise
            const categoryPromises = categories
                .filter(category => category.path)
                .map(async category => {
                    try {
                        const response = await fetch(`${category.path}/icons.json`);
                        if (!response.ok) {
                            throw new Error(`Failed to load icons for ${category.name}`);
                        }

                        const data = await response.json();
                        const icons = Array.isArray(data) ? data : (data.icons || []);
                        return icons.filter(icon => favorites.includes(icon.name));
                    } catch (error) {
                        console.error(`Error loading icons for ${category.name}:`, error);
                        return [];
                    }
                });

            // 等待所有分类加载完成
            const allCategoryIcons = await Promise.all(categoryPromises);
            const favoriteIcons = allCategoryIcons.flat();

            // 如果没有找到任何收藏的图标
            if (favoriteIcons.length === 0) {
                favoritesGrid.innerHTML = '<div class="empty-favorites">无法加载收藏图标，请检查网络连接后重试</div>';
                return;
            }

            // 清空加载状态
            favoritesGrid.innerHTML = '';

            // 创建所有图标的加载 Promise
            const iconPromises = favoriteIcons.map(async icon => {
                try {
                    const response = await fetch(icon.path);
                    if (!response.ok) {
                        throw new Error(`Failed to load icon: ${icon.name}`);
                    }

                    const svgContent = await response.text();
                    const iconItem = document.createElement('div');
                    iconItem.className = 'favorite-item';
                    iconItem.innerHTML = `
                        <div class="icon-preview">
                            ${svgContent}
                        </div>
                        <div class="icon-name">${icon.name}</div>
                        <button class="remove-favorite" title="移除收藏">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 6l12 12m0-12L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    `;

                    // 设置图标为描边样式
                    const iconSvg = iconItem.querySelector('.icon-preview svg');
                    iconSvg.querySelectorAll('path').forEach(path => {
                        path.setAttribute('stroke', 'currentColor');
                        path.setAttribute('fill', 'none');
                        path.style.stroke = 'currentColor';
                        path.style.fill = 'none';
                    });

                    // 移除收藏按钮点击事件
                    const removeBtn = iconItem.querySelector('.remove-favorite');
                    removeBtn.addEventListener('click', () => {
                        const index = favorites.indexOf(icon.name);
                        if (index !== -1) {
                            favorites.splice(index, 1);
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                            favoritesCount.textContent = favorites.length;
                            renderFavorites();
                            showToast('已从收藏夹移除');
                        }
                    });

                    return iconItem;
                } catch (error) {
                    console.error(`Error loading icon ${icon.name}:`, error);
                    return null;
                }
            });

            // 等待所有图标加载完成
            const iconElements = await Promise.all(iconPromises);

            // 过滤掉加载失败的图标并添加到网格中
            iconElements
                .filter(element => element !== null)
                .forEach(element => favoritesGrid.appendChild(element));

            // 如果所有图标都加载失败
            if (favoritesGrid.children.length === 0) {
                favoritesGrid.innerHTML = '<div class="empty-favorites">加载收藏图标失败，请检查网络连接后重试</div>';
            }
        } catch (error) {
            console.error('Error rendering favorites:', error);
            favoritesGrid.innerHTML = '<div class="empty-favorites">加载收藏图标时发生错误，请稍后重试</div>';
        }
    }

    // 下载所有收藏图标
    async function downloadAllFavorites() {
        if (favorites.length === 0) {
            showToast('暂无收藏图标');
            return;
        }

        showToast('正在打包收藏图标...');
        const zip = new JSZip();
        const rootFolder = zip.folder("收藏图标");
        
        try {
            // 遍历所有分类查找收藏的图标
            for (const category of categories) {
                if (!category.path) continue;

                try {
                    const response = await fetch(`${category.path}/icons.json`);
                    if (!response.ok) continue;

                    const data = await response.json();
                    const icons = Array.isArray(data) ? data : (data.icons || []);
                    
                    for (const icon of icons) {
                        if (favorites.includes(icon.name)) {
                            const svgResponse = await fetch(icon.path);
                            if (!svgResponse.ok) continue;
                            
                            const svgContent = await svgResponse.text();
                            rootFolder.file(`${icon.name}.svg`, svgContent);
                        }
                    }
                } catch (error) {
                    console.error(`Error loading icons for ${category.name}:`, error);
                }
            }

            // 生成并下载 zip 文件
            const content = await zip.generateAsync({
                type: 'blob',
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'favorite-icons.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
            showToast('下载完成');
        } catch (error) {
            console.error('Error generating zip:', error);
            showToast('下载失败，请重试');
        }
    }

    // 收藏按钮点击事件
    const navFavoritesBtn = navbar.querySelector('.nav-btn.favorites');
    navFavoritesBtn.addEventListener('click', () => {
        renderFavorites();
        favoritesModal.classList.add('show');
        disableScroll();
    });

    // 关闭收藏夹弹窗
    const closeFavoritesModal = favoritesModal.querySelector('.modal-close');
    closeFavoritesModal.addEventListener('click', () => {
        favoritesModal.classList.remove('show');
        enableScroll();
    });

    // 点击弹窗外部关闭
    favoritesModal.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            favoritesModal.classList.remove('show');
            enableScroll();
        }
    });

    // 下载全部按钮点击事件
    const downloadAllBtn = favoritesModal.querySelector('#downloadAllBtn');
    downloadAllBtn.addEventListener('click', downloadAllFavorites);
}); 