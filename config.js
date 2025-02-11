const bookmarkConfig = {
  categories: [
    {
      id: 'quick',
      name: '快速访问',
      links: [
        { id: 'quick_1', url: "https://linux.do", name: "LinuxDo", icon: "🐧" },
        { id: 'quick_2', url: "https://www.github.com", name: "GitHub", icon: "📦" },
        { id: 'quick_3', url: "https://mail.qq.com", name: "QQ 邮箱", icon: "📧" },
      ]
    },
    {
      id: 'forum',
      name: '论坛',
      links: [
        { id: 'forum_1', url: "https://www.v2ex.com", name: "V2EX", icon: "💬" },
        { id: 'forum_2', url: "https://www.ruanyifeng.com/blog/", name: "阮一峰", icon: "💬" },
        { id: 'forum_3', url: "https://hellogithub.com/", name: "HelloGitHub", icon: "💬" },
        { id: 'forum_4', url: "https://learnku.com/", name: "LearnKu", icon: "💬" },
      ]
    },
    {
      id: 'tools',
      name: '工具',
      links: [
        { id: 'tools_1', url: "https://translate.google.com", name: "Google 翻译", icon: "🌐" },
        { id: 'tools_2', url: "https://22.do/zh", name: "22.do 一次性邮箱", icon: "📧" },
        { id: 'tools_3', url: "https://pmail.plus/zh/#!", name: "pmail.plus 一次性邮箱", icon: "📧" },
        { id: 'tools_4', url: "https://ping.pe/", name: "IP 查询", icon: "🌐" },
      ]
    },
    {
      id: 'entertainment',
      name: '娱乐',
      links: [
        { id: 'entertainment_1', url: "https://www.youtube.com", name: "YouTube", icon: "📺" },
        { id: 'entertainment_2', url: "https://www.netflix.com", name: "Netflix", icon: "🎬" },
        { id: 'entertainment_3', url: "https://www.bilibili.com", name: "Bilibili", icon: "📺" },
        { id: 'entertainment_4', url: "https://movie.douban.com/", name: "豆瓣电影", icon: "🎬" },
      ]
    }
  ]
};

// 修改搜索引擎配置，使用数组存储
const defaultSearchEngines = [
  {
    id: 'google',
    name: "Google",
    url: "https://www.google.com/search?q={q}",
    isDefault: true
  },
  {
    id: 'bing',
    name: "Bing",
    url: "https://www.bing.com/search?q={q}"
  },
  {
    id: 'baidu',
    name: "百度",
    url: "https://www.baidu.com/s?wd={q}"
  },
  {
    id: 'DockerHub',
    name: "DockerHub",
    url: "https://hub.docker.com/search?q={q}"
  },
  {
    id: 'GitHub',
    name: "GitHub",
    url: "https://github.com/search?q={q}&type=repositories"
  },
  {
    id: 'npm',
    name: "npm",
    url: "https://www.npmjs.com/search?q={q}"
  }
];

// 获取搜索引擎列表
function getSearchEngines() {
  const stored = localStorage.getItem('searchEngines');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('解析存储的搜索引擎配置失败:', e);
    }
  }
  return defaultSearchEngines;
}

// 获取当前选中的搜索引擎
function getStoredSearchEngine() {
  const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_ENGINE);
  const engines = getSearchEngines();
  if (stored) {
    const engine = engines.find(e => e.id === stored);
    if (engine) return stored;
  }
  // 如果没有存储或存储的引擎不存在，返回默认引擎
  const defaultEngine = engines.find(e => e.isDefault) || engines[0];
  return defaultEngine.id;
}

// 保存搜索引擎设置
function saveSearchEngineSelection(engineId) {
  const engines = getSearchEngines();
  const engine = engines.find(e => e.id === engineId);
  if (engine) {
    localStorage.setItem(STORAGE_KEYS.SEARCH_ENGINE, engineId);
    return true;
  }
  return false;
}

// 生成唯一ID
function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

