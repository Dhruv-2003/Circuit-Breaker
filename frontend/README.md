## Steps

- User enters the source, arxiv , pdf
- We scan the PDF , for emails in the whole research
- We display them for the donor and they can select the % of the funds they want to distribute
- Then Donor can select the amounts to pay
- For these emails , we create emailWallets , or put those funds in Unclaimed status for them
- The receiver gets an email regarding the payment
- And the payment is complete

### Choice 1

-> User connects their EOA , with some funds in it
-> We then create a Batched Transaction to register Unclaimed funds for an address , after preparing all the respective inputs for it
-> Do a Batch a tx directly from the wallet to perform this

## Choice 2

-> User has this email wallet , which is already created
-> Then User does the tx by sending multiple emails to these receiver with cc as sepolia@sendeth.org
-> And boom it's done.

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
