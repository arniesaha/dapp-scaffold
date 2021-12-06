import React, { useCallback } from "react";
import { useConnection } from "../../contexts/connection";
import { Transaction, SystemProgram, Connection } from "@solana/web3.js";
import { notify } from "../../utils/notifications";
import { ConnectButton } from "./../../components/ConnectButton";
import { LABELS } from "../../constants";
import { useWallet} from "@solana/wallet-adapter-react";
//import { transfer } from "@project-serum/serum/lib/token-instructions";
import { PublicKey, Keypair } from "@solana/web3.js";


export const FaucetView = () => {
  const connection = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();

  const PK = new PublicKey('BbevycRn7na8BuU8dtQakimi71PvSQ3pnuJ5BLYgzXLH');

  const handleRequestAirdrop = useCallback(async () => {
    try {
      if (!publicKey) {
        return;
      }

      const transactionx = new Transaction().add(SystemProgram.transfer({fromPubkey: publicKey, toPubkey: PK, lamports: 1000 }));

      const signature = await sendTransaction(transactionx, connection);

      await connection.confirmTransaction(signature, 'processed');

      


      notify({
        message: LABELS.ACCOUNT_FUNDED,
        type: "success",
      });
    } catch (error) {
      notify({
        message: LABELS.AIRDROP_FAIL,
        type: "error",
      });
      console.error(error);
    }
  }, [publicKey, connection]);

  return (
    <div className="flexColumn" style={{ flex: 1 }}>
      <div>
        <div className="deposit-input-title" style={{ margin: 10 }}>
          {LABELS.FAUCET_INFO}
        </div>
        <ConnectButton type="primary" onClick={handleRequestAirdrop}>
          {LABELS.GIVE_SOL}
        </ConnectButton>
      </div>
    </div>
  );
};
