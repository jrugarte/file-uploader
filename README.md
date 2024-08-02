File Uploader

Description

File Uploader is an application that allows users to easily and securely upload and manage files. It was designed to be intuitive and efficient.

Hi there! So...
For those who want to keep alive this little masterpiece, i get some information for you:

- Due to time, i couldn´t separate some components, like the skeleton or the specific modals(could be a good task).

- The assessment was the next:
  1 - Build a single button that allows you to upload files <=5MB to Vercel’s blob storage.
  a - call a third party API (example.com) when the upload begins
  b - call a third party API (example.com) when the upload succeeds
  c - call a third party API (example.com) when the upload fails
  d - If the file is >5MB please show a modal that rejects
  2 - After the upload is complete, show a list of links of all uploaded files such that you can download them again.
  a - Put a pencil icon to each link in the list to rename the file. A modal with Save and Cancel buttons should open for the rename.
  3 - Show a skeleton instead of the list of files when the list is still loading.
  a - add some fake delay if it loads too fast just to show the effect.
  4 - Put a trash icon next to each link in the list so that you can delete it.
  5 - Ensure there are error boundaries in case anything errors and you show some kind of error UI.
  6 - When you refresh the whole page, the entire state should persist.

Contributions are welcome! If you would like to contribute, please follow these steps:

1-Fork the repository.
2-Create a new branch for your feature (git checkout -b feature/new-feature).
3-Make your changes and commit (git commit -am 'Add new feature').
4-Push your branch (git push origin feature/new-feature).
5-Open a Pull Request.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
