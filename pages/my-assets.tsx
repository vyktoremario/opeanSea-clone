import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";


import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function MyAssets() {
    const [nfts, setNfts] = useState([] as Record<string, any>[]);
    const [loadingState, setLoadingState] = useState('not-loaded');

    useEffect(() => {
        loadNFTs();
    }, [])

    const loadNFTs = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
        const marketContract = new ethers.Contract(
          nftmarketaddress,
          Market.abi,
          signer
        );
    
        const data = await marketContract.fetchMyNFT();
    
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
      if (loadingState == "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No assets owned. Buy Some 😊</h1>;

    return  (
        <div className="flex justify-center">
        <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div
              key={i + nft.tokenId}
              className="border shadow rounded-xl overflow-hidden"
            >
              <Image src={nft.image} className="rounded" alt="nft" width={500} height={500} />
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    )
}