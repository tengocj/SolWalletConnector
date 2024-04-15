const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');

class SolWalletConnector {
    constructor() {
        this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        this.wallet = Keypair.generate();
    }

    getPublicKey() {
        return this.wallet.publicKey.toString();
    }

    async getBalance() {
        return await this.connection.getBalance(this.wallet.publicKey);
    }

    async airdropSol(amount) {
        const airdropSignature = await this.connection.requestAirdrop(this.wallet.publicKey, amount * LAMPORTS_PER_SOL);
        await this.connection.confirmTransaction(airdropSignature);
    }

    async sendSol(receiverPublicKey, amount) {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: this.wallet.publicKey,
                toPubkey: new PublicKey(receiverPublicKey),
                lamports: amount * LAMPORTS_PER_SOL
            })
        );
        await this.connection.sendTransaction(transaction, [this.wallet]);
    }
}
