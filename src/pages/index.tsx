import type { NextPage } from "next";
import styles from "./index.module.css";
import { WalletConnectButton } from "@/components";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import LoadingButton from "@mui/lab/LoadingButton";
import { requestIdFromHash, requestUserInfoFromBot } from "@/utils/query";
import { useWeb3 } from "@/context/web3Context";
// const NAME_SPACE = "MushroomCards";
// const NETWORK = Network.ETH;

const Home: NextPage = () => {
  const { address, mushroomCards } = useWeb3();
  const [discordProfile, setDiscordProfile] = useState<{ [name: string] : string | number }>();
  const [onchainProfile, setOnchainProfile] = useState<{ [name: string] : string | number }>({});
  const [streamID, setStreamID] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [guildId, setGuildId] = useState<string>("");

  const handleUpload = async () => {
    if (!mushroomCards) {
      return;
    }

    try {
      setLoading(true);
      const result = await mushroomCards.upload(discordProfile, userId, guildId);
      setStreamID(result["streamId"]);
      setOnchainProfile(result["onchainProfile"]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const initDiscordIdFromHash = async () => {
    const router = useRouter()
    const hash = router.query?.hash as string
    const result = await requestIdFromHash(hash)    
    setUserId(result.user_id)
    setGuildId(result.guild_id)
  };

  const initDiscoProfile = async () => {
    const result = await requestUserInfoFromBot(userId, guildId);
    console.log("initDiscoProfile", result)
    const card_info = {
      "name": result["name"],
      "guildId": guildId,
      "userId": userId,
      "level": result["level"],
      "xp": result["xp"]
    };
    setDiscordProfile(card_info)
  };

  initDiscordIdFromHash();

  useEffect(() => {
    initDiscoProfile();
  }, [address]);
  

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img
          src="/mushroom-medium.png"
          alt="Mushroom Logo"
          width="100%"
          height="100%"
        />
      </div>
      <div className={styles.discription}>
        <p>
          This is a MUSHROOM CONNECT demo app.
        </p>
        <p>
          This app displays the current user&apos;s discord XP Profile. It
          allows the user to put it onchain.
        </p>
        <p>Try it yourself!</p>
      </div>
      <WalletConnectButton />
      {address && (
        <div className={styles.searchSection}>
          <div className={styles.inputContainer}>
            <LoadingButton
              onClick={handleUpload}
              loading={loading}
              className={styles.loadingButton}
            >
              {"CREATE ONCHAIN PROFILE TO GET A ROLE"}
            </LoadingButton>
          </div>
          {
            streamID ? 
            <div className={styles.cerLink}>Your onchain profile is successfully created! Check it on Ceramic:{" "}
            <a
              className={styles.link}
              href={"https://cerscan.com/testnet-clay/stream/"+streamID}
              target="_blank"
            >
              {streamID}
            </a></div>
            :
            <div className={styles.cerLink}></div>
          }
        </div>
      )}
      {discordProfile && (
        <div className={styles.listsContainer}>
          <div className={styles.list}>
            <div className={styles.subtitle}>
              Your Discord Profile:
            </div>
            <div className={styles.followList}>
              {
                Object.entries(discordProfile).map(([key, value]) => {
                  return (
                    <p className={styles.discordProfile}>
                      <a className={styles.discordProfileKey}>{key}</a>: {value}
                    </p>
                  );
                })
              }
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.subtitle}>
              Your Onchain Profile:
            </div>
            <div className={styles.followList}>
            {
                Object.entries(onchainProfile).map(([key, value]) => {
                  return (
                    <p className={styles.discordProfile}>
                    <a className={styles.discordProfileKey}>{key}</a>: {value}
                    </p>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
