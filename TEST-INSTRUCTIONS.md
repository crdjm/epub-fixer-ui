# Authentication Test Instructions

## Test User Credentials
- Email: test@example.com
- Password: password123

## How to Test Authentication

1. Open your browser and visit: http://localhost:3457/auth/signin

2. Enter the test credentials:
   - Email: test@example.com
   - Password: password123

3. Click the "Sign in" button

4. You should be redirected to the dashboard at http://localhost:3457/dashboard

## Troubleshooting

If you encounter authentication issues:

1. Clear your browser cookies for localhost:3457
2. Make sure you're using the correct credentials
3. Check the browser console for any error messages
4. Verify that the development server is running on port 3457

## Expected Behavior

- Successful authentication should redirect you to the dashboard
- Invalid credentials should show an error message
- Existing Google accounts should show a specific error message