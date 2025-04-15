# Cpts489-Sp25-GroupProject-MerchStore


## Setting up your local Server & Database

1. Install dependencies
    ```sh
    npm install
    npm run init-start
    ```

2. Start Server (without resetting database)
    ```sh
    npm start
    ```

3. Just want to reset (seed) the database
    ```sh
    npm run seed
    ```
  - This will create a fresh local SQLite file and populate it with products from /js/products.json.

## DEFAULT User Accounts

- **Customer**
    - Email:     customer@example.com
    - Password:  12345
- **Admin**
    - Email:     user@name.com
    - Password:  password

## 🔄 Branch Workflow & Development Guide  (For our team: here down)

This repository follows a structured branching strategy to ensure smooth development, testing, and integration while minimizing merge conflicts.  

{ `jack`, `joshua`, `nathan`, `luke` } --> `testing` --> `main`

### **Branch Structure**  

- **Personal Branches (`feature/your-name-*`)**  
  - Each developer creates and works on their own branch (e.g., `feature/alex-new-ui`).  
  - Full control is allowed over personal branches.  
  - Once a feature is complete, open a **Pull Request (PR)** to merge into `testing`. 

- **`testing` Branch** (Integration & Debugging)  
  - The collaborative branch where **all personal branches merge**.  
  - All features should be tested here **before merged into `main`**.  
  - No direct commits; changes must come from personal branches via PRs.  

- **`main` Branch** (Stable & Deployment-Ready)  
  - Should **always** remain stable and production-ready.  
  - Only accepts **tested changes** from `testing`.  
  - No direct commits from individual developers.  

### **Development Instructions**  

1. **Create a Personal Branch**  
    ```sh
    git checkout -b feature/your-name-description testing
    ```

2. **Push in Personal Branch**  
    ```sh
    git push origin feature/your-name-description
    ```

3. **Keep Your Personal Branch Updated (Rebase from `testing`)**
     - Keeping your branch up-to-date helps **reduce merge conflicts**.
    
    ```sh
    git fetch origin
    git checkout feature/your-branch-name
    git rebase origin/testing
    
    # Resolve conflicts if needed
    git push --force-with-lease origin feature/your-branch-name
    ```

5. **Merge Your Feature Branch into `testing`**  
    Once your work is complete:
    1. Open a **Pull Request (PR)** from your **feature branch** → `testing`.  
    2. Wait for **at least one review** before merging.

6. **Testing and Bug Fixes in `testing` Branch**  
    All testing and debugging happen in testing.
    Fix issues and update the PR if needed.

7. **Merge `testing` into `main`**  
    Once `testing` is stable:
    1. Open a **PR to merge `testing` into `main`**.  
    2. Ensure no critical bugs exist before merging!  


---


## Resetting Your Personal Branch for a New Milestone

If your personal branch becomes **messy** and you want it to match `main`, use one of the following options:

### Option 1: Full Reset (If You Don’t Need Old Commits)
This completely **replaces** your personal branch with the latest `main`.  

```sh
git checkout feature/your-branch-name
git reset --hard origin/main  # Makes your branch an exact copy of `main`
git push --force origin feature/your-branch-name  # Force update on GitHub
```

**WARNING**: This will delete any commits in your branch that aren't in `main`.


### Option 2: Rebase (If You Want to Keep Past Work)
If you want to **keep** your past commits but ensure `main` is the foundation:

```sh
git checkout feature/your-branch-name
git fetch origin
git rebase origin/main  # Moves your commits on top of the latest `main`

# Resolve conflicts if necessary
git push --force-with-lease origin feature/your-branch-name
```


---  


## Best Practices
- **Keep your branch updated with `testing` using rebase** to avoid conflicts.  
- **Write meaningful commit messages** that explain your changes clearly.  
- **Review and test code** before merging into `testing`.  
- **Reset your personal branch** before a new milestone to start clean.  
- **Ask for help** if you encounter **merge conflicts** or **Git issues**. 


---  

 
## Next Steps
- If you're unsure how to start, ask in our team chat.
- Always check for updates in `testing` before beginning new work.
- If you need a Git refresher, check the [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf).
