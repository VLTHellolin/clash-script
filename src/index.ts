import dns from './config/dns.yaml';
import global from './config/global.yaml';
import hosts from './config/hosts.yaml';
import proxyGroups from './config/proxy-groups.yaml';
import proxyProviders from './config/proxy-providers.yaml';
import ruleProviders from './config/rule-providers.yaml';
import rules from './config/rules.yaml';
import sniffer from './config/sniffer.yaml';

const interpolateEnvVars = (str: string): string => {
  return str.replace(/\$\{(\w+)\}/g, (_, key) => process.env[key] || '');
};

const result = Bun.YAML.stringify({
  ...global,
  ...dns,
  ...sniffer,
  ...hosts,
  ...proxyGroups,
  ...proxyProviders,
  ...ruleProviders,
  ...rules,
}, null, 2);

const dist = Bun.file('dist/config.yaml');
await Bun.write(dist, interpolateEnvVars(result));
