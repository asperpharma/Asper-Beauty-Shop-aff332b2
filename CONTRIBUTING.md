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
   git checkout -b feature/my-feature-branch
   ```
4. **Make Changes**: Make your changes and ensure that your code adheres to the
   coding standards outlined in this repository.
5. **Test Your Changes**: Run tests to confirm that your changes work as
   expected:
   ```bash
   npm run lint        # Check code quality
   npm run build       # Verify build succeeds
   npm run preview     # Test production build locally
   ```
6. **Commit Your Changes**: Commit your changes with a clear and descriptive
   message:
   ```bash
   git commit -m "Add my feature: description"
   ```
7. **Push Your Changes**: Push your changes to your forked repository:
   ```bash
   git push origin feature/my-feature-branch
   ```
8. **Create a Pull Request**: Go to the original repository and create a pull
   request from your branch targeting the appropriate base branch.

## Branch Strategy

This repository uses multiple deployment branches:

### Target Branch: `main` (Production)

Use for:
- New features
- Bug fixes
- Security updates
- Breaking changes
- Any changes requiring team review

**Process**: Create PR → Get approval → Merge to `main`

### Target Branch: `deploy/asper-updates` (Staging/Rapid Updates)

Use for:
- Product catalog updates
- Content changes (descriptions, images)
- Marketing copy
- Minor UI tweaks
- Rapid iterations

**Process**: Can push directly (if you have permissions) or create PR

For detailed branch deployment workflows, see [BRANCH_DEPLOYMENT_GUIDE.md](./BRANCH_DEPLOYMENT_GUIDE.md).

## Coding Standards

- Follow the existing code style in the project.
- Use TypeScript for type safety (interfaces for objects, types for unions).
- Write clear and concise comments in your code (match existing comment style).
- Use functional components (no class components).
- Follow Tailwind CSS utility-first approach (no inline styles).
- Support bilingual content (English & Arabic) using `useLanguage()` hook.
- Ensure mobile-first responsive design.
- Ensure that your changes do not break existing functionality.
- Run linters before committing: `npm run lint`

## Testing Requirements

Before submitting your PR:

- [ ] Code builds successfully: `npm run build`
- [ ] Linter passes: `npm run lint`
- [ ] Local preview works: `npm run preview`
- [ ] Changes tested in both English and Arabic (if user-facing)
- [ ] Mobile responsiveness verified
- [ ] No console errors in browser
- [ ] Existing features still work

## Pull Request Guidelines

- **Title**: Clear and descriptive (e.g., "Add product filtering", "Fix cart total calculation")
- **Description**: Include:
  - Summary of changes
  - Related issue (if any)
  - Testing steps
  - Screenshots (for UI changes)
- **Size**: Keep PRs focused and reasonably sized
- **Commits**: Use clear commit messages

## Issue Tracking

- Use the GitHub issues feature to report bugs or request features.
- Search existing issues before creating a new one.
- Provide clear reproduction steps for bugs.
- Include screenshots or error messages when applicable.

## Code Review Process

1. All PRs require at least one approval
2. CI checks must pass (Deno lint, type-check, tests)
3. Address review comments promptly
4. Resolve all conversations before merge

## License

By contributing to this project, you agree that your contributions will be
licensed under the project's license.

## Contact

For any questions, feel free to reach out:
- **Email**: asperpharma@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/issues)

---

**Thank you for contributing to Asper Beauty Shop! 🌟**
