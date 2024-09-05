// 国内DNS服务器
const domesticNameservers = [
  "https://doh.pub/dns-query",
  "https://dns.alidns.com/dns-query",
];
// 国外DNS服务器
const foreignNameservers = [
  "https://dns.cloudflare.com/dns-query",
  "https://dns.google/dns-query",
];

const fallbackDomain = ["+.google.com", "+.facebook.com", "+.youtube.com"];

const fakeIpFilter = [
  "+.lan",
  "+.local",
  "+.msftncsi.com",
  "+.msftconnecttest.com",
  "localhost.ptlogin2.qq.com",
  "localhost.sec.qq.com",
  "localhost.work.weixin.qq.com",
];

const dnsConfig = {
  enable: true,
  ipv6: true,
  listen: "0.0.0.0:1053",
  "fake-ip-range": "198.18.0.1/16",
  "enhanced-mode": "fake-ip",
  "fake-ip-filter": fakeIpFilter,
  "default-nameserver": ["223.5.5.5", "119.29.29.29", "system"],
  nameserver: ["https://1.1.1.1/dns-query", "https://8.8.8.8/dns-query"],
  "proxy-server-nameserver": ["https://doh.pub/dns-query"],
  "nameserver-policy": {
    "rule-set:private,cn_domain,direct,mydomain": [
      // "system",
      ...domesticNameservers,
    ],
    "geosite:cn": [...domesticNameservers],
    "geosite:geolocation-!cn": [...domesticNameservers,...foreignNameservers],
    "rule-set:gfw,proxy,telegram,tld-not-cn": [...foreignNameservers],
  },
  fallback: ["tls://8.8.4.4", "tls://1.1.1.1"],
  "fallback-filter": {
    geoip: true,
    "geoip-code": "CN",
    geosite: ["gfw"],
    ipcidr: ["240.0.0.0/4"],
    domain: fallbackDomain,
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
const ruleProviderMrs = {
  type: "http",
  format: "mrs",
  interval: 86400,
};
// 规则集配置
const ruleProviders = {
  mydomain: {
    ...ruleProviderYaml,
    behavior: "domain",
    url: "https://gh.828820.xyz/zhstzzy/WorkerVless2sub/main/privateDomin.yaml?token=sar9862",
    path: "./ruleset/mydomain.yaml",
  },

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
  // MetaCubeX
  "tld-not-cn": {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tld-!cn.mrs",
    path: "./ruleset/tld-not-cn",
  },
  "geolocation-!cn": {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
    path: "./ruleset/geolocation-!cn",
  },
  gfw: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/gfw.mrs",
    path: "./ruleset/gfw",
  },
  proxy: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo-lite/geosite/proxy.mrs",
    path: "./ruleset/proxy",
  },
  private: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo-lite/geosite/private.mrs",
    path: "./ruleset/private",
  },
  telegramcidr: {
    ...ruleProviderMrs,
    behavior: "ipcidr",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
    path: "./ruleset/telegramcidr",
  },
  lancidr: {
    ...ruleProviderMrs,
    behavior: "ipcidr",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs",
    path: "./ruleset/lancidr",
  },
  cncidr: {
    ...ruleProviderMrs,
    behavior: "ipcidr",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
    path: "./ruleset/cncidr",
  },
  youtube: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs",
    path: "./ruleset/youtube",
  },
  cn_domain: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
    path: "./ruleset/cn_domain",
  },
  telegram: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
    path: "./ruleset/telegram",
  },
  github: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs",
    path: "./ruleset/github",
  },
  microsoft: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs",
    path: "./ruleset/microsoft",
  },
  ads: {
    ...ruleProviderMrs,
    behavior: "domain",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ads-all.mrs",
    path: "./ruleset/category-ads-all",
  },
  copilot: {
    ...ruleProviderYaml,
    behavior: "classical",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.yaml",
    path: "./ruleset/Copilot.yaml",
  },
  claude: {
    ...ruleProviderYaml,
    behavior: "classical",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml",
    path: "./ruleset/Claude.yaml",
  },
  bard: {
    ...ruleProviderYaml,
    behavior: "classical",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BardAI/BardAI.yaml",
    path: "./ruleset/BardAI.yaml",
  },
  openai: {
    ...ruleProviderYaml,
    behavior: "classical",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
    path: "./ruleset/OpenAI.yaml",
  },
  steam: {
    ...ruleProviderYaml,
    behavior: "classical",
    url: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.yaml",
    path: "./ruleset/Steam.yaml",
  },
};
// 规则
const rules = [
  //规则集
  "RULE-SET,reject,Block",
  "RULE-SET,ads,Block",

  "RULE-SET,mydomain,DIRECT",
  "RULE-SET,applications,DIRECT",
  "RULE-SET,private,DIRECT",
  "RULE-SET,direct,DIRECT",
  "RULE-SET,cncidr,DIRECT,no-resolve",
  "RULE-SET,lancidr,DIRECT,no-resolve",
  "RULE-SET,cn_domain,DIRECT",

  "RULE-SET,github,Proxy",
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
      proxies: ["Auto Select", "DIRECT", ...proxyInfo],
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
      "exclude-filter": excludeInfo,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Speedtest.png",
    },
    {
      ...groupBaseOption,
      name: "Microsoft",
      type: "select",
      proxies: ["DIRECT", "Proxy"],
      "include-all": false,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png",
    },
    {
      ...groupBaseOption,
      name: "AIGC",
      type: "select",
      "include-all": true,
      "exclude-filter": excludeInfo,
      proxies: ["Proxy"],
      filter:
        "(?i)香港|Hong Kong|HK|🇭🇰|新加坡|Singapore|🇸🇬|日本|Japan|🇯🇵|美国|USA|🇺🇸",
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png",
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
    {
      ...groupBaseOption,
      name: "GLOBAL",
      type: "select",
      proxies: ["Auto Select", "DIRECT", ...proxyInfo],
      "include-all": false,
      "exclude-filter": excludeInfo,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Orz-3/mini/master/Color/Global.png",
    },
  ];

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
