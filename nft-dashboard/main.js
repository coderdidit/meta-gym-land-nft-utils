/** Connect to Moralis server */
const serverUrl = "https://inzloc1b6zrv.usemoralis.com:2053/server";
const appId = "gsWQjK3OLHfDLpPuiyVJb6g9TW9rYbhF41oyDXi8";
Moralis.start({ serverUrl, appId });

const chain = "rinkeby"
const ERC1155_CONTRACT = "0x7650D3448F8044d8732528148c2A2d6B1D17BA88"

const fechMetadtata = async (nfts) => {
    promises = []
    for (const nft of nfts) {
        const id = nft.token_id
        const options = { address: ERC1155_CONTRACT, token_id: id, chain: chain };
        promises.push(Moralis.Web3API.token.getTokenIdMetadata(options))
    }
    return Promise.all(promises)
}

const renderInventory = async (nftsMeta) => {
    const parent = document.getElementById("app")
    for (const nft of nftsMeta) {
        if (nft.metadata) {
            const metadata = JSON.parse(nft.metadata)
            const html = `
        <div class="card">
            <img class="card-img-top" src="${metadata.image}">
            <div class="card-body">
                <h5 class="card-title">${metadata.name}</h5>
                <p class="card-text">${metadata.description}</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
        `
            const col = document.createElement("div")
            col.className = "col col-md-3"
            col.innerHTML = html
            parent.appendChild(col)
        }
    }
}

/** Add from here down */
async function login() {
    let user = Moralis.User.current();
    if (!user) {
        try {
            user = await Moralis.authenticate({ signingMessage: "Hello World!" })
            console.log(user)
            console.log(user.get('ethAddress'))

            // list nfts
            const opts = { address: ERC1155_CONTRACT, chain: chain }
            const nfts = await Moralis.Web3API.token.getAllTokenIds(opts)

            console.log('nfts', nfts.result)
            const nftsMeta = await fechMetadtata(nfts.result)
            renderInventory(nftsMeta)
            for (const m of nftsMeta) {
                console.log('nftMeta', m)
            }

        } catch (error) {
            console.log(error)
        }
    }
}

async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;

/** Useful Resources  */

// https://docs.moralis.io/moralis-server/users/crypto-login
// https://docs.moralis.io/moralis-server/getting-started/quick-start#user
// https://docs.moralis.io/moralis-server/users/crypto-login#metamask

/** Moralis Forum */

// https://forum.moralis.io/