class PeerService {
    constructor() {
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ],
                },
            ],
        });
    }
    
    // async getAnswer(offer) {
    //     await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    //     const ans = await this.peer.createAnswer();
    //     await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    //     return ans;
    //     console.log(ans)

    // }
    async getAnswer(offer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    return ans;
}

    async setLocalDescription(ans) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }

    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }
}

export default new PeerService();
