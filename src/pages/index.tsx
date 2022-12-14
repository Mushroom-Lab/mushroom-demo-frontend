import type { NextPage } from "next";
import styles from "./index.module.css";
import { WalletConnectButton } from "@/components";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import LoadingButton from "@mui/lab/LoadingButton";
import { postAssignRole, postDMToUser, requestIdFromHash, requestUserInfoFromBot, requestUserInfoFromCeramic } from "@/utils/query";
import { useWeb3 } from "@/context/web3Context";
import { formatDid } from "@/utils/helper";
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
      console.log("statusRole start");
      const statusRole = await postAssignRole(userId, guildId)
      console.log("statusRole", statusRole);
      // const statusDM = await postDMToUser(`You have already linked Discord with your wallet. Check your onchain profile: https://cerscan.com/testnet-clay/stream/${result["streamId"]}`, userId)
      // console.log("postDMToUser", statusDM);
      console.log(process.env.TEST)
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
    if (hash && (!userId) && (!guildId)) {
      const result = await requestIdFromHash(hash)    
      setUserId(result.user_id)
      setGuildId(result.guild_id)
    }
  };

  const initDiscoProfile = async () => {
    if (userId && guildId && (!discordProfile)) {
      const result = await requestUserInfoFromBot(userId, guildId);
      console.log("initDiscoProfile", result)
      const card_info = {
        "name": result["name"],
        "guildId": guildId,
        "userId": userId,
        "level": result["level"],
        "popularityLevel": result["popularityLevel"],
        "xp": result["xp"]
      };
      console.log("card_info", card_info)
      setDiscordProfile(card_info)

      const result_onchian = await requestUserInfoFromCeramic(userId, guildId);
      console.log("initOnchianProfile", result_onchian)
      if (result_onchian["status"] == 0) {
        const card_info_inchain = {
          "guildId": result_onchian["profile"]["guildId"],
          "userId": result_onchian["profile"]["userId"],
          "level": result_onchian["profile"]["level"],
          "popularityLevel": result_onchian["profile"]["popularityLevel"],
          "address": formatDid(result_onchian["profile"]["address"]),
          "updatedAt": result_onchian["profile"]["updatedAt"],
        };
        console.log("card_info_inchain", card_info_inchain)
        setOnchainProfile(card_info_inchain)
      }  
    }
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
          This is a MUSHROOM CREMINI demo app.
        </p>
        <p>
          This app helps you sync your Discord reputation onchain. Try it yourself!
        </p>
        <p className={styles.fontBold}>First please join <a className={styles.link} href={"https://discord.gg/sEJzUPHgVX"} target="_blank" > our discord </a> to connect your DID!</p>
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