// 获取快速访问链接
function getQuickAccessLinks() {
  const links = localStorage.getItem(STORAGE_KEYS.QUICK_ACCESS);
  let parsedLinks = [];
  
  try {
    parsedLinks = JSON.parse(links) || [];
    
    // 为旧数据添加ID
    parsedLinks = parsedLinks.map(link => {
      if (!link.id) {
        link.id = generateId();
      }
      return link;
    });
    
    // 保存更新后的数据
    localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS, JSON.stringify(parsedLinks));
  } catch (e) {
    console.error('解析快速访问数据失败:', e);
    parsedLinks = [];
  }
  
  return parsedLinks;
}

// 修改保存快速访问链接函数
function saveQuickAccessLink(link) {
  const links = getQuickAccessLinks();
  // 添加唯一ID
  link.id = generateId();
  links.push(link);
  localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS, JSON.stringify(links));
  return true;
}

// 修改删除快速访问链接函数
function deleteQuickAccessLink(id) {
  const links = getQuickAccessLinks();
  const index = links.findIndex(link => link.id === id);
  if (index !== -1) {
    links.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS, JSON.stringify(links));
    return true;
  }
  return false;
}

// 修改更新快速访问链接函数
function updateQuickAccessLink(id, newData) {
  const links = getQuickAccessLinks();
  const index = links.findIndex(link => link.id === id);
  if (index !== -1) {
    // 保持原有ID
    newData.id = id;
    links[index] = newData;
    localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS, JSON.stringify(links));
    return true;
  }
  return false;
}

// 获取导航配置
function getBookmarkConfig() {
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARK_CONFIG);
  let config = stored ? JSON.parse(stored) : bookmarkConfig;
  
  // 如果是旧格式，转换为新格式
  if (!Array.isArray(config.categories)) {
    const categories = [];
    Object.entries(config).forEach(([name, links]) => {
      const categoryId = name.toLowerCase().replace(/\s+/g, '_');
      categories.push({
        id: categoryId,
        name: name,
        links: links.map((link, index) => ({
          ...link,
          id: `${categoryId}_${index + 1}`
        }))
      });
    });
    config = { categories };
    localStorage.setItem(STORAGE_KEYS.BOOKMARK_CONFIG, JSON.stringify(config));
  }
  
  return config;
}

// 添加存储键
const STORAGE_KEYS = {
  SEARCH_ENGINE: 'searchEngine',
  QUICK_ACCESS: 'quickAccess',
  BOOKMARK_CONFIG: 'bookmarkConfig',
  WEBDAV_CONFIG: 'webdavConfig'
};

// 修改加密相关函数
const ENCRYPTION_KEY = 'nav_webdav_key_unsafed';

// 简单的加密函数（降级方案）
function simpleEncrypt(text) {
  const key = ENCRYPTION_KEY;
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result);
}

// 简单的解密函数（降级方案）
function simpleDecrypt(encrypted) {
  try {
    const text = atob(encrypted);
    const key = ENCRYPTION_KEY;
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('解密失败:', error);
    return encrypted;
  }
}

// 修改保存 WebDAV 配置函数
async function saveWebDAVConfig(config) {
  // 加密密码
  const encryptedConfig = {
    ...config,
    password: simpleEncrypt(config.password)
  };
  localStorage.setItem(STORAGE_KEYS.WEBDAV_CONFIG, JSON.stringify(encryptedConfig));
}

// 修改获取 WebDAV 配置函数
async function getWebDAVConfig() {
  const stored = localStorage.getItem(STORAGE_KEYS.WEBDAV_CONFIG);
  if (!stored) return null;
  
  const config = JSON.parse(stored);
  // 解密密码
  return {
    ...config,
    password: simpleDecrypt(config.password)
  };
}

// 导出这些函数和变量
export { 
  bookmarkConfig,
  defaultSearchEngines,
  getSearchEngines,
  getStoredSearchEngine,
  saveSearchEngineSelection,
  getQuickAccessLinks,
  saveQuickAccessLink,
  deleteQuickAccessLink,
  updateQuickAccessLink,
  getBookmarkConfig,
  STORAGE_KEYS,
  getWebDAVConfig,
  saveWebDAVConfig,
  generateId,
};
