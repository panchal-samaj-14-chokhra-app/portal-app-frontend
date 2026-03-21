import { execSync } from 'child_process';

try {
  console.log('Updating pnpm-lock.yaml to match package.json...');
  execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
  console.log('✓ Successfully updated pnpm-lock.yaml');
} catch (error) {
  console.error('✗ Failed to update lockfile:', error.message);
  process.exit(1);
}
