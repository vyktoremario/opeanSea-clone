import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";
import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const Home = () => {
  const [nfts, setNfts] = useState([] as Record<string, any>[]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${process.env.PROJECT_ID}`);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
      );
      // console.log(marketContract);
      
      console.log(await await marketContract.fetchMarketItems());
      const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (item: Record<string, any>) => {
        const tokenUri = await tokenContract.tokenURI(item.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(item.price.toString(), "ether");

        let newItem = {
          price,
          tokenId: item.tokenId.toNumber(),
          seller: item.seller,
          owner: item.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return newItem;
      })
    );

    setNfts(items);

    setLoadingState("loaded");
  };

  const buyNFT = async (nft: Record<string, any>) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();

    loadNFTs();
  };

  if (loadingState == "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No Items in market place</h1>;

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div
              key={i + nft.tokenId}
              className="border shadow rounded-xl overflow-hidden"
            >
              <Image src={nft.image} alt="nft" width={500} height={500} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div
                  style={{ height: "70px", overflow: "hidden" }}
                >
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNFT(nft)}
                >
                  Buy NFT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
