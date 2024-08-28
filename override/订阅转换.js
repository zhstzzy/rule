// 国内DNS服务器
const domesticNameservers = [
  "tls://1.12.12.12:853",
  "tls://223.6.6.6:853",
  "https://doh.pub/dns-query",
  "https://dns.alidns.com/dns-query",
];
// 国外DNS服务器
const foreignNameservers = [
  "tls://1.0.0.1:853",
  "tls://8.8.4.4:853",
  "https://cloudflare-dns.com/dns-query",
  "https://dns.google/dns-query",
  "https://doh.dns.sb/dns-query",
];

const ProxyNameserver = [
  "quic://223.5.5.5",
  "quic://223.6.6.6",
  "https://cloudflare-dns.com/dns-query",
  "https://dns.google/dns-query",
  "https://1.12.12.12/dns-query",
  "https://120.53.53.53/dns-query",
];

const dnsConfig = {
  enable: true,
  ipv6: true,
  listen: "0.0.0.0:1053",
  "fake-ip-range": "198.18.0.1/16",
  "enhanced-mode": "fake-ip",
  "fake-ip-filter": [
    "+.lan",
    "+.local",
    "+.msftncsi.com",
    "+.msftconnecttest.com",
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
    "localhost.work.weixin.qq.com",
  ],
  "default-nameserver": ["223.5.5.5", "119.29.29.29", "system"],
  nameserver: ["223.5.5.5", "119.29.29.29"],
  "proxy-server-nameserver": [...domesticNameservers, ...foreignNameservers],
  "nameserver-policy": {
    "rule-set:private,cn_domain,direct": "system",
    "rule-set:gfw,proxy,telegram,tld-not-cn": [...ProxyNameserver],
  },
  fallback: [...foreignNameservers],
  "fallback-filter": {
    geoip: true,
    ipcidr: ["240.0.0.0/4", "0.0.0.0/32"],
  },
};

const snifferConfig = {
  enable: true,
  "force-dns-mapping": true,
  "parse-pure-ip": true,
  "override-destination": false,
  sniff: {
    HTTP: {
      ports: [80, "8080-8880"],
      "override-destination": true,
    },
    TLS: { ports: [443, 8443] },
    QUIC: { ports: [443, 8443] },
  },
  "force-domain": ["+.v2ex.com"],
  "skip-domain": ["+.push.apple.com"],
};

// 规则集通用配置
const ruleProviderYaml = {
  type: "http",
  format: "yaml",
  interval: 86400,
};
const ruleProviderText = {
  type: "http",
  format: "text",
  interval: 86400,
};
const ruleProvideripcidr = {
  type: "http",
  behavior: "ipcidr",
  interval: 86400,
};
// 规则集配置
const ruleProviders = {
  reject: {
    ...ruleProviderText,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
    path: "./ruleset/reject.yaml",
  },
  direct: {
    ...ruleProviderText,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    path: "./ruleset/direct.yaml",
  },
  applications: {
    ...ruleProviderText,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
    path: "./ruleset/applications.yaml",
  },
  prevent_dns_leak: {
    type: "http",
    interval: 86400,
    behavior: "domain",
    format: "text",
    url: "https://cdn.jsdelivr.net/gh/xishang0128/rules@main/clash%20or%20stash/prevent_dns_leak/prevent_dns_leak_domain.list",
  },

  // MetaCubeX
  "tld-not-cn": {
    ...ruleProviderText,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/tld-!cn.yaml",
    path: "./ruleset/tld-not-cn.yaml",
  },
  "geolocation-!cn": {
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.yaml",
    path: "./ruleset/geolocation-!cn.yaml",
    behavior: "domain",
    interval: 86400,
    format: "yaml",
    type: "http",
  },
  gfw: {
    ...ruleProviderText,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/gfw.yaml",
    path: "./ruleset/gfw.yaml",
  },
  proxy: {
    ...ruleProviderText,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo-lite/geosite/proxy.yaml",
    path: "./ruleset/proxy.yaml",
  },
  private: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo-lite/geosite/private.yaml",
    path: "./ruleset/private.yaml",
  },
  telegramcidr: {
    ...ruleProvideripcidr,
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/telegram.yaml",
    path: "./ruleset/telegramcidr.yaml",
  },
  lancidr: {
    ...ruleProvideripcidr,
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/private.yaml",
    path: "./ruleset/lancidr.yaml",
  },
  cncidr: {
    ...ruleProvideripcidr,
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/cn.yaml",
    path: "./ruleset/cncidr.yaml",
  },
  youtube: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/youtube.yaml",
    path: "./ruleset/youtube.yaml",
  },
  cn_domain: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/cn.yaml",
    path: "./ruleset/cn_domain.yaml",
  },
  telegram: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/telegram.yaml",
    path: "./ruleset/telegram.yaml",
  },
  github: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/github.yaml",
    path: "./ruleset/github.yaml",
  },
  microsoft: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/microsoft.yaml",
    path: "./ruleset/microsoft.yaml",
  },
  ads: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-ads-all.yaml",
    path: "./ruleset/category-ads-all.yaml",
  },
  copilot: {
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.yaml",
    path: "./ruleset/copilot.yaml",
    behavior: "classical",
    interval: 86400,
    format: "yaml",
    type: "http",
  },
  claude: {
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml",
    path: "./ruleset/claude.yaml",
    behavior: "classical",
    interval: 86400,
    format: "yaml",
    type: "http",
  },
  bard: {
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BardAI/BardAI.yaml",
    path: "./ruleset/bard.yaml",
    behavior: "classical",
    interval: 86400,
    format: "yaml",
    type: "http",
  },
  openai: {
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
    path: "./ruleset/openai.yaml",
    behavior: "classical",
    interval: 86400,
    format: "yaml",
    type: "http",
  },
  steam: {
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.yaml",
    path: "./ruleset/steam.yaml",
    behavior: "classical",
    interval: 86400,
    format: "yaml",
    type: "http",
  },
};
// 规则
const rules = [
  //规则集
  "RULE-SET,reject,Block",
  "RULE-SET,ads,Block",

  "RULE-SET,applications,DIRECT",
  "RULE-SET,private,DIRECT",
  "RULE-SET,direct,DIRECT",
  "RULE-SET,cncidr,DIRECT,no-resolve",
  "RULE-SET,lancidr,DIRECT,no-resolve",
  "RULE-SET,cn_domain,DIRECT",

  "RULE-SET,microsoft,Microsoft",
  "RULE-SET,copilot,AIGC",
  "RULE-SET,bard,AIGC",
  "RULE-SET,openai,AIGC",
  "RULE-SET,claude,AIGC",
  "RULE-SET,gfw,Proxy",
  "RULE-SET,youtube,Proxy",
  "RULE-SET,proxy,Proxy",
  "RULE-SET,geolocation-!cn,Proxy",
  "RULE-SET,tld-not-cn,Proxy",
  "RULE-SET,telegramcidr,Proxy,no-resolve",

  "RULE-SET,github,Proxy",
  "RULE-SET,telegram,Proxy",

  // 其他规则
  "GEOIP,LAN,DIRECT",
  "GEOIP,CN,DIRECT",
  "MATCH,Fallback",
];
// 代理组通用配置
const groupBaseOption = {
  interval: 300,
  timeout: 3000,
  url: "http://www.gstatic.com/generate_204",
  lazy: true,
  "max-failed-times": 3,
  hidden: false,
};

