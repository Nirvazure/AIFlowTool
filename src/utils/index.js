//目前这里没有做好

let convertPCMToWAV=(pcmView)=>{
    let sampleRate = 16000;
    let numChannels = 1;
    let buffer = new ArrayBuffer(44 + pcmView.length); //lengrh找不到
    let wavView = new DataView(buffer);
    writeString(wavView, 0, 'RIFF');
    wavView.setUint32(4, 36 + pcmView.length, true); //rest size
    this.writeString(wavView, 8, 'WAVE'); //format
    this.writeString(wavView, 12, 'fmt '); //with space
    wavView.setUint32(16, 16, true); //消息格式头长度
    wavView.setInt16(20, 1, true); //音频格式 pcm-1
    wavView.setInt16(22, numChannels, true);
    wavView.setUint32(24, sampleRate, true);
    wavView.setUint32(28, sampleRate * 2, true); //字节率
    wavView.setInt16(32, numChannels * 2, true); //每个采样字节数
    wavView.setInt16(34, 16, true); //每个采样存储比特数
    writeString(wavView, 36, 'data'); //data以及长度
    wavView.setUint32(40, pcmView.length, true);
    let offset = 44;

    for (var i = 0; i < pcmView.length; i++) {
        wavView.setUint8(offset + i, pcmView[i]);
    }

    return new Uint8Array(wavView.buffer);
}
 
writeString(view, offset, string){
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}


let getDagName=dags=> {
    let dagNames = []
    for (let k in dags) {
        dagNames.push(dags[k].name)
    }
    return dagNames
}
export default{
    getDagName,
    getColor
}