# Pulse - Contributing Guidelines

Thank you for your interest in contributing to Pulse! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Messages](#commit-messages)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Reporting Bugs](#reporting-bugs)
9. [Feature Requests](#feature-requests)

## Code of Conduct

- Be respectful and inclusive
- Welcome new contributors
- Provide constructive feedback
- Focus on code, not people
- Report violations to maintainers

## Getting Started

### 1. Fork the Repository

Click "Fork" on GitHub to create your own copy of Pulse.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Pulse.git
cd Pulse
git remote add upstream https://github.com/KZel08/Pulse.git
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/issue-description
```

**Branch Naming Convention:**
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code refactoring
- `test/` for tests

### 4. Set Up Development Environment

Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) to set up all services locally.

## Development Workflow

### 1. Make Your Changes

Edit files as needed for your contribution.

### 2. Test Your Changes

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
npm run lint

# AI Service tests
cd ai-service
pytest
```

### 3. Keep Your Fork Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript (Backend & Frontend)

**Style Guide:**
- Use ESLint configuration provided
- Follow naming conventions:
  - Classes: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private members: `_camelCase`
- Prefer `const` over `let` over `var`
- Use type annotations consistently
- Maximum line length: 100 characters

**Example:**
```typescript
// Good
class ChatGateway {
  private readonly chatService: ChatService;

  async handleMessage(payload: SendMessageDto): Promise<void> {
    const message = await this.chatService.saveMessage(payload);
    return message;
  }
}

// Bad
class chatgateway {
  service: any;
  
  handle_message(p) {
    let m = this.service.save(p);
    return m;
  }
}
```

### Python (AI Service)

**Style Guide:**
- Follow PEP 8 style guidelines
- Use type hints where possible
- Maximum line length: 100 characters
- Use docstrings for all functions

**Example:**
```python
# Good
def process_message(message: str) -> Dict[str, Any]:
    """
    Process a message using AI model.
    
    Args:
        message: The input message to process
        
    Returns:
        Dictionary with processed result
    """
    result = model.predict(message)
    return result

# Bad
def process(msg):
    r = model.predict(msg)
    return r
```

### CSS/Tailwind

- Use Tailwind utilities where possible
- Avoid inline styles
- Organize classes logically
- Use responsive prefixes (`md:`, `lg:`, etc.)

**Example:**
```tsx
// Good
<div className="flex items-center justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-lg md:text-xl font-semibold">Title</h1>
</div>

// Bad
<div style={{display: 'flex', justifyContent: 'space-between', padding: '16px'}}>
  <h1 style={{fontSize: '18px', fontWeight: 'bold'}}>Title</h1>
</div>
```

## Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, dependencies, etc.

### Examples

```
feat(chat): add typing indicators for conversations

- Implement typing_start and typing_stop WebSocket events
- Emit typing notifications to other conversation participants
- Add debouncing on client-side to reduce event spam

Fixes #123
```

```
fix(auth): prevent JWT token expiration on long sessions

- Increase JWT expiration time from 1 hour to 24 hours
- Implement token refresh mechanism

Fixes #456
```

```
docs(setup): add troubleshooting section to setup guide

- Add common connection issues and solutions
- Include database reset instructions
```

## Pull Request Process

### 1. Create a Pull Request

Push your branch and create a PR on GitHub:

```
Title: <type>(<scope>): <description>

## Description
Brief explanation of changes

## Changes
- Change 1
- Change 2

## Related Issues
Fixes #123
```

### 2. PR Checklist

Before submitting, ensure:
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### 3. Code Review

- Address reviewer feedback
- Update code as requested
- Push updates to the same branch
- Don't force push after review starts

### 4. Merge

Once approved:
- Squash commits if requested
- Ensure all checks pass
- Merge to main branch

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run specific test file
npm run test -- auth.service.spec.ts

# Run with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm run test

# Run with coverage
npm run test:cov

# E2E tests (if using Cypress)
npm run test:e2e
```

### AI Service Tests

```bash
cd ai-service

# Run all tests
pytest

# Run specific test
pytest tests/test_ai_model.py

# With coverage
pytest --cov
```

### Writing Tests

**Backend (NestJS):**
```typescript
describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();
    service = module.get<ChatService>(ChatService);
  });

  it('should save a message', async () => {
    const result = await service.saveMessage('conv-1', 'user-1', 'Hello');
    expect(result).toBeDefined();
    expect(result.content).toBe('Hello');
  });
});
```

**Frontend (React + Vitest):**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatWindow from './ChatWindow';

describe('ChatWindow', () => {
  it('should render messages', () => {
    const messages = [
      { id: '1', content: 'Hello', sender: 'user-1' }
    ];
    render(<ChatWindow messages={messages} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Reporting Bugs

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g., Ubuntu 20.04]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.0.0]
- Python version: [if applicable]

## Logs
Include relevant error logs
```

## Feature Requests

### Feature Request Template

```markdown
## Description
Clear description of the feature

## Motivation
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternative Approaches
Other possible solutions

## Additional Context
Any other relevant information
```

## Performance Considerations

- Minimize bundle size
- Optimize database queries
- Use appropriate caching strategies
- Profile code for bottlenecks
- Implement lazy loading where applicable

## Security Considerations

- Never commit secrets or credentials
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper CORS policies
- Use HTTPS in production
- Keep dependencies updated

## Documentation

Update relevant documentation when:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Updating dependencies
- Fixing documented bugs

## Questions?

- Check existing issues and discussions
- Read through documentation
- Join our community chat
- Create a new discussion

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Pulse! 🚀
