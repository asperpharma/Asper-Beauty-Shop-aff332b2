# Contribution Guidelines for Asper Beauty Shop

Thank you for considering contributing to Asper Beauty Shop! We welcome
contributions from the community and appreciate your time and effort. Please
follow these guidelines to ensure a smooth process.

## How to Contribute

1. **Fork the Repository**: Start by forking the repository on GitHub to your
   own account.
2. **Clone your Fork**: Clone your forked repository to your local machine
   using:
   ```bash
   git clone https://github.com/your-username/Asper-Beauty-Shop.git
   ```
3. **Create a Branch**: Create a new branch for your feature or fix:
   ```bash
   git checkout -b my-feature-branch
   ```
4. **Make Changes**: Make your changes and ensure that your code adheres to the
   coding standards outlined in this repository.
5. **Test Your Changes**: Run tests to confirm that your changes work as
   expected.
6. **Commit Your Changes**: Commit your changes with a clear and descriptive
   message:
   ```bash
   git commit -m "Add my feature"
   ```
7. **Push Your Changes**: Push your changes to your forked repository:
   ```bash
   git push origin my-feature-branch
   ```
8. **Create a Pull Request**: Go to the original repository and create a pull
   request from your branch.

## Deployment Workflow

### For Contributors Without Direct Push Access

Follow the standard pull request workflow above. Your changes will be reviewed and merged by maintainers.

### For Team Members with Push Access

If you have write access to the repository, you can deploy using dedicated branches:

#### Using the Deploy Branch

```bash
# Create or switch to deployment branch
git checkout -b deploy/asper-updates
# Or: git checkout deploy/asper-updates && git pull origin deploy/asper-updates

# Make and commit your changes
git add .
git commit -m "Descriptive commit message"

# Push to deployment branch
git push origin deploy/asper-updates
```

#### Merging to Main

If you have permissions to push directly to `main`:

```bash
# Update both branches
git checkout deploy/asper-updates
git pull origin deploy/asper-updates

git checkout main
git pull origin main

# Merge and push
git merge deploy/asper-updates
git push origin main
```

**Note**: Always check branch protection rules before pushing. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Coding Standards

- Follow the existing code style in the project.
- Write clear and concise comments in your code.
- Ensure that your changes do not break existing functionality.

## Issue Tracking

- Use the GitHub issues feature to report bugs or request features.

## License

By contributing to this project, you agree that your contributions will be
licensed under the project's license.

## Contact

For any questions, feel free to reach out to the maintainers of this repository.
