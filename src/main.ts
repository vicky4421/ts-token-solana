import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi"
import { userKeypair } from "./helpers"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createFungible, createV1, mplTokenMetadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata"

// instantiate a new instance of umi client running on the devnet cluster. 
const umi = createUmi("https://api.devnet.solana.com")

// eddsa : an interface for managing public and secret key
const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey)

// register keypair to be used as the default signer for all transactions
// use: installs umi plugin
// keypairIdentity: Umi plugin that sets the identity and the payer to a provided keypair.
// 

umi.use(keypairIdentity(keypair))
    .use(mplTokenMetadata())

// Uploading our asset metadata to an off-chain or centralised storage provider using URI
const metadata = {
    name: "Solana Gold",
    symbol: "GOLDSOL",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
}

const mint = generateSigner(umi)
async function createMetadataDetails() {
    await createV1(umi, {
        mint,
        authority: umi.identity,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: 9,
        tokenStandard: TokenStandard.Fungible
    }).sendAndConfirm(umi)
}

// create tokens
createFungible(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
}).sendAndConfirm(umi)