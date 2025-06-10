# Fixing npm ci Issues

## Problem

When running `npm ci` in the CI environment, you might encounter the following error:

```
npm error code EUSAGE
npm error
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
npm error
```

## Solution

This error occurs because the `npm ci` command requires a `package-lock.json` file that is in sync with your `package.json`. 

### Option 1: Run the setup script

We've added a setup script to help generate the package-lock.json file:

```bash
npm run setup
```

This will:
1. Check if package-lock.json exists
2. If not, run npm install to generate it
3. Install dependencies using npm ci if node_modules doesn't exist

### Option 2: Manual steps

If you prefer to do it manually:

1. Run `npm install` to generate the package-lock.json file:

```bash
npm install
```

2. Commit the generated package-lock.json file to your repository:

```bash
git add package-lock.json
git commit -m "Add package-lock.json for CI builds"
git push
```

3. Now you can run `npm ci` without errors:

```bash
npm ci
```

## CI Workflow Changes

The GitHub Actions workflow has been updated to handle this situation automatically:

1. The initial Slack notification step now uses `npm install` instead of `npm ci`
2. The dependencies installation step checks if package-lock.json exists:
   - If it doesn't exist, it runs `npm install` to generate it
   - If it exists, it runs `npm ci` for a clean install

These changes ensure that the workflow will run successfully even if the package-lock.json file is missing.