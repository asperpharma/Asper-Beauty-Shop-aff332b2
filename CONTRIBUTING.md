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
   request from your branch targeting the `main` branch.

## Pull Request and Deployment Process

**IMPORTANT**: This repository uses a PR-based deployment workflow. Changes are **only deployed to production when merged to the `main` branch**.

For detailed instructions on:
- Creating and managing pull requests
- Code review process
- Merging PRs to trigger deployment
- Deployment verification

Please read: [PR Merge Guidelines](.github/PR_MERGE_GUIDELINES.md)

### Quick Deployment Checklist

Before your PR can be merged:
- [ ] All tests pass locally and in CI
- [ ] Code follows project style guidelines
- [ ] PR description is clear and complete
- [ ] At least one approval from a maintainer
- [ ] No merge conflicts with `main`

After merge to `main`:
- ✅ Automatic deployment to https://www.asperbeautyshop.com (2-5 minutes)
- ✅ Changes go live in production

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
