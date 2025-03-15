import type { DNSConfig, RuleProvider } from './types';

const cdn = 'https://cdn.hellolin.top/';
const rulesetURL = 'https://ruleset.skk.moe/';

const regions = [
  { name: 'HongKong', regex: /香港|HK|Hong|🇭🇰/, icon: 'Hong_Kong' },
  { name: 'Taiwan', regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/, icon: 'China' },
  { name: 'Singapore', regex: /新加坡|狮城|SG|Singapore|🇸🇬/, icon: 'Singapore' },
  { name: 'Japan', regex: /日本|JP|Japan|🇯🇵/, icon: 'Japan' },
  { name: 'USA', regex: /美国|US|United States|America|🇺🇸/, icon: 'United_States' },
  { name: 'UK', regex: /英国|UK|EN|GB|United Kingdom|Britain|England|🇬🇧/, icon: 'United_Kingdom' },
  { name: 'Others', icon: 'World_Map' },
];

const proxyGroups = [
  { name: 'CDN', icon: 'Rocket' },
  { name: 'Stream', icon: 'Media' },
  { name: 'AI', icon: 'ChatGPT' },
  { name: 'Telegram', icon: 'Telegram' },
  { name: 'Apple', icon: 'Apple' },
  { name: 'Microsoft', icon: 'Microsoft' },
  { name: 'Final', icon: 'Final' },
];

const rulesets: Record<string, string[]> = {
  reject: ['REJECT', 'domainset', 'non_ip', 'ip'],
  cdn: ['CDN', 'domainset', 'non_ip'],
  stream_us: ['USA', 'non_ip', 'ip'],
  stream_eu: ['UK', 'non_ip', 'ip'],
  stream_jp: ['Japan', 'non_ip', 'ip'],
  stream_hk: ['HongKong', 'non_ip', 'ip'],
  stream_tw: ['Taiwan', 'non_ip', 'ip'],
  stream: ['Stream', 'non_ip', 'ip'],
  ai: ['AI', 'non_ip'],
  telegram: ['Telegram', 'non_ip', 'ip'],
  apple_cdn: ['DIRECT', 'domainset'],
  apple_services: ['Apple', 'domainset'],
  apple_cn: ['DIRECT', 'non_ip'],
  microsoft_cdn: ['DIRECT', 'non_ip'],
  microsoft: ['Microsoft', 'non_ip'],
  download: ['DIRECT', 'domainset', 'non_ip'],
  lan: ['DIRECT', 'non_ip', 'ip'],
  domestic: ['DIRECT', 'non_ip', 'ip'],
  direct: ['DIRECT', 'non_ip'],
  global: ['Final', 'non_ip'],
  china_ip: ['DIRECT,no-resolve', 'ip'],
  china_ip_ipv6: ['DIRECT,no-resolve', 'ip'],
};

const domesticNameservers = [
  'https://dns.alidns.com/dns-query',
  'https://doh.pub/dns-query',
];
const foreignNameservers = [
  'https://1.1.1.1/dns-query',
  'https://208.67.222.222/dns-query',
  'https://8.8.8.8/dns-query',
];
const nameservers = [
  ...domesticNameservers,
  ...foreignNameservers,
];

const dnsConfig: DNSConfig = {
  'enable': true,
  'ipv6': true,
  'use-system-hosts': false,
  'listen': '0.0.0.0:1053',
  'enhanced-mode': 'fake-ip',
  'cache-algorithm': 'arc',
  'fake-ip-range': '198.18.0.1/16',
  'fake-ip-filter': [
    '+.lan',
    '+.local',
    '+.msftconnecttest.com',
    '+.msftncsi.com',
    'localhost.ptlogin2.qq.com',
    'localhost.sec.qq.com',
    'localhost.work.weixin.qq.com',
  ],
  'default-nameserver': [
    '223.5.5.5',
    '119.29.29.29',
    '1.1.1.1',
    '8.8.8.8',
  ],
  'nameserver': nameservers,
  'proxy-server-nameserver': nameservers,
  'nameserver-policy': {
    'geosite:private,cn,geolocation-cn': domesticNameservers,
    'geosite:geolocation-!cn': foreignNameservers,
  },
};

function generateProxyGroups() {
  return proxyGroups.map(group =>
    ({
      name: group.name,
      icon: `${cdn}gh/Koolson/Qure/IconSet/Color/${group.icon}.png`,
      proxies: ['DIRECT', 'HongKong', 'Taiwan', 'Singapore', 'Japan', 'USA', 'UK', 'Others'],
      type: 'select',
    }));
}

function groupProxies(proxies: any) {
  const result = regions.map(region =>
    ({
      regex: region.regex,
      name: region.name,
      icon: `${cdn}gh/Koolson/Qure/IconSet/Color/${region.icon}.png`,
      proxies: [] as string[],
      type: 'select',
      url: 'https://www.gstatic.com/generate_204',
      interval: 1800,
      lazy: true,
    }));

  for (const proxy of proxies) {
    for (const region of result) {
      if (region.regex === undefined || region.regex.test(proxy.name)) {
        region.proxies.push(proxy.name);
        break;
      }
    }
  }

  for (const region of result) {
    region.proxies.push('DIRECT'); // Placeholder
    delete region.regex;
  }

  return result;
}

function generateRuleProviders() {
  const result: Record<string, RuleProvider> = {};

  for (const name in rulesets) {
    for (const rule of rulesets[name].slice(1)) {
      result[`${name}_${rule}`] = {
        type: 'http',
        url: `${rulesetURL}Clash/${rule}/${name}.txt`,
        behavior: rule === 'domainset' ? 'domain' : 'classical',
        format: 'text',
        interval: 43200,
      };
    }
  }

  return result;
}

function generateRules() {
  const result: string[] = [];

  for (const name in rulesets) {
    const proxy = rulesets[name][0];
    for (const rule of rulesets[name].slice(1)) {
      result.push(`RULE-SET,${name}_${rule},${proxy}`);
    }
  }

  result.push(
    'GEOSITE,CN,DIRECT',
    'GEOIP,LAN,DIRECT,no-resolve',
    'GEOIP,CN,DIRECT,no-resolve',
    'MATCH,Final',
  );

  return result;
}

export function main(config: any) {
  Object.assign(config, {
    'dns': dnsConfig,
    'rule-providers': generateRuleProviders(),
    'rules': generateRules(),
    'proxy-groups': [
      ...generateProxyGroups(),
      ...groupProxies(config.proxies),
    ],
  });

  return config;
}
