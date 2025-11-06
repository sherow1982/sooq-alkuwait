#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import io

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(ROOT, '..'))
PAGES_DIR = os.path.join(REPO_ROOT, 'products-pages')

INJECTION = '<script src="../assets/js/universal-cart-fix.js"></script>'
SKIP_TOKENS = ('TEMPLATE', 'SAMPLE', 'WORKING', 'FIXED', 'TEST')

def needs_injection(html):
    return 'universal-cart-fix.js' not in html

def inject(html):
    if '</body>' in html:
        return html.replace('</body>', f'    {INJECTION}\n</body>')
    return html + '\n' + INJECTION + '\n'

def main():
    total = processed = injected = skipped = 0
    for name in sorted(os.listdir(PAGES_DIR)):
        if not name.lower().endswith('.html'):
            continue
        if any(token in name.upper() for token in SKIP_TOKENS):
            continue
        total += 1
        path = os.path.join(PAGES_DIR, name)
        with io.open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        if needs_injection(content):
            new_content = inject(content)
            with io.open(path, 'w', encoding='utf-8', newline='') as f:
                f.write(new_content)
            injected += 1
            processed += 1
            print(f'✅ Injected: {name}')
        else:
            skipped += 1
            processed += 1
            print(f'⏭️ Skipped (already has script): {name}')
    print('\n=== Summary ===')
    print(f'Total HTML files: {total}')
    print(f'Processed: {processed}')
    print(f'Injected: {injected}')
    print(f'Skipped: {skipped}')

if __name__ == '__main__':
    main()
