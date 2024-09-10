const proxyName = "Proxy";
const microsoftName = "Microsoft";
const AIName = "AIGC";
const FallbackName = "Fallback";

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
  "default-nameserver": ["119.29.29.29", "system"],
  nameserver: foreignNameservers,
  "proxy-server-nameserver": domesticNameservers,
  "nameserver-policy": {
    "geosite:private": "system",
    "geosite:cn": domesticNameservers,
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
};
// 规则
const rules = [
  //规则集
  "RULE-SET,reject,Block",
  "GEOSITE,category-ads-all,Block",
  "RULE-SET,mydomain,DIRECT",
  "GEOSITE,private,DIRECT",

  "GEOSITE,youtube," + proxyName,
  "GEOSITE,google," + proxyName,
  "GEOSITE,telegram," + proxyName,
  "GEOSITE,twitter," + proxyName,
  "GEOSITE,pixiv," + proxyName,
  "GEOSITE,category-scholar-!cn," + proxyName,
  "GEOSITE,biliintl," + proxyName,
  "GEOSITE,github," + proxyName,
  "GEOSITE,onedrive," + microsoftName,
  "GEOSITE,microsoft," + microsoftName,
  "RULE-SET,copilot," + AIName,
  "RULE-SET,bard," + AIName,
  "RULE-SET,openai," + AIName,
  "RULE-SET,claude," + AIName,
  "GEOSITE,apple-cn,DIRECT",
  "GEOSITE,steam@cn,DIRECT",
  "GEOSITE,category-games@cn,DIRECT",
  "GEOSITE,geolocation-!cn," + proxyName,
  "GEOSITE,cn,DIRECT",
  "GEOIP,private,DIRECT,no-resolve",
  "GEOIP,telegram," + proxyName,
  "GEOIP,JP," + proxyName,
  "GEOIP,LAN,DIRECT",
  "GEOIP,CN,DIRECT",
  "MATCH," + FallbackName,
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
      name: proxyName,
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
      name: microsoftName,
      type: "select",
      proxies: ["DIRECT", proxyName],
      "include-all": false,
      icon: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png",
    },
    {
      ...groupBaseOption,
      name: AIName,
      type: "select",
      "include-all": true,
      "exclude-filter": excludeInfo,
      proxies: [proxyName],
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
      name: FallbackName,
      type: "select",
      proxies: [proxyName, "Auto Select", "DIRECT"],
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
  config["rules"] = rules;
  config["rule-providers"] = ruleProviders;

  // 覆盖原配置中DNS配置
  config["dns"] = dnsConfig;
  // 域名嗅探
  config["sniffer"] = snifferConfig;
  // 返回修改后的配置
  return config;
}
