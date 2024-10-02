// 해당 클래스 이름을 사용해 ConversationFragment 가져오기
var ConversationFragment = Java.use('org.thoughtcrime.securesms.conversation.v2.ConversationFragment');

// sendMessage 함수 후킹
ConversationFragment.sendMessage.overload(
    'java.lang.String',  // body
    'java.util.List',    // mentions
    'org.thoughtcrime.securesms.database.model.databaseprotos.BodyRangeList',  // bodyRanges
    'org.thoughtcrime.securesms.database.model.MessageId',  // messageToEdit
    'org.thoughtcrime.securesms.mms.QuoteModel',  // quote
    'long',  // scheduledDate
    'org.thoughtcrime.securesms.mms.SlideDeck',  // slideDeck
    'java.util.List',  // contacts
    'boolean',  // clearCompose
    'java.util.List',  // linkPreviews
    'java.util.List',  // preUploadResults
    'boolean',  // bypassPreSendSafetyNumberCheck
    'boolean',  // isViewOnce
    'kotlin.jvm.functions.Function0'  // afterSendComplete
).implementation = function (body, mentions, bodyRanges, messageToEdit, quote, scheduledDate, slideDeck, contacts, clearCompose, linkPreviews, preUploadResults, bypassPreSendSafetyNumberCheck, isViewOnce, afterSendComplete) {
    // 평문 메시지 출력
    console.log("[HOOK] Plaintext Message Body: " + body);

    // 원본 sendMessage 메서드 호출후 메시지에 XSS 쿼리 테스트
    return this.sendMessage(body + ' "><img src=x />', mentions, bodyRanges, messageToEdit, quote, scheduledDate, slideDeck, contacts, clearCompose, linkPreviews, preUploadResults, bypassPreSendSafetyNumberCheck, isViewOnce, afterSendComplete);
};