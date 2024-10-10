const enableStacktracePrinting = false;
const inputDataReplacements = [
    ["msg", "test", "hello"],
    ['ex', '{"cmt":""}', '{"cmt":"hello world"}'],
    ['extra', '*', '{"name":"(이모티콘)","path":"4412206.emot_003.webp","type":"animated-emoticon/digital-item","sound":"4420326.sound_003.mp3","s":0}']
];

const receiveDataReplacements = [
    ['message', '?', 'test'],
];