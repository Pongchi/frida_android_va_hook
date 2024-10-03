// org.telegram.tgnet.ConnectionsManager 클래스 로드
var ConnectionsManager = Java.use("org.telegram.tgnet.ConnectionsManager");

// sendRequestInternal 메서드를 후킹
ConnectionsManager.sendRequestInternal.overload(
    'org.telegram.tgnet.TLObject', 
    'org.telegram.tgnet.RequestDelegate', 
    'org.telegram.tgnet.RequestDelegateTimestamp', 
    'org.telegram.tgnet.QuickAckDelegate', 
    'org.telegram.tgnet.WriteToSocketDelegate', 
    'int', 'int', 'int', 'boolean', 'int'
).implementation = function (object, onComplete, onCompleteTimestamp, onQuickAck, onWriteToSocket, flags, datacenterId, connectionType, immediate, requestToken) {
    
    // 인자값 출력
    console.log("[Frida Hook] sendRequestInternal called");
    console.log("\tTLObject: " + object);

    // 원래 메서드를 호출하고 결과를 저장
    var result = this.sendRequestInternal(object, onComplete, onCompleteTimestamp, onQuickAck, onWriteToSocket, flags, datacenterId, connectionType, immediate, requestToken);

    return result;
};

var sendMessage_Class = Java.use('org.telegram.tgnet.TLRPC$TL_messages_sendMessage');

// serializeToStream 메서드 후킹
sendMessage_Class.serializeToStream.implementation = function(stream) {
    console.log("[Frida Hook] serializeToStream called!");

    // 필요한 필드 값 출력
    console.log("\tFlags: " + this.flags.value);
    console.log("\tMessage: " + this.message.value);
    console.log("\tRandom ID: " + this.random_id.value);

    // 원래 메서드 호출 (stream을 넘겨주기)
    this.serializeToStream(stream);
};

var sendReaction_Class = Java.use('org.telegram.tgnet.TLRPC$TL_messages_sendReaction');
var reactionEmoji_Class = Java.use('org.telegram.tgnet.TLRPC$TL_reactionEmoji'); // reactionEmoji 클래스 가져오기

// serializeToStream 메소드 후킹
sendReaction_Class.serializeToStream.implementation = function(stream) {
    console.log("[Frida Hook] serializeToStream called for TL_messages_sendReaction");

    // msg_id 출력
    console.log("\tMessage ID: " + this.msg_id.value);

    // reaction.value를 사용하여 ArrayList에 접근
    if (this.reaction.value && this.reaction.value.size !== undefined) {
        var reactionCount = this.reaction.value.size();
        console.log("\tReaction count: " + reactionCount);

        // 각 reaction에 접근하여 값 출력
        for (var i = 0; i < reactionCount; i++) {
            var reaction = this.reaction.value.get(i);
            
            try {
                // reaction을 TL_reactionEmoji로 캐스팅
                var castedReaction = Java.cast(reaction, reactionEmoji_Class);

                // 기존 emoticon 값 출력
                console.log("\tOld Reaction " + i + ": " + castedReaction.emoticon.value);

                // emoticon 필드를 새로운 값으로 변경
                castedReaction.emoticon.value = "😎";  // 새로 설정할 이모티콘
                console.log("\tNew Reaction " + i + ": " + castedReaction.emoticon.value);

            } catch (e) {
                console.log("\tReaction " + i + ": Not a TL_reactionEmoji instance");
            }
        }
    } else {
        console.log("\treaction is not an ArrayList or is empty.");
    }

    // 원래 메서드 호출 (stream 전달)
    this.serializeToStream.call(this, stream);
};