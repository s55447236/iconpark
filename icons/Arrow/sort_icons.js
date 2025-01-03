/**
 * 版本历史：
 * 
 * v2.5.0 (2024-01-02)
 * [ADD]
 * - 新增 122 个图标：copyleft、reply-all、collage、ink-bottle、dashboard-2、
 *   dashboard-3、usb、draft、delete-column、delete-row、flow-chart、h-1 到 h-6、
 *   insert-column-left、insert-column-right、insert-row-bottom、insert-row-top、
 *   merge-cells-horizontal、merge-cells-vertical、mind-map、node-tree、
 *   organization-chart、question-mark
 * [UPDATE]
 * - 根据最新的 logo 样式，重新设计了 discord 和 gitlab 图标
 * [FIX]
 * - 修改了 iconfont 的基线，现在图标应该与文字垂直对齐
 * 
 * v1.0.0 (2024-01-01)
 * [ADD]
 * - 初始版本发布
 * - 支持箭头图标组
 * - 支持通用图标组
 * - 支持形状图标组
 * - 支持文件图标组
 * - 支持图标搜索功能
 * - 支持图标收藏功能
 * - 支持 SVG 和 PNG 格式下载
 * - 支持图标颜色和尺寸调整
 */

const fs = require('fs');
const path = require('path');

// 定义图标的精确显示顺序
const iconOrder = [
    // 第一列
    'arrow-curve-left-down',
    'arrow-curve-left-right',
    'arrow-curve-left-up',
    'arrow-down-left',
    'arrow-curve-up-left',
    'arrow-curve-right-up',
    'arrow-left-square-contained',
    'arrow-right-square-contained',
    'arrow-up-square-contained',
    'arrow-down-square-contained',
    'arrow-down-left-square-contained',
    'arrow-up-right-square-contained',
    'arrow-down-right-square-contained',
    'arrow-up-left-square-contained',

    // 第二列
    'arrow-left-contained-02',
    'arrow-up-left-contained',
    'arrow-down-left-contained',
    'arrow-down-right-contained',
    'arrow-up-right-contained',
    'arrow-right-contained-02',
    'arrow-up-contained-02',
    'arrow-down-contained-02',
    'arrow-left-contained-01',
    'arrow-up-contained-01',
    'arrow-right-contained-01',
    'arrow-down-contained-01',
    'arrow-expand-01',
    'arrow-expand-02',

    // 第三列
    'arrow-expand-03',
    'arrow-expand-04',
    'arrow-up',
    'down-arrow',
    'arrow-right',
    'arrow-left',
    'arrow-up-left',
    'arrow-down-right',
    'arrow-down-left',
    'arrow-up-right',
    'arrow-down-right',
    'arrow-curve-up-right',
    'arrow-switch-horizontal',
    'arrow-switch-vertical',

    // 第四列
    'arrow-refresh-01',
    'arrow-refresh-02',
    'arrow-refresh-03',
    'arrow-refresh-04',
    'arrow-refresh-05',
    'arrow-refresh-06',
    'arrow-rotate-left-01',
    'arrow-rotate-left-02',
    'arrow-rotate-right-01',
    'arrow-rotate-right-02',
    'chevron-double-down',
    'chevron-double-left',
    'chevron-double-right',
    'chevron-double-up',

    // 第五列
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'chevron-up',
    'flip-left',
    'flip-right',
    'arrow-up-sm',
    'down-arrow-sm',
    'arrow-right-sm',
    'arrow-left-sm',
    'arrow-up-left-sm',
    'arrow-down-right-sm',
    'arrow-down-left-sm',
    'arrow-up-right-sm'
];

try {
    // 读取 icons.json 文件
    const iconsJsonPath = path.join(__dirname, 'icons.json');
    const icons = JSON.parse(fs.readFileSync(iconsJsonPath, 'utf8'));

    // 创建一个映射来存储图标的顺序
    const orderMap = new Map(iconOrder.map((name, index) => [name, index]));

    // 按照指定顺序排序图标
    icons.sort((a, b) => {
        const orderA = orderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER;
        const orderB = orderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
    });

    // 检查是否所有图标都在排序列表中
    const iconNames = new Set(icons.map(icon => icon.name));
    const missingIcons = iconOrder.filter(name => !iconNames.has(name));
    if (missingIcons.length > 0) {
        console.log('警告：以下图标在 icons.json 中不存在：');
        missingIcons.forEach(name => console.log(`- ${name}`));
    }

    const extraIcons = icons.filter(icon => !orderMap.has(icon.name));
    if (extraIcons.length > 0) {
        console.log('\n以下图标不在排序列表中：');
        extraIcons.forEach(icon => console.log(`- ${icon.name}`));
    }

    // 将排序后的图标写回文件
    fs.writeFileSync(iconsJsonPath, JSON.stringify(icons, null, 2));
    console.log(`\n✓ 排序完成！共处理 ${icons.length} 个图标`);

} catch (error) {
    console.error('错误：', error);
} 