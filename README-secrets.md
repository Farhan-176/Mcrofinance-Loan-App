# Secret Management

Do not commit real credentials to the repository. Use environment variables via `.env` files locally and platform-specific secret managers in production.

- Add secrets only to `backend/.env` and `frontend/.env` (these are gitignored).
- Share non-sensitive config via `backend/.env.example` and `frontend/.env.example`.
- For production, set env vars in Railway/Render/Vercel dashboards or GitHub Actions Secrets.

## Rotation and Revocation (MongoDB Atlas)
1. Create a new database user with a strong password.
2. Update your deployment platforms with the new `MONGODB_URI`.
3. Remove or disable the old database user in Atlas.
4. Review Atlas security and connection logs for suspicious activity.
5. After verifying, mark the GitHub secret alert as revoked.

## Best Practices
- Never include `username:password` in docs in the exact `mongodb+srv://` format.
- URL-encode special characters in passwords when used in URIs.
- Use `.gitignore` to prevent committing env files.
- Consider enabling IP access restrictions rather than `0.0.0.0/0` in production.
