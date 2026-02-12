# ZenSpace API Service Layer

This directory contains the API service layer for ZenSpace, implementing clean separation between the React components and backend data fetching.

## Current Implementation

The API service is currently implemented with **simulated data storage** using in-memory maps. This allows you to:

1. **Test the app immediately** without a backend
2. **See the expected API patterns** for real backend integration
3. **Quickly replace with real endpoints** as needed

## File Structure

- `index.ts` - Main API service with all endpoints

## API Modules

### Authentication (`authAPI`)
- `login(email)` - Login user
- `signup(name, email, password)` - Register new user
- `logout()` - Logout current user
- `getCurrentToken()` - Get authentication token
- `isAuthenticated()` - Check auth status

**To integrate with real backend:**
```typescript
// Replace the simulated calls with real HTTP requests
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});
const data = await response.json();
```

### User Management (`userAPI`)
- `getCurrentUser()` - Get logged-in user
- `getUser(userId)` - Get user by ID
- `getUsers()` - Get all users

### Workspace Management (`workspaceAPI`)
- `getUserWorkspaces()` - Get user's workspaces
- `createWorkspace(name)` - Create new workspace

### Project Management (`projectAPI`)
- `getProjects(workspaceId)` - Get projects in workspace
- `getProject(projectId)` - Get project by ID
- `createProject(project)` - Create new project
- `updateProject(projectId, updates)` - Update project
- *(Delete method pending)*

### Task Management (`taskAPI`)
- `getTasks(projectId?)` - Get all tasks or tasks in project
- `getTask(taskId)` - Get task by ID
- `createTask(task)` - Create new task
- `updateTask(taskId, updates)` - Update task
- `deleteTask(taskId)` - Delete task

## Error Handling

All API functions throw `APIError` with a message and optional HTTP status code:

```typescript
try {
  await userAPI.getCurrentUser();
} catch (err) {
  if (err instanceof APIError) {
    console.error(`Error (${err.status}): ${err.message}`);
  }
}
```

## Integrating a Real Backend

### Steps:
1. **Replace API endpoints** - Update fetch URLs in each API module
2. **Add authentication headers** - Include token in requests:
   ```typescript
   headers: { 
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${authAPI.getCurrentToken()}`
   }
   ```
3. **Configure .env** - Set `VITE_API_URL` to your backend server
4. **Test thoroughly** - Verify all data flows work correctly

### Example Backend Integration (Node.js/Express):

```typescript
// Before (Simulated)
export const authAPI = {
  async login(email: string) {
    const user = simulatedDB.users.get(userId);
    return { user, token };
  }
}

// After (Real Backend)
export const authAPI = {
  async login(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new APIError('Login failed', response.status);
    const data = await response.json();
    localStorage.setItem('zenspace_token', data.token);
    return data;
  }
}
```

## Initial Data Seeding

The `seedData()` function is called on app initialization to create sample data. When integrating a real backend, you can:

1. **Remove seedData()** - Let your backend manage data
2. **Keep for demo purposes** - Seed test data on first login
3. **Move to backend** - Create seeding in your backend setup script

## Next Steps

1. ✅ Test the app with simulated data
2. ⏳ Build/configure your backend (Node.js, Python, etc.)
3. ⏳ Replace API calls with real endpoints
4. ⏳ Deploy and test with real data
5. ⏳ Monitor and optimize as needed

## Notes

- All data currently persists only in memory during the session
- For persistent storage, integrate with a real database
- Consider adding retry logic and caching as needed
- Implement proper error boundaries in React components for production
