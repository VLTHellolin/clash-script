// Type declarations from https://wiki.metacubex.one/

export interface DNSConfig {
  'enable'?: boolean;
  'cache-algorithm'?: 'lru' | 'arc';
  'prefer-h3'?: boolean;
  'use-hosts'?: boolean;
  'use-system-hosts'?: boolean;
  'listen'?: string;
  'ipv6'?: boolean;
  'default-nameserver'?: string[];
  'enhanced-mode'?: 'fake-ip' | 'redir-host';
  'fake-ip-range'?: string;
  'fake-ip-filter-mode'?: 'blacklist' | 'whitelist';
  'fake-ip-filter'?: string[];
  'nameserver-policy'?: Record<string, string[]>;
  'nameserver'?: string[];
  'fallback'?: string[];
  'proxy-server-nameserver'?: string[];
  'direct-nameserver'?: string[];
  'direct-nameserver-follow-policy'?: boolean;
}

export type Proxy = 'DIRECT' | 'REJECT' | 'REJECT-DROP' | 'PASS' | 'COMPATIBLE';

export interface RuleProvider {
  type: 'http' | 'file' | 'inline';
  behavior?: 'domain' | 'ipcidr' | 'classical';
  url?: string;
  path?: string;
  interval?: number;
  proxy?: string;
  format?: 'yaml' | 'text' | 'mrs';
  filter?: string;
}

export interface ProxyGroup {
  'type': 'select' | 'url-test' | 'fallback' | 'load-balance' | 'relay';
  'proxies': string[];
  'use'?: string[];
  'url'?: string;
  'interval'?: number;
  'lazy'?: boolean;
  'timeout'?: number;
  'max-failed-times'?: number;
  'hidden'?: boolean;
  'icon'?: string;
}
