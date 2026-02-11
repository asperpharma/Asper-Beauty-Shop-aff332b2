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
   expected. See the Testing section below.
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

## Coding Standards

- Follow the existing code style in the project.
- Write clear and concise comments in your code.
- Ensure that your changes do not break existing functionality.

## Testing & CI

Before submitting a pull request:

1. **Run Linters**:
   ```bash
   npm run lint        # ESLint for frontend code
   deno fmt            # Format Deno files (auto-fix)
   deno lint           # Lint Deno files
   ```

2. **Verify Integrations**:
   ```bash
   ./verify-connections.sh  # Check all integrations (48 tests)
   ```

3. **Build & Preview**:
   ```bash
   npm run build
   npm run preview
   ```

**Automated CI Checks**: All pull requests automatically run GitHub Actions that:
- Check code formatting with `deno fmt --check`
- Run linting with `deno lint`
- Type-check Supabase edge functions
- Run the Deno test suite

Ensure these checks pass before requesting review.

## Issue Tracking

- Use the GitHub issues feature to report bugs or request features.

## License

By contributing to this project, you agree that your contributions will be
licensed under the project's license.

## Contact

For any questions, feel free to reach out to the maintainers of this repository.
