# Issue tracker: GitHub (with local .scratch mirror)

Issues and PRDs for this repo live as GitHub Issues. Use the `gh` CLI for all operations. A local `.scratch/` copy is maintained as a hardened mirror — write there too when creating issues.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies. Also write a copy to `.scratch/<slug>.md`.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Local .scratch mirror

When creating an issue, also write a markdown file at `.scratch/<slug>.md` with the same title and body. The slug should be kebab-case derived from the issue title. This acts as a local hardened copy in case GitHub is unavailable.

## When a skill says "publish to the issue tracker"

Create a GitHub issue and write the `.scratch/` mirror.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`. Fall back to reading `.scratch/<slug>.md` if offline.
