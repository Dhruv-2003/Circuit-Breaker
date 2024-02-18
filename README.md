# Discovery Donar

Discovery Donar revolutionizes academic funding by seamlessly connecting donors with researchers and contributors. With a simple yet powerful interface, users can donate funds directly to authors and contributors of research papers, empowering academic collaboration and innovation. The platform utilizes zk-email email wallets, enabling secure and efficient distribution of funds without the need for complex setups or installations. Through Discovery Donar, users can support academic progress and breakthroughs with ease.

## Key Features:

- **Automated Email Extraction**: Discovery Donar automatically scans research papers for email addresses, streamlining the donation process.
- **Flexible Fund Allocation**: Donors can allocate funds to authors and contributors based on the significance of contributions within the paper, fostering fair and transparent funding distribution.
- **Email Wallet Integration**: Utilizing Ethereum email wallets, users can securely receive and manage funds via email, eliminating the need for browser extensions or mobile apps.
- **No Seed Phrases or Private Key**: Users can access their on-chain Smart contract Wallet directly from their email, which enables seamless onboarding.
- **Email Address Privacy**: There is no public link between the Smart Contract wallet and the email address controlling it.

## How to Use

1. Donors can simply provide a link to arxiv or upload a PDF.
2. All the scraped emails from the PDF are displayed on the interface, where users can choose the allocation of donation respectively.
3. Then they can simply select the amount and the token they want to send.
4. Upon confirmation, they have to send emails to the relayers to process the transaction.

## How It's Made

The project uses the "Email Wallet" function built by the zkemail team at EF. We utilize the Proof of email across the app, allowing users to do transactions just by sending an email. The email wallet validates the authenticity of emails through ZK Proof of DKIM signature, ensuring secure transactions without revealing sensitive information on-chain like their email addresses.

Our bot scrapes all the emails from the arxiv link or any other PDF by entering the URL or, which are then displayed in the interface. Donor sends an email with the relayer as CC. Relayer listens for new emails and verifies the DKIM signature in the email to create a zk proof of email.

Then the transaction is processed to send these tokens to the recipients. The donors and recipients receive an email directly regarding the transaction which took place for them. Email wallet is also directly created for these recipients once the transaction is executed which they can continue to use to access their funds.

For any new user, the funds are sent to a core wallet as an unclaimed donation and when the user creates an email wallet by sending an email to the relayer, they can claim their donation amount.
