const fs = require('fs');
const path = require('path');

// 获取所有图标目录
const iconsDir = path.join(__dirname, 'icons');
const iconDirs = fs.readdirSync(iconsDir).filter(file => 
    fs.statSync(path.join(iconsDir, file)).isDirectory()
);

// 处理每个目录
iconDirs.forEach(dir => {
    const dirPath = path.join(iconsDir, dir);
    const jsonPath = path.join(dirPath, 'icons.json');
    
    // 获取目录中的所有SVG文件
    const svgFiles = fs.readdirSync(dirPath)
        .filter(file => file.toLowerCase().endsWith('.svg'));
    
    // 为每个SVG文件创建图标数据
    const icons = svgFiles.map(file => {
        const name = path.basename(file, '.svg');
        return {
            name: name,
            title: name.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            category: dir,
            fileName: file,
            path: `icons/${dir}/${file}`
        };
    });
    
    // 检查是否存在icons.json
    let existingIcons = [];
    if (fs.existsSync(jsonPath)) {
        try {
            const content = fs.readFileSync(jsonPath, 'utf8');
            const parsed = JSON.parse(content);
            existingIcons = Array.isArray(parsed) ? parsed : [];
            console.log(`✓ ${dir}: icons.json 已存在`);
        } catch (e) {
            console.log(`✗ ${dir}: icons.json 格式错误`);
            existingIcons = [];
        }
    } else {
        console.log(`! ${dir}: 创建新的 icons.json`);
    }
    
    // 合并现有数据和新数据，保留现有数据的path
    const mergedIcons = icons.map(icon => {
        const existing = existingIcons.find(e => e.fileName === icon.fileName);
        return {
            ...icon,
            path: existing?.path || icon.path
        };
    });
    
    // 写入新的icons.json
    fs.writeFileSync(
        jsonPath,
        JSON.stringify(mergedIcons, null, 2),
        'utf8'
    );
    
    console.log(`${dir}: 包含 ${svgFiles.length} 个SVG文件`);
}); 