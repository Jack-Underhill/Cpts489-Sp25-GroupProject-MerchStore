# Cpts489-Sp25-GroupProject-MerchStore


## 🔄 Branch Workflow & Development Guide  

This repository follows a structured branching strategy to ensure smooth development, testing, and integration while minimizing merge conflicts.  

{ `jack`, `joshua`, `nathan`, `luke` } --> `testing` --> `main`

### **Branch Structure**  

- **Personal Branches (`feature/your-name-*`)**  
  - Each developer creates and works on their own branch (e.g., `feature/alex-new-ui`).  
  - Full control is allowed over personal branches.  
  - Once ready, merge into `testing` via a pull request (PR).  

- **`testing` Branch** (Integration & Debugging)  
  - This is the collaborative branch where all personal branches merge.  
  - All features should be tested here before being merged into `main`.  
  - No direct commits; changes must come from personal branches via PRs.  

- **`main` Branch** (Stable & Deployment-Ready)  
  - The `main` branch should always be stable and production-ready.  
  - Only merges from `testing` are allowed, or direct updates by maintainers.  
  - No direct commits from individual developers.  

### **Development Instructions**  

1. **Create a Personal Branch**  
   ```sh
   git checkout -b feature/your-name-description

2. **Push in Personal Branch**  
   ```sh
   git push origin feature/your-name-description

3. **Git Rebase Personal onto Testing**  
   ```sh
   git fetch origin
   git checkout feature/your-branch-name
   git rebase origin/testing
   # Resolve conflicts if needed
   git push --force-with-lease origin feature/your-branch-name

4. **Merge into Testing Branch**  
    Open a Pull Request (PR) from your feature branch to testing.
    Wait for at least one review before merging.

5. **Testing and Bug Fixes in Testing Branch**  
    All testing and debugging happen in testing.
    Fix issues and update the PR if needed.

6. **Merge into Main Branch**  
    Once testing is stable, open a PR to merge testing into main.
    *Ensure no critical bugs exist before merging*


### **Best Practices**
    1. Always keep your personal branch(es) updated with testing with "git rebase".
    2. Write meaningful commit messages tailered towards your feature/change.
    3. Review and test code before merging.
    4. Resolve merge conflicts before making a PR.
