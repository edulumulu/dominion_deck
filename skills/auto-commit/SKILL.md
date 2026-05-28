---
name: auto-commit
description: Automate the full git workflow when the user asks to commit, push, or create a PR for changes in this project. Trigger whenever the user says things like "commit", "sube los cambios", "haz PR", "push", "commit and push", "create a PR". Do NOT use when the user is still in the middle of iterating on code changes and hasn't explicitly asked for a commit or PR.
---

# Auto Commit

A streamlined workflow to add, verify, commit, push, and PR changes.

## Workflow

1. **Ensure you are on a `feature/SN-XXXX` branch**
   - Run `git branch --show-current` to get the current branch name.
   - If it already matches `feature/SN-\d{4}` (e.g. `feature/SN-0001`), keep it.
   - Otherwise, find the next available branch number:
     ```bash
     git branch -r | grep -oP 'feature/SN-\K\d+' | sort -n | tail -1
     ```
     - Take the highest number, increment by 1, and left-pad to 4 digits.
     - If no branches exist, start at `0001`.
   - Create and switch to the new branch:
     ```bash
     git checkout -b feature/SN-<next-number>
     ```

2. **Stage changed files**
   - Run `git add -A .` from the project root.
   - The `.gitignore` covers artifacts (`dist/`, `node_modules/`, `.db`, `__pycache__/`, `.DS_Store`), so `git add -A` is safe.

3. **Verify the build**
   - Run `npm run build` inside `frontend/`.
   - If it fails, stop and tell the user what went wrong. Do NOT commit broken code.

4. **Ask for a commit message** if the user hasn't provided one
   - Use a conventional commit prefix: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
   - Example: `feat: add dark mode toggle`
   - If the user said something like "commit with message 'fix card images'", use that directly.

5. **Commit**
   ```bash
   git commit -m "<message>"
   ```

6. **Push**
   ```bash
   git push origin <current-branch>
   ```

7. **PR** — only if the user asked for one
   ```bash
   gh pr create --base develop --head <current-branch> --title "<title>" --body "<body>"
   ```
   Include a meaningful body that summarizes what changed and why.
