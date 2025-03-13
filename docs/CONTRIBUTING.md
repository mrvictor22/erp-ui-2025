# Contributing Guide

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Guidelines

### Code Style

- Use TypeScript strictly
- Follow ESLint rules
- Use meaningful variable names
- Comment complex logic
- Keep components focused and small

### Component Structure

```typescript
// Component template
import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Props {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
  return (
    // JSX
  );
}
```

### Commit Messages

Format:
```
type(scope): description

[optional body]
[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Maintenance

### Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure all checks pass
4. Request review
5. Address feedback

## Testing

- Write unit tests for utilities
- Write integration tests for components
- Test edge cases
- Maintain good test coverage

## Documentation

- Update README.md for major changes
- Document new features
- Keep API documentation current
- Include examples where helpful