// 程序入口
function main(config) {
  const proxyInfo = [];
  config["proxies"].forEach((item) => {
    proxyInfo.push(item["name"]);
  });
  const excludeInfo =
    "(?i)Traffic|Expire|Premium|频道|订阅|ISP|到期|重置|3K大佬下血本|导航站|节点探针";
  // 覆盖原配置中的代理组
  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      name: "Proxy",
      type: "select",
      proxies: [
        "Auto Select",
        "DIRECT",
        "HK AUTO",
        "SG AUTO",
        "JP AUTO",
        "US AUTO",
        ...proxyInfo,
      ],
      "include-all": false,
      "exclude-filter": excludeInfo,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png",
    },
    {
      ...groupBaseOption,
      name: "Auto Select",
      type: "url-test",
      tolerance: 100,
      proxies: proxyInfo,
      "include-all": false,
      // "exclude-filter":
      //   "(?i)群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|导航|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入",
      "exclude-filter": excludeInfo,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Speedtest.png",
    },
    {
      ...groupBaseOption,
      name: "Microsoft",
      type: "select",
      proxies: ["DIRECT", "Proxy", "HK AUTO", "SG AUTO", "JP AUTO", "US AUTO"],
      "include-all": false,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png",
    },
    {
      ...groupBaseOption,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png",
      name: "AIGC",
      type: "select",
      proxies: ["Proxy", "SG AUTO", "JP AUTO", "US AUTO"],
    },
    {
      ...groupBaseOption,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Orz-3/mini/master/Color/HK.png",
      "include-all": true,
      "exclude-filter": excludeInfo,
      filter: "(?i)香港|Hong Kong|HK|🇭🇰",
      name: "HK AUTO",
      type: "url-test",
    },
    {
      ...groupBaseOption,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Orz-3/mini/master/Color/SG.png",
      "include-all": true,
      "exclude-filter": excludeInfo,
      filter: "(?i)新加坡|Singapore|🇸🇬",
      name: "SG AUTO",
      type: "url-test",
    },
    {
      ...groupBaseOption,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Orz-3/mini/master/Color/JP.png",
      "include-all": true,
      "exclude-filter": excludeInfo,
      filter: "(?i)日本|Japan|🇯🇵",
      name: "JP AUTO",
      type: "url-test",
    },
    {
      ...groupBaseOption,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Orz-3/mini/master/Color/US.png",
      "include-all": true,
      "exclude-filter": excludeInfo,
      filter: "(?i)美国|USA|🇺🇸",
      name: "US AUTO",
      type: "url-test",
    },
    {
      ...groupBaseOption,
      name: "Block",
      type: "select",
      proxies: ["REJECT", "DIRECT"],
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Reject.png",
    },
    {
      ...groupBaseOption,
      name: "Fallback",
      type: "select",
      proxies: ["Proxy", "Auto Select", "DIRECT"],
      "include-all": false,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png",
    },
  ];

  // config["proxies"].forEach((item) => {
  //   config["proxy-groups"][0]["proxies"].push(item["name"]);
  //   // config["proxy-groups"][1]["proxies"].push(item["name"]);
  // });

  // 覆盖原配置中的规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  // 覆盖原配置中DNS配置
  config["dns"] = dnsConfig;
  // 域名嗅探
  config["sniffer"] = snifferConfig;
  // 返回修改后的配置
  return config;
}
