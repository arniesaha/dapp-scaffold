import React, { useCallback } from "react";
import { useConnection } from "../../contexts/connection";
import { notify } from "../../utils/notifications";
import { ConnectButton } from "./../../components/ConnectButton";
import { LABELS } from "../../constants";
import { useWallet} from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';


export const FaucetView = () => {
  const connection = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const recieverKey = new PublicKey('BbevycRn7na8BuU8dtQakimi71PvSQ3pnuJ5BLYgzXLH');
  const amount: number = 1;

  const handleRequestAirdrop = useCallback(async () => {
    try {
      if (!publicKey) {
        return;
      }
      
      // Create the transaction (instruction array)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recieverKey,
          lamports: (LAMPORTS_PER_SOL / 100) * amount,
        })
      );

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, 'processed');

      console.log('tx signature:', signature);

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
