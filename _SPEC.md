# SPEC

----------------------------------------------------------------

## Flow
### Init
1. Create a product
1.1 Upload the code file to Vercel Blob (private) - BOILERPLATE_INDEX_HTML

### Chat
1. Chat with the product
1.1 Generate a prompt with a product code file on Vercel Blob (private)
2. Respond with a code file
2.1 Upload the code file to Vercel Blob (private)
3. Preview the code file in a browser

### Payment
1. Require subscription
2. If not subscribed
  - show a payment modal
  - throw an error when a user tries to use prompt generation feature
